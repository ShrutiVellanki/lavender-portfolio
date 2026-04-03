import { useState, useEffect } from "react";
import {
  Sun, Moon, Mail, ExternalLink, ArrowUp, Code2, Palette,
  BarChart3, Globe, Briefcase, Mic, Menu, X, Coffee, User, Wrench,
  ShieldCheck, CalendarCog, Megaphone,
} from "lucide-react";

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

/* ─── Scroll progress hook ─── */

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? window.scrollY / h : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return p;
}

/* ─── Scroll reveal hook ─── */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".rv, .sg");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("show"); obs.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── Data ─── */

const SECTIONS = [
  { id: "about", label: "About", num: "01", icon: <User className="w-3.5 h-3.5" /> },
  { id: "skills", label: "Skills", num: "02", icon: <Wrench className="w-3.5 h-3.5" /> },
  { id: "experience", label: "Experience", num: "03", icon: <Briefcase className="w-3.5 h-3.5" /> },
  { id: "projects", label: "Projects", num: "04", icon: <Code2 className="w-3.5 h-3.5" /> },
  { id: "talks", label: "Talks", num: "05", icon: <Mic className="w-3.5 h-3.5" /> },
  { id: "contact", label: "Contact", num: "06", icon: <Coffee className="w-3.5 h-3.5" /> },
];

const EXPERIENCE = [
  {
    company: "Gen",
    subtitle: "(NortonLifeLock)",
    accent: "iris" as const,
    icon: <ShieldCheck className="w-4 h-4" />,
    roles: [
      {
        title: "Software Engineer (Frontend) — Windows UI",
        period: "Jun 2025 – Present",
        description: "Currently delivering Windows UI features for Norton and Avast products, helping users stay safe on the Dark Web.",
        bullets: [
          "Independently scoped and delivered a <strong>Dark Web Breach Details UI flow in Svelte (JavaScript)</strong>, enabling users to monitor credentials, view breach details, and take actionable next steps",
          "Implemented <strong>comprehensive metrics tracking</strong> across the Dark Web Monitoring flow to measure clicks and impressions and enable A/B testing",
          "Built <strong>region-specific UI variants in JavaScript to support credential monitoring across 100+ regions</strong>, adapting interfaces, copy, and <strong>input validation</strong> to meet regional user needs",
        ],
      },
      {
        title: "Software Engineer — Digital Trust Services",
        period: "Jun 2022 – Jun 2025",
        description: "",
        bullets: [
          "Led a team of 3 engineers to create a <strong>Storybook Component Library</strong>, improving UX for <strong>100,000+ users</strong> and reducing UI inconsistencies by <strong>30%</strong>",
          "Successfully delivered key UI components for the financial services sector such as <strong>bank sign-ins</strong>, <strong>account selection screens</strong> and <strong>data-heavy transaction history tables</strong>, improving user engagement",
          "Integrated <strong>accessibility testing</strong>, <strong>component testing</strong>, and <strong>visual testing</strong> into the component library, improving <strong>code coverage by 20%</strong>",
          "Partnered with <strong>design and product teams</strong> to refine requirements, ensuring alignment with user and business goals",
        ],
      },
    ],
  },
  {
    company: "Fiix Software",
    accent: "foam" as const,
    icon: <CalendarCog className="w-4 h-4" />,
    roles: [
      {
        title: "Frontend Developer",
        period: "Jun 2021 – Jun 2022",
        description: "",
        bullets: [
          "Led <strong>3-person frontend team</strong> to deliver a calendar feature for Fiix CMMS, improving <strong>user engagement</strong> and increasing <strong>engineering velocity by 10% per sprint</strong>",
        ],
      },
    ],
  },
  {
    company: "Veriday",
    accent: "gold" as const,
    icon: <Megaphone className="w-4 h-4" />,
    roles: [
      {
        title: "Frontend Developer",
        period: "Jan 2021 – Jun 2021",
        description: "",
        bullets: [
          "Implemented and maintained frontend features on the <strong>Digital Agent Marketing Tool</strong>, ensuring <strong>accessibility</strong>, <strong>cross-browser compatibility</strong>, and <strong>responsiveness</strong>",
        ],
      },
    ],
  },
];

