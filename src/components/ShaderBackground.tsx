import { useEffect, useRef, useState } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   Shader background: a slow flowing lavender aurora.

   - Uses domain-warped value-noise (fbm) at low resolution for cheap GPU cost
   - Reads pointer + scroll for a subtle parallax/warp
   - Re-tints itself based on the `dark` prop (palette mirrors index.css)
   - Disabled (no rAF) when prefers-reduced-motion is set
   ────────────────────────────────────────────────────────────────────────── */

const VERT = /* glsl */ `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;
uniform float u_scroll;
uniform float u_dark;

/* Lavender palette (sRGB, /255) */
const vec3 IRIS  = vec3(0.5647, 0.4784, 0.6627); /* #907aa9 */
const vec3 IRIS_L= vec3(0.8313, 0.7411, 0.9372); /* #d4bdef */
const vec3 FOAM  = vec3(0.4313, 0.6039, 0.5098); /* #6e9a82 */
const vec3 LOVE  = vec3(0.7058, 0.3882, 0.4784); /* #b4637a */
const vec3 GOLD  = vec3(0.9176, 0.6156, 0.2039); /* #ea9d34 */
const vec3 ROSE  = vec3(0.8431, 0.5098, 0.4941); /* #d7827e */

const vec3 BG_LIGHT = vec3(0.9803, 0.9803, 0.9882); /* lavender-50  */
const vec3 BG_DARK  = vec3(0.1019, 0.0941, 0.1882); /* lavender-950 */

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i + vec2(0.0, 0.0));
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * vnoise(p);
    p = rot * p * 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p  = (gl_FragCoord.xy - 0.5 * u_res.xy) / min(u_res.x, u_res.y);

  float t  = u_time * 0.07;
  vec2  m  = (u_mouse - 0.5) * 0.55;
  float sc = u_scroll * 0.9;

  /* domain-warped fbm — flowing aurora curtains */
  vec2 q = vec2(
    fbm(p * 1.6 + vec2(t,        sc * 0.45)),
    fbm(p * 1.6 + vec2(-t * 0.9, 1.7 + sc * 0.35))
  );
  vec2 r = vec2(
    fbm(p * 2.0 + 4.5 * q + vec2(1.7 + t * 0.8, 9.2 + m.x)),
    fbm(p * 2.0 + 4.5 * q + vec2(8.3 - t * 0.6, 2.8 + m.y))
  );
  float n = fbm(p * 2.4 + 4.5 * r + vec2(t));

  /* sharper bands give the curtains structure */
  float band = smoothstep(0.20, 0.95, n);

  vec3 col;
  if (u_dark > 0.5) {
    /* Dark mode: rich, glowing aurora */
    col = mix(IRIS * 0.85,  IRIS_L * 1.15,    band);
    col = mix(col, FOAM * 1.05,               smoothstep(0.20, 0.85, q.x));
    col = mix(col, LOVE * 1.10,               smoothstep(0.35, 0.95, r.y));
    col = mix(col, GOLD * 0.95,               smoothstep(0.55, 0.95, n) * 0.75);

    /* gentle floor (keeps deep corners moody, doesn't wash) */
    col = mix(BG_DARK, col, 0.92);

    /* subtle bloom in the brightest bands */
    col += 0.18 * pow(band, 4.0) * IRIS_L;

    col += 0.05 * vec3(hash(gl_FragCoord.xy + u_time));      /* dither */
  } else {
    /* Light mode: vivid pastels, more saturated than before */
    col = mix(IRIS_L * 1.05, FOAM * 1.10,     band);
    col = mix(col, ROSE,                      smoothstep(0.40, 0.90, q.x));
    col = mix(col, GOLD,                      smoothstep(0.55, 0.95, r.y) * 0.85);
    col = mix(col, IRIS * 0.95,               smoothstep(0.55, 0.95, n) * 0.55);

    /* pull less toward white so colour shows through */
    col = mix(BG_LIGHT, col, 0.78);

    /* faint highlight pop in the brightest bands */
    col += 0.10 * pow(band, 5.0);

    col += 0.02 * vec3(hash(gl_FragCoord.xy + u_time));
  }

  /* vignette: deeper toward edges so the centre reads */
  float vg = smoothstep(1.30, 0.45, length(uv - 0.5));
  col *= mix(0.85, 1.05, vg);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn("shader compile failed:", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

/* Static fallback for mobile / touch / reduced-motion / no-WebGL.
   Layered radial gradients in the same lavender palette as the shader. */
const STATIC_LIGHT = [
  "radial-gradient(70% 70% at 78% 18%, rgba(212,189,239,0.92), transparent 75%)",
  "radial-gradient(60% 70% at 22% 55%, rgba(168,212,184,0.55), transparent 75%)",
  "radial-gradient(55% 60% at 68% 82%, rgba(240,173,169,0.50), transparent 75%)",
  "radial-gradient(40% 50% at 12% 12%, rgba(250,212,154,0.40), transparent 70%)",
  "radial-gradient(45% 55% at 50% 50%, rgba(204,176,198,0.40), transparent 80%)",
  "linear-gradient(140deg, #fafafc 0%, #f3f2f7 60%, #efeef5 100%)",
].join(",");

const STATIC_DARK = [
  "radial-gradient(70% 70% at 78% 18%, rgba(144,122,169,0.85), transparent 75%)",
  "radial-gradient(60% 70% at 22% 55%, rgba(110,154,130,0.45), transparent 75%)",
  "radial-gradient(55% 60% at 68% 82%, rgba(180,99,122,0.55), transparent 75%)",
  "radial-gradient(40% 50% at 12% 12%, rgba(234,157,52,0.25), transparent 70%)",
  "radial-gradient(45% 55% at 50% 50%, rgba(133,107,128,0.40), transparent 80%)",
  "linear-gradient(140deg, #1a1830 0%, #232136 60%, #2a2746 100%)",
].join(",");

/* Decide whether to skip WebGL entirely:
   - small viewports (most phones)
   - touch-only / no-hover devices (covers tablets too)
   - reduced-motion preference */
function useStaticFallback() {
  const query = "(max-width: 768px), (hover: none) and (pointer: coarse), (prefers-reduced-motion: reduce)";
  const [useStatic, setUseStatic] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia(query).matches;
  });
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = () => setUseStatic(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);
  return useStatic;
}

function StaticBackground({ dark }: { dark: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none transition-[background] duration-700"
      style={{ background: dark ? STATIC_DARK : STATIC_LIGHT }}
    />
  );
}

function WebGLBackground({ dark }: { dark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const darkRef = useRef(dark);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    darkRef.current = dark;
  }, [dark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const gl =
      (canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false }) as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) {
      setFailed(true);
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      setFailed(true);
      return;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("program link failed:", gl.getProgramInfoLog(program));
      setFailed(true);
      return;
    }
    gl.useProgram(program);

    /* If the GPU loses the context (common on iOS Safari background/foreground
       cycles), fall back to the static gradient instead of staring at a blank
       canvas. */
    const onContextLost = (e: Event) => {
      e.preventDefault();
      setFailed(true);
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uScroll = gl.getUniformLocation(program, "u_scroll");
    const uDark = gl.getUniformLocation(program, "u_dark");

    const mouse = { x: 0.5, y: 0.5 };
    let scrollN = 0;

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = 1.0 - e.clientY / window.innerHeight;
    };
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      scrollN = h > 0 ? window.scrollY / h : 0;
    };

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    resize();
    onScroll();

    const start = performance.now();
    let raf = 0;
    let lastT = 0;

    const render = (now: number) => {
      /* throttle to ~45fps for battery */
      if (now - lastT < 22) {
        raf = requestAnimationFrame(render);
        return;
      }
      lastT = now;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uScroll, scrollN);
      gl.uniform1f(uDark, darkRef.current ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!reduced) raf = requestAnimationFrame(render);
    };

    if (reduced) {
      render(performance.now());
    } else {
      raf = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  if (failed) return <StaticBackground dark={dark} />;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
    />
  );
}

export default function ShaderBackground({ dark }: { dark: boolean }) {
  const useStatic = useStaticFallback();
  return useStatic ? <StaticBackground dark={dark} /> : <WebGLBackground dark={dark} />;
}
