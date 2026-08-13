import { useState, useEffect, useRef } from "react";
import {
  Sun, Moon, Mail, ExternalLink, ArrowUp, Code2, Palette,
  BarChart3, Globe, Mic, Menu, X,
  ShieldCheck, CalendarCog, Megaphone,
} from "lucide-react";
import ShaderBackground from "./components/ShaderBackground";
import { ProjectPreview, type PreviewKey } from "./components/ProjectPreview";

/* ─── Icons ─── */

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/* ─── Utils ─── */

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ─── Theme hook ─── */

function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("portfolio-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("portfolio-theme", dark ? "dark" : "light");
  }, [dark]);
  return { dark, toggle: () => setDark((d) => !d) };
}

/* ─── Scroll progress bar ───
   Leaf component that writes scaleX to the DOM directly (rAF-coalesced),
   so per-pixel scroll updates never re-render the App tree. */

function ProgressBar({ accentClass }: { accentClass: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (!ref.current) return;
      const p = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      ref.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      onScroll();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    update();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-0.5">
      <div ref={ref} className={`progress-bar h-full ${accentClass} opacity-60`} style={{ transform: "scaleX(0)" }} />
    </div>
  );
}

/* ─── Back to top ───
   Leaf component so the 500px threshold crossing only re-renders the button. */

