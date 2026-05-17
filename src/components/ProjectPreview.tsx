/**
 * Designed SVG previews for project cards.
 *
 * Goals:
 * - Stylized rather than photorealistic — hints at each project's UI/concept
 *   without going stale when the live site changes.
 * - Consistent 16:10 viewBox (400×250) so cards line up cleanly.
 * - Uses the lavender palette + each project's accent color.
 *
 * Each preview is purely decorative; consumers should pass aria-hidden.
 */

type Accent = "iris" | "foam" | "gold" | "love" | "pine" | "rose";

type PreviewProps = {
  accent: Accent;
  className?: string;
};

const ACCENT_HEX: Record<Accent, { solid: string; soft: string; ink: string }> = {
  iris: { solid: "#907aa9", soft: "#d4bdef", ink: "#575279" },
  foam: { solid: "#6e9a82", soft: "#a8d4b8", ink: "#3f6651" },
  love: { solid: "#b4637a", soft: "#f082a0", ink: "#7f4257" },
  gold: { solid: "#c98b22", soft: "#f5cf85", ink: "#8a5e15" },
  pine: { solid: "#856b80", soft: "#ccb0c6", ink: "#5b4a58" },
  rose: { solid: "#d7827e", soft: "#f0ada9", ink: "#9c5854" },
};

/* ── Lavender Finance — stylized dashboard ── */
export function FinancePreview({ accent, className }: PreviewProps) {
  const c = ACCENT_HEX[accent];
  return (
    <svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="finance-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fafafc" />
          <stop offset="100%" stopColor="#efeef5" />
        </linearGradient>
        <linearGradient id="finance-line-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.solid} stopOpacity="0.35" />
          <stop offset="100%" stopColor={c.solid} stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="400" height="250" fill="url(#finance-bg)" />

      {/* sidebar */}
      <rect x="0" y="0" width="68" height="250" fill="#fff" opacity="0.85" />
      <rect x="12" y="14" width="44" height="6" rx="3" fill={c.solid} />
      <rect x="12" y="44" width="44" height="4" rx="2" fill="#dfdee8" />
      <rect x="12" y="56" width="34" height="4" rx="2" fill="#dfdee8" />
      <rect x="12" y="68" width="40" height="4" rx="2" fill="#dfdee8" />
      <rect x="8" y="40" width="52" height="14" rx="3" fill={c.soft} opacity="0.45" />

      {/* main panel: net worth card */}
      <rect x="84" y="18" width="300" height="118" rx="10" fill="#fff" stroke="#efeef5" />
      <rect x="98" y="32" width="58" height="5" rx="2.5" fill="#9893a5" />
      <rect x="98" y="46" width="92" height="11" rx="3" fill={c.ink} />
      <rect x="200" y="48" width="34" height="7" rx="3.5" fill={c.solid} opacity="0.85" />

      {/* sparkline area */}
      <path
        d="M98 116 L120 102 L138 108 L156 88 L176 96 L198 78 L222 86 L246 70 L270 80 L296 60 L324 68 L356 50 L370 56"
        fill="none"
        stroke={c.solid}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M98 116 L120 102 L138 108 L156 88 L176 96 L198 78 L222 86 L246 70 L270 80 L296 60 L324 68 L356 50 L370 56 L370 126 L98 126 Z"
        fill="url(#finance-line-fill)"
      />
      <circle cx="370" cy="56" r="3" fill={c.solid} />
      <circle cx="370" cy="56" r="6" fill={c.solid} opacity="0.18" />

      {/* stat cards row */}
      <g>
        <rect x="84" y="148" width="94" height="80" rx="8" fill="#fff" stroke="#efeef5" />
        <rect x="96" y="160" width="40" height="4" rx="2" fill="#9893a5" />
        <rect x="96" y="174" width="58" height="9" rx="3" fill={c.ink} />
        <rect x="96" y="194" width="68" height="3" rx="1.5" fill="#dfdee8" />
        <rect x="96" y="202" width="50" height="3" rx="1.5" fill="#dfdee8" />
      </g>
      <g>
        <rect x="184" y="148" width="94" height="80" rx="8" fill="#fff" stroke="#efeef5" />
        <rect x="196" y="160" width="40" height="4" rx="2" fill="#9893a5" />
        <rect x="196" y="174" width="58" height="9" rx="3" fill="#575279" />
        <rect x="196" y="194" width="68" height="3" rx="1.5" fill="#dfdee8" />
      </g>
      <g>
        <rect x="284" y="148" width="100" height="80" rx="8" fill="#fff" stroke="#efeef5" />
        <rect x="296" y="160" width="40" height="4" rx="2" fill="#9893a5" />
        <rect x="296" y="174" width="58" height="9" rx="3" fill={c.ink} />
        <rect x="296" y="194" width="68" height="3" rx="1.5" fill="#dfdee8" />
        <circle cx="370" cy="164" r="6" fill={c.soft} opacity="0.6" />
      </g>
    </svg>
  );
}

