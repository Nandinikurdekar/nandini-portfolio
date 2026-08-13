import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  ExternalLink,
  Github,
  Award,
  Cloud,
  Database,
  Mail,
  Menu,
  MoveUpRight,
  Send,
  X
} from "lucide-react";
import { site, skills, projects, journey } from "./data/site";
import "./styles.css";

const ease = [0.22, 1, 0.36, 1];

function Reveal({ children, className = "", delay = 0, y = 24 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduce ? 0.01 : 0.65, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [cursor, setCursor] = useState({ x: -100, y: -100, visible: false });
  const reduce = useReducedMotion();

  useEffect(() => {
    const ids = ["home", "about", "skills", "projects", "certifications", "journey", "contact"];
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && setActive(id),
        { rootMargin: "-35% 0px -55% 0px" }
      );
      observer.observe(el);
      return observer;
    }).filter(Boolean);
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) {
      const move = (e) => setCursor({ x: e.clientX, y: e.clientY, visible: true });
      const leave = () => setCursor((c) => ({ ...c, visible: false }));
      window.addEventListener("mousemove", move);
      document.documentElement.addEventListener("mouseleave", leave);
      return () => {
        window.removeEventListener("mousemove", move);
        document.documentElement.removeEventListener("mouseleave", leave);
      };
    }
  }, []);

  useEffect(() => {
    const close = (e) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink selection:bg-accentSoft selection:text-ink">
      <motion.div
        className="pointer-events-none fixed z-[100] hidden h-2.5 w-2.5 rounded-full bg-ink md:block"
        animate={{ x: cursor.x - 5, y: cursor.y - 5, opacity: cursor.visible ? 0.72 : 0 }}
        transition={{ type: "spring", stiffness: 600, damping: 35, mass: 0.15 }}
      />
      <Navbar active={active} menuOpen={menuOpen} setMenuOpen={setMenuOpen} go={go} />
      <main>
        <Hero go={go} setSelected={setSelected} />
        <About />
        <Skills />
        <Projects setSelected={setSelected} />
        <Certifications />
        <Journey />
        <Contact />
      </main>
      <Footer />
      <AnimatePresence>
        {selected && <ProjectDialog project={selected} close={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}

function Navbar({ active, menuOpen, setMenuOpen, go }) {
  const links = [
    ["about", "About"],
    ["skills", "Skills"],
    ["projects", "Projects"],
    ["certifications", "Certifications"],
    ["journey", "Journey"],
    ["contact", "Contact"]
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-line/90 bg-paper/85 px-4 py-2.5 shadow-[0_8px_40px_rgba(30,33,31,0.06)] backdrop-blur-xl transition-all duration-300 sm:px-5">
        <button onClick={() => go("home")} className="font-display text-xl tracking-tight" aria-label="Go to home">
          Nandini Kurdekar <span className="text-accent"></span>
        </button>
        <div className="hidden items-center gap-1 md:flex">
          {links.map(([id, label]) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={`nav-link ${active === id ? "nav-link-active" : ""}`}
            >
              {label}
            </button>
          ))}
          <button onClick={() => go("contact")} className="ml-2 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-transform hover:-translate-y-0.5">
            Let's talk!<ArrowUpRight size={14} />
          </button>
        </div>
        <button
          className="grid h-10 w-10 place-items-center rounded-full border border-line md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto mt-2 max-w-7xl rounded-3xl border border-line bg-paper p-3 shadow-xl md:hidden"
          >
            {links.map(([id, label]) => (
              <button key={id} onClick={() => go(id)} className="block w-full rounded-2xl px-4 py-3 text-left text-sm hover:bg-white/70">
                {label}
              </button>
            ))}
            <button onClick={() => go("contact")} className="mt-1 flex w-full items-center justify-between rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-paper">
              Let's talk! <ArrowUpRight size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero({ go, setSelected }) {
  return (
    <section id="home" className="relative flex min-h-screen items-center px-6 pb-16 pt-32 lg:px-10">
      <div className="grain absolute inset-0 opacity-30" />
      <div className="mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
        <div className="relative z-10">
          <Reveal>
            <div className="mb-7 flex items-center gap-3 text-[11px] font-semibold tracking-[0.22em] text-muted">
              <span className="status-dot" /> {site.eyebrow}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="max-w-4xl font-display text-[clamp(3.8rem,9vw,8.2rem)] leading-[0.88] tracking-[-0.055em]">
              Hello, I'm <span className="italic text-accent">Nandini Kurdekar!</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-8 max-w-2xl text-[clamp(1.35rem,2.5vw,2rem)] leading-tight tracking-[-0.025em] text-ink/80">
              {site.hero}
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <button onClick={() => go("projects")} className="group inline-flex items-center gap-3 rounded-full bg-ink px-5 py-3.5 text-sm font-semibold text-paper transition-transform hover:-translate-y-1">
                See what I've built <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <a href={site.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3.5 text-sm font-semibold transition-colors hover:bg-white/60">
                GitHub <Github size={16} />
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.32}>
            <div className="mt-16 flex items-center gap-3 text-xs text-muted">
              <span className="scroll-line" />
              Scroll to explore
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.18} y={30} className="relative z-10">
          <Workspace go={go} setSelected={setSelected} />
        </Reveal>
      </div>
    </section>
  );
}

function Workspace({ go, setSelected }) {
  const reduce = useReducedMotion();

  const phrases = [
    "Systems that make ideas tangible!",
    "Ideas turned into working software!",
    "Learning by building real things!",
  ];

  const commands = [
    "Help",
    "About",
    "Projects",
    "Skills",
    "Certifications",
    "Journey",
    "Contact",
    "Clear",
  ];

  const [typedText, setTypedText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [output, setOutput] = useState([
    {
      type: "system",
      lines: [
        "Help     : available commands",
        "About     : about me",
        "Projects  : things I've built",
        "Skills    : tools I use",
        "Certifications : credentials & learning",
        "Journey   : learning journey",
        "Contact   : get in touch",
        "Clear     clear workspace",
      ],
    },
  ]);

  // --------------------------------------------------
  // Typing / deleting animation
  // --------------------------------------------------

  useEffect(() => {
    if (reduce) {
      setTypedText(phrases[phraseIndex]);
      return;
    }

    const currentPhrase = phrases[phraseIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        const nextText = currentPhrase.slice(0, typedText.length + 1);
        setTypedText(nextText);

        if (nextText === currentPhrase) {
          setTimeout(() => setIsDeleting(true), 1400);
        }
      } else {
        const nextText = currentPhrase.slice(0, typedText.length - 1);
        setTypedText(nextText);

        if (nextText === "") {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, isDeleting ? 45 : 75);

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, phraseIndex, reduce]);

  // --------------------------------------------------
  // Command execution
  // --------------------------------------------------

  const executeCommand = (rawCommand) => {
    const command = rawCommand.trim().toLowerCase();

    if (!command) return;

    setHistory((prev) => [...prev, rawCommand]);
    setHistoryIndex(-1);

    const addOutput = (lines) => {
      setOutput((prev) => [
        ...prev,
        {
          type: "command",
          command: rawCommand,
        },
        {
          type: "response",
          lines: Array.isArray(lines) ? lines : [lines],
        },
      ]);
    };

    if (command === "clear") {
      setOutput([]);
      setInput("");
      return;
    }

    if (command === "help") {
      addOutput([
        "Help     : available commands",
        "About     :about me",
        "Projects  : things I've built",
        "Skills    : tools I use",
        "Certifications : credentials & learning",
        "Journey   : learning journey",
        "Contact   : get in touch",
        "Open <project>",
        "Clear     : clear workspace",
      ]);
      setInput("");
      return;
    }

    if (command === "about") {
      addOutput("Opening about...");
      setInput("");
      setTimeout(() => go("about"), 150);
      return;
    }

    if (command === "skills") {
      addOutput("Opening skills...");
      setInput("");
      setTimeout(() => go("skills"), 150);
      return;
    }

    if (command === "certifications" || command === "certificates" || command === "certs") {
      addOutput("Opening certifications...");
      setInput("");
      setTimeout(() => go("certifications"), 150);
      return;
    }

    if (command === "journey") {
      addOutput("Opening journey...");
      setInput("");
      setTimeout(() => go("journey"), 150);
      return;
    }

    if (command === "contact") {
      addOutput("Opening contact...");
      setInput("");
      setTimeout(() => go("contact"), 150);
      return;
    }

    if (command === "projects") {
      addOutput([
        "01  " + projects.map((p) => p.title || p.name).join("\n02  "),
        "",
        "Tip: use  open <project>",
      ]);
      setInput("");
      return;
    }

    if (command.startsWith("open ")) {
      const searchTerm = command.replace("open ", "").trim();

      const project = projects.find((p) => {
        const title = (p.title || p.name || "").toLowerCase();
        return (
          title.includes(searchTerm) ||
          searchTerm.includes(title) ||
          title
            .split(/\s+/)
            .some((word) => word.length > 3 && searchTerm.includes(word))
        );
      });

      if (project) {
        addOutput(`Opening ${project.title || project.name}...`);
        setInput("");

        setTimeout(() => {
          setSelected(project);
        }, 180);

        return;
      }

      addOutput([
        `Project not found: ${searchTerm}`,
        "",
        "Try: open nightvision",
      ]);
      setInput("");
      return;
    }

    addOutput([
      `command not found: ${command}`,
      "",
      "Type  help  to see available commands.",
    ]);

    setInput("");
  };

  // --------------------------------------------------
  // Keyboard controls
  // --------------------------------------------------

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeCommand(input);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      if (!history.length) return;

      const nextIndex =
        historyIndex === -1
          ? history.length - 1
          : Math.max(0, historyIndex - 1);

      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();

      if (!history.length) return;

      if (historyIndex === -1) return;

      const nextIndex = historyIndex + 1;

      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }

      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();

      const matches = commands.filter((command) =>
        command.startsWith(input.toLowerCase())
      );

      if (matches.length === 1) {
        setInput(matches[0]);
      }
    }
  };

  return (
    <div className="workspace mx-auto max-w-[520px] lg:ml-auto">
      <div className="workspace-top">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#c97a67]" />
          <span className="h-2 w-2 rounded-full bg-[#c7a85e]" />
          <span className="h-2 w-2 rounded-full bg-[#789579]" />
        </div>

        <span className="font-mono text-[10px] tracking-wider text-muted">
          NANDINI.DEV
        </span>
      </div>

      <div className="workspace-body">
        {/* PERSONAL WORKSPACE */}
        <div className="mb-10">
          <span className="eyebrow-chip">PERSONAL WORKSPACE</span>

          <p className="mt-5 font-display text-4xl leading-tight tracking-tight">
            Currently <span className="italic text-accent">building</span>
          </p>

          <div className="mt-3 flex min-h-[18px] items-center gap-2 font-mono text-xs text-muted">
            <span className="cursor-blink">▌</span>
            <span>{typedText}</span>
          </div>
        </div>

        {/* AREAS */}
        <div className="space-y-2.5">
          {["software", "AI / ML", "data", "security"].map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.8 + i * 0.12,
                duration: 0.45,
              }}
              className="workspace-row"
            >
              <span className="font-mono text-[10px] text-muted">
                0{i + 1}
              </span>

              <span>{item}</span>

              <Check size={14} className="ml-auto text-sage" />
            </motion.div>
          ))}
        </div>

        {/* STATUS */}
        <div className="mt-10 border-t border-line pt-5">
          <div className="flex items-center justify-between text-[11px] text-muted">
            <span>Learning → Building → Understanding</span>
            <span className="status-live">active</span>
          </div>

          <div className="mt-3 h-px overflow-hidden bg-line">
            <motion.div
              className="h-full origin-left bg-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                delay: 1.1,
                duration: 1.4,
                ease,
              }}
            />
          </div>
        </div>

        {/* TERMINAL */}
        <div className="mt-8 border-t border-line pt-5">
          

          <div className="max-h-52 overflow-y-auto pr-1 font-mono text-[11px] leading-6">
            {output.map((item, index) => {
              if (item.type === "command") {
                return (
                  <div key={index} className="text-ink">
                    <span className="text-muted">nandini@dev:~$ </span>
                    {item.command}
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  className={
                    item.type === "system"
                      ? "text-muted"
                      : "whitespace-pre-line text-ink/70"
                  }
                >
                  {item.lines.join("\n")}
                </div>
              );
            })}
          </div>

          {/* INPUT */}
          <div className="mt-3 flex items-center gap-2 font-mono text-[11px]">
            <span className="shrink-0 text-muted">nandini@dev:~$</span>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Workspace command input"
              autoComplete="off"
              spellCheck="false"
              className="min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-muted/40"
              placeholder="type a command..."
            />

            <span className="cursor-blink text-accent">▌</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] font-mono text-muted/60">
  <span>try:</span>

  {[
    "Help ",
    "Projects ",
    "Open Nightvision ",
    "About ",
    "Skills ",
    "Contact ",
  ].map((command) => (
    <button
      key={command}
      type="button"
      onClick={() => {
        setInput(command);
      }}
      className="transition-colors hover:text-ink"
    >
      {command}
    </button>
  ))}
