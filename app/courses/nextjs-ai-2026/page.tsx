"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CourseDetailBar from "../../course-detail-bar";
import { CheckCircle2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

function VideoPlayer() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="mt-6">
      <div className="relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-black cursor-pointer group" onClick={() => setPlaying(true)}>
        {!playing && <>
          <img src="https://img.youtube.com/vi/XaEPnpAyzAY/maxresdefault.jpg" alt="Video thumbnail" className="w-full aspect-video object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
          <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">44:54</div>
        </>}
        {playing && <iframe src="https://www.youtube.com/embed/XaEPnpAyzAY?autoplay=1&start=6&end=2694" className="w-full aspect-video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />}
      </div>
    </div>
  );
}

const sections = [
  { title: "เริ่มต้นกับ Next.js", lessons: [
    { num: "01", title: "แนะนำคอร์ส Next.js ในยุค AI", duration: "เร็วๆ นี้", free: true },
    { num: "02", title: "ติดตั้งและตั้งค่า Next.js", duration: "เร็วๆ นี้", free: false },
    { num: "03", title: "โครงสร้างโปรเจกต์ Next.js", duration: "เร็วๆ นี้", free: false },
  ]},
  { title: "App Router และ Layout", lessons: [
    { num: "04", title: "App Router คืออะไร?", duration: "เร็วๆ นี้", free: false },
    { num: "05", title: "Layout และ Page", duration: "เร็วๆ นี้", free: false },
    { num: "06", title: "Dynamic Routes", duration: "เร็วๆ นี้", free: false },
  ]},
  { title: "Server Components และ Data Fetching", lessons: [
    { num: "07", title: "Server Components vs Client Components", duration: "เร็วๆ นี้", free: false },
    { num: "08", title: "Data Fetching ใน Next.js", duration: "เร็วๆ นี้", free: false },
    { num: "09", title: "Server Actions", duration: "เร็วๆ นี้", free: false },
  ]},
  { title: "AI Integration", lessons: [
    { num: "10", title: "การใช้ AI ช่วยเขียนโค้ด Next.js", duration: "เร็วๆ นี้", free: false },
    { num: "11", title: "AI Code Generation", duration: "เร็วๆ นี้", free: false },
    { num: "12", title: "AI Assistant สำหรับ Debug", duration: "เร็วๆ นี้", free: false },
  ]},
  { title: "Workshop", lessons: [
    { num: "13", title: "สร้างโปรเจกต์จริงด้วย Next.js + AI", duration: "เร็วๆ นี้", free: false },
  ]},
];

