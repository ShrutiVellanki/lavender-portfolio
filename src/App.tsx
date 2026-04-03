import { useState, useEffect } from "react";
import {
  Sun, Moon, Mail, ExternalLink, ArrowUp, Code2, Palette,
  BarChart3, Globe, Briefcase, Mic, Menu, X, User, Wrench, Coffee,
  ShieldCheck, CalendarCog, Megaphone,
} from "lucide-react";

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

const NAV_LINKS = [
  { href: "#about", label: "About", icon: <User className="w-3.5 h-3.5" />, active: "text-iris dark:text-iris-light" },
  { href: "#skills", label: "Skills", icon: <Wrench className="w-3.5 h-3.5" />, active: "text-foam dark:text-foam-light" },
  { href: "#experience", label: "Experience", icon: <Briefcase className="w-3.5 h-3.5" />, active: "text-gold dark:text-gold-light" },
  { href: "#projects", label: "Projects", icon: <Code2 className="w-3.5 h-3.5" />, active: "text-pine dark:text-pine-light" },
  { href: "#talks", label: "Talks", icon: <Mic className="w-3.5 h-3.5" />, active: "text-love dark:text-love-light" },
];

const EXPERIENCE = [
  {
    company: "Gen",
    subtitle: "(NortonLifeLock)",
    accent: "iris",
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
    accent: "foam",
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
    accent: "gold",
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
    accent: "foam",
  },
  {
    title: "Lavender Storybook",
    description:
      "A themed copy-paste component library documented with Storybook. 20+ accessible, theme-aware React components with full design token system.",
    tags: ["React", "Storybook", "Tailwind CSS", "TypeScript"],
    github: "https://github.com/ShrutiVellanki/lavender-storybook",
    live: "https://lavender-storybook.vercel.app",
    icon: <Palette className="w-5 h-5" />,
    accent: "iris",
  },
  {
    title: "Recipe Extraction Demo",
    description:
      "A Python-based solution for extracting recipe data from PDFs using GPT-5, LangChain, and PyMuPDF.",
    tags: ["Python", "LangChain", "GPT-5", "PyMuPDF"],
    github: "https://github.com/ShrutiVellanki/recipe-extraction-demo",
    icon: <Code2 className="w-5 h-5" />,
    accent: "gold",
  },
];

const TALKS = [
  {
    title: "Addressing The Current State of Cognitive Accessibility",
    event: "Toronto Javascript Meetup",
    date: "April 2024",
    description: "Making UIs legible under real-world cognitive load — bridging dev and design to support actual human attention patterns.",
    link: "https://docs.google.com/presentation/d/1JY9PGEJFxRvTTRGSnXWxPeX7zwe-zKVvcjYojPiqGSU/edit?slide=id.g2cdf78d232d_0_593#slide=id.g2cdf78d232d_0_593",
    accent: "love",
  },
  {
    title: "How to Add Accessibility Checks to Your Workflow",
    event: "Toronto Javascript Meetup",
    date: "Sept 2023",
    description: "Practical strategies for weaving accessibility checks into everyday development without slowing down delivery.",
    link: "https://docs.google.com/presentation/d/1fNus6C7VcLAzvOt0sP0vIMvvTH3_DRhFOT6VBsvqVAo/edit?slide=id.g282c81c7448_1_166#slide=id.g282c81c7448_1_166",
    accent: "rose",
  },
];

const SKILLS = [
  { category: "Development", items: ["React", "Svelte", "TypeScript", "JavaScript", "REST API Integration", "Tailwind CSS", "CI/CD (TeamCity)"], icon: <Code2 className="w-5 h-5" />, accent: "iris" },
  { category: "UX & Design", items: ["Storybook", "Storybook Addons for Visual Testing", "Unit Testing", "Accessibility", "Figma"], icon: <Palette className="w-5 h-5" />, accent: "foam" },
  { category: "Cross-functional Collaboration", items: ["Teamwork with design, product, and development teams"], icon: <Globe className="w-5 h-5" />, accent: "gold" },
  { category: "AI & A11Y", items: ["ARIA", "WCAG", "WAI", "JAWS", "NVDA", "Axe", "AI Tooling (Cursor, Github Copilot)"], icon: <BarChart3 className="w-5 h-5" />, accent: "love" },
];