</div>
        </div>
      </div>

      <div className="workspace-note">
        <span className="text-xs">Currently curious</span>
        <span className="font-display italic">
          How systems fit together
        </span>
      </div>
    </div>
  );
}

function SectionHead({ number, eyebrow, title, intro }) {
  return (
    <div className="mb-14 grid gap-5 lg:grid-cols-[180px_1fr]">
      <Reveal>
        <div className="section-label"><span>{number}</span> {eyebrow}</div>
      </Reveal>
      <Reveal delay={0.05}>
        <div>
          <h2 className="max-w-4xl font-display text-[clamp(2.7rem,6vw,5.4rem)] leading-[0.95] tracking-[-0.045em]">{title}</h2>
          {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>}
        </div>
      </Reveal>
    </div>
  );
}

function About() {
  const steps = ["LEARN", "BUILD", "BREAK", "UNDERSTAND", "IMPROVE"];
  return (
    <section id="about" className="border-t border-line px-6 py-28 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHead number="01" eyebrow="ABOUT" title="A little about me." />
        <div className="grid gap-14 lg:grid-cols-[1.15fr_.85fr]">
          <Reveal>
            <div className="max-w-3xl space-y-6 text-[clamp(1.25rem,2.3vw,1.7rem)] leading-relaxed tracking-[-0.02em]">
              {site.about.map((p) => <p key={p}>{p}</p>)}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="border-l border-line pl-7 lg:pl-10">
              <div className="mb-5 text-[10px] font-semibold tracking-[0.2em] text-muted">THE LOOP</div>
              <div className="space-y-1">
                {steps.map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0.25, x: -6 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="flex items-center gap-4 py-2.5"
                  >
                    <span className="font-mono text-[10px] text-muted">0{i + 1}</span>
                    <span className={i === 4 ? "font-display text-2xl italic text-accent" : "text-xl"}>{step}</span>
                    {i < steps.length - 1 && <span className="ml-auto text-line">↓</span>}
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const [activeSkill, setActiveSkill] = useState(null);
  return (
    <section id="skills" className="border-t border-line bg-[#eeece5] px-6 py-28 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHead number="02" eyebrow="TOOLBOX" title="Tools I use." intro="A practical stack built through projects rather than percentage bars." />
        <div className="grid gap-px overflow-hidden rounded-[2rem] border border-line bg-line md:grid-cols-2">
          {skills.map((group, index) => (
            <Reveal key={group.category} delay={index * 0.03} className="h-full">
              <div className={`skill-group ${activeSkill === group.category ? "skill-group-active" : ""}`} onMouseEnter={() => setActiveSkill(group.category)} onMouseLeave={() => setActiveSkill(null)}>
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-[0.15em] text-muted">{group.category.toUpperCase()}</span>
                  <span className="font-mono text-[10px] text-muted">/{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="skill-pill">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects({ setSelected }) {
  return (
    <section id="projects" className="border-t border-line px-6 py-28 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHead number="03" eyebrow="SELECTED WORK" title="Things I've built." intro="A selection of genuine projects from my GitHub — kept deliberately honest." />
        <div className="space-y-5">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} setSelected={setSelected} />
          ))}
        </div>
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-line pt-7 sm:flex-row sm:items-center">
            <p className="text-sm text-muted">More code, experiments and history live on GitHub.</p>
            <a href={site.github} target="_blank" rel="noreferrer" className="link-arrow">
              Visit GitHub <ArrowUpRight size={15} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ProjectCard({ project, index, setSelected }) {
  const featured = project.featured;
  return (
    <Reveal delay={index * 0.035}>
      <article className={`project-card ${featured ? "project-featured" : ""}`}>
        <div className="project-number">{project.id}</div>
        <div className="project-main">
          <div>
            <div className={`project-kind project-kind-${project.accent}`}>{project.kind}</div>
            <h3 className="mt-4 font-display text-[clamp(2rem,4vw,3.6rem)] leading-none tracking-[-0.04em] transition-transform duration-300 group-hover:translate-x-1">
              {project.name}
            </h3>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">{project.summary}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {project.technologies.map((tech) => <span key={tech} className="tech-chip">{tech}</span>)}
            </div>
          </div>
          <ProjectVisual project={project} />
        </div>
        <div className="project-footer">
          <button onClick={() => setSelected(project)} className="group inline-flex items-center gap-2 text-sm font-semibold">
            Explore project <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
          <a href={project.repo} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="icon-link" aria-label={`Open ${project.name} on GitHub`}>
            <Github size={17} /> <span>GitHub</span>
          </a>
        </div>
      </article>
    </Reveal>
  );
}

function ProjectVisual({ project }) {
  if (project.visual === "enhancement") {
    return (
      <div className="visual visual-enhancement">
        <div className="visual-grid" />
        <div className="vision-frame dark">
          <span>INPUT FRAME</span>
          <div className="fake-scene dim"><div className="scene-shape" /></div>
        </div>
        <div className="vision-arrow"><ArrowUpRight size={18} /></div>
        <div className="vision-frame light">
          <span>OUTPUT</span>
          <div className="fake-scene bright"><div className="scene-shape" /></div>
        </div>
      </div>
    );
  }
  const labels = {
    network: ["users", "profiles", "businesses", "community"],
    form: ["LANGUAGE", "SYMPTOMS", "NOTES", "REPORT"],
    player: ["SEARCH", "PLAY", "FAVORITES", "QUEUE"],
    vision: ["FACE", "EYES", "FRAME", "SIGNAL"],
    security: ["LENGTH", "UPPERCASE", "NUMBER", "SPECIAL"]
  };
  return (
    <div className={`visual visual-${project.visual}`}>
      <div className="mini-grid">
        {labels[project.visual].map((label, i) => (
          <motion.div key={label} className="mini-node" whileHover={{ y: -2 }}>
            <span className="font-mono text-[9px] text-muted">0{i + 1}</span>
            <span>{label}</span>
            <span className="node-dot" />
          </motion.div>
        ))}
      </div>
      <div className="visual-caption">
        <span>PROJECT MAP</span>
        <span className="font-mono">interactive</span>
      </div>
    </div>
  );
}

function ProjectDialog({ project, close }) {
  return (
    <motion.div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/35 p-3 backdrop-blur-sm sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
        initial={{ opacity: 0, y: 30, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.985 }}
        transition={{ duration: 0.45, ease }}
        className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-line bg-paper shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper/90 px-6 py-4 backdrop-blur sm:px-8">
          <span className="font-mono text-[10px] text-muted">{project.id} / {project.kind}</span>
          <button onClick={close} className="grid h-9 w-9 place-items-center rounded-full border border-line hover:bg-white/70" aria-label="Close project dialog"><X size={16} /></button>
        </div>
        <div className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[.9fr_1.1fr] lg:p-12">
          <div>
            <div className={`project-kind project-kind-${project.accent}`}>{project.kind}</div>
            <h2 id="project-title" className="mt-5 font-display text-5xl leading-none tracking-[-0.045em] sm:text-6xl">{project.name}</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">{project.summary}</p>
            <a href={project.repo} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper">
              View repository <ExternalLink size={15} />
            </a>
          </div>
          <ProjectVisual project={project} />
        </div>
        <div className="grid gap-px border-t border-line bg-line sm:grid-cols-3">
          <Detail title="Problem" text={project.problem} />
          <Detail title="Approach" text={project.approach} />
          <div className="bg-paper p-6 sm:p-8">
            <div className="text-[10px] font-semibold tracking-[0.18em] text-muted">FEATURES</div>
            <ul className="mt-5 space-y-3">
              {project.features.map((feature) => <li key={feature} className="flex gap-2 text-sm leading-relaxed"><Check size={15} className="mt-0.5 shrink-0 text-sage" />{feature}</li>)}
            </ul>
          </div>
        </div>
        <div className="border-t border-line p-6 sm:p-8">
          <div className="text-[10px] font-semibold tracking-[0.18em] text-muted">TECHNOLOGIES</div>
          <div className="mt-4 flex flex-wrap gap-2">{project.technologies.map((t) => <span key={t} className="tech-chip">{t}</span>)}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Detail({ title, text }) {
  return <div className="bg-paper p-6 sm:p-8"><div className="text-[10px] font-semibold tracking-[0.18em] text-muted">{title.toUpperCase()}</div><p className="mt-5 text-sm leading-7 text-ink/75">{text}</p></div>;
}

function Certifications() {
  const [openGroup, setOpenGroup] = useState(null);

  const grouped = [
    {
      id: "aws",
      number: "01",
      title: "AWS Cloud",
      issuer: "AWS Academy",
      icon: Cloud,
      summary: "Five AWS Academy training badges covering cloud foundations, operations, security, development, and architecting.",
      items: [
        { title: "AWS Academy Graduate - Cloud Foundations - Training Badge", date: "Mar 16, 2026", url: "https://www.credly.com/go/9xL4P6v5" },
        { title: "AWS Academy Graduate - Cloud Operations - Training Badge", date: "May 1, 2026", url: "https://www.credly.com/go/Ym8nMug3" },
        { title: "AWS Academy Graduate - Cloud Security Foundations - Training Badge", date: "Apr 30, 2026", url: "https://www.credly.com/go/Wnuu87N5" },
        { title: "AWS Academy Graduate - Cloud Developing - Training Badge", date: "May 1, 2026", url: "https://www.credly.com/go/qPGiBplo" },
        { title: "AWS Academy Graduate - Cloud Architecting - Training Badge", date: "May 1, 2026", url: "https://www.credly.com/go/6xOR1isY" },
      ],
    },
    {
      id: "mongodb",
      number: "02",
      title: "MongoDB",
      issuer: "MongoDB",
      icon: Database,
      summary: "MongoDB learning badges covering the document model, Atlas, CRUD, aggregation, indexing, transactions, and data modeling.",
      items: [
        "MongoDB Indexes",
        "MongoDB and the Document Model",
        "MongoDB Transactions",
        "Getting Started with MongoDB Atlas",
        "MongoDB Data Modeling Intro",
        "Connecting to a MongoDB Database",
        "MongoDB CRUD Operations: Insert and Find Documents",
        "MongoDB CRUD Operations: Replace and Delete Documents",
        "MongoDB CRUD Operations: Modifying Query Results",
        "MongoDB Aggregation",
        "Introduction to MongoDB (For Students)",
      ],
    },
  ];

  const individual = [
    { number: "03", title: "Complete React JS Course 2025: React JS For Beginners", issuer: "Udemy", date: "Jan 9, 2026", detail: "2-hour course completion certificate", url: "https://ude.my/UC-192db944-984c-49a7-b98f-026606fb8ef8" },
    { number: "04", title: "Foundations of Web Development: CSS, Bootstrap, JS, React", issuer: "PROPER DOT INSTITUTE · Udemy", date: "May 11, 2026", detail: "5.5-hour course completion certificate", url: "https://ude.my/UC-fd314dae-98d3-4d84-a32c-d31a5fc8a862" },
    { number: "05", title: "HTML - The Complete Guide to HTML for Beginners", issuer: "Sara Academy · Udemy", date: "Feb 4, 2026", detail: "2-hour course completion certificate", url: "https://ude.my/UC-251b8094-79a0-44df-89ed-546303843a12" },
    { number: "06", title: "AWS Academy Graduate - Generative AI Foundations", issuer: "AWS Academy", date: "Sep 7, 2025", detail: "12-hour training badge", url: "https://www.credly.com/badges/7e7453aa-5526-4a82-8a6e-39235a56727c" },
    { number: "07", title: "Data Structures & Algorithms Training", issuer: "Internshala", date: "Oct 6, 2025", detail: "8-week online training · 90% final assessment", url: "https://trainings.internshala.com/verify_certificate" },
    { number: "08", title: "Data Analytics Job Simulation", issuer: "Deloitte · Forage", date: "Sep 7, 2025", detail: "Practical tasks in data analysis and forensic technology", url: null },
  ];

  return (
    <section id="certifications" className="border-t border-line bg-[#eeece5] px-6 py-28 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHead
          number="04"
          eyebrow="CREDENTIALS"
          title="Certifications & learning."
          intro="A curated record of courses, training badges, and practical learning I've completed."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {grouped.map((group, index) => {
            const Icon = group.icon;
            const isOpen = openGroup === group.id;
            return (
              <Reveal key={group.id} delay={index * 0.05}>
                <article className="rounded-[2rem] border border-line bg-paper p-6 sm:p-8">
                  <button
                    type="button"
                    onClick={() => setOpenGroup(isOpen ? null : group.id)}
                    className="group w-full text-left"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div className="flex items-start gap-4">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-line bg-[#eeece5]">
                          <Icon size={19} />
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold tracking-[0.18em] text-muted">{group.number} · GROUPED CREDENTIALS</div>
                          <h3 className="mt-2 font-display text-3xl tracking-tight">{group.title}</h3>
                          <p className="mt-1 text-sm text-muted">{group.issuer}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className={`mt-1 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} />
                    </div>
                    <p className="mt-6 max-w-2xl text-sm leading-6 text-muted">{group.summary}</p>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6 border-t border-line pt-5">
                          <div className="space-y-3">
                            {group.items.map((item, itemIndex) => {
                              const data = typeof item === "string" ? { title: item } : item;
                              return (
                                <div key={data.title} className="flex items-start gap-3 rounded-2xl bg-[#eeece5] px-4 py-3">
                                  <span className="mt-0.5 font-mono text-[10px] text-muted">{String(itemIndex + 1).padStart(2, "0")}</span>
                                  <div className="min-w-0 flex-1">
                                    <div className="text-sm leading-5">{data.title}</div>
                                    {data.date && <div className="mt-1 text-[10px] text-muted">{data.date}</div>}
                                  </div>
                                  {data.url && (
                                    <a href={data.url} target="_blank" rel="noreferrer" aria-label={`View ${data.title}`} className="shrink-0 text-muted transition-colors hover:text-ink" onClick={(e) => e.stopPropagation()}>
                                      <ExternalLink size={14} />
                                    </a>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {individual.map((item, index) => (
            <Reveal key={item.title} delay={0.08 + index * 0.035}>
              <article className="group flex h-full flex-col rounded-[1.75rem] border border-line bg-paper p-6 transition-transform duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-[10px] text-muted">{item.number}</span>
                  <Award size={17} className="text-muted transition-transform duration-300 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="mt-8 font-display text-2xl leading-tight tracking-tight">{item.title}</h3>
                <div className="mt-3 text-sm text-muted">{item.issuer}</div>
                <div className="mt-auto pt-7">
                  <div className="text-[10px] font-semibold tracking-[0.15em] text-muted">{item.date}</div>
                  <p className="mt-2 text-xs leading-5 text-muted">{item.detail}</p>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold" aria-label={`View ${item.title}`}>
                      View credential <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Journey() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 65%"] });
  const scale = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <section id="journey" ref={ref} className="border-t border-line bg-[#202522] px-6 py-28 text-paper lg:px-10 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHead number="05" eyebrow="JOURNEY" title="Still learning. Still building." intro="No invented career timeline — just the direction my work has actually taken." />
        <div className="relative mt-16">
          <div className="absolute left-[18px] top-0 h-full w-px bg-paper/15" />
          <motion.div className="absolute left-[18px] top-0 h-full w-px origin-top bg-[#8ea8b7]" style={{ scaleY: scale }} />
          <div className="space-y-8">
            {journey.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.04} y={14}>
                <div className="relative grid gap-6 pl-12 sm:grid-cols-[260px_1fr] sm:gap-12">
                  <span className="timeline-dot" />
                  <div>
                    <div className="font-display text-2xl tracking-tight">{item.title}</div>
                  </div>
                  <p className="max-w-2xl leading-7 text-paper/60">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={0.1}>
          <div className="mt-16 rounded-[2rem] border border-paper/10 bg-paper/[0.035] p-7 sm:p-9">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold tracking-[0.15em] text-paper/50">
              <span className="status-dot status-dot-dark" /> CURRENTLY EXPLORING
            </div>
            <p className="mt-5 max-w-3xl font-display text-3xl leading-tight tracking-tight sm:text-4xl">
              Cybersecurity, practical labs, and the habit of understanding systems from the inside out.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    const subject = encodeURIComponent(
      `Portfolio enquiry from ${form.name}`
    );

    const body = encodeURIComponent(
      `Hi Nandini,

Name: ${form.name}
Email: ${form.email}
Phone: ${form.phone}
LinkedIn: ${form.linkedin || "Not provided"}
GitHub: ${form.github || "Not provided"}

Quick note:
${form.message || "No additional message."}`
    );

    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section
      id="contact"
      className="border-t border-line px-6 py-28 lg:px-10 lg:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHead
          number="05"
          eyebrow="CONTACT"
          title="Let's build something useful."
          intro="Have an interesting opportunity, project, or idea? I'd love to hear about it."
        />

        <div className="grid gap-14 lg:grid-cols-[1fr_.8fr]">
          <Reveal>
            <div className="border-t border-line pt-7">
              <div className="text-[10px] font-semibold tracking-[0.18em] text-muted">
                REACH ME
              </div>

              <div className="mt-6 space-y-2">
                <a
                  className="contact-link"
                  href={`mailto:${site.email}`}
                >
                  <Mail size={18} />
                  {site.email}
                  <ArrowUpRight size={16} />
                </a>

                <a
                  className="contact-link"
                  href={site.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={18} />
                  GitHub
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <form
              onSubmit={submit}
              className="rounded-[2rem] border border-line bg-[#eeece5] p-6 sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="text-[10px] font-semibold tracking-[0.18em] text-muted"
                  >
                    NAME *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="mt-2 w-full border-b border-line bg-transparent py-3 outline-none placeholder:text-muted/60 focus:border-accent"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="text-[10px] font-semibold tracking-[0.18em] text-muted"
                  >
                    EMAIL *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="mt-2 w-full border-b border-line bg-transparent py-3 outline-none placeholder:text-muted/60 focus:border-accent"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="text-[10px] font-semibold tracking-[0.18em] text-muted"
                  >
                    PHONE *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 ..."
                    className="mt-2 w-full border-b border-line bg-transparent py-3 outline-none placeholder:text-muted/60 focus:border-accent"
                  />
                </div>

                {/* LinkedIn */}
                <div>
                  <label
                    htmlFor="linkedin"
                    className="text-[10px] font-semibold tracking-[0.18em] text-muted"
                  >
                    LINKEDIN
                  </label>
                  <input
                    id="linkedin"
                    name="linkedin"
                    type="url"
                    value={form.linkedin}
                    onChange={handleChange}
                    placeholder="linkedin.com/in/..."
                    className="mt-2 w-full border-b border-line bg-transparent py-3 outline-none placeholder:text-muted/60 focus:border-accent"
                  />
                </div>

                {/* GitHub */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="github"
                    className="text-[10px] font-semibold tracking-[0.18em] text-muted"
                  >
                    GITHUB
                  </label>
                  <input
                    id="github"
                    name="github"
                    type="url"
                    value={form.github}
                    onChange={handleChange}
                    placeholder="github.com/..."
                    className="mt-2 w-full border-b border-line bg-transparent py-3 outline-none placeholder:text-muted/60 focus:border-accent"
                  />
                </div>

              </div>

              {/* Quick Note */}
              <div className="mt-7">
                <label
                  htmlFor="message"
                  className="text-[10px] font-semibold tracking-[0.18em] text-muted"
                >
                  A QUICK NOTE
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Tell me a little about what you're working on..."
                  className="mt-4 w-full resize-none border-b border-line bg-transparent py-3 text-base outline-none placeholder:text-muted/60 focus:border-accent"
                />
              </div>

              <button
                type="submit"
                className="group mt-6 inline-flex items-center gap-3 rounded-full bg-ink px-5 py-3.5 text-sm font-semibold text-paper"
              >
                {sent ? "Opening email…" : "Send a note"}
                <Send
                  size={15}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5"
                />
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line px-6 py-7 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-xs text-muted sm:flex-row">
        <span className="font-display text-lg text-ink">Nandini Kurdekar <span className="text-accent"></span></span>
        <span>Built with curiosity and too many tabs.</span>
        <span>© 2026</span>
      </div>
    </footer>
  );
}

createRoot(document.getElementById("root")).render(<App />);