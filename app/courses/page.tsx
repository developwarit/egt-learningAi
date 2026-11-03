"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TypingCodeCard } from "../typing-code-card";
import { ArrowRight, Bot, BookOpen, Bug, ChartNoAxesCombined, Code, Cpu, Database, FolderKanban, Globe, GraduationCap, Hammer, Laptop, Lightbulb, Palette, PenLine, Rocket, Send, Settings, Sprout, Target, Zap } from "lucide-react";

const courseTabs = [
  { id: "software", label: "Software 💻", color: "bg-blue-500" },
  { id: "data", label: "Data 📊", color: "bg-purple-500" },
];

const courses = [
  {
    title: "HTML CSS Masterful",
    slug: "html-css-masterful",
    description: "ปูพื้นฐาน HTML และ CSS ตั้งแต่เริ่มต้น จนสร้างหน้าเว็บที่จัดวางได้จริง",
    tags: ["html", "css"],
    lessons: 92,
    duration: "8 ชม. 19 นาที",
    price: "ฟรี",
    status: "เปิดให้เรียนแล้ว",
    image: "/courses/html-css-masterful.jpg",
  },
  {
    title: "JavaScript Mastery",
    slug: "javascript-mastery",
    description: "คอร์ส JavaScript Mastery คอร์สที่จะพาทุกคนมาเป็น เซียน เขียนเว็บด้วย JavaScript ซึ่งเป็นอีกหนึ่งภาษาที่มีความสำคัญอย่างมากในการเป็น Web Developer",
    tags: ["javascript"],
    lessons: 55,
    duration: "6 ชม. 50 นาที",
    price: "ฟรี",
    status: "เปิดให้เรียนแล้ว",
    image: "/courses/javascript-mastery.jpg",
  },
  {
    title: "Figma to Code",
    slug: "figma-to-code",
    description: "แปลง Web Design จาก Figma ให้เป็นหน้าเว็บที่ใช้งานได้จริง ด้วย HTML CSS และ JavaScript",
    tags: ["figma", "design", "code"],
    lessons: 3,
    duration: "3 Ep",
    price: "ฟรี",
    status: "เปิดให้เรียนแล้ว",
    image: "/courses/figma-to-code.jpg",
  },
  {
    title: "NextJS ในยุค AI ปี 2026",
    slug: "nextjs-ai-2026",
    description: "เรียนรู้ Next.js สำหรับการพัฒนาเว็บสมัยใหม่ ด้วย AI Assistant ช่วยเขียนโค้ด",
    tags: ["nextjs", "react", "ai"],
    lessons: 13,
    duration: "เปิดให้เรียนแล้ว",
    price: "ฟรี",
    status: "เปิดให้เรียนแล้ว",
    image: "/nextjs-ai.png",
  },
  {
    title: "NodeJS สำหรับการพัฒนาเว็บสมัยใหม่",
    slug: "nodejs-modern-web",
    description: "เรียนรู้ Node.js สำหรับผู้เริ่มต้น พัฒนา Backend และ API สำหรับเว็บไซต์สมัยใหม่",
    tags: ["nodejs", "backend", "api"],
    lessons: 15,
    duration: "เปิดให้เรียนแล้ว",
    price: "ฟรี",
    status: "เปิดให้เรียนแล้ว",
    image: "/nodejs.png",
  },
  {
    title: "Vibe Coding for Non-Tech",
    slug: "vibe-coding-for-non-tech",
    description: "เรียนรู้โค้ดเบื้องต้นและสร้างโปรเจกต์ของตัวเองครั้งแรกไปพร้อมๆ กัน โดยไม่ต้องมีพื้นฐาน",
    tags: ["coding", "beginner"],
    lessons: 8,
    duration: "2 วัน",
    price: "ฟรี",
    status: "รอกำลังเปิดรับสมัคร",
    image: "/courses/vibe-coding.png",
  },
];

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      {children}
    </div>
  );
}


