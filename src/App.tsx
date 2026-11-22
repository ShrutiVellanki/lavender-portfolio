import { useState, useEffect } from "react";
import {
  ArrowUpRight, Menu, X, MapPin, Mail,
  Compass, UsersRound, Blocks, Workflow, LayoutDashboard, Component, Mic,
} from "lucide-react";
import { ProjectPreview, type PreviewKey } from "./components/ProjectPreview";

/* ─── Brand glyphs ─── */

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/* ─── Theme toggle icon: a lightbulb ───
   Light theme = bulb on (glass lit bright yellow). Dark theme = bulb off (gray glass). */

function Bulb({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`bulb w-[22px] h-[22px] ${on ? "is-on" : "is-off"}`} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path className="bulb-glass" d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5Z" />
      <path d="M9 18h6M10 22h4" />
    </svg>
  );
}

/* ─── Utils ─── */

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ─── Theme (black on white ⇄ white on black) ─── */

function readSavedTheme() {
  if (typeof window === "undefined") return false;
  try {
    const saved = localStorage.getItem("portfolio-theme");
    if (saved) return saved === "dark";
  } catch { /* storage unavailable */ }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function useTheme() {
  const [dark, setDark] = useState(readSavedTheme);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("portfolio-theme", dark ? "dark" : "light"); } catch { /* ignore */ }
  }, [dark]);

  const toggle = () => setDark((d) => !d);

  return { dark, toggle };
}

/* ─── Data ─── */

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "talks", label: "Talks" },
  { id: "contact", label: "Contact" },
];

const EMAIL = "shvellanki@gmail.com";

const SOCIALS = [
  { href: "https://github.com/ShrutiVellanki", label: "GitHub", Icon: GithubIcon },
  { href: "https://www.linkedin.com/in/shruti-vellanki/", label: "LinkedIn", Icon: LinkedinIcon },
  { href: "https://x.com/ShrutiVellanki", label: "X", Icon: XLogo },
];

const ABOUT = [
  { Icon: Compass, text: "I scope features with product and design, then build them end to end." },
  { Icon: UsersRound, text: "I run discovery and feedback sessions with real users, measure what works, and iterate." },
  { Icon: Blocks, text: "I build shared pieces, like design systems, that other teams reuse." },
];

type Role = { title: string; company: string; period: string; description: string; tags: string[] };

/* Company label + total years; roles are matched by `company`. */
const COMPANIES: { name: string; period: string }[] = [
  { name: "Ascend · Remote", period: "2026–now" },
  { name: "Gen", period: "2022–2026" },
  { name: "Fiix by Rockwell Automation", period: "2021–2022" },
  { name: "Veriday Inc", period: "2021" },
];

const WORK: Role[] = [
  {
    title: "Product Engineer, AI Team",
    company: "Ascend · Remote",
    period: "2026–now",
    description: "Own an AI-native tax planning workflow in production, from discovery and UX to AI systems design: tool calls, system prompts, model selection, context management and output refinement. Run discovery directly with partner accounting firms and product leadership, prototyping to validate ideas before they're built.",
    tags: ["Evals", "AI systems design", "Prompting", "Tool calling", "Product discovery"],
  },
  {
    title: "Software Engineer, Windows UI",
    company: "Gen",
    period: "2025–2026",
    description: "Owned Dark Web Monitoring for Norton 360 and Avast and shipped organic-upsell growth work with a global team. 50M+ users.",
    tags: ["Svelte", "TypeScript", "Claude", "Cursor", "AI-assisted development"],
  },
  {
    title: "Software Engineer, Digital Trust Services",
    company: "Gen",
    period: "2022–2025",
    description: "Built product features and internal tools for Interac Verified, an identity verification product later acquired by Interac. Led its design system.",
    tags: ["React", "TypeScript", "Design systems", "Figma"],
  },
  {
    title: "Software Developer",
    company: "Fiix by Rockwell Automation",
    period: "2021–2022",
    description: "Led engineering on the Calendar feature of Fiix's maintenance software, and represented the team in design reviews.",
    tags: ["Design systems", "Figma", "REST APIs"],
  },
  {
    title: "Frontend Engineer",
    company: "Veriday Inc",
    period: "2021",
    description: "Built features for Veriday's Digital Agent and ran its accessibility audits.",
    tags: ["WCAG", "ARIA", "Axe", "JAWS", "NVDA"],
  },
];

type Project = {
  id: string; title: string; kind: string; KindIcon: typeof Workflow;
  description: string; tags: string[]; github: string; live?: string; preview: PreviewKey;
};

