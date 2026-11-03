import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Hammer, Images, Link2, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "ส่งโปรเจกต์ — กำลังปรับปรุง | EGT-Learning",
  description: "พื้นที่แบ่งปันโปรเจกต์ของนักเรียน EGT-Learning กำลังอยู่ระหว่างการปรับปรุง",
};

export default function SubmitProjectPage() {
  return (
    <main className="min-h-screen bg-[#faf9f7] text-gray-900">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-[#faf9f7]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link href="/courses" className="text-lg font-bold tracking-tight text-gray-900">
            EGT-Learning
          </Link>
          <Link
            href="/courses"
            className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:bg-white hover:text-gray-900 hover:shadow"
          >
            <ArrowLeft
              size={16}
              strokeWidth={2}
              className="transition group-hover:-translate-x-0.5"
              aria-hidden
            />
            <span className="hidden sm:inline">กลับหน้าหลัก</span>
            <span className="sm:hidden">กลับ</span>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-5 pb-24 pt-32 sm:px-8">
        <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600">
          <Hammer size={14} strokeWidth={2} aria-hidden />
          กำลังปรับปรุง
        </p>

        <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
          ส่งโปรเจกต์
        </h1>
        <p className="mt-3 text-base leading-relaxed text-gray-600">
          หน้านี้กำลังอยู่ระหว่างการปรับปรุง — เรากำลังทำระบบให้ทุกคนส่งโปรเจกต์ของตัวเอง
          พร้อมรูปและลิงก์ เพื่อให้เพื่อน ๆ ในชุมชนเข้าไปดูและให้กำลังใจกันได้
        </p>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900">สิ่งที่จะทำได้เมื่อเปิดใช้งาน</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <Images size={17} strokeWidth={2} className="mt-0.5 shrink-0 text-blue-600" aria-hidden />
              อัปโหลดรูปโปรเจกต์ได้หลายรูป พร้อมคำอธิบายสั้น ๆ
            </li>
            <li className="flex items-start gap-3">
              <Link2 size={17} strokeWidth={2} className="mt-0.5 shrink-0 text-blue-600" aria-hidden />
              แนบลิงก์เว็บหรือ GitHub ของโปรเจกต์
            </li>
            <li className="flex items-start gap-3">
              <Users size={17} strokeWidth={2} className="mt-0.5 shrink-0 text-blue-600" aria-hidden />
              โปรเจกต์จะขึ้นในฟีดชุมชนให้ทุกคนกดถูกใจและคอมเมนต์
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            ไปที่ชุมชน
            <ArrowRight size={16} strokeWidth={2.5} aria-hidden />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-white"
          >
            ติดต่อเรา
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          ระหว่างนี้ถ้ามีโปรเจกต์อยากแชร์ ส่งรูปและรายละเอียดมาทางหน้า{" "}
          <Link href="/contact" className="font-medium text-blue-600 transition hover:text-blue-700">
            ติดต่อ
          </Link>{" "}
          ได้เลย
        </p>
      </section>
    </main>
  );
}
