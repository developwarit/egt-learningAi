"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CourseDetailPage() {
  return (
    <main className="min-h-screen bg-[#faf9f7] text-gray-900">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-[#faf9f7]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link
            href="/courses"
            className="font-mono text-sm font-semibold tracking-[0.18em] text-gray-900 transition hover:text-gray-700"
          >
            EGT-Learning
          </Link>
          <Link
            href="/courses"
            className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 text-sm font-medium text-gray-600 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-gray-300 hover:text-gray-900 hover:shadow-md active:translate-y-0"
          >
            <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            กลับหน้าคอร์ส
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 lg:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-black text-gray-900 sm:text-6xl">
              คอร์ส
            </h1>
            <h2 className="mt-2 text-4xl font-bold text-purple-600 sm:text-5xl">
              Vibe Coding for Non-Tech
            </h2>
            
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-white font-semibold">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                รอกำลังเปิดรับสมัคร
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ระยะเวลาเรียน: 2 วัน (On-site)
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
                หมวดหมู่: Software Development
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
          >
            {/* Intro Message */}
            <div className="rounded-xl bg-purple-50 p-6 mb-8">
              <p className="text-lg text-gray-800 leading-relaxed">
                💡 เรียนรู้โค้ดเบื้องต้นและสร้างโปรเจกต์ของตัวเองครั้งแรกไปพร้อมๆ กัน โดยไม่ต้องมีพื้นฐาน — เปลี่ยนไอเดียให้เป็นเว็บไซต์จริง!
              </p>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                คอร์สนี้สำหรับมือใหม่ที่ไม่เคยเขียนโค้ดมาก่อน แต่อยากสร้างเว็บไซต์หรือโปรเจกต์ของตัวเอง 🚀
              </p>
              <p>
                คุณจะได้เรียนรู้:
              </p>
              <ul className="space-y-3 ml-6">
                <li className="flex items-start gap-3">
                  <span className="text-purple-500 mt-1">✅</span>
                  <span>พื้นฐาน HTML, CSS และ JavaScript</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-500 mt-1">✅</span>
                  <span>วิธีใช้ AI ช่วยเขียนโค้ด (Vibe Coding)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-500 mt-1">✅</span>
                  <span>สร้างเว็บไซต์แรกของตัวเองตั้งแต่ศูนย์</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-500 mt-1">✅</span>
                  <span>เรียนรู้วิธี Debug และแก้ไขโค้ด</span>
                </li>
              </ul>
              <p>
                เรียน On-site 2 วัน พร้อม Workshop ลงมือทำจริง — ไม่ใช่แค่ดูอย่างเดียว แต่สร้างเป็น! ✨
              </p>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-xl bg-gray-300 px-8 py-4 text-lg font-bold text-gray-500 cursor-not-allowed">
                รอกำลังเปิดรับสมัคร
              </div>
              <p className="mt-4 text-sm text-gray-500">
                ติดตามข่าวสารการเปิดรับสมัครได้เร็วๆ นี้! 📢
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
