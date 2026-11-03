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
          <img src="https://img.youtube.com/vi/VF_veXAZNw4/maxresdefault.jpg" alt="Video thumbnail" className="w-full aspect-video object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
          <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">1:56:52</div>
        </>}
        {playing && <iframe src="https://www.youtube.com/embed/VF_veXAZNw4?autoplay=1&start=6&end=7012" className="w-full aspect-video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />}
      </div>
    </div>
  );
}

const sections = [
  { title: "เริ่มต้นกับ Node.js", lessons: [
    { num: "01", title: "แนะนำคอร์ส Node.js สำหรับผู้เริ่มต้น", duration: "เร็วๆ นี้", free: true },
    { num: "02", title: "ติดตั้ง Node.js และตั้งค่า", duration: "เร็วๆ นี้", free: false },
    { num: "03", title: "Node.js คืออะไร?", duration: "เร็วๆ นี้", free: false },
  ]},
  { title: "JavaScript พื้นฐานสำหรับ Node.js", lessons: [
    { num: "04", title: "Variables และ Data Types", duration: "เร็วๆ นี้", free: false },
    { num: "05", title: "Functions และ Modules", duration: "เร็วๆ นี้", free: false },
    { num: "06", title: "Async/Await และ Promises", duration: "เร็วๆ นี้", free: false },
  ]},
  { title: "Built-in Modules", lessons: [
    { num: "07", title: "File System (fs)", duration: "เร็วๆ นี้", free: false },
    { num: "08", title: "Path Module", duration: "เร็วๆ นี้", free: false },
    { num: "09", title: "HTTP Module", duration: "เร็วๆ นี้", free: false },
  ]},
  { title: "สร้าง REST API", lessons: [
    { num: "10", title: "REST API คืออะไร?", duration: "เร็วๆ นี้", free: false },
    { num: "11", title: "สร้าง API ด้วย Express.js", duration: "เร็วๆ นี้", free: false },
    { num: "12", title: "CRUD Operations", duration: "เร็วๆ นี้", free: false },
  ]},
  { title: "Database และ Authentication", lessons: [
    { num: "13", title: "เชื่อมต่อ Database", duration: "เร็วๆ นี้", free: false },
    { num: "14", title: "User Authentication", duration: "เร็วๆ นี้", free: false },
    { num: "15", title: "Workshop: สร้าง API จริง", duration: "เร็วๆ นี้", free: false },
  ]},
];

export default function NodejsModernWebPage() {
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
        title="NodeJS สำหรับการพัฒนาเว็บสมัยใหม่"
        tabs={[{id:"details",label:"รายละเอียดคอร์ส"},{id:"curriculum",label:"เนื้อหาคอร์ส"}]}
        activeTab={tab}
        onTabChange={setTab}
      />
      <div className="mx-auto max-w-5xl px-5 py-8">
        {tab==="details"&&<div>
          <h1 className="text-4xl font-bold text-gray-900">NodeJS สำหรับการพัฒนาเว็บสมัยใหม่</h1>
          <Link href="/instructor/milerdev" className="mt-3 flex items-center gap-2 group"><div className="h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-transparent transition group-hover:ring-blue-300"><img src="/milerdev-profile.png" alt="MilerDev" className="h-full w-full object-cover" /></div><p className="text-sm text-gray-500">จาก <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition">MilerDev</span></p></Link>
          
          <p className="mt-6 text-lg text-gray-700 leading-relaxed">เรียนรู้ Node.js สำหรับผู้เริ่มต้น พัฒนา Backend และ API สำหรับเว็บไซต์สมัยใหม่ เรียนตั้งแต่พื้นฐาน JavaScript ไปจนถึงการสร้าง REST API และเชื่อมต่อ Database</p>
          
          <VideoPlayer />
          
          <div className="mt-8 flex flex-wrap gap-6 rounded-2xl border border-gray-200 bg-white p-6">
            <span className="flex items-center gap-2 text-sm text-gray-600"><Clock className="h-4 w-4 text-gray-400" strokeWidth={2} />เร็วๆ นี้</span>
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">กำลังเตรียมเนื้อหา</span>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">ทำไมต้องเรียน Node.js</h2>
            <p className="text-gray-600 leading-relaxed">Node.js เป็น Runtime Environment ที่ใช้ JavaScript สำหรับพัฒนาฝั่ง Server ได้รับความนิยมอย่างมากในการสร้าง API, Microservices และ Full-stack Applications เรียนรู้ Node.js จะช่วยให้เป็น Full-stack Developer ได้</p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">คอร์สนี้เหมาะสำหรับใคร</h2>
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 space-y-2">
              "<p className="flex items-start gap-2 text-gray-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" strokeWidth={2.5} />"ผู้เริ่มต้นที่ต้องการเรียน Backend</p>
              "<p className="flex items-start gap-2 text-gray-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" strokeWidth={2.5} />"ผู้ที่มีพื้นฐาน JavaScript แล้ว</p>
              "<p className="flex items-start gap-2 text-gray-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" strokeWidth={2.5} />"ผู้ที่ต้องการสร้าง REST API</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">สิ่งที่จะได้รับจากคอร์สนี้</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-xl bg-green-50 border border-green-100 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" strokeWidth={2.2} />
                <p className="text-gray-700">เข้าใจ Node.js และ Module System</p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-green-50 border border-green-100 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" strokeWidth={2.2} />
                <p className="text-gray-700">สร้าง REST API ด้วย Express.js</p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-green-50 border border-green-100 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" strokeWidth={2.2} />
                <p className="text-gray-700">เชื่อมต่อ Database และทำ Authentication</p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-green-50 border border-green-100 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" strokeWidth={2.2} />
                <p className="text-gray-700">สร้างโปรเจกต์จริงพร้อม Portfolio</p>
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