/* ── Lavender Storybook — component grid ── */
export function StorybookPreview({ accent, className }: PreviewProps) {
  const c = ACCENT_HEX[accent];
  return (
    <svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="sb-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fafafc" />
          <stop offset="100%" stopColor="#efeef5" />
        </linearGradient>
      </defs>
      <rect width="400" height="250" fill="url(#sb-bg)" />

      {/* left rail */}
      <rect x="0" y="0" width="78" height="250" fill="#fff" opacity="0.9" />
      <rect x="12" y="16" width="48" height="6" rx="3" fill={c.solid} />
      <rect x="12" y="36" width="54" height="3" rx="1.5" fill="#dfdee8" />
      <rect x="12" y="46" width="40" height="3" rx="1.5" fill="#dfdee8" />
      <rect x="12" y="62" width="30" height="4" rx="2" fill="#9893a5" />
      <rect x="12" y="76" width="50" height="3" rx="1.5" fill="#dfdee8" />
      <rect x="12" y="86" width="44" height="3" rx="1.5" fill="#dfdee8" />
      <rect x="12" y="96" width="36" height="3" rx="1.5" fill="#dfdee8" />
      <rect x="12" y="112" width="32" height="4" rx="2" fill="#9893a5" />
      <rect x="12" y="126" width="46" height="3" rx="1.5" fill="#dfdee8" />
      <rect x="12" y="136" width="38" height="3" rx="1.5" fill="#dfdee8" />
      <rect x="12" y="152" width="30" height="4" rx="2" fill="#9893a5" />
      <rect x="12" y="166" width="48" height="3" rx="1.5" fill="#dfdee8" />
      <rect x="12" y="176" width="40" height="3" rx="1.5" fill="#dfdee8" />

      {/* canvas area: 2x2 component preview grid */}
      {/* top-left: a button */}
      <rect x="94" y="20" width="142" height="100" rx="8" fill="#fff" stroke="#efeef5" />
      <rect x="106" y="32" width="50" height="3" rx="1.5" fill="#dfdee8" />
      <rect x="135" y="60" width="60" height="22" rx="11" fill={c.solid} />
      <rect x="148" y="68" width="34" height="6" rx="2" fill="#fff" opacity="0.95" />

      {/* top-right: input + label */}
      <rect x="244" y="20" width="142" height="100" rx="8" fill="#fff" stroke="#efeef5" />
      <rect x="256" y="32" width="60" height="3" rx="1.5" fill="#dfdee8" />
      <rect x="256" y="58" width="44" height="3" rx="1.5" fill="#9893a5" />
      <rect x="256" y="70" width="118" height="22" rx="6" fill="#fafafc" stroke={c.soft} />
      <circle cx="364" cy="81" r="3" fill={c.solid} />

      {/* bottom-left: tabs / pin */}
      <rect x="94" y="130" width="142" height="100" rx="8" fill="#fff" stroke="#efeef5" />
      <rect x="106" y="142" width="60" height="3" rx="1.5" fill="#dfdee8" />
      <g>
        <rect x="106" y="166" width="22" height="28" rx="4" fill={c.soft} opacity="0.45" />
        <rect x="132" y="166" width="22" height="28" rx="4" fill={c.soft} opacity="0.45" />
        <rect x="158" y="166" width="22" height="28" rx="4" fill={c.solid} />
        <rect x="184" y="166" width="22" height="28" rx="4" fill={c.soft} opacity="0.45" />
        <rect x="210" y="166" width="14" height="28" rx="4" fill={c.soft} opacity="0.45" />
      </g>
      <rect x="106" y="206" width="40" height="3" rx="1.5" fill="#dfdee8" />

      {/* bottom-right: chart sparkline */}
      <rect x="244" y="130" width="142" height="100" rx="8" fill="#fff" stroke="#efeef5" />
      <rect x="256" y="142" width="60" height="3" rx="1.5" fill="#dfdee8" />
      <path
        d="M256 210 L268 200 L280 188 L294 196 L308 178 L322 184 L336 168 L352 174 L368 156 L378 162"
        fill="none"
        stroke={c.solid}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="378" cy="162" r="3" fill={c.solid} />
    </svg>
  );
}

