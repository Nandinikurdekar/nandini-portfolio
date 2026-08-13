export const site = {
  name: "Nandini",
  fullName: "Nandini Kurdekar",
  email: "nandinikurdekar5@gmail.com",
  github: "https://github.com/Nandinikurdekar",
  linkedin: "",
  resume: "",
  eyebrow: "COMPUTER ENGINEERING · BUILDER · LEARNER",
  hero: "I build things to understand how they work.",
  about: [
    "I'm a final-year Computer Engineering student interested in building practical software and learning by taking ideas from a rough problem to a working system.",
    "My projects span software development, AI and computer vision, data-oriented work, and hands-on cybersecurity learning. I enjoy moving between the product layer and the technical details underneath it."
  ]
};

export const skills = [
  { category: "Languages", items: ["Python", "JavaScript", "C/C++"] },
  { category: "Frontend", items: ["React", "HTML", "CSS", "Tailwind CSS"] },
  { category: "Backend", items: ["Node.js", "Express.js", "FastAPI", "Flask", "PHP"] },
  { category: "Databases", items: ["MySQL", "MongoDB", "SQLite"] },
  { category: "AI / ML", items: ["Machine Learning", "Computer Vision", "OpenCV", "scikit-learn", "NumPy", "Pandas"] },
  { category: "Data", items: ["Data Analysis", "Data Visualization", "Power BI"] },
  { category: "Security", items: ["Linux", "Network Security", "SOC Fundamentals", "Threat Analysis", "TryHackMe"] },
  { category: "Tools", items: ["Git", "GitHub", "VS Code", "Streamlit"] }
];

export const projects = [
  {
    id: "01",
    name: "NightVision AI",
    kind: "FLAGSHIP · COMPUTER VISION",
    repo: "https://github.com/Nandinikurdekar/NightVisionAI",
    accent: "blue",
    featured: true,
    summary: "A low-light vision enhancement platform built around live camera input and an enhancement pipeline.",
    problem: "Low-light frames can hide useful visual information. This project explores how software can process a live camera stream to improve visibility.",
    approach: "The repository is organized around a camera layer, enhancement/model management, an engine that connects the pieces, evaluation, detection, training, and model components.",
    technologies: ["Python", "OpenCV", "Computer Vision"],
    features: ["Live webcam input", "Low-light enhancement pipeline", "Model management", "Evaluation and training structure"],
    visual: "enhancement"
  },
  {
    id: "02",
    name: "EmpowHer",
    kind: "PRODUCT FOUNDATION · WEB / BACKEND",
    repo: "https://github.com/Nandinikurdekar/EmpowHer",
    accent: "sage",
    summary: "Backend foundation for a women entrepreneurship support platform, built around structured user, business and community data.",
    problem: "The project is designed as a foundation for connecting entrepreneurs with profiles, businesses, community posts and connections.",
    approach: "The current repository contains a Node.js/Express backend with a MySQL connection layer and a schema organized around users, entrepreneur profiles, business profiles, connections and community content.",
    technologies: ["Node.js", "Express.js", "MySQL", "JWT", "bcrypt"],
    features: ["REST backend foundation", "MySQL connection pool", "User and entrepreneur data model", "Community-oriented schema"],
    visual: "network"
  },
  {
    id: "03",
    name: "MedBridge",
    kind: "WEB APP · MULTILINGUAL",
    repo: "https://github.com/Nandinikurdekar/medbridge",
    accent: "warm",
    summary: "A multilingual patient intake system that collects symptoms and produces structured patient reports.",
    problem: "Medical intake can become harder when language and input formats vary. MedBridge explores a simpler, multilingual intake flow.",
    approach: "A responsive HTML/CSS/JavaScript interface sends structured form data to a PHP backend, stores records in MySQL, and provides a patient-record view and report generation.",
    technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    features: ["Multilingual support", "Voice input for notes", "MySQL storage", "Patient record dashboard", "Downloadable report"],
    visual: "form"
  },
  {
    id: "04",
    name: "Podcast Web",
    kind: "FRONTEND · REACT",
    repo: "https://github.com/Nandinikurdekar/podcast-web",
    accent: "blue",
    summary: "A modern podcast streaming UI focused on interaction, search and a compact player experience.",
    problem: "The project explores how a media-heavy interface can stay simple while still supporting useful playback interactions.",
    approach: "Built with React and Tailwind CSS, with Framer Motion used for interface animation.",
    technologies: ["React", "Tailwind CSS", "Framer Motion"],
    features: ["Podcast playback UI", "Expandable mini player", "Favorites", "Search", "Smooth animations"],
    visual: "player"
  },
  {
    id: "05",
    name: "Driver Drowsiness Detection",
    kind: "COMPUTER VISION",
    repo: "https://github.com/Nandinikurdekar/driver-drowsiness-detection",
    accent: "sage",
    summary: "A real-time drowsiness detection experiment using OpenCV and Haar cascade classifiers.",
    problem: "Driver fatigue is a visual signal that can be explored through face and eye detection from a camera feed.",
    approach: "The project uses OpenCV with frontal-face and eye Haar cascade models to process a live visual stream.",
    technologies: ["Python", "OpenCV", "NumPy", "Pillow"],
    features: ["Real-time camera processing", "Face detection", "Eye detection"],
    visual: "vision"
  },
  {
    id: "06",
    name: "SecurePass Analyzer",
    kind: "SECURITY · FLASK",
    repo: "https://github.com/Nandinikurdekar/SecurePass-Analyzer",
    accent: "warm",
    summary: "A small Flask service that evaluates password strength against concrete composition criteria.",
    problem: "Password strength is easier to reason about when the feedback explains which criteria are satisfied.",
    approach: "The Flask backend checks length, uppercase, lowercase, numeric and special-character requirements and returns structured feedback.",
    technologies: ["Python", "Flask", "Flask-CORS", "Regex"],
    features: ["Password criteria checks", "Structured JSON response", "Strength feedback"],
    visual: "security"
  }
];

export const journey = [
  {
    title: "Computer Engineering",
    text: "Building a broad technical base through engineering coursework and hands-on development."
  },
  {
    title: "Software Development",
    text: "Turning ideas into working interfaces, backends, databases and small full-stack systems."
  },
  {
    title: "AI / Machine Learning",
    text: "Exploring machine learning and computer vision through projects such as NightVision AI and drowsiness detection."
  },
  {
    title: "Data",
    text: "Learning data analysis and visualization alongside software development."
  },
  {
    title: "Cybersecurity",
    text: "Currently exploring security concepts, SOC fundamentals, network security and practical labs."
  }
];
