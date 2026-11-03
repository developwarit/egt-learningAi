"use client";



import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const tags = ["ทั้งหมด", "agentic coding", "css", "html", "javascript", "reactjs"];

const articles = [
  {
    id: "agentic-coding",
    title: "พื้นฐาน Web Dev ที่ต้องรู้ก่อนใช้ Agentic Coding",
    description:
      "ทำไมนักพัฒนาทุกคน ที่ใช้ AI ได้ด้วยกว่าคนที่ไม่รู้พื้นฐาน 10 เท่า",
    date: "19 กรกฎาคม 2569",
    author: "Warit Panyeam",
    tags: ["agentic coding", "html", "javascript"],
    image: "/blog/agentic-coding.jpg",
    href: "/blog/agentic-coding",
  },
];

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("ทั้งหมด");

  const filtered = articles.filter((a) => {
    const matchTag =
      activeTag === "ทั้งหมด" || a.tags.includes(activeTag);
    const matchSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  return (
    <main className="min-h-screen bg-[#faf9f7] text-gray-900">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-[#faf9f7]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link href="/courses" className="text-lg font-bold tracking-tight text-gray-900">
            EGT-Learning
          </Link>
          <Link
            href="/courses"
            className="flex items-center gap-2 text-sm text-gray-600 transition hover:text-gray-900"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            กลับหน้าหลัก
          </Link>
        </div>
      </header>

      <section className="pt-32 pb-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-10">
          {/* Title */}
          <motion.div {...fadeIn}>
            <div className="flex items-end justify-between">
              <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
                บทความที่น่าสนใจ
              </h1>
              <span className="text-sm text-gray-500">
                {filtered.length} บทความ
              </span>
            </div>
          </motion.div>

          <div className="my-8 border-t border-gray-200" />

          {/* Search */}
          <motion.div
            {...fadeIn}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-gray-200 bg-white p-5"
          >
            <p className="mb-3 text-sm font-semibold text-gray-900">
              ค้นหาบทความ
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาหัวข้อบทความ"
                className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-gray-400 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveTag("ทั้งหมด");
                }}
                className="shrink-0 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                ล้างตัวกรอง
              </button>
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div
            {...fadeIn}
            transition={{ delay: 0.15 }}
            className="mt-6 flex flex-wrap gap-2"
          >
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeTag === tag
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {tag}
              </button>
            ))}
          </motion.div>

          {/* Articles */}
          <div className="mt-10 space-y-6">
            {filtered.map((article, index) => (
              <motion.div
                key={article.id}
                {...fadeIn}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Link
                  href={article.href}
                  className="group grid gap-6 overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-gray-300 hover:shadow-md sm:grid-cols-[1.2fr_1fr]"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-gray-100 sm:h-auto">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-between p-6">
                    <div>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Date */}
                      <p className="mt-3 text-sm text-gray-500">
                        {article.date}
                      </p>

                      {/* Title */}
                      <h2 className="mt-3 text-2xl font-bold leading-tight text-gray-900 group-hover:text-blue-600 transition">
                        {article.title}
                      </h2>

                      {/* Description */}
                      <p className="mt-3 text-sm leading-relaxed text-gray-600">
                        {article.description}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                      <span className="text-sm text-gray-500">
                        โดย {article.author}
                      </span>
                      <span className="flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                        อ่านบทความ
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-lg text-gray-700">ไม่พบบทความที่ค้นหา</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveTag("ทั้งหมด");
                  }}
                  className="mt-4 text-sm font-medium text-blue-600 hover:underline"
                >
                  ล้างตัวกรอง
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} EGT-Learning
          </p>
          <nav className="flex flex-wrap gap-5 text-sm text-gray-600">
            <Link href="/courses/catalog" className="transition hover:text-gray-900">คอร์สทั้งหมด</Link>
            <Link href="/blog" className="transition hover:text-gray-900">บทความ</Link>
            <Link href="/contact" className="transition hover:text-gray-900">ติดต่อ</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