const PROJECTS = [
  {
    title: "Lavender Finance",
    description:
      "A personal finance dashboard with net-worth tracking, budgeting, transaction management, and interactive charts. Features i18n, responsive layout, and Lavender Dawn/Moon themes.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Recharts", "i18next"],
    github: "https://github.com/ShrutiVellanki/lavender-finance",
    live: "https://lavender-finance.vercel.app",
    icon: <BarChart3 className="w-5 h-5" />,
    accent: "foam" as const,
  },
  {
    title: "Lavender Storybook",
    description:
      "A themed copy-paste component library documented with Storybook. 20+ accessible, theme-aware React components with full design token system.",
    tags: ["React", "Storybook", "Tailwind CSS", "TypeScript"],
    github: "https://github.com/ShrutiVellanki/lavender-storybook",
    live: "https://lavender-storybook.vercel.app",
    icon: <Palette className="w-5 h-5" />,
    accent: "iris" as const,
  },
  {
    title: "Recipe Extraction Demo",
    description:
      "A Python-based solution for extracting recipe data from PDFs using GPT-5, LangChain, and PyMuPDF.",
    tags: ["Python", "LangChain", "GPT-5", "PyMuPDF"],
    github: "https://github.com/ShrutiVellanki/recipe-extraction-demo",
    icon: <Code2 className="w-5 h-5" />,
    accent: "gold" as const,
  },
];

const TALKS = [
  {
    title: "Addressing The Current State of Cognitive Accessibility",
    event: "Toronto Javascript Meetup",
    date: "April 2024",
    description: "Making UIs legible under real-world cognitive load — bridging dev and design to support actual human attention patterns.",
    link: "https://docs.google.com/presentation/d/1JY9PGEJFxRvTTRGSnXWxPeX7zwe-zKVvcjYojPiqGSU/edit?slide=id.g2cdf78d232d_0_593#slide=id.g2cdf78d232d_0_593",
    accent: "love" as const,
  },
  {
    title: "How to Add Accessibility Checks to Your Workflow",
    event: "Toronto Javascript Meetup",
    date: "Sept 2023",
    description: "Practical strategies for weaving accessibility checks into everyday development without slowing down delivery.",
    link: "https://docs.google.com/presentation/d/1fNus6C7VcLAzvOt0sP0vIMvvTH3_DRhFOT6VBsvqVAo/edit?slide=id.g282c81c7448_1_166#slide=id.g282c81c7448_1_166",
    accent: "rose" as const,
  },
];

const SKILLS = [
  { category: "Development", items: ["React", "Svelte", "TypeScript", "JavaScript", "REST API Integration", "Tailwind CSS", "CI/CD (TeamCity)"], icon: <Code2 className="w-5 h-5" />, accent: "iris" as const },
  { category: "UX & Design", items: ["Storybook", "Storybook Addons for Visual Testing", "Unit Testing", "Accessibility", "Figma"], icon: <Palette className="w-5 h-5" />, accent: "foam" as const },
  { category: "Cross-functional Collaboration", items: ["Teamwork with design, product, and development teams"], icon: <Globe className="w-5 h-5" />, accent: "gold" as const },
  { category: "AI & A11Y", items: ["ARIA", "WCAG", "WAI", "JAWS", "NVDA", "Axe", "AI Tooling (Cursor, Github Copilot)"], icon: <BarChart3 className="w-5 h-5" />, accent: "love" as const },
];

type Accent = "iris" | "foam" | "gold" | "love" | "pine" | "rose";