function FadeInWhenVisible({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

function HoverCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

function FloatingElement({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}

export default function CoursesPage() {
  const [user, setUser] = useState<{id:string;name:string|null;email:string;image:string|null} | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => setUser(d.user)).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/courses";
  };

  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "";

  return (
    <main className="min-h-screen bg-[#faf9f7] text-gray-900">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-[#faf9f7]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link
            href="/"
className="flex items-center gap-1"
          >
            <span className="text-lg font-bold tracking-tight text-gray-900">EGT-Learning</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <Link href="/courses" className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100">
              หน้าหลัก
            </Link>
            <Link href="/blog" className="rounded-full px-4 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900">
              บทความ
            </Link>
            <Link href="/community" className="rounded-full px-4 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900">
              ชุมชน
            </Link>
            <span className="rounded-full px-4 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900">
              <Link href="/contact">ติดต่อ</Link>
            </span>
          </div>
          {/* Hamburger Menu Button (Mobile) */}
          <button
            type="button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {showMobileMenu ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2563EB] text-sm font-bold text-white transition hover:bg-[#2563EB]/80"
                >
                  {user.image ? (
                    <img src={user.image} alt="" className="h-9 w-9 rounded-full object-cover" />
                  ) : (
                    initials
                  )}
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="text-sm font-semibold text-gray-900">{user.name || "ผู้ใช้"}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                      โปรไฟล์
                    </Link>
                    <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                      ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                เข้าสู่ระบบ
              </Link>
            )}
            
          </div>
        </div>
      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            <Link href="/courses" className="block rounded-lg px-4 py-3 text-left text-sm font-medium text-blue-600 bg-blue-50 transition hover:bg-blue-100">
              หน้าหลัก
            </Link>
            <Link href="/blog" className="block rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900">
              บทความ
            </Link>
            <Link href="/community" className="block rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900">
              ชุมชน
            </Link>
            <Link href="/contact" className="block rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900">
              ติดต่อ
            </Link>
          </nav>
        </div>
      )}