const PROJECTS: Project[] = [
  {
    id: "recipe",
    title: "Recipe Extraction",
    kind: "LLM pipeline",
    KindIcon: Workflow,
    description: "Turns unstructured recipe PDFs into clean, structured data.",
    tags: ["Python", "LangChain", "PyMuPDF"],
    github: "https://github.com/ShrutiVellanki/recipe-extraction-demo",
    preview: "recipe",
  },
  {
    id: "finance",
    title: "Lavender Finance",
    kind: "Product",
    KindIcon: LayoutDashboard,
    description: "A personal finance dashboard with net-worth tracking, budgeting, transactions, and interactive charts. Internationalized, responsive, and themeable.",
    tags: ["React", "TypeScript", "Tailwind", "Recharts", "i18next"],
    github: "https://github.com/ShrutiVellanki/lavender-finance",
    live: "https://lavender-finance.vercel.app",
    preview: "finance",
  },
  {
    id: "storybook",
    title: "Lavender Storybook",
    kind: "Design system",
    KindIcon: Component,
    description: "A copy-paste library of 20+ accessible, theme-aware React components on a full design-token system, documented in Storybook.",
    tags: ["React", "Storybook", "Tailwind", "TypeScript"],
    github: "https://github.com/ShrutiVellanki/lavender-storybook",
    live: "https://lavender-storybook.vercel.app",
    preview: "storybook",
  },
];

const TALKS = [
  {
    title: "The Current State of Cognitive Accessibility",
    event: "Toronto JavaScript Meetup",
    date: "Apr 2024",
    link: "https://docs.google.com/presentation/d/1JY9PGEJFxRvTTRGSnXWxPeX7zwe-zKVvcjYojPiqGSU/edit?slide=id.g2cdf78d232d_0_593#slide=id.g2cdf78d232d_0_593",
  },
  {
    title: "How to Add Accessibility Checks to Your Workflow",
    event: "Toronto JavaScript Meetup",
    date: "Sep 2023",
    link: "https://docs.google.com/presentation/d/1fNus6C7VcLAzvOt0sP0vIMvvTH3_DRhFOT6VBsvqVAo/edit?slide=id.g282c81c7448_1_166#slide=id.g282c81c7448_1_166",
  },
];

/* ─── Shared bits ─── */

const linkU = "underline decoration-[1.5px] underline-offset-[6px] decoration-ink/35 hover:decoration-ink transition-[text-decoration-color] duration-200";

function ExtLink({ href, children, className = "", arrow = true }: { href: string; children: React.ReactNode; className?: string; arrow?: boolean }) {
  const external = !href.startsWith("mailto");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`group/link inline-flex items-center gap-1.5 min-h-11 ${className}`}
    >
      {children}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
      {arrow && <ArrowUpRight aria-hidden="true" className="w-[1em] h-[1em] transition-transform duration-300 ease-out group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />}
    </a>
  );
}

/* `wide`: heading on top and content across the full width (used by Projects).
   `band`: sits on the pale-yellow closing band shared with the footer (Contact). */
function Section({ id, title, wide, band, children }: { id: string; title: string; wide?: boolean; band?: boolean; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={`scroll-mt-16 px-5 sm:px-10 ${band ? "bg-band" : ""}`}>
      <div className={`max-w-6xl mx-auto grid lg:grid-cols-12 gap-x-10 gap-y-10 ${band ? "pt-16 sm:pt-20 pb-16 sm:pb-20" : "border-t-2 border-ink pt-8 pb-20 sm:pb-28"}`}>
        <h2 id={`${id}-h`} className={`${wide ? "lg:col-span-12" : "lg:col-span-4 lg:sticky lg:top-24"} self-start text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[0.95] tracking-[-0.03em]`}>
          {title}
        </h2>
        <div className={wide ? "lg:col-span-12" : "lg:col-span-8"}>{children}</div>
      </div>
    </section>
  );
}

/* ─── App ─── */