export default function NextjsAI2026Page() {
  const router = useRouter();
  const [tab, setTab] = useState("details");
  const [open, setOpen] = useState([0]);
  const [authChecked, setAuthChecked] = useState(false);
  const total = sections.reduce((s, sec) => s + sec.lessons.length, 0);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (!d.user) {
        router.push("/login");
      } else {
        setAuthChecked(true);
      }
    }).catch(() => {
      router.push("/login");
    });
  }, [router]);

  if (!authChecked) {
    return <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center"><p className="text-gray-500">กำลังตรวจสอบ...</p></div>;
  }

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <CourseDetailBar
        title="NextJS ในยุค AI ปี 2026"
        tabs={[{id:"details",label:"รายละเอียดคอร์ส"},{id:"curriculum",label:"เนื้อหาคอร์ส"}]}
        activeTab={tab}
        onTabChange={setTab}
      />
      <div className="mx-auto max-w-5xl px-5 py-8">
        {tab==="details"&&<div>
          <h1 className="text-4xl font-bold text-gray-900">NextJS ในยุค AI ปี 2026</h1>
          <Link href="/instructor/milerdev" className="mt-3 flex items-center gap-2 group"><div className="h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-transparent transition group-hover:ring-blue-300"><img src="/milerdev-profile.png" alt="MilerDev" className="h-full w-full object-cover" /></div><p className="text-sm text-gray-500">จาก <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition">MilerDev</span></p></Link>
          
          <p className="mt-6 text-lg text-gray-700 leading-relaxed">เรียนรู้ Next.js เวอร์ชันล่าสุดสำหรับการพัฒนาเว็บสมัยใหม่ พร้อมเรียนรู้การใช้ AI Assistant ช่วยเขียนโค้ดให้เร็วขึ้น เหมาะสำหรับผู้เริ่มต้นที่ต้องการสร้างเว็บไซต์ด้วย React Framework ที่นิยมที่สุดในปัจจุบัน</p>
          
          <VideoPlayer />
          
          <div className="mt-8 flex flex-wrap gap-6 rounded-2xl border border-gray-200 bg-white p-6">
            <span className="flex items-center gap-2 text-sm text-gray-600"><Clock className="h-4 w-4 text-gray-400" strokeWidth={2} />เร็วๆ นี้</span>
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">กำลังเตรียมเนื้อหา</span>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">ทำไมต้องเรียน Next.js ในยุค AI</h2>
            <p className="text-gray-600 leading-relaxed">Next.js เป็น React Framework ที่ได้รับความนิยมสูงสุดในการพัฒนาเว็บสมัยใหม่ รองรับทั้ง Server-Side Rendering, Static Site Generation และ App Router ที่ทันสมัย การเรียนรู้ Next.js ร่วมกับ AI Assistant จะช่วยให้พัฒนาเว็บได้เร็วขึ้นอย่างมาก</p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">คอร์สนี้เหมาะสำหรับใคร</h2>
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 space-y-2">
              "<p className="flex items-start gap-2 text-gray-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" strokeWidth={2.5} />"ผู้เริ่มต้นที่ต้องการเรียน Next.js</p>
              "<p className="flex items-start gap-2 text-gray-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" strokeWidth={2.5} />"ผู้ที่มีพื้นฐาน HTML, CSS, JavaScript แล้ว</p>
              "<p className="flex items-start gap-2 text-gray-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" strokeWidth={2.5} />"ผู้ที่ต้องการใช้ AI ช่วยพัฒนาเว็บ</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">สิ่งที่จะได้รับจากคอร์สนี้</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-xl bg-green-50 border border-green-100 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" strokeWidth={2.2} />
                <p className="text-gray-700">เข้าใจ App Router และ Server Components</p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-green-50 border border-green-100 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" strokeWidth={2.2} />
                <p className="text-gray-700">เรียนรู้ Data Fetching และ Server Actions</p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-green-50 border border-green-100 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" strokeWidth={2.2} />
                <p className="text-gray-700">ใช้ AI ช่วยเขียนโค้ดและ Debug</p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-green-50 border border-green-100 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" strokeWidth={2.2} />
                <p className="text-gray-700">สร้างโปรเจกต์จริงด้วย Next.js</p>
              </div>
            </div>
          </div>
        </div>}
        {tab==="curriculum"&&<div>
          <div className="flex items-center justify-between mb-6"><h1 className="text-3xl font-bold text-gray-900">เนื้อหาการเรียน</h1><span className="text-sm text-gray-500">{total} บท · เร็วๆ นี้</span></div>
          <div className="space-y-4">{sections.map((sec,sIdx)=>(<div key={sIdx} className="rounded-2xl border border-gray-200 bg-white overflow-hidden"><button onClick={()=>setOpen((p: number[])=>p.includes(sIdx)?p.filter(i=>i!==sIdx):[...p,sIdx])} className="flex w-full items-center justify-between p-5 text-left hover:bg-gray-50"><span className="font-bold text-gray-900">{sec.title}</span><svg className={"h-5 w-5 text-gray-400 transition-transform "+(open.includes(sIdx)?"rotate-180":"")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg></button>{open.includes(sIdx)&&<div className="border-t border-gray-100">{sec.lessons.map((l,lIdx)=>(<div key={lIdx} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 border-b border-gray-50 last:border-0"><div className="flex items-center gap-4"><span className="w-8 text-sm text-gray-400 font-medium">{l.num}</span><div><p className="font-medium text-gray-900">{l.title}</p><p className="text-xs text-gray-500 mt-0.5">{l.duration}</p></div></div></div>))}</div>}</div>))}</div>
        </div>}
      </div>
    </main>
  );
}