</header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
                        {/* Left Content */}
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <GraduationCap size={16} strokeWidth={2} aria-hidden />
                สำหรับนักศึกษาวิทยาลัยเทคนิค กฟผ.แม่เมาะ
              </p>
              <h1 className="mt-4 text-2xl font-black leading-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
                EGT-Learning<img
                  src="/rocket.svg"
                  alt=""
                  aria-hidden
                  className="ml-3 inline-block h-7 w-7 align-middle sm:h-10 sm:w-10"
                />
              </h1>
              <p className="mt-2 text-xl font-semibold text-orange-600">
                เรียนฟรี ลงมือทำจริง สร้างทักษะที่ใช้ได้จริง
              </p>
              <p className="mt-4 max-w-md text-base leading-relaxed text-gray-600">
                เรียนรู้ AI, Data และ Software Development ตั้งแต่พื้นฐาน
                พร้อมทำโปรเจกต์จริงและสร้าง Portfolio ระหว่างเรียน
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/courses/catalog"
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-gray-900 transition hover:bg-orange-600"
                >
                  เริ่มเรียนฟรี
                  <ArrowRight size={16} strokeWidth={2.5} aria-hidden />
                </Link>
              </div>
            </div>

            {/* Right Content - Code Editor */}
            <div className="flex min-w-0 justify-center lg:justify-end">
              <div className="w-full min-w-0 max-w-md"><TypingCodeCard /></div>
            </div>
          </div>
        </div>
      </section>

      
      
      {/* AI Tools */}
      <section className="py-12 bg-[#faf9f7]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">
            กลุ่มเครื่องมือ AI ที่ใช้บ่อยๆ
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {[
              { name: "ChatGPT", icon: "/icons/ai/chatgpt.svg" },
              { name: "Gemini", icon: "/icons/ai/gemini.svg" },
              { name: "Microsoft Copilot", icon: "/icons/ai/copilot.svg" },
              { name: "Claude", icon: "/icons/ai/claude.svg" },
              { name: "Perplexity", icon: "/icons/ai/perplexity.svg" },
              { name: "Cursor", icon: "/icons/ai/cursor.svg" },
            ].map((tool) => (
              <div key={tool.name} className="flex items-center gap-3">
                <img
                  src={tool.icon}
                  alt={tool.name}
                  className="h-8 w-8 object-contain"
                />
                <span className="text-sm font-semibold text-slate-800">
                  {tool.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* What You'll Learn */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-12">
            <p className="text-sm font-medium text-gray-500">What You'll Learn</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              เรียนอะไรบ้าง?
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-gray-300 hover:shadow-md">
              <Bot size={42} strokeWidth={1.8} className="mb-5 text-gray-700" />
              <h3 className="text-lg font-bold text-gray-900">AI & AI Tools</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                เรียนรู้การใช้ AI ให้เป็นเครื่องมือช่วยเรียนและทำงาน
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-gray-300 hover:shadow-md">
              <ChartNoAxesCombined size={42} strokeWidth={1.8} className="mb-5 text-gray-700" />
              <h3 className="text-lg font-bold text-gray-900">Data & Analytics</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                พื้นฐานการจัดการข้อมูล วิเคราะห์ข้อมูล และสร้าง Dashboard
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-gray-300 hover:shadow-md">
              <Laptop size={42} strokeWidth={1.8} className="mb-5 text-gray-700" />
              <h3 className="text-lg font-bold text-gray-900">Software Development</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                เรียนรู้การเขียนโปรแกรม พัฒนาเว็บไซต์ และสร้างระบบจริง
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-gray-300 hover:shadow-md">
              <Rocket size={42} strokeWidth={1.8} className="mb-5 text-gray-700" />
              <h3 className="text-lg font-bold text-gray-900">Real Projects</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                นำความรู้มาสร้างโปรเจกต์ที่สามารถนำไปใส่ Portfolio ได้
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Motivational Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 lg:px-10 text-center">
          <p className="text-sm font-medium text-gray-500">Why This Program?</p>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            ไม่ได้ทำมาเพื่อให้คุณจำโค้ด
          </h2>
          <p className="mt-4 text-2xl font-semibold text-orange-600">
            เราอยากให้คุณ สร้างเป็น
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-lg text-gray-700">
            <span>เรียนรู้</span>
            <span className="text-orange-500">→</span>
            <span>ทดลอง</span>
            <span className="text-orange-500">→</span>
            <span>ผิดพลาด</span>
            <span className="text-orange-500">→</span>
            <span>แก้ไข</span>
            <span className="text-orange-500">→</span>
            <span>สร้างโปรเจกต์</span>
          </div>
          <p className="mt-8 max-w-2xl mx-auto text-base leading-relaxed text-gray-600">
            เพราะทักษะที่ดีที่สุด ไม่ได้เกิดจากการดูอย่างเดียว แต่เกิดจากการลงมือทำ
          </p>
        </div>
      </section>

{/* Courses List - MilerDev Style */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">คอร์สเรียนล่าสุด</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                เลือกจากเนื้อหา และ บททดลองจริง
              </h2>
            </div>
            <Link href="/courses/catalog" className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100">
              ดูคอร์สทั้งหมด →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {courses.slice(0, 4).map((course, index) => (
              <Link key={course.title}
                href={`/courses/${course.slug}`}
                className="group block rounded-2xl border border-gray-200 bg-white overflow-hidden transition hover:border-gray-300 hover:shadow-lg"
                >
                {/* Course Image */}
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                  {/* Free Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-900 backdrop-blur">
                      ดูในเบื้องต้นฟรี
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-5">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {course.tags.map((tag: string) => (
                      <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">{course.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 line-clamp-2">{course.description}</p>
                  
                  {/* Meta */}
                  <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {course.lessons} บทเรียน
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                      </svg>
                      {course.duration}
                    </span>
                  </div>
                  
                  {/* Price + CTA */}
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-xl font-bold text-gray-900">{course.price === "ฟรี" ? "ฟรี" : `฿${course.price}`}</span>
                    <span className="text-sm font-semibold text-blue-600 transition group-hover:text-blue-700">
                      ดูรายละเอียด →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/courses/catalog" className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100">
              ดูคอร์สทั้งหมด →
            </Link>
          </div>
        </div>
      </section>

      {/* Why We Built This */}
      <section className="py-16 bg-[#faf9f7]">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 lg:px-10 text-center">
          <p className="text-sm font-medium text-gray-500">Why We Built This</p>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            ทำไมเราถึงสร้างเว็บไซต์นี้?
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-base leading-relaxed text-gray-600">
            การเริ่มต้นเขียนโค้ดอาจดูยากในช่วงแรก ทั้งคำศัพท์ เทคโนโลยี เครื่องมือ และโปรเจกต์ที่ไม่รู้ว่าจะเริ่มจากตรงไหน
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed text-gray-600">
            เว็บไซต์นี้จึงถูกสร้างขึ้นเพื่อเป็นพื้นที่เล็ก ๆ สำหรับรวบรวมความรู้ เครื่องมือ และประสบการณ์จากการเรียนรู้จริง
            เพื่อให้ทุกคนสามารถเข้ามาเรียนรู้และนำไปทดลองสร้างโปรเจกต์ของตัวเองได้
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-lg font-semibold text-gray-700">
            <span>เรียนรู้</span>
            <span className="text-orange-500">→</span>
            <span>ลงมือทำ</span>
            <span className="text-orange-500">→</span>
            <span>สร้างผลงาน</span>
            <span className="text-orange-500">→</span>
            <span>แบ่งปัน</span>
          </div>
        </div>
      </section>

      {/* Who Is This For? */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-12 text-center">
            <p className="text-sm font-medium text-gray-500">Who Is This For?</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              เว็บนี้เหมาะกับใคร?
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-[#faf9f7] p-6 transition hover:border-gray-300 hover:shadow-md">
              <Sprout size={36} strokeWidth={1.8} className="text-gray-700" />
              <h3 className="mt-4 text-lg font-bold text-gray-900">มือใหม่</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                ยังไม่เคยเขียนโค้ด และไม่รู้ว่าจะเริ่มจากตรงไหน
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-[#faf9f7] p-6 transition hover:border-gray-300 hover:shadow-md">
              <GraduationCap size={36} strokeWidth={1.8} className="text-gray-700" />
              <h3 className="mt-4 text-lg font-bold text-gray-900">นักศึกษา</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                อยากฝึกทักษะเพิ่มเติมและมีโปรเจกต์ใส่ Portfolio
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-[#faf9f7] p-6 transition hover:border-gray-300 hover:shadow-md">
              <Zap size={36} strokeWidth={1.8} className="text-gray-700" />
              <h3 className="mt-4 text-lg font-bold text-gray-900">Vibe Coder</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                อยากใช้ AI ช่วยสร้าง ทดลอง และต่อยอดโปรเจกต์
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-[#faf9f7] p-6 transition hover:border-gray-300 hover:shadow-md">
              <Target size={36} strokeWidth={1.8} className="text-gray-700" />
              <h3 className="mt-4 text-lg font-bold text-gray-900">คนที่อยากสร้างโปรเจกต์</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                มีไอเดียแต่ยังไม่รู้ว่าจะเปลี่ยนไอเดียให้เป็นโปรแกรมได้อย่างไร
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Roadmap */}
      <section className="py-16 bg-[#faf9f7]">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 lg:px-10">
          <div className="mb-12 text-center">
            <p className="text-sm font-medium text-gray-500">Learning Path</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
               Learning Roadmap
            </h2>
            <p className="mt-4 text-gray-600">จาก 0 → สร้างโปรเจกต์ได้</p>
          </div>

          <div className="relative">
            {/* Roadmap Items */}
            <div className="space-y-6">
              {[
                { step: "START", label: "เริ่มต้น", icon: Target },
                { step: "1", label: "พื้นฐาน Programming", icon: Code },
                { step: "2", label: "Web Development / Data", icon: Globe },
                { step: "3", label: "Frontend / Analytics", icon: Palette },
                { step: "4", label: "Backend / Database", icon: Settings },
                { step: "5", label: "Build Project", icon: Hammer },
                { step: "6", label: "Portfolio", icon: FolderKanban },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700">
                    <item.icon size={20} strokeWidth={1.8} aria-hidden />
                  </div>
                  <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-sm text-gray-500">Step {item.step}</p>
                    <p className="font-semibold text-gray-900">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vibe Coding */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-12 text-center">
            <p className="text-sm font-medium text-gray-500">Vibe Coding</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
               Vibe Coding
            </h2>
            <p className="mt-4 text-gray-600">จากไอเดีย → สู่โปรเจกต์จริง ด้วย AI</p>
          </div>

          <div className="space-y-4">
            {[
              { num: "01", title: "Vibe Coding คืออะไร?", icon: Lightbulb, desc: "ทำความเข้าใจแนวคิด และรู้ว่า AI ช่วยเราได้อย่างไร" },
              { num: "02", title: "เริ่มสร้างเว็บไซต์ด้วย AI", icon: Globe, desc: "สร้างเว็บไซต์แรกตั้งแต่ไอเดียจนเป็นหน้าเว็บจริง" },
              { num: "03", title: "เขียน Prompt ให้ AI เข้าใจ", icon: PenLine, desc: "เรียนรู้วิธีสื่อสารกับ AI เพื่อให้ได้ผลลัพธ์ที่ต้องการ" },
              { num: "04", title: "Debug ด้วย AI", icon: Bug, desc: "เมื่อ Code มีปัญหา เรียนรู้วิธีหาและแก้ Bug อย่างเป็นระบบ" },
              { num: "05", title: "เข้าใจ Code ที่ AI สร้าง", icon: BookOpen, desc: "อ่าน วิเคราะห์ และปรับ Code ให้เป็น Code ที่เราเข้าใจ" },
            ].map((item, i) => (
              <div key={i} className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-md">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                  {item.num}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
                <item.icon size={20} strokeWidth={1.8} className="hidden shrink-0 text-gray-400 sm:block" aria-hidden />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Real Projects */}
      <section className="py-16 bg-[#faf9f7]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-12 text-center">
            <p className="text-sm font-medium text-gray-500">Real Projects</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
               จากการเรียน → สู่การสร้าง
            </h2>
            <p className="mt-4 text-gray-600">เรียนรู้จากการลงมือทำ และเปลี่ยนความรู้ให้กลายเป็นผลงานจริง</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "AI Chatbot", tech: "Next.js · AI · Supabase", desc: "โปรเจกต์ฝึกสร้าง Chatbot โดยใช้ AI เป็นตัวช่วย", status: "เสร็จแล้ว", image: "/projects/ai-chatbot.png" },
              { title: "Portfolio Website", tech: "React · Tailwind", desc: "เว็บไซต์ Portfolio สำหรับแสดงผลงาน", status: "เสร็จแล้ว", image: "/projects/portfolio.png" },
              { title: "Dashboard App", tech: "Next.js · PostgreSQL", desc: "แดชบอร์ดสำหรับจัดการข้อมูล", status: "กำลังพัฒนา", image: "/projects/dashboard.png" },
            ].map((project, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white overflow-hidden transition hover:border-gray-300 hover:shadow-md">
                <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                  <div className="mt-2 flex items-center justify-between gap-2"><p className="text-xs font-medium text-gray-500">{project.tech}</p><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{project.status}</span></div>
                  <p className="mt-2 text-sm text-gray-600">{project.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
              อยากสร้างโปรเจกต์แบบนี้? คุยกับเรา
              <ArrowRight size={16} strokeWidth={2} aria-hidden />
            </a>
          </div>
        </div>
      </section>

      {/* Submit Project CTA */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 lg:px-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            มีโปรเจกต์ของตัวเองแล้ว?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            ไม่ว่าจะเป็นโปรเจกต์เล็กหรือใหญ่
            มาแบ่งปันสิ่งที่คุณสร้าง และประสบการณ์ที่ได้เรียนรู้กับคนอื่น
          </p>
          <Link href="/submit-project" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-4 text-lg font-bold text-white transition hover:bg-orange-600">
            ส่งโปรเจกต์ของฉัน
            <ArrowRight size={18} strokeWidth={2.5} aria-hidden />
          </Link>
        </div>
      </section>


      {/* Resources */}
      <section className="py-16 bg-[#faf9f7]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-12 text-center">
            <p className="text-sm font-medium text-gray-500">Resources</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
               แหล่งเรียนรู้
            </h2>
            <p className="mt-4 text-gray-600">เครื่องมือและแหล่งเรียนรู้ที่ช่วยให้การเริ่มต้นง่ายขึ้น</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Bot, title: "AI Tools", desc: "เครื่องมือ AI สำหรับช่วยเรียนรู้และทำงาน" },
              { icon: Code, title: "Development", desc: "เครื่องมือสำหรับนักพัฒนา" },
              { icon: Palette, title: "Design", desc: "เครื่องมือออกแบบ UI/UX" },
              { icon: ChartNoAxesCombined, title: "Data", desc: "เครื่องมือวิเคราะห์ข้อมูล" },
              { icon: Database, title: "Database", desc: "ระบบฐานข้อมูลสำหรับโปรเจกต์" },
              { icon: Cpu, title: "Vibe Coding", desc: "เครื่องมือสำหรับการเขียนโค้ดด้วย AI" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-md">
                  <Icon size={28} strokeWidth={1.8} className="text-gray-700" />
                  <div>
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Student Showcase */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
               ตัวอย่างผลงานนักเรียน
            </h2>
            <p className="mt-4 text-gray-600">
              ผลงานนักเรียนที่เริ่มจาก 0
            </p>
            <p className="mt-2 text-gray-600">
              เห็นได้ชัดว่าพวกเขาสร้างเว็บของตัวเองได้ใน 5 เดือน พร้อมกันไปเป็น Portfolio เพื่อใช้สมัครงาน
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Major Cineplex", desc: "เว็บจองตั๋วภาพยนตร์", image: "/showcase/major-cineplex.jpg" },
              { name: "Neatly", desc: "เว็บไซต์จองที่พัก", image: "/showcase/neatly.png" },
              { name: "Pet Sitter", desc: "บริการดูแลสัตว์เลี้ยง", image: "/showcase/pet-sitter.webp" },
              { name: "Snake Game", desc: "เกมงูแบบ Online", image: "/showcase/snake-game.png" },
            ].map((project, i) => (
              <HoverCard key={i}><div className="rounded-2xl border border-gray-200 bg-[#faf9f7] overflow-hidden transition hover:border-gray-300 hover:shadow-md">
                <div className="flex h-40 items-center justify-center overflow-hidden bg-gray-100">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Target size={48} strokeWidth={1.5} className="text-gray-400" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-600">{project.desc}</p>
                </div>
              </div></HoverCard>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 bg-[#faf9f7]">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] items-center">
            <div>
              <h2 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                พื้นฐานที่แกะแยกออกจากความกลัว
              </h2>
              <p className="mt-4 text-2xl font-bold text-blue-600">
                รู้รอด ทำเป็นงาน พร้อมเติบโตไปกับ AI
              </p>
            </div>
            <div className="text-gray-600 leading-relaxed">
              <p>
                เราไม่ได้สอนให้จำโค้ด แต่สอนให้คิดเป็น ลงมือทำเป็น และสร้างโปรเจกต์จริงได้
                ไม่ว่าจะเป็น AI, Data หรือ Software Development — ทุกคนเริ่มจากศูนย์ได้
              </p>
              <p className="mt-4">
                เพราะเราเชื่อว่าทุกคนมีศักยภาพในการเรียนรู้ และสร้างสิ่งใหม่ๆ ได้เสมอ
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Share Knowledge */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 lg:px-10 text-center">
          <p className="text-sm font-medium text-gray-500">Community</p>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            อยากช่วยแบ่งปัน?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed text-gray-600">
            เว็บไซต์นี้เกิดจากการเรียนรู้และประสบการณ์จริง
            ถ้าคุณมีบทเรียน เทคนิค หรือโปรเจกต์ที่อยากแบ่งปัน
            สามารถส่งมาให้คนอื่นเรียนรู้ต่อได้
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/community" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
              <PenLine size={16} strokeWidth={2} aria-hidden />
              แชร์ความรู้
            </Link>
            <Link href="/submit-project" className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100">
              <Send size={16} strokeWidth={2} aria-hidden />
              ส่งโปรเจกต์
            </Link>
          </div>
        </div>
      </section>

      {/* Start From Zero */}
      <section className="py-16 bg-[#faf9f7]">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 lg:px-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            เริ่มจากศูนย์ก็สร้างได้
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed text-gray-600">
            ไม่จำเป็นต้องรู้ทุกอย่างก่อนเริ่ม
            เรียนรู้ทีละขั้น ลงมือทำจริง และใช้ AI เป็นเครื่องมือช่วยคิด
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed text-gray-600">
            เพราะโปรเจกต์แรกไม่จำเป็นต้องสมบูรณ์แบบ
            แค่เริ่มสร้าง ก็ถือว่าเริ่มเรียนรู้แล้ว
          </p>
          <a href="/courses/catalog" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-4 text-lg font-bold text-white transition hover:bg-orange-600">
            เริ่มเรียนฟรี
            <ArrowRight size={18} strokeWidth={2.5} aria-hidden />
          </a>
        </div>
      </section>


      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-xs">
              <p className="text-lg font-bold tracking-tight text-gray-900">EGT-Learning</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                เรียน AI, Data และ Software Development ด้วยการลงมือทำโปรเจกต์จริง
              </p>
            </div>
            <nav className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm sm:grid-cols-3">
              <Link href="/courses/catalog" className="text-gray-600 transition hover:text-gray-900">คอร์สทั้งหมด</Link>
              <Link href="/blog" className="text-gray-600 transition hover:text-gray-900">บทความ</Link>
              <Link href="/community" className="text-gray-600 transition hover:text-gray-900">ชุมชน</Link>
              <Link href="/contact" className="text-gray-600 transition hover:text-gray-900">ติดต่อ</Link>
              <Link href="/login" className="text-gray-600 transition hover:text-gray-900">เข้าสู่ระบบ</Link>
              <Link href="/register" className="text-gray-600 transition hover:text-gray-900">สมัครเรียน</Link>
            </nav>
          </div>
          <p className="mt-10 border-t border-gray-100 pt-6 text-xs text-gray-500">
            © {new Date().getFullYear()} EGT-Learning
          </p>
        </div>
      </footer>
      
    </main>
  );
}