/* ── Recipe Extraction — document → structured data ── */
export function RecipePreview({ accent, className }: PreviewProps) {
  const c = ACCENT_HEX[accent];
  return (
    <svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="recipe-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fafafc" />
          <stop offset="100%" stopColor="#efeef5" />
        </linearGradient>
      </defs>
      <rect width="400" height="250" fill="url(#recipe-bg)" />

      {/* left: PDF document */}
      <g>
        {/* shadow */}
        <rect x="34" y="38" width="124" height="174" rx="6" fill="#000" opacity="0.06" />
        {/* page */}
        <rect x="30" y="34" width="124" height="174" rx="5" fill="#fff" stroke="#efeef5" />
        {/* dog-ear corner */}
        <path d="M138 34 L154 34 L154 50 Z" fill="#f3f2f7" />
        <path d="M138 34 L154 50 L138 50 Z" fill="#dfdee8" />
        {/* title */}
        <rect x="44" y="50" width="68" height="6" rx="2" fill={c.ink} />
        <rect x="44" y="62" width="44" height="3" rx="1.5" fill="#9893a5" />
        {/* body lines */}
        <rect x="44" y="80" width="92" height="3" rx="1.5" fill="#dfdee8" />
        <rect x="44" y="90" width="84" height="3" rx="1.5" fill="#dfdee8" />
        {/* highlighted ingredient lines */}
        <rect x="42" y="102" width="98" height="10" rx="2" fill={c.soft} opacity="0.55" />
        <rect x="44" y="105" width="88" height="3.5" rx="1.5" fill={c.ink} />
        <rect x="44" y="118" width="74" height="3" rx="1.5" fill="#dfdee8" />
        <rect x="42" y="128" width="92" height="10" rx="2" fill={c.soft} opacity="0.55" />
        <rect x="44" y="131" width="80" height="3.5" rx="1.5" fill={c.ink} />
        <rect x="44" y="144" width="86" height="3" rx="1.5" fill="#dfdee8" />
        <rect x="44" y="154" width="72" height="3" rx="1.5" fill="#dfdee8" />
        <rect x="44" y="164" width="84" height="3" rx="1.5" fill="#dfdee8" />
        <rect x="44" y="174" width="60" height="3" rx="1.5" fill="#dfdee8" />
        <rect x="44" y="184" width="74" height="3" rx="1.5" fill="#dfdee8" />
        <rect x="44" y="194" width="48" height="3" rx="1.5" fill="#dfdee8" />
      </g>

      {/* arrow + AI badge */}
      <g>
        <line x1="170" y1="125" x2="220" y2="125" stroke={c.solid} strokeWidth="1.5" strokeDasharray="3 3" />
        <polygon points="220,120 230,125 220,130" fill={c.solid} />
        <rect x="178" y="105" width="42" height="16" rx="8" fill={c.solid} />
        <text x="199" y="116" textAnchor="middle" fontFamily="ui-monospace, SFMono-Regular, monospace" fontSize="8" fontWeight="600" fill="#fff" letterSpacing="0.5">
          GPT-5
        </text>
      </g>

      {/* right: structured output cards */}
      <g>
        <rect x="240" y="40" width="138" height="56" rx="6" fill="#fff" stroke="#efeef5" />
        <rect x="252" y="52" width="46" height="3.5" rx="1.5" fill={c.solid} />
        <rect x="252" y="64" width="100" height="3" rx="1.5" fill="#dfdee8" />
        <rect x="252" y="74" width="84" height="3" rx="1.5" fill="#dfdee8" />
        <rect x="252" y="84" width="70" height="3" rx="1.5" fill="#dfdee8" />

        <rect x="240" y="104" width="138" height="44" rx="6" fill="#fff" stroke="#efeef5" />
        <rect x="252" y="116" width="38" height="3.5" rx="1.5" fill={c.solid} />
        <rect x="252" y="128" width="106" height="3" rx="1.5" fill="#dfdee8" />
        <rect x="252" y="138" width="82" height="3" rx="1.5" fill="#dfdee8" />

        <rect x="240" y="156" width="138" height="56" rx="6" fill="#fff" stroke="#efeef5" />
        <rect x="252" y="168" width="42" height="3.5" rx="1.5" fill={c.solid} />
        <rect x="252" y="180" width="110" height="3" rx="1.5" fill="#dfdee8" />
        <rect x="252" y="190" width="92" height="3" rx="1.5" fill="#dfdee8" />
        <rect x="252" y="200" width="76" height="3" rx="1.5" fill="#dfdee8" />
      </g>
    </svg>
  );
}

/* ── dispatcher ── */
export type PreviewKey = "finance" | "storybook" | "recipe";

export function ProjectPreview({ kind, accent, className }: { kind: PreviewKey; accent: Accent; className?: string }) {
  if (kind === "finance") return <FinancePreview accent={accent} className={className} />;
  if (kind === "storybook") return <StorybookPreview accent={accent} className={className} />;
  return <RecipePreview accent={accent} className={className} />;
}