export default function App() {
  const { dark, toggle } = useTheme();
  const [mobileNav, setMobileNav] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    ["top", ...SECTIONS.map((s) => s.id)].forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  // Esc closes the mobile menu
  useEffect(() => {
    if (!mobileNav) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileNav(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileNav]);


  return (
    <div className="min-h-screen bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-3 focus:font-semibold focus:bg-accent focus:text-on-accent"
      >
        Skip to content
      </a>


      {/* ── Nav ── */}
      <nav aria-label="Primary" className="fixed top-0 inset-x-0 z-50 bg-paper border-b-2 border-ink">
        <div className="px-5 sm:px-10">
          <div className="max-w-6xl mx-auto h-16 flex items-center justify-between">
            <a href="#" className="inline-flex items-center min-h-11 font-extrabold tracking-[-0.02em]">
              Shruti Vellanki
            </a>
            <div className="flex items-center">
              <ul className="hidden md:flex items-center gap-1">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      aria-current={active === s.id ? "true" : undefined}
                      className={`inline-flex items-center h-9 px-3 rounded-full text-[15px] font-semibold ${
                        active === s.id ? "bg-accent-soft text-[#0a0a0a]" : "text-ink hover:bg-ink/5"
                      }`}
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
              <button
                onClick={toggle}
                aria-label={dark ? "Turn the lights on (light theme)" : "Turn the lights off (dark theme)"}
                aria-pressed={!dark}
                className="toon ml-3"
              >
                <Bulb on={!dark} />
              </button>
              <button
                onClick={() => setMobileNav(!mobileNav)}
                className="toon md:hidden ml-3"
                aria-label={mobileNav ? "Close menu" : "Open menu"}
                aria-expanded={mobileNav}
                aria-controls="mobile-nav"
              >
                {mobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        {mobileNav && (
          <div id="mobile-nav" className="md:hidden border-t-2 border-ink bg-paper px-5 py-2">
            <ul>
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => setMobileNav(false)}
                    aria-current={active === s.id ? "true" : undefined}
                    className={`flex items-center w-fit -ml-3 px-3 min-h-12 rounded-full text-xl font-bold tracking-[-0.01em] ${active === s.id ? "bg-accent-soft text-[#0a0a0a]" : ""}`}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      <main id="main">
        {/* ══════════════ HERO ══════════════ */}
        <header id="top" className="px-5 sm:px-10 pt-32 pb-20 sm:pt-40 sm:pb-28">
          <div className="max-w-6xl mx-auto w-full">
            <div className="hero-in">
              <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-lg font-medium">
                <span className="inline-flex items-center gap-1.5 text-muted">
                  <MapPin aria-hidden="true" className="w-[1.15em] h-[1.15em] fill-accent-soft text-[#0a0a0a] dark:fill-transparent dark:text-accent-soft" strokeWidth={1.75} /> Toronto
                </span>
              </p>
              <h1 className="mt-4 text-[clamp(3rem,8vw,5.33rem)] font-extrabold leading-[0.92] tracking-[-0.035em]">
                Shruti Vellanki
              </h1>
              <p className="mt-8 max-w-[22ch] text-[clamp(1.6rem,3.2vw,2.5rem)] leading-[1.35] tracking-[-0.015em] font-normal">
                Product engineer. Currently building an AI platform for accounting firms.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4 text-[17px] font-semibold">
                <a href={`mailto:${EMAIL}`} aria-label={`Email ${EMAIL}`} className="group inline-flex items-center min-h-11">
                  <span className="toon">
                    <Mail aria-hidden="true" className="w-5 h-5" />
                  </span>
                </a>
                {SOCIALS.map(({ href, label, Icon }) => (
                  <ExtLink key={label} href={href} arrow={false} className="hover:text-ink">
                    <span className="toon">
                      <Icon className="w-[18px] h-[18px]" />
                    </span>
                    <span className="sr-only">{label}</span>
                  </ExtLink>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* ══════════════ ABOUT ══════════════ */}
        <Section id="about" title="What I do">
          <ul className="max-w-[44ch] space-y-6 text-[clamp(1.15rem,1.8vw,1.35rem)] leading-[1.5] tracking-[-0.01em]">
            {ABOUT.map(({ Icon, text }) => (
              <li key={text} className="group grid grid-cols-[3rem_1fr] gap-4 items-start">
                <span aria-hidden="true" className="toon toon-lg">
                  <Icon className="w-6 h-6" strokeWidth={2} />
                </span>
                <span className="pt-1.5">{text}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* ══════════════ WORK ══════════════ */}
        <Section id="work" title="Work">
          <ol>
            {COMPANIES.map((c, ci) => {
              const roles = WORK.filter((r) => r.company === c.name);
              const multi = roles.length > 1;
              return (
                <li key={c.name} className={`grid sm:grid-cols-[7rem_1fr] gap-x-8 gap-y-1 py-8 ${ci ? "border-t border-ink" : "pt-0 sm:pt-2"}`}>
                  <span className="text-[16px] font-medium text-muted tabular-nums sm:pt-1">
                    {ci === 0 ? <span className="inline-block px-2 rounded-full bg-accent-soft text-on-accent font-bold">{c.period}</span> : c.period}
                  </span>
                  {multi ? (
                    /* Several roles at one company: a short timeline under the company name */
                    <div>
                      <h3 className="text-[1.375rem] font-bold leading-snug tracking-[-0.015em]">{c.name}</h3>
                      <ol className="relative mt-4 pl-7 space-y-6">
                        <span aria-hidden="true" className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-ink" />
                        {roles.map((r) => (
                          <li key={r.title} className="relative">
                            <span aria-hidden="true" className="absolute -left-7 top-[0.45rem] w-3 h-3 rounded-full bg-accent-soft border-2 border-ink" />
                            <h4 className="text-[1.15rem] font-bold leading-snug">{r.title}</h4>
                            <p className="text-[15px] text-muted tabular-nums">{r.period}</p>
                            <p className="mt-2 text-[17px] leading-relaxed max-w-[62ch]">{r.description}</p>
                            <p className="mt-2 text-[15px] text-muted">{r.tags.join(", ")}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-[1.375rem] font-bold leading-snug tracking-[-0.015em]">{roles[0].title}</h3>
                      <p className="text-[16px] text-muted">{c.name}</p>
                      <p className="mt-3 text-[17px] leading-relaxed max-w-[62ch]">{roles[0].description}</p>
                      <p className="mt-3 text-[15px] text-muted">{roles[0].tags.join(", ")}</p>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </Section>

        {/* ══════════════ PROJECTS ══════════════ */}
        <Section id="projects" title="Projects" wide>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {PROJECTS.map((p) => (
              <li key={p.id} id={`project-${p.id}`} className="scroll-mt-24 flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden border-2 border-ink">
                  <ProjectPreview kind={p.preview} accent="iris" className="mono-img absolute inset-0 w-full h-full" />
                </div>
                <p className="mt-5 inline-flex items-center gap-2 text-[15px] font-medium text-muted">
                  <p.KindIcon aria-hidden="true" className="w-4 h-4" /> {p.kind}
                </p>
                <h3 className="mt-1 text-[1.45rem] font-bold leading-[1.2] tracking-[-0.02em]">
                  <a href={p.github} target="_blank" rel="noopener noreferrer" className="group/title inline-flex items-baseline gap-2 decoration-2 underline-offset-[6px] hover:underline">
                    {p.title}
                    <ArrowUpRight aria-hidden="true" className="w-[0.6em] h-[0.6em] self-center transition-transform duration-300 ease-out group-hover/title:-translate-y-0.5 group-hover/title:translate-x-0.5" />
                    <span className="sr-only"> (code on GitHub, opens in a new tab)</span>
                  </a>
                </h3>
                <p className="mt-2 text-[16px] leading-relaxed">{p.description}</p>
                <p className="mt-2 text-[14px] text-muted">{p.tags.join(", ")}</p>
                {p.live && (
                  <div className="mt-auto pt-3">
                    <ExtLink href={p.live} className={`font-semibold ${linkU}`}>Live site</ExtLink>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Section>

        {/* ══════════════ TALKS ══════════════ */}
        <Section id="talks" title="Talks">
          <ul>
            {TALKS.map((t, i) => (
              <li key={t.title} className={i ? "border-t border-ink" : ""}>
                <a
                  href={t.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid sm:grid-cols-[1fr_auto] items-end gap-x-8 gap-y-3 py-7"
                >
                  <span>
                    <span className="block text-[clamp(1.4rem,2.6vw,1.9rem)] font-bold leading-[1.3] tracking-[-0.02em] decoration-2 underline-offset-[6px] group-hover:underline">{t.title}</span>
                    <span className="mt-3 inline-flex items-center gap-2 text-[16px] opacity-80">
                      <Mic aria-hidden="true" className="w-4 h-4" /> {t.event}, {t.date}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold">
                    Slides <ArrowUpRight aria-hidden="true" className="w-4 h-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Section>

        {/* ══════════════ CONTACT ══════════════ */}
        <Section id="contact" title="Let’s talk!" band wide>
          <p className="max-w-[44ch] text-[clamp(1.15rem,1.8vw,1.35rem)] leading-[1.5]">
            Happy to chat with AI builders, product people, or anyone who knows a good coffee shop.
          </p>
          <a href={`mailto:${EMAIL}`} className="group mt-8 inline-flex items-center gap-4 min-h-11 [overflow-wrap:anywhere]">
            <span className="toon shrink-0 bg-white dark:bg-accent-soft"><Mail aria-hidden="true" className="w-5 h-5" /></span>
            <span className="text-[clamp(1.25rem,2.2vw,1.6rem)] font-bold tracking-[-0.015em] underline decoration-2 underline-offset-[6px] decoration-ink/30 group-hover:decoration-ink transition-[text-decoration-color] duration-200">{EMAIL}</span>
          </a>
        </Section>
      </main>

      <footer className="px-5 sm:px-10 bg-band">
        <div className="max-w-6xl mx-auto border-t border-ink/25 py-8 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end text-[15px]">
          <div className="space-y-2">
            <p className="text-muted">© {new Date().getFullYear()} Shruti Vellanki</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6">
            {SOCIALS.map(({ href, label }) => (
              <ExtLink key={label} href={href} className="font-semibold hover:underline underline-offset-4 decoration-2">
                {label}
              </ExtLink>
            ))}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })}
              className="inline-flex items-center min-h-11 font-semibold hover:underline underline-offset-4 decoration-2"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