const A: Record<Accent, { text: string; bg: string; border: string; pill: string; hoverText: string }> = {
  iris:  { text: "text-iris dark:text-iris-light", bg: "bg-iris/8 dark:bg-iris-light/8", border: "border-iris/40 dark:border-iris-light/30", pill: "bg-iris/10 text-iris dark:bg-iris-light/10 dark:text-iris-light", hoverText: "hover:text-iris dark:hover:text-iris-light" },
  foam:  { text: "text-foam dark:text-foam-light", bg: "bg-foam/8 dark:bg-foam-light/8", border: "border-foam/40 dark:border-foam-light/30", pill: "bg-foam/10 text-foam dark:bg-foam-light/10 dark:text-foam-light", hoverText: "hover:text-foam dark:hover:text-foam-light" },
  gold:  { text: "text-gold dark:text-gold-light", bg: "bg-gold/4 dark:bg-gold-light/5", border: "border-gold/25 dark:border-gold-light/20", pill: "bg-gold/10 text-gold dark:bg-gold-light/10 dark:text-gold-light", hoverText: "hover:text-gold dark:hover:text-gold-light" },
  love:  { text: "text-love dark:text-love-light", bg: "bg-love/8 dark:bg-love-light/8", border: "border-love/40 dark:border-love-light/30", pill: "bg-love/10 text-love dark:bg-love-light/10 dark:text-love-light", hoverText: "hover:text-love dark:hover:text-love-light" },
  pine:  { text: "text-pine dark:text-pine-light", bg: "bg-pine/8 dark:bg-pine-light/8", border: "border-pine/40 dark:border-pine-light/30", pill: "bg-pine/10 text-pine dark:bg-pine-light/10 dark:text-pine-light", hoverText: "hover:text-pine dark:hover:text-pine-light" },
  rose:  { text: "text-rose dark:text-rose-light", bg: "bg-rose/8 dark:bg-rose-light/8", border: "border-rose/40 dark:border-rose-light/30", pill: "bg-rose/10 text-rose dark:bg-rose-light/10 dark:text-rose-light", hoverText: "hover:text-rose dark:hover:text-rose-light" },
};

/* ─── App ─── */