function BackToTop({ btnClass }: { btnClass: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 500);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })}
      className={`fixed bottom-6 left-6 z-40 p-3 rounded-full ${btnClass} shadow-lg shadow-black/15 dark:shadow-black/30 transition-all duration-500 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      aria-label="Back to top"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}

/* ─── Scroll reveal hook ─── */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".rv, .sg");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("show"); obs.unobserve(e.target); }
      }),
      { threshold: 0.05, rootMargin: "0px 0px 0px 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── Data ─── */

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "talks", label: "Talks" },
  { id: "contact", label: "Contact" },
];

const SOCIALS = [
  { href: "https://github.com/ShrutiVellanki",            icon: <GithubIcon className="w-5 h-5" />,   label: "GitHub" },
  { href: "https://www.linkedin.com/in/shruti-vellanki/", icon: <LinkedinIcon className="w-5 h-5" />, label: "LinkedIn" },
  { href: "https://x.com/ShrutiVellanki",                 icon: <XIcon className="w-[18px] h-[18px]" />, label: "X" },
  { href: "mailto:shvellanki@gmail.com",                  icon: <Mail className="w-5 h-5" />,         label: "Email" },
];

type ExperienceRole = {
  title: string;
  period: string;
  location?: string;
  description: string;
  skills?: string[];
};
type ExperienceEntry = {
  company: string;
  subtitle?: string;
  icon: React.ReactNode;
  roles: ExperienceRole[];
};

const EXPERIENCE: ExperienceEntry[] = [
  {
    company: "Gen",
    subtitle: "(NortonLifeLock & Avast)",
    icon: <ShieldCheck className="w-4 h-4" />,
    roles: [
      {
        title: "Software Engineer — Windows UI",
        period: "Jun 2025 – Jun 2026",
        description:
          "Building + owning Dark Web Monitoring features for Norton™ 360 and Avast, delivering Organic Upsell initiatives on a global remote team. (50M+ users)",
        skills: ["AI", "Claude", "Svelte"],
      },
      {
        title: "Software Engineer — Digital Trust Services",
        period: "Jul 2022 – Jun 2025",
        description:
          "Frontend engineering & internal tooling on Interac Verified (now acquired by Interac). Leading development for the Interac Verified Design System.",
        skills: ["Design Systems", "AI", "React"],
      },
    ],
  },
  {
    company: "Fiix by Rockwell Automation",
    icon: <CalendarCog className="w-4 h-4" />,
    roles: [
      {
        title: "Software Developer",
        period: "Jun 2021 – Jun 2022",
        description:
          "Leading frontend engineering on the Fiix CMMS's Calendar feature and representing the Calendar team in Design Review meetings.",
        skills: ["Design Systems", "Front-End Development"],
      },
    ],
  },
  {
    company: "Veriday Inc",
    icon: <Megaphone className="w-4 h-4" />,
    roles: [
      {
        title: "Frontend Engineer",
        period: "Jan 2021 – Jun 2021",
        description:
          "Frontend Engineering + Accessibility Audits on Veriday's Digital Agent.",
        skills: ["Accessibility", "Front-End Development"],
      },
    ],
  },
];

type ProjectEntry = {
  title: string;
  description: string;
  tags: string[];
  github: string;
  live?: string;
  icon: React.ReactNode;
  preview: PreviewKey;
};

const PROJECTS: ProjectEntry[] = [
  {
    title: "Lavender Finance",
    description:
      "A personal finance dashboard with net-worth tracking, budgeting, transaction management, and interactive charts. Features i18n, responsive layout, and Lavender Dawn/Moon themes.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Recharts", "i18next"],
    github: "https://github.com/ShrutiVellanki/lavender-finance",
    live: "https://lavender-finance.vercel.app",
    icon: <BarChart3 className="w-5 h-5" />,
    preview: "finance",
  },
  {
    title: "Lavender Storybook",
    description:
      "A themed copy-paste component library documented with Storybook. 20+ accessible, theme-aware React components with full design token system.",
    tags: ["React", "Storybook", "Tailwind CSS", "TypeScript"],
    github: "https://github.com/ShrutiVellanki/lavender-storybook",
    live: "https://lavender-storybook.vercel.app",
    icon: <Palette className="w-5 h-5" />,
    preview: "storybook",
  },
  {
    title: "Recipe Extraction Demo",
    description:
      "A Python-based solution for extracting recipe data from PDFs using GPT-5, LangChain, and PyMuPDF.",
    tags: ["Python", "LangChain", "GPT-5", "PyMuPDF"],
    github: "https://github.com/ShrutiVellanki/recipe-extraction-demo",
    icon: <Code2 className="w-5 h-5" />,
    preview: "recipe",
  },
];

const TALKS = [
  {
    title: "Addressing the Current State of Cognitive Accessibility",
    event: "Toronto JavaScript Meetup",
    date: "Apr 2024",
    description: "Making UIs legible under real-world cognitive load — bridging dev and design to support actual human attention patterns.",
    link: "https://docs.google.com/presentation/d/1JY9PGEJFxRvTTRGSnXWxPeX7zwe-zKVvcjYojPiqGSU/edit?slide=id.g2cdf78d232d_0_593#slide=id.g2cdf78d232d_0_593",
  },
  {
    title: "How to Add Accessibility Checks to Your Workflow",
    event: "Toronto JavaScript Meetup",
    date: "Sep 2023",
    description: "Practical strategies for weaving accessibility checks into everyday development without slowing down delivery.",
    link: "https://docs.google.com/presentation/d/1fNus6C7VcLAzvOt0sP0vIMvvTH3_DRhFOT6VBsvqVAo/edit?slide=id.g282c81c7448_1_166#slide=id.g282c81c7448_1_166",
  },
];

const SKILLS = [
  { category: "Development", items: ["React", "Svelte", "TypeScript", "JavaScript", "REST API Integration", "Tailwind CSS", "CI/CD (TeamCity)"], icon: <Code2 className="w-5 h-5" /> },
  { category: "UX & Design", items: ["Storybook", "Visual Testing (Storybook Addons)", "Unit Testing", "Accessibility", "Figma"], icon: <Palette className="w-5 h-5" /> },
  { category: "Cross-functional Collaboration", items: ["Partnering with design, product, and engineering teams"], icon: <Globe className="w-5 h-5" /> },
  { category: "AI & Accessibility", items: ["ARIA", "WCAG", "WAI", "JAWS", "NVDA", "Axe", "AI Tooling (Cursor, GitHub Copilot)"], icon: <BarChart3 className="w-5 h-5" /> },
];

type Accent = "iris" | "foam" | "gold" | "love" | "pine" | "rose";

const A: Record<Accent, { text: string; bg: string; border: string; pill: string; hoverText: string; hoverBg: string; solid: string; btn: string; socialHover: string }> = {
  iris:  { text: "text-iris-ink dark:text-iris-light", bg: "bg-iris/8 dark:bg-iris-light/8", border: "border-iris/40 dark:border-iris-light/30", pill: "bg-iris/10 text-iris-ink dark:bg-iris-light/10 dark:text-iris-light", hoverText: "hover:text-iris-ink dark:hover:text-iris-light", hoverBg: "hover:bg-iris/10 dark:hover:bg-iris-light/10", solid: "bg-iris dark:bg-iris-light", btn: "bg-iris text-white hover:bg-iris/85 dark:bg-iris-light dark:text-lavender-950 dark:hover:bg-iris-light/85", socialHover: "hover:text-iris-ink dark:hover:text-iris-light hover:border-iris/40 dark:hover:border-iris-light/30 hover:bg-iris/10 dark:hover:bg-iris-light/10" },
  foam:  { text: "text-foam-ink dark:text-foam-light", bg: "bg-foam/8 dark:bg-foam-light/8", border: "border-foam/40 dark:border-foam-light/30", pill: "bg-foam/10 text-foam-ink dark:bg-foam-light/10 dark:text-foam-light", hoverText: "hover:text-foam-ink dark:hover:text-foam-light", hoverBg: "hover:bg-foam/10 dark:hover:bg-foam-light/10", solid: "bg-foam dark:bg-foam-light", btn: "bg-foam text-white hover:bg-foam/85 dark:bg-foam-light dark:text-lavender-950 dark:hover:bg-foam-light/85", socialHover: "hover:text-foam-ink dark:hover:text-foam-light hover:border-foam/40 dark:hover:border-foam-light/30 hover:bg-foam/10 dark:hover:bg-foam-light/10" },
  gold:  { text: "text-gold-ink dark:text-gold-light", bg: "bg-gold/4 dark:bg-gold-light/5", border: "border-gold/25 dark:border-gold-light/20", pill: "bg-gold/10 text-gold-ink dark:bg-gold-light/10 dark:text-gold-light", hoverText: "hover:text-gold-ink dark:hover:text-gold-light", hoverBg: "hover:bg-gold/10 dark:hover:bg-gold-light/10", solid: "bg-gold dark:bg-gold-light", btn: "bg-gold text-lavender-950 hover:bg-gold/85 dark:bg-gold-light dark:text-lavender-950 dark:hover:bg-gold-light/85", socialHover: "hover:text-gold-ink dark:hover:text-gold-light hover:border-gold/40 dark:hover:border-gold-light/30 hover:bg-gold/10 dark:hover:bg-gold-light/10" },
  love:  { text: "text-love-ink dark:text-love-light", bg: "bg-love/8 dark:bg-love-light/8", border: "border-love/40 dark:border-love-light/30", pill: "bg-love/10 text-love-ink dark:bg-love-light/10 dark:text-love-light", hoverText: "hover:text-love-ink dark:hover:text-love-light", hoverBg: "hover:bg-love/10 dark:hover:bg-love-light/10", solid: "bg-love dark:bg-love-light", btn: "bg-love text-white hover:bg-love/85 dark:bg-love-light dark:text-lavender-950 dark:hover:bg-love-light/85", socialHover: "hover:text-love-ink dark:hover:text-love-light hover:border-love/40 dark:hover:border-love-light/30 hover:bg-love/10 dark:hover:bg-love-light/10" },
  pine:  { text: "text-pine-ink dark:text-pine-light", bg: "bg-pine/8 dark:bg-pine-light/8", border: "border-pine/40 dark:border-pine-light/30", pill: "bg-pine/10 text-pine-ink dark:bg-pine-light/10 dark:text-pine-light", hoverText: "hover:text-pine-ink dark:hover:text-pine-light", hoverBg: "hover:bg-pine/10 dark:hover:bg-pine-light/10", solid: "bg-pine dark:bg-pine-light", btn: "bg-pine text-white hover:bg-pine/85 dark:bg-pine-light dark:text-lavender-950 dark:hover:bg-pine-light/85", socialHover: "hover:text-pine-ink dark:hover:text-pine-light hover:border-pine/40 dark:hover:border-pine-light/30 hover:bg-pine/10 dark:hover:bg-pine-light/10" },
  rose:  { text: "text-rose-ink dark:text-rose-light", bg: "bg-rose/8 dark:bg-rose-light/8", border: "border-rose/40 dark:border-rose-light/30", pill: "bg-rose/10 text-rose-ink dark:bg-rose-light/10 dark:text-rose-light", hoverText: "hover:text-rose-ink dark:hover:text-rose-light", hoverBg: "hover:bg-rose/10 dark:hover:bg-rose-light/10", solid: "bg-rose dark:bg-rose-light", btn: "bg-rose text-lavender-950 hover:bg-rose/85 dark:bg-rose-light dark:text-lavender-950 dark:hover:bg-rose-light/85", socialHover: "hover:text-rose-ink dark:hover:text-rose-light hover:border-rose/40 dark:hover:border-rose-light/30 hover:bg-rose/10 dark:hover:bg-rose-light/10" },
};

/* ─── Token playground (hero showpiece) ───
   A live specimen rendered from the site's own Rosé Pine tokens.
   The accent picked here re-themes the whole page: buttons, links, card
   chips, pills, focus rings, selection, and the scroll progress bar. */

const TOKENS: Record<Accent, { hex: string; hexDark: string; inkHex: string; ink?: boolean }> = {
  iris: { hex: "#907aa9", hexDark: "#d4bdef", inkHex: "#7a6395" },
  foam: { hex: "#6e9a82", hexDark: "#a8d4b8", inkHex: "#527a63" },
  gold: { hex: "#ea9d34", hexDark: "#fad49a", inkHex: "#9a6511", ink: true },
  love: { hex: "#b4637a", hexDark: "#f082a0", inkHex: "#a85570" },
  pine: { hex: "#856b80", hexDark: "#ccb0c6", inkHex: "#7a6375" },
  rose: { hex: "#d7827e", hexDark: "#f0ada9", inkHex: "#a35450", ink: true },
};
const ACCENT_KEYS = Object.keys(TOKENS) as Accent[];
const RADII = { sm: 4, md: 12, lg: 24 } as const;
type Radius = keyof typeof RADII;

function TokenPlayground({ accent, onAccentChange, radius, onRadiusChange, dark, onToggleTheme }: {
  accent: Accent;
  onAccentChange: (a: Accent) => void;
  radius: Radius;
  onRadiusChange: (r: Radius) => void;
  dark: boolean;
  onToggleTheme: () => void;
}) {
  const t = TOKENS[accent];
  const hex = dark ? t.hexDark : t.hex;
  // Dark-theme accents are pastels (need ink text); light-theme gold/rose are too bright for white.
  const btnInk = dark || t.ink ? "#1a1830" : "#ffffff";
  const r = RADII[radius];

  return (
    <div>
      <p className="text-[13px] leading-snug text-lavender-700 dark:text-lavender-300">
        This site renders from the same design tokens as{" "}
        <a href="https://github.com/ShrutiVellanki/lavender-storybook" target="_blank" rel="noopener noreferrer" className={`font-semibold ${A[accent].text} hover:underline transition-colors duration-300`}>lavender-storybook</a>.
        Change a token below and the whole page updates.
      </p>

      {/* Two columns in the wide desktop dialog: controls left, specimen right */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">
      {/* Specimen */}
      <div
        className="mt-5 lg:order-2 border border-lavender-300/70 dark:border-lavender-700/30 bg-lavender-100/80 dark:bg-lavender-900/70 p-4 transition-[border-radius] duration-300"
        style={{ borderRadius: r + 6 }}
      >
        <div
          className="bg-white dark:bg-lavender-950 border border-lavender-200 dark:border-lavender-700/25 p-4 transition-[border-radius] duration-300"
          style={{ borderRadius: r }}
        >
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full transition-colors duration-300" style={{ backgroundColor: hex }} />
            <span className="text-[13px] font-bold text-lavender-700 dark:text-lavender-50">Lavender UI</span>
          </div>
          <div aria-hidden="true" className="mt-4 flex items-end gap-1.5 h-16">
            {[0.45, 0.75, 0.55, 1, 0.65].map((h, i) => (
              <span
                key={i}
                className="flex-1 transition-colors duration-300"
                style={{ height: `${h * 100}%`, backgroundColor: hex, opacity: 0.35 + h * 0.55, borderRadius: Math.max(2, Math.min(r / 2, 10)), transition: "background-color 300ms, border-radius 300ms" }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-5 lg:order-1 space-y-4">
        <div>
          <span className="block text-[11px] font-mono font-medium text-lavender-700 dark:text-lavender-300 mb-2">--color-accent</span>
          <div className="flex items-center gap-2.5">
            {ACCENT_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={accent === k}
                aria-label={`Use ${k} accent`}
                onClick={() => onAccentChange(k)}
                className={`w-7 h-7 rounded-full border border-lavender-900/15 dark:border-white/20 transition-transform duration-200 hover:scale-110 ${
                  accent === k ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-lavender-950" : ""
                }`}
                style={{
                  backgroundColor: dark ? TOKENS[k].hexDark : TOKENS[k].hex,
                  ...(accent === k ? { "--tw-ring-color": dark ? TOKENS[k].hexDark : TOKENS[k].hex } : {}),
                } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
        <div>
          <span className="block text-[11px] font-mono font-medium text-lavender-700 dark:text-lavender-300 mb-2">--radius</span>
          <div className="inline-flex rounded-lg border border-lavender-300/80 dark:border-lavender-700/40 overflow-hidden">
            {(Object.keys(RADII) as Radius[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={radius === k}
                onClick={() => onRadiusChange(k)}
                className={`px-3 py-1 text-[12px] font-bold uppercase tracking-wide transition-colors ${
                  radius === k ? "" : "text-lavender-700 dark:text-lavender-300 hover:bg-lavender-100 dark:hover:bg-lavender-900/60"
                }`}
                style={radius === k ? { backgroundColor: hex, color: btnInk } : undefined}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="block text-[11px] font-mono font-medium text-lavender-700 dark:text-lavender-300 mb-2">--theme</span>
          <div className="inline-flex rounded-lg border border-lavender-300/80 dark:border-lavender-700/40 overflow-hidden">
            <button
              type="button"
              aria-pressed={!dark}
              aria-label="Switch to light theme"
              onClick={() => { if (dark) onToggleTheme(); }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-[12px] font-bold uppercase tracking-wide transition-colors ${
                !dark ? "" : "text-lavender-700 dark:text-lavender-300 hover:bg-lavender-100 dark:hover:bg-lavender-900/60"
              }`}
              style={!dark ? { backgroundColor: hex, color: btnInk } : undefined}
            >
              <Sun className="w-3.5 h-3.5" aria-hidden="true" /> light
            </button>
            <button
              type="button"
              aria-pressed={dark}
              aria-label="Switch to dark theme"
              onClick={() => { if (!dark) onToggleTheme(); }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-[12px] font-bold uppercase tracking-wide transition-colors ${
                dark ? "" : "text-lavender-700 dark:text-lavender-300 hover:bg-lavender-100 dark:hover:bg-lavender-900/60"
              }`}
              style={dark ? { backgroundColor: hex, color: btnInk } : undefined}
            >
              <Moon className="w-3.5 h-3.5" aria-hidden="true" /> dark
            </button>
          </div>
        </div>
        <p aria-live="polite" className="font-mono text-[11px] text-lavender-700 dark:text-lavender-300 border-t border-lavender-200/80 dark:border-lavender-700/25 pt-3">
          --color-{accent}: <span className="font-bold" style={{ color: dark ? t.hexDark : t.inkHex }}>{hex}</span>; --radius: {r}px; --theme: {dark ? "dark" : "light"};
        </p>
      </div>
      </div>
    </div>
  );
}

/* ─── Token modal — bottom sheet on mobile, centered dialog on desktop ─── */

function TokenModal({ accent, onAccentChange, radius, onRadiusChange, dark, onToggleTheme }: {
  accent: Accent;
  onAccentChange: (a: Accent) => void;
  radius: Radius;
  onRadiusChange: (r: Radius) => void;
  dark: boolean;
  onToggleTheme: () => void;
}) {
  // The playground auto-opens as a modal on load — a bottom sheet on small
  // screens, a centered dialog on large ones — and the palette FAB re-opens
  // it after dismissal. One state drives both presentations.
  const [open, setOpen] = useState(true);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  // Modal a11y: lock body scroll, close on Escape, move focus in on open
  // and back to the FAB on close.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      fabRef.current?.focus();
    };
  }, [open]);

  const t = TOKENS[accent];
  const dotColor = dark ? t.hexDark : t.hex;

  return open ? (
    <div className="fixed inset-0 z-[70] flex items-end justify-center lg:items-center lg:p-8">
      <div
        className="backdrop-in absolute inset-0 bg-lavender-950/50"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="token-sheet-title"
        className="sheet-in relative w-full lg:w-[640px] max-h-[85dvh] lg:max-h-[calc(100vh-6rem)] overflow-y-auto bg-white dark:bg-lavender-950 border-t lg:border border-lavender-300/80 dark:border-lavender-700/40 shadow-[0_-8px_32px_rgba(35,33,54,0.25)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.5)] rounded-t-[calc(var(--card-r,12px)+4px)] lg:rounded-[calc(var(--card-r,12px)+4px)] pb-[env(safe-area-inset-bottom)] lg:pb-0 transition-[border-radius] duration-300"
      >
        <div className="sticky top-0 z-10 flex items-center gap-2.5 px-5 py-4 bg-white dark:bg-lavender-950 border-b border-lavender-200/80 dark:border-lavender-700/25">
          <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full transition-colors duration-300" style={{ backgroundColor: dotColor }} />
          <span id="token-sheet-title" className="text-[13px] font-bold text-lavender-700 dark:text-lavender-50">Live design tokens</span>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close design tokens"
            className={`ml-auto -mr-2 p-2 rounded-lg text-lavender-600 dark:text-lavender-400 ${A[accent].hoverText} ${A[accent].hoverBg} transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">
          <TokenPlayground
            accent={accent}
            onAccentChange={onAccentChange}
            radius={radius}
            onRadiusChange={onRadiusChange}
            dark={dark}
            onToggleTheme={onToggleTheme}
          />
        </div>
      </div>
    </div>
  ) : (
    <button
      ref={fabRef}
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Open design tokens"
      className={`fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-4 sm:right-6 z-40 p-3.5 rounded-full ${A[accent].btn} shadow-lg shadow-black/20 dark:shadow-black/40 transition-colors duration-300`}
    >
      <Palette className="w-5 h-5" />
    </button>
  );
}