const ACCENT_STYLES: Record<string, { borderTop: string; borderLeft: string; text: string; bullet: string; hoverText: string; dot: string; line: string }> = {
  iris:  { borderTop: "border-t-iris/60 dark:border-t-iris-light/40", borderLeft: "border-l-iris/60 dark:border-l-iris-light/40", text: "text-iris dark:text-iris-light", bullet: "before:bg-iris dark:before:bg-iris-light", hoverText: "hover:text-iris dark:hover:text-iris-light", dot: "border-iris dark:border-iris-light", line: "border-l-iris/30 dark:border-l-iris-light/20" },
  foam:  { borderTop: "border-t-foam/60 dark:border-t-foam-light/40", borderLeft: "border-l-foam/60 dark:border-l-foam-light/40", text: "text-foam dark:text-foam-light", bullet: "before:bg-foam dark:before:bg-foam-light", hoverText: "hover:text-foam dark:hover:text-foam-light", dot: "border-foam dark:border-foam-light", line: "border-l-foam/30 dark:border-l-foam-light/20" },
  gold:  { borderTop: "border-t-gold/60 dark:border-t-gold-light/40", borderLeft: "border-l-gold/60 dark:border-l-gold-light/40", text: "text-gold dark:text-gold-light", bullet: "before:bg-gold dark:before:bg-gold-light", hoverText: "hover:text-gold dark:hover:text-gold-light", dot: "border-gold dark:border-gold-light", line: "border-l-gold/30 dark:border-l-gold-light/20" },
  love:  { borderTop: "border-t-love/60 dark:border-t-love-light/40", borderLeft: "border-l-love/60 dark:border-l-love-light/40", text: "text-love dark:text-love-light", bullet: "before:bg-love dark:before:bg-love-light", hoverText: "hover:text-love dark:hover:text-love-light", dot: "border-love dark:border-love-light", line: "border-l-love/30 dark:border-l-love-light/20" },
  pine:  { borderTop: "border-t-pine/60 dark:border-t-pine-light/40", borderLeft: "border-l-pine/60 dark:border-l-pine-light/40", text: "text-pine dark:text-pine-light", bullet: "before:bg-pine dark:before:bg-pine-light", hoverText: "hover:text-pine dark:hover:text-pine-light", dot: "border-pine dark:border-pine-light", line: "border-l-pine/30 dark:border-l-pine-light/20" },
  rose:  { borderTop: "border-t-rose/60 dark:border-t-rose-light/40", borderLeft: "border-l-rose/60 dark:border-l-rose-light/40", text: "text-rose dark:text-rose-light", bullet: "before:bg-rose dark:before:bg-rose-light", hoverText: "hover:text-rose dark:hover:text-rose-light", dot: "border-rose dark:border-rose-light", line: "border-l-rose/30 dark:border-l-rose-light/20" },
};

