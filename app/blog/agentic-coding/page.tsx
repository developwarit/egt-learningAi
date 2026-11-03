"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ViewCounter } from "./view-counter";
import { TableOfContents } from "./table-of-contents";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function BlogPage() {
  // Update page title
  if (typeof window !== "undefined") {
    document.title = "EGT-Learning - Agentic Coding";
  }
  return (
    <main className="min-h-screen bg-[#faf9f7] text-gray-900">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-[#faf9f7]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link href="/courses" className="text-lg font-bold tracking-tight text-gray-900">
            EGT-Learning
          </Link>
          <Link
            href="/blog"
            className="flex items-center gap-2 text-sm text-gray-800 transition hover:text-gray-900"
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
            กลับหน้า บทความที่น่าสนใจ
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
          {/* Breadcrumb */}
          <motion.nav {...fadeIn} className="flex items-center gap-2 overflow-hidden text-sm text-gray-500">
            <Link href="/courses" className="shrink-0 whitespace-nowrap transition hover:text-gray-900">
              หน้าแรก
            </Link>
            <span className="shrink-0">/</span>
            <Link href="/blog" className="shrink-0 whitespace-nowrap transition hover:text-gray-900">
              บทความ
            </Link>
            <span className="shrink-0">/</span>
            <span className="min-w-0 truncate text-gray-900">พื้นฐาน Web Dev ที่ต้องรู้ก่อนใช้ Agentic Coding</span>
          </motion.nav>

          {/* Tags */}
          <motion.div {...fadeIn} transition={{ delay: 0.05 }} className="mt-6 flex flex-wrap gap-2">
            {["agentic coding", "html", "javascript", "css"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Title */}
          <motion.h1
            className="mt-6 text-4xl font-black leading-tight tracking-tight text-gray-900 sm:text-5xl"
            {...fadeIn}
            transition={{ delay: 0.1 }}
          >
            พื้นฐาน Web Dev ที่ต้องรู้ก่อนใช้ Agentic Coding
          </motion.h1>

          {/* Description */}
          <motion.p
            className="mt-6 text-lg leading-relaxed text-gray-600"
            {...fadeIn}
            transition={{ delay: 0.15 }}
          >
            ทำไมนักพัฒนาทุกคน ที่ใช้ AI ได้ด้วยกว่าคนที่ไม่รู้พื้นฐาน 10 เท่า
          </motion.p>

          {/* Author & Stats */}
          <motion.div
            {...fadeIn}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center gap-6 rounded-2xl border border-gray-200 bg-white p-5"
          >
            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                WP
              </div>
              <div>
                <p className="text-xs text-gray-500">ผู้เขียน</p>
                <p className="font-semibold text-gray-900">Warit Panyeam</p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden h-12 w-px bg-gray-200 sm:block" />

            {/* Stats */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <p className="text-xs text-gray-500">เผยแพร่</p>
                <p className="font-medium text-gray-900">19 กรกฎาคม 2569</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">เวลาอ่าน</p>
                <p className="font-medium text-gray-900">6 นาที</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">ยอดวิว</p>
                <p className="font-medium text-gray-900"><ViewCounter slug="agentic-coding" /></p>
              </div>
            </div>
          </motion.div>            {/* Divider */}
          <div id="intro" className="my-12 border-t border-gray-200" />

          {/* Content */}
          <div className="prose-custom space-y-8 text-base leading-relaxed text-gray-700 lg:col-span-1">
            {/* Section 1 */}
            <motion.section {...fadeIn}>
              <p className="text-gray-900">
                มันอ่าน codebase ทั้งโปรเจกต์ได้ แก้ไขไฟล์โค้ดได้โดยตรง รัน terminal commands ได้
                และทำงานหลายขั้นตอนต่อเนื่องกันได้ สิ่งนี้เรียกว่า <strong className="text-blue-600 font-bold">Agentic Coding</strong>
              </p>
              <p className="mt-4 text-gray-600">
                หลายคนจึงคิดว่า &quot;ถ้า AI เขียนโค้ดได้แล้ว ฉันยังต้องเรียน Web Dev ทำไม?&quot;
              </p>
              <p className="mt-4 font-semibold text-gray-900">
                คำตอบคือ: ยังต้องเรียนอยู่ — และสำคัญกว่าเดิมด้วยซ้ำ
              </p>
            </motion.section>

            {/* Section 2 - Agentic Coding คืออะไร */}
            <motion.section id="what-is" {...fadeIn}>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Agentic Coding คืออะไรกันแน่?
              </h2>
              <p className="text-gray-600">
                Agentic Coding ≠ แค่ถาม ChatGPT แล้วก็อปโค้ด
              </p>
              <p className="mt-3 text-gray-600">
                Agentic Coding คือการทำงานร่วมกับ AI ที่:
              </p>
              <ul className="mt-3 space-y-2 text-gray-600">
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  <span>เข้าใจ context ทั้งโปรเจกต์ — อ่านไฟล์ทุกไฟล์ในโฟลเดอร์ได้</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  <span>แก้โค้ดได้โดยตรง — ไม่ต้องก็อปวางเอง</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  <span>รัน commands ได้ — npm install, git commit, database migration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  <span>
                    ทำ multi-step tasks — &quot;สร้าง API endpoint พร้อม validation และ unit
                    test&quot;
                  </span>
                </li>
              </ul>
            </motion.section>

            {/* Section 3 - ปัญหาที่เกิดขึ้นจริง */}
            <motion.section id="problems" {...fadeIn}>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                ปัญหาที่เกิดขึ้นจริง: เมื่อคนไม่รู้พื้นฐานใช้ AI
              </h2>
              <p className="text-gray-600">
                ลองนึกภาพสถานการณ์นี้: คุณสั่ง AI ว่า &quot;สร้างระบบ login
                ให้หน่อย&quot; แล้ว AI ก็สร้างโค้ดมาให้ 200 บรรทัด คุณรัน npm run dev
                แล้วเจอ error แดงๆ เต็มหน้าจอ
              </p>
              <p className="mt-3 text-gray-600">ถ้าคุณไม่รู้พื้นฐาน คุณจะ:</p>
              <ul className="mt-3 space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  <span>ก็อป error ไปถาม AI อีกครั้ง</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  <span>AI แก้ให้ แต่เกิด error ใหม่</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  <span>วนซ้ำ loop นี้ไปเรื่อยๆ โดยไม่เข้าใจว่าเกิดอะไรขึ้น</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  <span>โปรเจกต์กลายเป็น &quot;Frankenstein code&quot; ที่ทำงานได้บ้างไม่ได้บ้าง</span>
                </li>
              </ul>
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="font-semibold text-red-600">
                  นี่ไม่ใช่ Agentic Coding — นี่คือ การพึ่งพา AI แบบตาบอด
                </p>
              </div>
            </motion.section>

            {/* Section 4 - 5 เหตุผล */}
            <motion.section id="reasons" {...fadeIn}>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                5 เหตุผลที่พื้นฐาน Web Dev สำคัญมากในยุค AI
              </h2>

              {/* Reason 1 */}
              <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    1
                  </span>
                  สั่ง AI ได้ตรงและละเอียดกว่า
                </h3>
                <p className="mt-3 text-gray-600">
                  ความแตกต่างระหว่าง prompt ที่ดีกับไม่ดีมหาศาลมาก:
                </p>
                <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-sm">
                  <p className="text-red-600">
                    ไม่ดี &quot;ทำให้เว็บสวยขึ้น และเพิ่มฟีเจอร์ login ด้วย&quot;
                  </p>
                  <p className="mt-2 text-green-700">
                    ดี &quot;เพิ่มหน้า /login ด้วย Next.js App Router ใช้ NextAuth.js กับ
                    Credentials provider...&quot;
                  </p>
                </div>
              </div>

              {/* Reason 2 */}
              <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    2
                  </span>
                  ตรวจสอบโค้ดที่ AI สร้างได้
                </h3>
                <p className="mt-3 text-gray-600">
                  AI ไม่ได้ถูกต้องเสมอไป มันอาจสร้างโค้ดที่มี security vulnerability,
                  ใช้ library ที่ deprecated หรือเขียน logic ที่ผิดพลาดใน edge case
                </p>
              </div>

              {/* Reason 3 */}
              <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    3
                  </span>
                  Debug ได้เองเมื่อเกิดปัญหา
                </h3>
                <p className="mt-3 text-gray-600">
                  คนที่รู้ JavaScript จะรู้ทันทีว่า TypeError: Cannot read properties of
                  undefined หมายความว่า object ที่คาดว่าจะมีค่าเป็น undefined อยู่
                </p>
              </div>

              {/* Reason 4 */}
              <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    4
                  </span>
                  ตัดสินใจด้าน Architecture ได้
                </h3>
                <p className="mt-3 text-gray-600">
                  AI เก่งในการ implement แต่ไม่รู้ว่า business ของคุณต้องการอะไร
                  คำถามเช่น &quot;ควรใช้ Server Component หรือ Client Component?&quot;
                  ต้องการความเข้าใจพื้นฐาน
                </p>
              </div>

              {/* Reason 5 */}
              <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    5
                  </span>
                  ไม่กลัวเมื่อ AI ทำพัง
                </h3>
                <p className="mt-3 text-gray-600">
                  คนที่รู้ Git จะ git stash, git log, git revert ได้ คนที่ไม่รู้จะ panic
                </p>
              </div>
            </motion.section>

            {/* Section 5 - Roadmap */}
            <motion.section id="roadmap" {...fadeIn}>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                พื้นฐานที่ต้องรู้ก่อน: Roadmap จริงๆ
              </h2>

              <div className="space-y-4">
                {[
                  {
                    num: "1",
                    title: "เข้าใจว่า Web ทำงานยังไง",
                    desc: "Client vs Server, HTTP Request/Response, Status codes, API",
                  },
                  {
                    num: "2",
                    title: "HTML — โครงสร้างของหน้าเว็บ",
                    desc: "Semantic elements, Forms, Links & Images, JSX",
                  },
                  {
                    num: "3",
                    title: "CSS — ทำให้สวยงาม",
                    desc: "Box Model, Flexbox, Grid, Responsive, Tailwind CSS",
                  },
                  {
                    num: "4",
                    title: "JavaScript — ทำให้มีชีวิต",
                    desc: "Variables, Functions, Arrays, Objects, Async/Await, TypeScript",
                  },
                  {
                    num: "5",
                    title: "Tools — VS Code, Node.js, npm",
                    desc: "VS Code shortcuts, Terminal commands, Project structure",
                  },
                  {
                    num: "6",
                    title: "Git — Version Control",
                    desc: "init, add, commit, push, stash, revert — กฎทอง: commit ก่อนสั่ง AI เสมอ",
                  },
                  {
                    num: "7",
                    title: "อ่าน Error Messages ได้",
                    desc: "TypeError, 404, 500, Module not found, 'use client' directive",
                  },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      {item.num}
                    </span>
                    <div>
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Section 6 - Workflow */}
            <motion.section id="workflow" {...fadeIn}>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Workflow จริงๆ ของ Agentic Coding
              </h2>
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="space-y-4 font-mono text-sm text-gray-900">
                  <div>
                    <span className="text-blue-600">1. วางแผนก่อน</span>
                    <p className="ml-6 text-gray-500">└─ รู้ว่าต้องการ feature อะไร แบ่งเป็นขั้นตอนเล็กๆ</p>
                  </div>
                  <div>
                    <span className="text-blue-600">2. Commit ก่อนเริ่ม</span>
                    <p className="ml-6 text-gray-500">└─ git add . &amp;&amp; git commit -m &quot;before: add feature&quot;</p>
                  </div>
                  <div>
                    <span className="text-blue-600">3. ให้ Context ครบ</span>
                    <p className="ml-6 text-gray-500">└─ บอก tech stack, @mention ไฟล์ที่เกี่ยวข้อง</p>
                  </div>
                  <div>
                    <span className="text-blue-600">4. สั่งทีละขั้น</span>
                    <p className="ml-6 text-gray-500">└─ ไม่สั่ง 10 อย่างพร้อมกัน ตรวจสอบก่อนไปขั้นถัดไป</p>
                  </div>
                  <div>
                    <span className="text-blue-600">5. Review โค้ดที่ AI สร้าง</span>
                    <p className="ml-6 text-gray-500">└─ อ่านทุกบรรทัด ตรวจ security issues</p>
                  </div>
                  <div>
                    <span className="text-blue-600">6. Test ก่อน commit</span>
                    <p className="ml-6 text-gray-500">└─ รัน npm run dev ทดสอบ manual + npm test</p>
                  </div>
                  <div>
                    <span className="text-blue-600">7. Commit หลังทำสำเร็จ</span>
                    <p className="ml-6 text-gray-500">└─ git commit -m &quot;feat: add payment with Stripe&quot;</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 7 - AI vs Human */}
            <motion.section id="ai-vs-human" {...fadeIn}>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                สิ่งที่ AI ทำได้ดี vs ต้องการคนควบคุม
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                  <h3 className="font-bold text-green-700">AI ทำได้ดีมาก</h3>
                  <ul className="mt-3 space-y-2 text-sm text-gray-700">
                    <li>• สร้าง boilerplate code</li>
                    <li>• แก้ TypeScript type errors</li>
                    <li>• เขียน unit tests</li>
                    <li>• Refactor โค้ดซ้ำๆ</li>
                    <li>• อธิบายโค้ดที่ไม่เข้าใจ</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
                  <h3 className="font-bold text-orange-700">ต้องการคนควบคุม</h3>
                  <ul className="mt-3 space-y-2 text-sm text-gray-700">
                    <li>• Architecture decisions</li>
                    <li>• Security decisions</li>
                    <li>• UX/Product decisions</li>
                    <li>• Debug complex bugs</li>
                    <li>• Performance optimization</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Conclusion */}
            <motion.section id="conclusion" {...fadeIn}>
              <div className="my-8 border-t border-gray-200" />
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                บทสรุป: AI เป็นเครื่องมือ ไม่ใช่นาย
              </h2>
              <p className="text-gray-600">
                คนที่รู้พื้นฐาน + ใช้ Agentic Coding = <strong className="text-green-700">ทีมที่ทรงพลังที่สุด</strong>
              </p>
              <p className="mt-2 text-gray-600">
                คนที่ไม่รู้พื้นฐาน + ใช้ Agentic Coding ={" "}
                <strong className="text-red-600">ปัญหาที่ใหญ่กว่าเดิม</strong>
              </p>
              <p className="mt-4 font-semibold text-gray-900">
                เริ่มต้นเรียนพื้นฐานวันนี้ แล้วคุณจะพบว่า Agentic Coding ทรงพลังแค่ไหนเมื่ออยู่ในมือของคนที่รู้ว่ากำลังทำอะไรอยู่
              </p>
            </motion.section>
          </div>
          {/* Sidebar - TOC */}
          <div className="min-w-0">
            <div className="sticky top-24">
              <TableOfContents />
            </div>
          </div>


          
        </div>
        </div>
      </article>

      
    
      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <p className="font-semibold text-gray-900">EGT-Learning</p>
              <p className="text-sm text-gray-500">สร้างด้วย Next.js &amp; Tailwind CSS</p>
            </div>
            <nav className="flex gap-5 text-sm text-gray-600">
              <Link href="/courses/catalog" className="transition hover:text-gray-900">คอร์สทั้งหมด</Link>
              <Link href="/blog" className="transition hover:text-gray-900">บทความ</Link>
              <Link href="/contact" className="transition hover:text-gray-900">ติดต่อ</Link>
            </nav>
          </div>
          <p className="mt-6 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} EGT-Learning
          </p>
        </div>
      </footer>
    </main>
  );
}
