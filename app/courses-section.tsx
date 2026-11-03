"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const courseTabs = [
  { id: "software", label: "Software 💻", color: "bg-blue-500" },
  { id: "data", label: "Data 📊", color: "bg-purple-500" },
];

const tasks = [
  { done: false, text: "ลองแก้ไขข้อความ Hi 👋 ในไฟล์ด้านล่าง Console ดูบ้าง" },
  { done: false, text: "เปลี่ยนสีจาก blue เป็นสี purple เพื่อเปลี่ยนสีพื้นหลังของวงกลม" },
];

export function CoursesSection() {
  const [activeCourseTab, setActiveCourseTab] = useState("software");
  const [activeEditorTab, setActiveEditorTab] = useState("exercise");
  const [code, setCode] = useState(`.circle {
  content: "Hi 👋";
}`);

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-semibold text-orange-400">
            อัปสกิลด้วยเครื่องมือมากมาย
          </p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">
            EGT
            <br />
            LEARNING 🚀
          </h2>
          <p className="mt-2 text-lg font-semibold text-orange-400">
            เรียนรู้ ทำวันเรียน ยิงยาวได้ภายใน 5 เดือน
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
            ไม่ต้องรอหลักสูตรโรงเรียน! สามารถนำ AI เข้ามาช่วย的同时 เรียน แล้วเปลี่ยนไอเดียให้พร้อม
            สร้างรูปแบบการเปลี่ยนแปลง ✨
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              🎓 Bootcamp & Course
            </button>
          </div>
        </motion.div>

        {/* Right Content - Code Editor */}
        <motion.div
          className="rounded-2xl border border-white/10 bg-zinc-900/90 overflow-hidden"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Course Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 bg-zinc-800/50 px-4 py-3">
            <span className="text-sm text-zinc-400">เลือกเส้นทางการเรียนรู้ »</span>
            {courseTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCourseTab(tab.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeCourseTab === tab.id
                    ? `${tab.color} text-white`
                    : "bg-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Editor Tabs */}
          <div className="flex items-center gap-1 border-b border-white/10 px-4 py-2">
            {["exercise", "preview", "console"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveEditorTab(tab)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  activeEditorTab === tab
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {tab === "exercise" && "🎯 Exercise"}
                {tab === "preview" && "👁️ Preview"}
                {tab === "console" && ">_ Console"}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeEditorTab === "exercise" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-400">
                    🎯 Exercise
                  </span>
                </div>
                <p className="text-sm text-zinc-300">
                  แก้โค้ดด้านล่าง พร้อมกับดูผลลัพธ์ที่แท็บ Preview
                </p>
                <div className="mt-4 space-y-3">
                  <p className="text-xs font-semibold text-zinc-500">
                    Task <span className="text-green-400">สำเร็จแล้ว 0/2</span>
                  </p>
                  {tasks.map((task, i) => (
                    <label
                      key={i}
                      className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-zinc-300"
                    >
                      <input
                        type="checkbox"
                        checked={task.done}
                        readOnly
                        className="mt-0.5 h-4 w-4 rounded border-zinc-600"
                      />
                      {task.text}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeEditorTab === "preview" && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-blue-500 text-2xl font-bold text-white shadow-lg shadow-blue-500/30">
                  Hi 👋
                </div>
                <p className="mt-4 text-sm text-zinc-500">
                  ผลลัพธ์จะเปลี่ยนเมื่อแก้ไขโค้ด
                </p>
              </div>
            )}

            {activeEditorTab === "console" && (
              <div>
                <p className="mb-3 text-xs font-semibold text-zinc-500">
                  Console
                </p>
                <div className="rounded-lg bg-zinc-950 p-4 font-mono text-sm">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-transparent text-green-400 outline-none resize-none"
                    rows={6}
                    spellCheck={false}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