export default function App() {
  const { dark, toggle } = useTheme();
  const [showTop, setShowTop] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-lavender-50 text-lavender-700 dark:bg-lavender-900 dark:text-lavender-200 transition-colors duration-300">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-lavender-50/80 dark:bg-lavender-900/80 border-b border-lavender-300/50 dark:border-lavender-700/20">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="#" className="text-sm font-semibold tracking-tight text-iris dark:text-iris-light">SV</a>
          <div className="flex items-center gap-6">
            <ul className="hidden sm:flex items-center gap-5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={`inline-flex items-center gap-1.5 text-[13px] transition-colors ${activeSection === l.href.replace("#", "") ? `${l.active} font-medium` : "text-lavender-600 dark:text-lavender-500 hover:text-lavender-700 dark:hover:text-lavender-300"}`}>
                    {l.icon} {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <a href="#contact" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-iris to-foam dark:from-iris-light dark:to-foam-light text-white dark:text-lavender-900 text-[13px] font-medium hover:opacity-90 hover:shadow-md hover:shadow-iris/20 transition-all">
              <Coffee className="w-3.5 h-3.5" /> Get in Touch
            </a>
            <button onClick={toggle} className="p-2 rounded-lg text-lavender-600 dark:text-lavender-500 hover:bg-lavender-200/60 dark:hover:bg-lavender-950/60 transition-colors" aria-label="Toggle theme">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => setMobileNav(!mobileNav)} className="sm:hidden p-2 rounded-lg text-lavender-600 dark:text-lavender-500 hover:bg-lavender-200/60 dark:hover:bg-lavender-950/60 transition-colors" aria-label="Toggle menu">
              {mobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileNav && (
          <div className="sm:hidden border-t border-lavender-300/50 dark:border-lavender-700/20 bg-lavender-50/95 dark:bg-lavender-900/95 backdrop-blur-md">
            <ul className="px-6 py-4 space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setMobileNav(false)} className={`flex items-center gap-2 text-sm transition-colors ${activeSection === l.href.replace("#", "") ? `${l.active} font-medium` : "text-lavender-600 dark:text-lavender-500 hover:text-lavender-700 dark:hover:text-lavender-300"}`}>
                    {l.icon} {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#contact" onClick={() => setMobileNav(false)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-iris to-foam dark:from-iris-light dark:to-foam-light text-white dark:text-lavender-900 text-sm font-medium hover:opacity-90 hover:shadow-md hover:shadow-iris/20 transition-all">
                  <Coffee className="w-3.5 h-3.5" /> Get in Touch
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-iris/[0.06] via-transparent to-foam/[0.06] dark:from-iris-light/[0.06] dark:via-transparent dark:to-foam-light/[0.06]" />
        <div className="absolute top-20 -left-32 w-64 h-64 rounded-full bg-love/[0.06] dark:bg-love-light/[0.06] blur-3xl" />
        <div className="absolute bottom-10 -right-32 w-64 h-64 rounded-full bg-gold/[0.06] dark:bg-gold-light/[0.06] blur-3xl" />
        <div className="max-w-5xl mx-auto text-center relative">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] gradient-text">
            Shruti Vellanki
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-lavender-600 dark:text-lavender-500">
            Building systems under pressure.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <a href="https://github.com/ShrutiVellanki" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-3 rounded-full border border-lavender-300/60 dark:border-lavender-700/20 text-lavender-600 dark:text-lavender-500 hover:text-pine dark:hover:text-pine-light hover:border-pine/30 dark:hover:border-pine-light/30 hover:bg-pine/5 dark:hover:bg-pine-light/5 transition-all">
              <GithubIcon className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/shruti-vellanki/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-3 rounded-full border border-lavender-300/60 dark:border-lavender-700/20 text-lavender-600 dark:text-lavender-500 hover:text-foam dark:hover:text-foam-light hover:border-foam/30 dark:hover:border-foam-light/30 hover:bg-foam/5 dark:hover:bg-foam-light/5 transition-all">
              <LinkedinIcon className="w-5 h-5" />
            </a>
            <a href="mailto:shvellanki@gmail.com" aria-label="Email" className="p-3 rounded-full border border-lavender-300/60 dark:border-lavender-700/20 text-lavender-600 dark:text-lavender-500 hover:text-rose dark:hover:text-rose-light hover:border-rose/30 dark:hover:border-rose-light/30 hover:bg-rose/5 dark:hover:bg-rose-light/5 transition-all">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-6 bg-gradient-to-br from-transparent via-iris/[0.03] to-transparent dark:via-iris-light/[0.04]">
        <div className="max-w-5xl mx-auto">
          <SectionHeading icon={<User className="w-6 h-6" />} iconColor="text-iris dark:text-iris-light">About</SectionHeading>
          <div className="mt-8 max-w-3xl text-[15px] leading-relaxed text-lavender-600 dark:text-lavender-500">
            <p>
              Software Engineer with <strong className="text-lavender-700 dark:text-lavender-200">5+ years</strong> building <strong className="text-lavender-700 dark:text-lavender-200">frontend applications</strong> and <strong className="text-lavender-700 dark:text-lavender-200">design systems</strong> to serve over <strong className="text-lavender-700 dark:text-lavender-200">50M+ users</strong>. Experienced in <strong className="text-lavender-700 dark:text-lavender-200">React</strong>, <strong className="text-lavender-700 dark:text-lavender-200">TypeScript</strong>, <strong className="text-lavender-700 dark:text-lavender-200">JavaScript</strong>, and <strong className="text-lavender-700 dark:text-lavender-200">Svelte</strong>, collaborating across product, design and engineering to deliver <strong className="text-lavender-700 dark:text-lavender-200">scalable solutions</strong> that serve both <strong className="text-lavender-700 dark:text-lavender-200">user needs</strong> and <strong className="text-lavender-700 dark:text-lavender-200">business goals</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-20 px-6 bg-gradient-to-br from-foam/[0.04] via-white/50 to-iris/[0.04] dark:from-foam-light/[0.04] dark:via-lavender-950/30 dark:to-iris-light/[0.04]">
        <div className="max-w-5xl mx-auto">
          <SectionHeading icon={<Wrench className="w-6 h-6" />} iconColor="text-foam dark:text-foam-light">Skills</SectionHeading>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SKILLS.map((s) => {
              const a = ACCENT_STYLES[s.accent] || ACCENT_STYLES.iris;
              return (
                <div key={s.category} className={`rounded-xl border border-lavender-300/60 dark:border-lavender-700/20 border-t-2 ${a.borderTop} bg-white/60 dark:bg-lavender-950/40 p-5 hover:shadow-md transition-shadow`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={a.text}>{s.icon}</span>
                    <h3 className="text-sm font-semibold text-lavender-700 dark:text-lavender-100">{s.category}</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {s.items.map((item) => (
                      <li key={item} className={`text-[13px] text-lavender-600 dark:text-lavender-500 pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1.5 before:h-1.5 before:rounded-full ${a.bullet}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="py-20 px-6 bg-gradient-to-bl from-transparent via-gold/[0.03] to-transparent dark:via-gold-light/[0.04]">
        <div className="max-w-5xl mx-auto">
          <SectionHeading icon={<Briefcase className="w-6 h-6" />} iconColor="text-gold dark:text-gold-light">Experience</SectionHeading>
          <div className="mt-8 space-y-10">
            {EXPERIENCE.map((exp) => {
              const ea = ACCENT_STYLES[exp.accent] || ACCENT_STYLES.iris;
              return (
              <div key={exp.company}>
                <div className="flex items-center gap-2.5 mb-4">
                  <span className={`${ea.text} shrink-0`}>{exp.icon || <Briefcase className="w-4 h-4" />}</span>
                  <h3 className="text-lg font-semibold text-lavender-700 dark:text-lavender-100">
                    {exp.company}
                    {exp.subtitle && <span className="font-normal text-lavender-500 dark:text-lavender-600 ml-1.5">{exp.subtitle}</span>}
                  </h3>
                </div>
                <div className={`ml-6 border-l-2 ${ea.line} space-y-6`}>
                  {exp.roles.map((role) => (
                    <div key={role.title} className="pl-5 relative">
                      <div className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full border-2 ${ea.dot} bg-lavender-50 dark:bg-lavender-900`} />
                      <div className="flex items-baseline justify-between gap-3 flex-wrap">
                        <h4 className="text-sm font-semibold text-lavender-700 dark:text-lavender-200">{role.title}</h4>
                        <span className="text-xs text-lavender-500 dark:text-lavender-600 shrink-0">{role.period}</span>
                      </div>
                      {role.description && (
                        <p className="text-[13px] text-lavender-600 dark:text-lavender-500 mt-1 mb-2 leading-relaxed">{role.description}</p>
                      )}
                      <ul className={`space-y-1.5 ${!role.description ? "mt-2" : ""}`}>
                        {role.bullets.map((b, i) => (
                          <li key={i} className="text-[13px] text-lavender-600 dark:text-lavender-500 leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1 before:h-1 before:rounded-full before:bg-lavender-400 dark:before:bg-lavender-600 [&_strong]:font-semibold [&_strong]:text-lavender-700 dark:[&_strong]:text-lavender-300" dangerouslySetInnerHTML={{ __html: b }} />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-20 px-6 bg-gradient-to-br from-pine/[0.03] via-white/50 to-love/[0.03] dark:from-pine-light/[0.03] dark:via-lavender-950/30 dark:to-love-light/[0.03]">
        <div className="max-w-5xl mx-auto">
          <SectionHeading icon={<Code2 className="w-6 h-6" />} iconColor="text-pine dark:text-pine-light">Projects</SectionHeading>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((p) => {
              const a = ACCENT_STYLES[p.accent] || ACCENT_STYLES.iris;
              return (
                <div key={p.title} className={`group flex flex-col rounded-xl border border-lavender-300/60 dark:border-lavender-700/20 border-l-2 ${a.borderLeft} bg-white/60 dark:bg-lavender-950/40 p-6 hover:shadow-lg hover:shadow-lavender-400/10 dark:hover:shadow-lavender-900/20 transition-all duration-300`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={a.text}>{p.icon}</span>
                    <h3 className="text-base font-semibold text-lavender-700 dark:text-lavender-100">{p.title}</h3>
                  </div>
                  <p className="text-sm text-lavender-600 dark:text-lavender-500 leading-relaxed mb-4">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {p.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-lavender-200/80 dark:bg-lavender-950/80 text-lavender-600 dark:text-lavender-500">{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm mt-auto">
                    <a href={p.github} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 text-lavender-600 dark:text-lavender-500 ${a.hoverText} transition-colors`}>
                      <GithubIcon className="w-4 h-4" /> Code
                    </a>
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 text-lavender-600 dark:text-lavender-500 ${a.hoverText} transition-colors`}>
                        <ExternalLink className="w-4 h-4" /> Live
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Talks */}
      <section id="talks" className="py-20 px-6 bg-gradient-to-br from-love/[0.04] via-white/50 to-rose/[0.04] dark:from-love-light/[0.04] dark:via-lavender-950/30 dark:to-rose-light/[0.04]">
        <div className="max-w-5xl mx-auto">
          <SectionHeading icon={<Mic className="w-6 h-6" />} iconColor="text-love dark:text-love-light">Talks</SectionHeading>
          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            {TALKS.map((talk) => {
              const ta = ACCENT_STYLES[talk.accent] || ACCENT_STYLES.iris;
              return (
                <div key={talk.title} className={`rounded-xl border border-lavender-300/60 dark:border-lavender-700/20 border-t-2 ${ta.borderTop} bg-white/60 dark:bg-lavender-950/40 p-6 hover:shadow-md transition-shadow`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Mic className={`w-4 h-4 ${ta.text} shrink-0`} />
                    <h3 className="text-sm font-semibold text-lavender-700 dark:text-lavender-100">{talk.title}</h3>
                  </div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className={`text-xs ${ta.text}`}>{talk.event}</p>
                    {talk.date && <span className="text-xs text-lavender-500 dark:text-lavender-600 shrink-0">{talk.date}</span>}
                  </div>
                  <p className="text-[13px] text-lavender-600 dark:text-lavender-500 leading-relaxed">{talk.description}</p>
                  {talk.link && (
                    <a href={talk.link} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 text-xs mt-3 text-lavender-600 dark:text-lavender-500 ${ta.hoverText} transition-colors`}>
                      <ExternalLink className="w-3.5 h-3.5" /> View Slides
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6 bg-gradient-to-t from-iris/[0.04] via-transparent to-transparent dark:from-iris-light/[0.04]">
        <div className="max-w-5xl mx-auto text-center">
          <SectionHeading center icon={<Coffee className="w-6 h-6" />} iconColor="text-rose dark:text-rose-light">Get in Touch</SectionHeading>
          <p className="mt-4 text-[15px] text-lavender-600 dark:text-lavender-500 max-w-md mx-auto">
            Always open to interesting conversations and opportunities — or just grabbing a coffee somewhere in Toronto. Feel free to reach out.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <SocialLink href="https://github.com/ShrutiVellanki" icon={<GithubIcon className="w-5 h-5" />} label="GitHub" hoverColor="hover:text-pine dark:hover:text-pine-light hover:border-pine/30 dark:hover:border-pine-light/30 hover:bg-pine/5 dark:hover:bg-pine-light/5" />
            <SocialLink href="https://www.linkedin.com/in/shruti-vellanki/" icon={<LinkedinIcon className="w-5 h-5" />} label="LinkedIn" hoverColor="hover:text-foam dark:hover:text-foam-light hover:border-foam/30 dark:hover:border-foam-light/30 hover:bg-foam/5 dark:hover:bg-foam-light/5" />
            <SocialLink href="mailto:shvellanki@gmail.com" icon={<Mail className="w-5 h-5" />} label="Email" hoverColor="hover:text-rose dark:hover:text-rose-light hover:border-rose/30 dark:hover:border-rose-light/30 hover:bg-rose/5 dark:hover:bg-rose-light/5" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-lavender-300/50 dark:border-lavender-700/20">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-lavender-500 dark:text-lavender-600">
          <span>&copy; {new Date().getFullYear()} Shruti Vellanki</span>
          <span>
            Built with{" "}
            <a href="https://github.com/ShrutiVellanki/lavender-storybook" target="_blank" rel="noopener noreferrer" className="text-iris dark:text-iris-light hover:underline">
              lavender-storybook
            </a>
          </span>
        </div>
      </footer>

      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-6 right-6 p-2.5 rounded-full bg-iris dark:bg-iris-light text-white dark:text-lavender-900 shadow-lg hover:opacity-90 transition-opacity z-40" aria-label="Back to top">
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function SectionHeading({ children, center, icon, iconColor }: { children: React.ReactNode; center?: boolean; icon?: React.ReactNode; iconColor?: string }) {
  return (
    <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight text-lavender-700 dark:text-lavender-100 ${center ? "text-center" : ""}`}>
      <span className={`inline-flex items-center gap-2.5 ${center ? "justify-center" : ""}`}>
        {icon && <span className={iconColor || "text-iris dark:text-iris-light"}>{icon}</span>}
        {children}
      </span>
    </h2>
  );
}

function SocialLink({ href, icon, label, hoverColor }: { href: string; icon: React.ReactNode; label: string; hoverColor?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={`p-3 rounded-xl border border-lavender-300/60 dark:border-lavender-700/20 text-lavender-600 dark:text-lavender-500 transition-all ${hoverColor || "hover:text-iris dark:hover:text-iris-light hover:border-iris/30 dark:hover:border-iris-light/30 hover:bg-iris/5 dark:hover:bg-iris-light/5"}`}>
      {icon}
    </a>
  );
}
