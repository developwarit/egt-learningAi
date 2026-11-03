"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const modules = [
  { title: "ทำคความรู้จักกับ Generative AI", progress: "4/7", percent: 57, lessons: [
    { title: "ทำไมเราถึงใช้ AI ช่วยทำงาน", status: "done" },
    { title: "Generative AI คืออะไร", status: "done" },
    { title: "คุณสมบัติเด่นของ Generative AI", status: "current" },
    { title: "ตัวอย่างเครื่องมือ Generative AI", status: "locked" },
    { title: "การใช้งาน Generative AI", status: "done" },
    { title: "ขั้นตอนการทำงานของ Generative AI", status: "locked" },
    { title: "เริ่มต้นใช้งาน Chat GPT", status: "done" },
  ]},
  { title: "เทคนิคการเขียน Prompt", progress: "1/6", percent: 17, lessons: [
    { title: "Prompt คืออะไร", status: "done" },
    { title: "โครงสร้างของ Prompt", status: "locked" },
    { title: "เทคนิคการเขียน Prompt", status: "locked" },
    { title: "ตัวอย่าง Prompt สำหรับงานต่างๆ", status: "locked" },
    { title: "ฝึกเขียน Prompt", status: "locked" },
    { title: "สรุป Prompt Engineering", status: "locked" },
  ]},
  { title: "ข้อคิดประกันการใช้งาน AI", progress: "0/2", percent: 0, lessons: [
    { title: "ข้อจำกัดของ AI", status: "locked" },
    { title: "จริยธรรมในการใช้ AI", status: "locked" },
  ]},
];

const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
const doneLessons = modules.reduce((s, m) => s + m.lessons.filter(l => l.status === "done").length, 0);
const overallPercent = Math.round((doneLessons / totalLessons) * 100);

function MiniRing({ percent, size = 40 }: { percent: number; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * percent) / 100;
  return (
    <svg width={size} height={size} className="-rotate-90 shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={4} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#6366f1" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
  );
}

export default function CourseDetailPage() {
  const [expandedModule, setExpandedModule] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-[#f0f4ff] text-gray-900">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex items-center justify-between px-5 py-3">
          <Link href="/courses" className="font-bold text-lg text-orange-500">EGT-Learning</Link>
          <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-1 py-1">
            <span className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-500">แชร์ Course</span>
            <span className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white">เนื้อหาทั้งหมด</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-white">W</div>
        </div>
      </header>

      <div className="pt-16 pb-20">
        <div className="mx-auto max-w-5xl px-5 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">เนื้อหาทั้งหมดของคอร์สนี้</h1>

            <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 mb-8 flex items-center justify-between">
              <div className="text-white">
                <p className="text-sm font-medium opacity-80">คอร์ส Free course</p>
                <h2 className="text-3xl font-bold mt-1">Intro to Generative AI</h2>
              </div>
              <div className="text-white text-5xl font-bold">{overallPercent}%</div>
            </div>

            <div className="space-y-4">
              {modules.map((module, mi) => {
                const isExpanded = expandedModule === mi;
                return (
                  <div key={mi} className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                    <button onClick={() => setExpandedModule(isExpanded ? null : mi)} className="flex w-full items-center gap-4 p-5 text-left hover:bg-gray-50 transition">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-500 text-white font-bold text-sm">AI</div>
                      <div className="flex-1"><h3 className="font-bold text-indigo-600 text-lg">{module.title}</h3></div>
                      <div className="flex items-center gap-3">
                        <MiniRing percent={module.percent} />
                        <span className="text-sm font-semibold text-gray-500">{module.progress}</span>
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="border-t border-gray-100 px-5 pb-5">
                        <div className="flex items-center gap-3 py-3">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: module.percent + "%" }} />
                          </div>
                          <span className="text-sm font-semibold text-gray-500">{module.percent}%</span>
                        </div>
                        <div className="space-y-2">
                          {module.lessons.map((lesson, li) => (
                            <div key={li} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50">
                              <div className="flex items-center gap-3">
                                <span className={"flex h-2.5 w-2.5 rounded-full shrink-0 " + (lesson.status === "done" ? "bg-green-500" : lesson.status === "current" ? "bg-orange-400" : "bg-gray-300")} />
                                <span className="text-sm text-gray-700">{lesson.title}</span>
                              </div>
                              <span className={"text-xs font-medium shrink-0 " + (lesson.status === "done" ? "text-green-600" : lesson.status === "current" ? "text-orange-500" : "text-gray-400")}>
                                {lesson.status === "done" ? "เรียนจบ" : lesson.status === "current" ? "เรียนอยู่" : "ยังไม่เรียน"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <Link href="/courses/intro-to-generative-ai/curriculum" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-orange-600 transition hover:shadow-xl">
                เริ่มเรียนต่อ →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