export default function App() {
  const { dark, toggle } = useTheme();
  const [showTop, setShowTop] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [active, setActive] = useState("");
  const progress = useScrollProgress();
  useReveal();

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    SECTIONS.forEach(({ id }) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="geo-bg min-h-screen bg-lavender-50 text-lavender-700 dark:bg-lavender-900 dark:text-lavender-300 transition-colors duration-500">

      {/* ── Progress bar ── */}
      <div className="fixed top-0 inset-x-0 z-[60] h-0.5">
        <div className="progress-bar h-full bg-iris/60 dark:bg-iris-light/50" style={{ transform: `scaleX(${progress})` }} />
      </div>

      {/* ── Nav ── */}
      <nav className="fixed top-0.5 inset-x-0 z-50 backdrop-blur-lg bg-lavender-50/70 dark:bg-lavender-900/70 border-b border-lavender-300/30 dark:border-lavender-700/10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="#" className="text-[15px] font-bold tracking-[-0.02em] text-lavender-700 dark:text-lavender-100 hover:text-iris dark:hover:text-iris-light transition-colors">
            Shruti Vellanki
          </a>

          <div className="flex items-center gap-1">
            {/* Desktop nav */}
            <ul className="hidden md:flex items-center">
              {SECTIONS.filter(s => s.id !== "contact").map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium tracking-wide transition-colors ${
                      active === s.id
                        ? "text-iris dark:text-iris-light"
                        : "text-lavender-500 hover:text-lavender-700 dark:hover:text-lavender-200"
                    }`}
                  >
                    {s.icon} {s.label}
                    {active === s.id && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-iris dark:bg-iris-light rounded-full" />
                    )}
                  </a>
                </li>
              ))}
            </ul>

            <a href="#contact" className="hidden md:inline-flex items-center gap-1.5 ml-4 px-4 py-1.5 text-[13px] font-semibold rounded-full bg-lavender-700 dark:bg-lavender-100 text-white dark:text-lavender-900 hover:bg-lavender-800 dark:hover:bg-white transition-colors">
              <Coffee className="w-3.5 h-3.5" /> Get in Touch
            </a>

            <button onClick={toggle} className="p-2 ml-2 rounded-lg text-lavender-400 hover:text-lavender-700 dark:hover:text-lavender-100 transition-colors" aria-label="Toggle theme">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button onClick={() => setMobileNav(!mobileNav)} className="md:hidden p-2 rounded-lg text-lavender-500 hover:text-lavender-700 dark:hover:text-lavender-200 transition-colors" aria-label="Toggle menu">
              {mobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileNav && (
          <div className="md:hidden border-t border-lavender-300/30 dark:border-lavender-700/10 bg-lavender-50/95 dark:bg-lavender-900/95 backdrop-blur-lg">
            <div className="px-6 py-5 space-y-4">
              {SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`} onClick={() => setMobileNav(false)} className={`flex items-center gap-2 text-sm font-medium transition-colors ${active === s.id ? "text-iris dark:text-iris-light" : "text-lavender-500 hover:text-lavender-700 dark:hover:text-lavender-200"}`}>
                  <span className="sec-num text-lavender-400 dark:text-lavender-600">{s.num}</span>{s.icon} {s.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main>
        {/* ══════════════ HERO ══════════════ */}
        <section className="pt-32 pb-20 sm:pt-44 sm:pb-28 px-6">
          <div className="max-w-6xl mx-auto hero-in">
            <p className="sec-num text-lavender-400 dark:text-lavender-600 mb-6">Software Engineer</p>
            <h1 className="text-[clamp(2.8rem,8vw,6rem)] font-extrabold tracking-[-0.04em] leading-[0.95] text-lavender-700 dark:text-lavender-100">
              Shruti<br />Vellanki
            </h1>
            <p className="mt-8 max-w-lg text-lg text-lavender-500 dark:text-lavender-500 leading-relaxed font-light">
              Building systems under pressure — frontend applications and design systems serving 50M+ users.
            </p>
            <div className="mt-10 flex items-center gap-5">
              {[
                { href: "https://github.com/ShrutiVellanki", icon: <GithubIcon className="w-5 h-5" />, label: "GitHub" },
                { href: "https://www.linkedin.com/in/shruti-vellanki/", icon: <LinkedinIcon className="w-5 h-5" />, label: "LinkedIn" },
                { href: "mailto:shvellanki@gmail.com", icon: <Mail className="w-5 h-5" />, label: "Email" },
              ].map((s) => (
                <a key={s.label} href={s.href} target={s.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer" aria-label={s.label} className="p-3 rounded-full border border-lavender-300/50 dark:border-lavender-700/20 text-lavender-500 hover:text-iris dark:hover:text-iris-light hover:border-iris/30 dark:hover:border-iris-light/20 hover:bg-iris/5 dark:hover:bg-iris-light/5 transition-all duration-300">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ ABOUT ══════════════ */}
        <Section id="about" num="01" title="About" icon={<User className="w-8 h-8" />} alt>
          <div className="max-w-2xl text-base leading-[1.85] text-lavender-600 dark:text-lavender-400">
            <p>
              Software Engineer with <strong className="font-semibold text-lavender-700 dark:text-lavender-200">5+ years</strong> building <strong className="font-semibold text-lavender-700 dark:text-lavender-200">frontend applications</strong> and <strong className="font-semibold text-lavender-700 dark:text-lavender-200">design systems</strong> to serve over <strong className="font-semibold text-lavender-700 dark:text-lavender-200">50M+ users</strong>. Experienced in <strong className="font-semibold text-lavender-700 dark:text-lavender-200">React</strong>, <strong className="font-semibold text-lavender-700 dark:text-lavender-200">TypeScript</strong>, <strong className="font-semibold text-lavender-700 dark:text-lavender-200">JavaScript</strong>, and <strong className="font-semibold text-lavender-700 dark:text-lavender-200">Svelte</strong>, collaborating across product, design and engineering to deliver <strong className="font-semibold text-lavender-700 dark:text-lavender-200">scalable solutions</strong> that serve both <strong className="font-semibold text-lavender-700 dark:text-lavender-200">user needs</strong> and <strong className="font-semibold text-lavender-700 dark:text-lavender-200">business goals</strong>.
            </p>
          </div>
        </Section>

        {/* ══════════════ SKILLS ══════════════ */}
        <Section id="skills" num="02" title="Skills" icon={<Wrench className="w-8 h-8" />}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sg">
            {SKILLS.map((s) => {
              const ac = A[s.accent];
              return (
                <div key={s.category} className="card rounded-2xl p-5 bg-white dark:bg-lavender-950/60 border border-lavender-200 dark:border-lavender-700/15 hover:shadow-lg hover:shadow-lavender-300/15 dark:hover:shadow-black/20">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`${ac.text} p-2 rounded-lg ${ac.bg}`}>{s.icon}</span>
                    <h3 className="text-sm font-bold tracking-wide text-lavender-700 dark:text-lavender-100">{s.category}</h3>
                  </div>
                  <ul className="space-y-2">
                    {s.items.map((item) => (
                      <li key={item} className="text-[13px] text-lavender-600 dark:text-lavender-400 leading-snug pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1 before:h-1 before:rounded-full before:bg-lavender-400 dark:before:bg-lavender-600">{item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ══════════════ EXPERIENCE ══════════════ */}
        <Section id="experience" num="03" title="Experience" icon={<Briefcase className="w-8 h-8" />} alt>
          <div className="space-y-14">
            {EXPERIENCE.map((exp) => {
              const ac = A[exp.accent];
              return (
                <div key={exp.company} className="rv">
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`${ac.text} p-2 rounded-lg ${ac.bg}`}>{exp.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-lavender-700 dark:text-lavender-100 leading-tight">
                        {exp.company}
                        {exp.subtitle && <span className="font-normal text-lavender-500 dark:text-lavender-500 ml-2 text-base">{exp.subtitle}</span>}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-8 ml-[18px] pl-8 border-l border-lavender-300/50 dark:border-lavender-700/20">
                    {exp.roles.map((role) => (
                      <div key={role.title} className="relative">
                        <span className={`absolute -left-[calc(2rem+5px)] top-1.5 w-2.5 h-2.5 rounded-full ${ac.bg} border-2 ${ac.border}`} />
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <h4 className="text-[15px] font-semibold text-lavender-700 dark:text-lavender-200">{role.title}</h4>
                          <span className="text-xs font-medium tracking-wide text-lavender-400 dark:text-lavender-600 uppercase">{role.period}</span>
                        </div>
                        {role.description && (
                          <p className="text-sm text-lavender-600 dark:text-lavender-400 mt-2 leading-relaxed">{role.description}</p>
                        )}
                        <ul className="mt-3 space-y-2">
                          {role.bullets.map((b, i) => (
                            <li key={i} className="text-sm text-lavender-600 dark:text-lavender-400 leading-[1.7] pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[10px] before:w-1.5 before:h-[1px] before:bg-lavender-400 dark:before:bg-lavender-600 [&_strong]:font-semibold [&_strong]:text-lavender-700 dark:[&_strong]:text-lavender-200" dangerouslySetInnerHTML={{ __html: b }} />
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ══════════════ PROJECTS ══════════════ */}
        <Section id="projects" num="04" title="Projects" icon={<Code2 className="w-8 h-8" />}>
          <div className="grid md:grid-cols-3 gap-5 sg">
            {PROJECTS.map((p) => {
              const ac = A[p.accent];
              return (
                <div key={p.title} className="card group flex flex-col rounded-2xl bg-white dark:bg-lavender-950/60 border border-lavender-200 dark:border-lavender-700/15 p-6 hover:shadow-lg hover:shadow-lavender-300/15 dark:hover:shadow-black/20">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`${ac.text} p-2 rounded-lg ${ac.bg}`}>{p.icon}</span>
                    <h3 className="text-base font-bold text-lavender-700 dark:text-lavender-100">{p.title}</h3>
                  </div>
                  <p className="text-sm text-lavender-600 dark:text-lavender-400 leading-relaxed mb-4">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {p.tags.map((t) => (
                      <span key={t} className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${ac.pill}`}>{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-5 text-sm mt-auto pt-4 border-t border-lavender-200/60 dark:border-lavender-700/15">
                    <a href={p.github} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 font-medium text-lavender-500 ${ac.hoverText} transition-colors`}>
                      <GithubIcon className="w-4 h-4" /> Code
                    </a>
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 font-medium text-lavender-500 ${ac.hoverText} transition-colors`}>
                        <ExternalLink className="w-4 h-4" /> Live
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ══════════════ TALKS ══════════════ */}
        <Section id="talks" num="05" title="Talks" icon={<Mic className="w-8 h-8" />} alt>
          <div className="grid sm:grid-cols-2 gap-5 sg">
            {TALKS.map((talk) => {
              const ac = A[talk.accent];
              return (
                <div key={talk.title} className="card flex flex-col rounded-2xl p-6 bg-white dark:bg-lavender-950/60 border border-lavender-200 dark:border-lavender-700/15 hover:shadow-lg hover:shadow-lavender-300/15 dark:hover:shadow-black/20">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`${ac.text} p-2 rounded-lg ${ac.bg}`}><Mic className="w-5 h-5" /></span>
                    <h3 className="text-base font-bold text-lavender-700 dark:text-lavender-100 leading-snug">{talk.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold tracking-wide uppercase ${ac.text}`}>{talk.event}</span>
                    {talk.date && <span className="text-xs text-lavender-400 dark:text-lavender-600 font-medium">· {talk.date}</span>}
                  </div>
                  <p className="text-sm text-lavender-600 dark:text-lavender-400 leading-relaxed mb-4">{talk.description}</p>
                  {talk.link && (
                    <div className="flex items-center gap-5 text-sm mt-auto pt-4 border-t border-lavender-200/60 dark:border-lavender-700/15">
                      <a href={talk.link} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 font-medium text-lavender-500 ${ac.hoverText} transition-colors`}>
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
        <Section id="contact" num="06" title="Get in Touch" icon={<Coffee className="w-8 h-8" />} center>
          <div className="max-w-md mx-auto text-center">
            <p className="text-base text-lavender-600 dark:text-lavender-400 leading-relaxed">
              Always open to interesting conversations and opportunities — or just grabbing a coffee somewhere in Toronto. Feel free to reach out.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              {[
                { href: "https://github.com/ShrutiVellanki", icon: <GithubIcon className="w-5 h-5" />, label: "GitHub" },
                { href: "https://www.linkedin.com/in/shruti-vellanki/", icon: <LinkedinIcon className="w-5 h-5" />, label: "LinkedIn" },
                { href: "mailto:shvellanki@gmail.com", icon: <Mail className="w-5 h-5" />, label: "Email" },
              ].map((s) => (
                <a key={s.label} href={s.href} target={s.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer" aria-label={s.label} className="p-3 rounded-full border border-lavender-300/50 dark:border-lavender-700/20 text-lavender-500 hover:text-iris dark:hover:text-iris-light hover:border-iris/30 dark:hover:border-iris-light/20 hover:bg-iris/5 dark:hover:bg-iris-light/5 transition-all duration-300">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </Section>
      </main>

      {/* ── Footer ── */}
      <footer className="py-10 px-6 border-t border-lavender-200/60 dark:border-lavender-700/10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-lavender-400 dark:text-lavender-600">
          <span>&copy; {new Date().getFullYear()} Shruti Vellanki</span>
          <span>
            Built with{" "}
            <a href="https://github.com/ShrutiVellanki/lavender-storybook" target="_blank" rel="noopener noreferrer" className="text-iris dark:text-iris-light hover:underline font-medium">
              lavender-storybook
            </a>
          </span>
        </div>
      </footer>

      {/* ── Back to top ── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-40 p-3 rounded-full bg-lavender-700 dark:bg-lavender-100 text-white dark:text-lavender-900 shadow-lg shadow-lavender-700/20 dark:shadow-black/30 transition-all duration-500 ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ─── Section wrapper ─── */

function Section({ id, num, title, icon, alt, center, children }: {
  id: string; num: string; title: string; icon?: React.ReactNode; alt?: boolean; center?: boolean; children: React.ReactNode;
}) {
  return (
    <section id={id} className={`py-20 sm:py-28 px-6 ${alt ? "bg-lavender-100/50 dark:bg-lavender-950/40" : ""}`}>
      <div className="max-w-6xl mx-auto rv">
        <div className={`mb-12 ${center ? "text-center" : ""}`}>
          <span className="sec-num text-lavender-400 dark:text-lavender-600 block mb-2">{num}</span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-lavender-700 dark:text-lavender-100 ${icon ? "inline-flex items-center gap-3" : ""}`}>
            {icon && <span className="text-iris dark:text-iris-light">{icon}</span>}
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}