/* ─── App ─── */

export default function App() {
  const { dark, toggle } = useTheme();
  const [mobileNav, setMobileNav] = useState(false);
  const [active, setActive] = useState("");
  const [accent, setAccent] = useState<Accent>("iris");
  const [radius, setRadius] = useState<Radius>("md");
  useReveal();

  // Propagate the radius token to the page: .card surfaces read var(--card-r),
  // so picking sm/md/lg in the playground reshapes the whole site.
  useEffect(() => {
    document.documentElement.style.setProperty("--card-r", `${RADII[radius]}px`);
  }, [radius]);

  // Propagate the accent token to CSS-only chrome (text selection, focus rings).
  useEffect(() => {
    const t = TOKENS[accent];
    const s = document.documentElement.style;
    s.setProperty("--accent", t.hex);
    s.setProperty("--accent-dark", t.hexDark);
  }, [accent]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    SECTIONS.forEach(({ id }) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <>
    <ShaderBackground dark={dark} />
    <div className="geo-bg min-h-screen text-lavender-700 dark:text-lavender-300 transition-colors duration-500 bg-lavender-50/10 dark:bg-lavender-900/20">

      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lg ${A[accent].btn}`}
      >
        Skip to content
      </a>

      {/* ── Progress bar (sits on top edge of nav) ── */}
      <ProgressBar accentClass={A[accent].solid} />

      {/* ── Nav ── */}
      <nav aria-label="Primary" className="fixed top-0 inset-x-0 z-50 backdrop-blur-lg bg-lavender-50/70 dark:bg-lavender-900/70 border-b border-lavender-300/30 dark:border-lavender-700/10">
        <div className="px-6 sm:px-10">
          <div className="max-w-6xl mx-auto h-14 flex items-center justify-between">
          <a href="#" className={`text-[15px] font-bold tracking-[-0.02em] text-lavender-700 dark:text-lavender-100 ${A[accent].hoverText} transition-colors`}>
            Shruti Vellanki
          </a>

          <div className="flex items-center gap-1">
            {/* Desktop nav */}
            <ul className="hidden lg:flex items-center">
              {SECTIONS.filter(s => s.id !== "contact").map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={active === s.id ? "page" : undefined}
                    className={`relative inline-flex items-center px-3 py-1.5 text-[13px] font-medium tracking-wide transition-colors ${
                      active === s.id
                        ? A[accent].text
                        : `text-lavender-700 dark:text-lavender-300 ${A[accent].hoverText}`
                    }`}
                  >
                    {s.label}
                    {active === s.id && (
                      <span className={`absolute bottom-0 left-3 right-3 h-[2px] ${A[accent].solid} rounded-full`} />
                    )}
                  </a>
                </li>
              ))}
            </ul>

            <a href="#contact" className={`hidden lg:inline-flex items-center ml-4 px-4 py-1.5 text-[13px] font-semibold rounded-full ${A[accent].btn} transition-colors duration-300`}>
              Get in Touch
            </a>

            <button onClick={() => setMobileNav(!mobileNav)} className={`lg:hidden p-2 ml-2 rounded-lg text-lavender-600 dark:text-lavender-400 ${A[accent].hoverText} ${A[accent].hoverBg} transition-colors`} aria-label={mobileNav ? "Close menu" : "Open menu"} aria-expanded={mobileNav} aria-controls="mobile-nav">
              {mobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileNav && (
          <div id="mobile-nav" className="lg:hidden border-t border-lavender-300/30 dark:border-lavender-700/10 bg-lavender-50/95 dark:bg-lavender-900/95 backdrop-blur-lg">
            <div className="px-6 sm:px-10">
              <div className="max-w-6xl mx-auto py-5 space-y-4">
              {SECTIONS.filter(s => s.id !== "contact").map((s) => (
                <a key={s.id} href={`#${s.id}`} onClick={() => setMobileNav(false)} aria-current={active === s.id ? "page" : undefined} className={`flex items-center text-sm font-medium transition-colors ${active === s.id ? A[accent].text : `text-lavender-700 dark:text-lavender-300 ${A[accent].hoverText}`}`}>
                  {s.label}
                </a>
              ))}
              <a href="#contact" onClick={() => setMobileNav(false)} className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full ${A[accent].btn} transition-colors duration-300`}>
                Get in Touch
              </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main id="main">
        {/* ══════════════ HERO ══════════════ */}
        <section id="about" className="hero-full relative flex items-center pt-20 pb-10 sm:pt-24 sm:pb-12 px-6 sm:px-10 bg-lavender-100/70 dark:bg-lavender-950/65">
          {/* soft radial halo behind hero text — invisible card, real contrast */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background:radial-gradient(75%_65%_at_30%_50%,rgba(250,250,252,0.78),rgba(250,250,252,0.30)_55%,transparent_80%)] dark:[background:radial-gradient(75%_65%_at_30%_50%,rgba(26,24,48,0.85),rgba(26,24,48,0.35)_55%,transparent_80%)]"
          />
          <div className="relative w-full max-w-6xl mx-auto">
            <div className="hero-in">
              <p className={`sec-num ${A[accent].text} mb-6 transition-colors duration-300 [text-shadow:0_1px_22px_rgba(250,250,252,0.85),0_0_2px_rgba(250,250,252,0.6)] dark:[text-shadow:0_1px_22px_rgba(26,24,48,0.9),0_0_2px_rgba(26,24,48,0.7)]`}>
                Product Engineer · Toronto
              </p>
              <h1 className="text-[clamp(2.75rem,7vw,5rem)] font-extrabold tracking-[-0.04em] leading-[0.95] text-lavender-700 dark:text-lavender-50 [text-shadow:0_2px_36px_rgba(250,250,252,0.85),0_0_3px_rgba(250,250,252,0.5)] dark:[text-shadow:0_2px_36px_rgba(26,24,48,0.95),0_0_3px_rgba(26,24,48,0.7)]">
                Shruti<br />Vellanki
              </h1>
              <p className="mt-8 max-w-lg text-lg text-lavender-700 dark:text-lavender-50 leading-relaxed font-medium [text-shadow:0_1px_24px_rgba(250,250,252,0.9),0_0_2px_rgba(250,250,252,0.6)] dark:[text-shadow:0_1px_24px_rgba(26,24,48,0.95),0_0_2px_rgba(26,24,48,0.7)]">
                Product engineer focused on great UX, platform UI, and AI-powered features.
              </p>
              <div className="mt-10 flex items-center gap-5">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`p-3 rounded-full bg-white/75 dark:bg-lavender-950/75 border border-lavender-300/60 dark:border-lavender-700/40 text-lavender-700 dark:text-lavender-100 ${A[accent].socialHover} transition-all duration-300`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ EXPERIENCE ══════════════ */}
        <Section id="experience" title="Experience">
          <div className="space-y-14">
            {EXPERIENCE.map((exp) => {
              const ac = A[accent];
              return (
                <div key={exp.company} className="rv">
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`${ac.text} p-2 rounded-lg ${ac.bg} transition-colors duration-300`}>{exp.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-lavender-700 dark:text-lavender-100 leading-tight">
                        {exp.company}
                        {exp.subtitle && <span className="font-normal text-lavender-700 dark:text-lavender-400 ml-2 text-base">{exp.subtitle}</span>}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-8 ml-[18px] pl-8 border-l-2 border-lavender-400/70 dark:border-lavender-500/50">
                    {exp.roles.map((role) => (
                      <div key={role.title + role.period} className="relative">
                        <span className={`absolute -left-[calc(2rem+7px)] top-0 w-3 h-3 rounded-full ${ac.solid} ring-2 ring-lavender-50 dark:ring-lavender-950 shadow-sm transition-colors duration-300`} />
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <h4 className="text-base font-semibold text-lavender-700 dark:text-lavender-200">{role.title}</h4>
                          <span className="text-xs font-semibold tracking-wide text-lavender-700 dark:text-lavender-200 uppercase tabular-nums">{role.period}</span>
                        </div>
                        {role.location && (
                          <p className="text-xs text-lavender-700 dark:text-lavender-300 mt-1 tracking-wide">{role.location}</p>
                        )}
                        {role.description && (
                          <p className="text-sm text-lavender-700 dark:text-lavender-400 mt-3 leading-relaxed">{role.description}</p>
                        )}
                        {role.skills && role.skills.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {role.skills.map((skill) => (
                              <span key={skill} className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${ac.pill} transition-colors duration-300`}>{skill}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ══════════════ PROJECTS ══════════════ */}
        <Section id="projects" title="Projects" alt>
          <div className="grid lg:grid-cols-3 gap-5 sg">
            {PROJECTS.map((p) => {
              const ac = A[accent];
              return (
                <div key={p.title} className="card group flex flex-col overflow-hidden bg-white/95 dark:bg-lavender-950/90 border border-lavender-200 dark:border-lavender-700/15 hover:shadow-lg hover:shadow-lavender-300/15 dark:hover:shadow-black/20">
                  {/* preview — inset frame reads clearly on light cards */}
                  <div className="relative mx-3 mt-3 aspect-[16/10] shrink-0 overflow-hidden rounded-xl border border-lavender-400/55 bg-lavender-100/70 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)] dark:border-lavender-600/40 dark:bg-lavender-900/60 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
                    <ProjectPreview kind={p.preview} accent={accent} className="absolute inset-0 w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/15 dark:from-lavender-950/30 to-transparent" />
                  </div>

                  {/* content */}
                  <div className="flex flex-col flex-1 p-6 pt-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`${ac.text} p-2 rounded-lg ${ac.bg} transition-colors duration-300`}>{p.icon}</span>
                      <h3 className="text-base font-bold text-lavender-700 dark:text-lavender-100">{p.title}</h3>
                    </div>
                    <p className="text-sm text-lavender-700 dark:text-lavender-400 leading-relaxed mb-4">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {p.tags.map((t) => (
                        <span key={t} className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${ac.pill} transition-colors duration-300`}>{t}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-5 text-sm mt-auto pt-4 border-t border-lavender-200/60 dark:border-lavender-700/15">
                      <a href={p.github} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 font-medium text-lavender-700 dark:text-lavender-300 ${ac.hoverText} transition-colors`}>
                        <GithubIcon className="w-4 h-4" /> Code
                      </a>
                      {p.live && (
                        <a href={p.live} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 font-medium text-lavender-700 dark:text-lavender-300 ${ac.hoverText} transition-colors`}>
                          <ExternalLink className="w-4 h-4" /> Live
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ══════════════ SKILLS ══════════════ */}
        <Section id="skills" title="Skills">
          <div className="grid auto-rows-fr lg:grid-cols-2 gap-4 sg">
            {SKILLS.map((s) => {
              const ac = A[accent];
              return (
                <div key={s.category} className="card p-7 bg-white/95 dark:bg-lavender-950/90 border border-lavender-200 dark:border-lavender-700/15 hover:shadow-lg hover:shadow-lavender-300/15 dark:hover:shadow-black/20">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`${ac.text} p-2 rounded-lg ${ac.bg} transition-colors duration-300`}>{s.icon}</span>
                    <h3 className="text-sm font-bold tracking-wide text-lavender-700 dark:text-lavender-100">{s.category}</h3>
                  </div>
                  <ul className="space-y-2">
                    {s.items.map((item) => (
                      <li key={item} className="text-sm text-lavender-700 dark:text-lavender-400 leading-snug pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1 before:h-1 before:rounded-full before:bg-lavender-400 dark:before:bg-lavender-600">{item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ══════════════ TALKS ══════════════ */}
        <Section id="talks" title="Talks" alt>
          <div className="grid lg:grid-cols-2 gap-5 sg">
            {TALKS.map((talk) => {
              const ac = A[accent];
              return (
                <div key={talk.title} className="card flex flex-col p-7 bg-white/95 dark:bg-lavender-950/90 border border-lavender-200 dark:border-lavender-700/15 hover:shadow-lg hover:shadow-lavender-300/15 dark:hover:shadow-black/20">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`${ac.text} p-2 rounded-lg ${ac.bg} transition-colors duration-300`}><Mic className="w-5 h-5" /></span>
                    <h3 className="text-base font-bold text-lavender-700 dark:text-lavender-100 leading-snug">{talk.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold tracking-wide uppercase ${ac.text} transition-colors duration-300`}>{talk.event}</span>
                    {talk.date && <span className="text-xs text-lavender-700 dark:text-lavender-400 font-medium">· {talk.date}</span>}
                  </div>
                  <p className="text-sm text-lavender-700 dark:text-lavender-400 leading-relaxed mb-4">{talk.description}</p>
                  {talk.link && (
                    <div className="flex items-center gap-5 text-sm mt-auto pt-4 border-t border-lavender-200/60 dark:border-lavender-700/15">
                      <a href={talk.link} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 font-medium text-lavender-700 dark:text-lavender-300 ${ac.hoverText} transition-colors`}>
                        <ExternalLink className="w-4 h-4" /> View Slides
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        {/* ══════════════ CONTACT ══════════════ */}
        <Section id="contact" title="Get in Touch" center>
          <div className="max-w-md mx-auto text-center">
            <p className="text-base text-lavender-700 dark:text-lavender-300 leading-relaxed">
              Always open to interesting conversations and opportunities — or just grabbing a coffee somewhere in Toronto. Feel free to reach out.
            </p>
            <div className="mt-8">
              <a
                href="mailto:shvellanki@gmail.com"
                className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full ${A[accent].btn} transition-colors duration-300`}
              >
                <Mail className="w-4 h-4" />
                Email me
              </a>
            </div>
            <div className="mt-8 flex justify-center gap-5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={`p-3 rounded-full bg-white/75 dark:bg-lavender-950/75 border border-lavender-300/60 dark:border-lavender-700/40 text-lavender-700 dark:text-lavender-100 ${A[accent].socialHover} transition-all duration-300`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </Section>
      </main>

      {/* ── Footer ── */}
      <footer className="relative py-10 px-6 border-t border-lavender-300/70 dark:border-lavender-700/40 bg-lavender-100/70 dark:bg-lavender-950/65">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 text-xs font-medium text-lavender-700 dark:text-lavender-200">
          <span>&copy; {new Date().getFullYear()} Shruti Vellanki</span>
          <span>
            Built with{" "}
            <a href="https://github.com/ShrutiVellanki/lavender-storybook" target="_blank" rel="noopener noreferrer" className={`${A[accent].text} hover:underline font-semibold transition-colors duration-300`}>
              lavender-storybook
            </a>
          </span>
        </div>
      </footer>

      {/* ── Token playground modal (auto-opens; palette FAB re-opens it) ── */}
      <TokenModal
        accent={accent}
        onAccentChange={setAccent}
        radius={radius}
        onRadiusChange={setRadius}
        dark={dark}
        onToggleTheme={toggle}
      />

      {/* ── Back to top (bottom-left; the palette FAB owns the right corner) ── */}
      <BackToTop btnClass={A[accent].btn} />
    </div>
    </>
  );
}

/* ─── Section wrapper ─── */

function Section({ id, title, alt, center, children }: {
  id: string; title: string; alt?: boolean; center?: boolean; children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative py-8 sm:py-12 px-6 sm:px-10 ${
        alt
          ? "bg-lavender-100/80 dark:bg-lavender-950/75"
          : "bg-lavender-50/60 dark:bg-lavender-900/45"
      }`}
    >
      <div className="relative max-w-6xl mx-auto rv">
        <div className={`relative mb-8 ${center ? "text-center" : ""}`}>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-lavender-700 dark:text-lavender-50">
            {title}
          </h2>
        </div>
        <div className="relative">{children}</div>
      </div>
    </section>
  );
}
