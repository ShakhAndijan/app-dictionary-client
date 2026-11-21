// Frontend roadmap (source: Frontend-roadmap-kunlik.docx). One topic = one study day. Names only until lessons are written.
export interface PlanModule { key: string; icon: string; title: string; days: number; star: boolean; src: string; topics: string[]; }
export const PLAN: PlanModule[] = [
 {
  "key": "internet",
  "icon": "🌐",
  "title": "Internet",
  "days": 5,
  "star": false,
  "src": "MDN: How the web works",
  "topics": [
   "Internet qanday ishlaydi",
   "HTTP chuqur",
   "HTTP versiyalari va HTTPS",
   "DNS, domen, hosting, CDN",
   "Brauzer qanday ishlaydi"
  ]
 },
 {
  "key": "html",
  "icon": "🧱",
  "title": "HTML",
  "days": 8,
  "star": false,
  "src": "MDN HTML",
  "topics": [
   "Hujjat tuzilishi va semantika",
   "Matn, havolalar, ro'yxatlar",
   "Formalar 1",
   "Formalar 2",
   "Jadvallar va media",
   "Interaktiv elementlar",
   "SEO va meta",
   "HTML takrori"
  ]
 },
 {
  "key": "css",
  "icon": "🎨",
  "title": "CSS",
  "days": 24,
  "star": true,
  "src": "MDN CSS",
  "topics": [
   "Selectorlar",
   "Cascade va specificity",
   "Inheritance va @layer",
   "Box model",
   "Birliklar va funksiyalar",
   "Display va normal flow",
   "Ranglar va fon",
   "Tipografiya",
   "Flexbox 1",
   "Flexbox 2",
   "Grid 1",
   "Grid 2",
   "Grid 3",
   "Positioning",
   "Stacking context va z-index",
   "Overflow va scroll",
   "Responsive dizayn",
   "Container queries",
   "Custom properties",
   "Zamonaviy selectorlar va nesting",
   "Transform va transition",
   "Animatsiya",
   "CSS arxitekturasi",
   "CSS takrori"
  ]
 },
 {
  "key": "javascript",
  "icon": "⚡",
  "title": "JavaScript",
  "days": 43,
  "star": true,
  "src": "javascript.info",
  "topics": [
   "JS qanday ishlaydi",
   "O'zgaruvchilar va tiplar",
   "Type coercion",
   "Raqamlar va satrlar",
   "Operatorlar va boshqaruv",
   "Funksiyalar asoslari",
   "Execution context va call stack",
   "Scope",
   "Hoisting va TDZ",
   "Closure 1",
   "Closure 2",
   "this 1",
   "this 2",
   "Obyektlar 1",
   "Obyektlar 2",
   "Prototype 1",
   "Prototype 2",
   "Class",
   "Massivlar 1",
   "Massivlar 2",
   "Funksional dasturlash",
   "Map, Set va Weak kolleksiyalar",
   "Symbol va iterator",
   "Generatorlar",
   "Xatolar",
   "Event loop 1",
   "Event loop 2",
   "Callback va Promise",
   "Promise kombinatorlari",
   "async/await",
   "Fetch va AbortController",
   "Modullar",
   "DOM 1",
   "DOM 2",
   "Hodisalar 1",
   "Hodisalar 2",
   "Timerlar, debounce, throttle",
   "Xotira boshqaruvi",
   "Regular expressions",
   "JSON, Date, Intl",
   "Design patterns",
   "JS takrori 1",
   "JS takrori 2"
  ]
 },
 {
  "key": "git",
  "icon": "🌿",
  "title": "Git va GitHub",
  "days": 5,
  "star": false,
  "src": "Pro Git",
  "topics": [
   "Git ichki tuzilishi",
   "Asosiy buyruqlar",
   "Branch, merge, rebase",
   "Kengaytirilgan Git",
   "GitHub ish oqimi"
  ]
 },
 {
  "key": "npm",
  "icon": "📦",
  "title": "Paket menejerlar",
  "days": 2,
  "star": false,
  "src": "docs.npmjs.com",
  "topics": [
   "npm chuqur",
   "pnpm, yarn, bun, workspaces"
  ]
 },
 {
  "key": "react",
  "icon": "⚛️",
  "title": "React",
  "days": 33,
  "star": true,
  "src": "react.dev",
  "topics": [
   "React falsafasi",
   "JSX",
   "Komponent va props",
   "Shartli render va ro'yxatlar",
   "State asoslari",
   "State'ni yangilash",
   "Render va commit",
   "Reconciliation va key",
   "Hodisalar",
   "Formalar",
   "State'ni loyihalash",
   "Komponent kompozitsiyasi",
   "useEffect 1",
   "useEffect 2",
   "useRef",
   "useReducer",
   "Context",
   "Context + reducer",
   "Custom hook'lar 1",
   "Custom hook'lar 2",
   "TanStack Query 1",
   "TanStack Query 2",
   "Client state: Zustand, Redux Toolkit",
   "React Router 1",
   "React Router 2",
   "Performance 1",
   "Performance 2",
   "Error boundary va Suspense",
   "Qo'shimcha API'lar",
   "React 19",
   "Server Components va React Compiler",
   "React patterns",
   "React takrori"
  ]
 },
 {
  "key": "tailwind",
  "icon": "💨",
  "title": "Zamonaviy CSS: Tailwind",
  "days": 4,
  "star": false,
  "src": "tailwindcss.com",
  "topics": [
   "Tailwind asoslari",
   "Tailwind chuqur",
   "shadcn/ui va Radix",
   "CSS-in-JS va CSS Modules"
  ]
 },
 {
  "key": "typescript",
  "icon": "🔷",
  "title": "TypeScript",
  "days": 16,
  "star": true,
  "src": "TypeScript Handbook",
  "topics": [
   "TS va kompilyator",
   "Asosiy tiplar",
   "Obyekt tiplari",
   "Union va intersection",
   "Narrowing",
   "Type guards va discriminated unions",
   "Funksiya tiplari",
   "Generics",
   "keyof, typeof, indexed access",
   "Utility types",
   "Mapped types",
   "Conditional types va infer",
   "Template literal types va satisfies",
   "React + TypeScript",
   "Zod va .d.ts",
   "TypeScript takrori"
  ]
 },
 {
  "key": "security",
  "icon": "🛡️",
  "title": "Web xavfsizlik",
  "days": 5,
  "star": true,
  "src": "OWASP Top 10",
  "topics": [
   "Same-origin policy va CORS",
   "XSS",
   "CSRF, clickjacking, CSP",
   "Cookie va token xavfsizligi",
   "OWASP Top 10 va dependency xavfsizligi"
  ]
 },
 {
  "key": "build",
  "icon": "🛠️",
  "title": "Build vositalari va linterlar",
  "days": 5,
  "star": false,
  "src": "vite.dev",
  "topics": [
   "Bundlerlar nazariyasi",
   "Vite chuqur",
   "esbuild, swc, Rolldown va bundle tahlili",
   "ESLint, Prettier, Biome",
   "Husky, lint-staged, CI"
  ]
 },
 {
  "key": "testing",
  "icon": "🧪",
  "title": "Testlash",
  "days": 10,
  "star": true,
  "src": "testing-library.com",
  "topics": [
   "Test nazariyasi",
   "Vitest 1",
   "Vitest 2",
   "React Testing Library 1",
   "React Testing Library 2",
   "Async testlar va MSW",
   "Hook va context testlari",
   "Playwright 1",
   "Playwright 2",
   "Coverage, CI va TDD"
  ]
 },
 {
  "key": "nextjs",
  "icon": "▲",
  "title": "SSR va Next.js",
  "days": 16,
  "star": true,
  "src": "nextjs.org/learn",
  "topics": [
   "Rendering strategiyalari",
   "App Router asoslari",
   "Murakkab routing",
   "loading, error, navigatsiya",
   "Server Components chuqur",
   "Client Components",
   "Data fetching",
   "Caching",
   "Server Actions",
   "Route handlers va middleware",
   "Streaming va Suspense",
   "Metadata, rasmlar, shriftlar",
   "Next.js performance",
   "Astro",
   "SSG alternativalari va TanStack Start",
   "Next.js takrori"
  ]
 },
 {
  "key": "auth",
  "icon": "🔐",
  "title": "Autentifikatsiya",
  "days": 4,
  "star": false,
  "src": "auth0.com/docs",
  "topics": [
   "Autentifikatsiya va avtorizatsiya",
   "JWT",
   "OAuth 2.0, OpenID Connect, SSO",
   "Auth.js va role-based access"
  ]
 },
 {
  "key": "deploy",
  "icon": "🚀",
  "title": "Deployment",
  "days": 2,
  "star": false,
  "src": "vercel.com/docs",
  "topics": [
   "Vercel va Netlify",
   "Cloudflare, Render, GitHub Pages, Docker"
  ]
 },
 {
  "key": "webapis",
  "icon": "🧩",
  "title": "Web API'lar, Web Components, PWA",
  "days": 7,
  "star": false,
  "src": "MDN Web APIs",
  "topics": [
   "Storage API'lar",
   "Observer'lar",
   "Boshqa brauzer API'lari",
   "WebSocket va SSE",
   "Web Components",
   "Service Worker",
   "PWA va Web Workers"
  ]
 },
 {
  "key": "graphql",
  "icon": "🕸️",
  "title": "GraphQL",
  "days": 3,
  "star": false,
  "src": "graphql.org/learn",
  "topics": [
   "GraphQL asoslari",
   "Apollo Client",
   "Codegen va Relay"
  ]
 },
 {
  "key": "performance",
  "icon": "⏱️",
  "title": "Performance",
  "days": 8,
  "star": true,
  "src": "web.dev/learn/performance",
  "topics": [
   "Performance'ni o'lchash",
   "Core Web Vitals",
   "Lighthouse va Performance paneli",
   "Critical rendering path",
   "Rasm va shrift optimizatsiyasi",
   "Kesh",
   "Runtime performance",
   "Performance budget va monitoring"
  ]
 },
 {
  "key": "a11y",
  "icon": "♿",
  "title": "Accessibility va Design Systems",
  "days": 6,
  "star": false,
  "src": "WCAG 2.2",
  "topics": [
   "A11y asoslari va WCAG 2.2",
   "Klaviatura va fokus",
   "ARIA va screen reader",
   "Accessible komponentlar",
   "Design system",
   "Storybook"
  ]
 },
 {
  "key": "mobile",
  "icon": "📱",
  "title": "Mobil ilovalar: React Native",
  "days": 7,
  "star": false,
  "src": "docs.expo.dev",
  "topics": [
   "RN arxitekturasi",
   "Komponentlar va stillar",
   "Expo Router",
   "Ro'yxatlar va performance",
   "Native API'lar",
   "Animatsiya",
   "Build va nashr"
  ]
 },
 {
  "key": "desktop",
  "icon": "🖥️",
  "title": "Desktop ilovalar",
  "days": 1,
  "star": false,
  "src": "tauri.app",
  "topics": [
   "Electron va Tauri"
  ]
 },
 {
  "key": "ai",
  "icon": "🤖",
  "title": "AI bilan frontend",
  "days": 4,
  "star": false,
  "src": "roadmap.sh AI",
  "topics": [
   "LLM va prompting",
   "AI yordamchilar, MCP, agentlar",
   "AI bilan refactoring va review",
   "AI'ni ilovaga qo'shish"
  ]
 },
 {
  "key": "final",
  "icon": "🏁",
  "title": "Yakuniy takror",
  "days": 3,
  "star": true,
  "src": "Barcha konspektlar",
  "topics": [
   "Umumiy takror: JS va CSS",
   "Umumiy takror: React, TS, Next.js",
   "Portfolio va mock intervyu"
  ]
 }
];

export const PLAN_GROUPS: { title: string; keys: string[] }[] = [{"title":"Poydevor","keys":["internet","html","css"]},{"title":"JavaScript","keys":["javascript"]},{"title":"Ish vositalari","keys":["git","npm"]},{"title":"React dunyosi","keys":["react","tailwind","typescript"]},{"title":"Sifat va xavfsizlik","keys":["security","build","testing"]},{"title":"Full-stack frontend","keys":["nextjs","auth","deploy"]},{"title":"Chuqurlashish","keys":["webapis","graphql","performance","a11y"]},{"title":"Kengayish va yakun","keys":["mobile","desktop","ai","final"]}];
