"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CourseDetailBar from "../../course-detail-bar";
import { CheckCircle2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

const episodes = [
  { id: 1, title: "Ep 1: แนะนำคอร์สและวิธีใช้ MCP Figma", videoId: "tcehtUlJly0" },
  { id: 2, title: "Ep 2: แปลง Design เป็น Code", videoId: "-1W1l3aJVHw" },
  { id: 3, title: "Ep 3: Workshop แปลง Design เป็น Code", videoId: "aOz2SbXn6DQ" },
];

function VideoPlayer() {
  const [currentEp, setCurrentEp] = useState(0);

  return (
    <div className="mt-6">
      <div className="flex gap-2 mb-3">
        {episodes.map((ep, i) => (
          <button
            key={ep.id}
            onClick={() => setCurrentEp(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              currentEp === i
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {ep.title}
          </button>
        ))}
      </div>
      <div className="relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-black">
        <iframe
          key={currentEp}
          src={`https://www.youtube-nocookie.com/embed/${episodes[currentEp].videoId}`}
          title={episodes[currentEp].title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full aspect-video"
        />
      </div>
    </div>
  );
}

const sections = [
  { title: "Ep 1: แนะนำคอร์สและวิธีใช้ MCP Figma", lessons: [
    { num: "01", title: "แนะนำคอร์ส Figma to Code", duration: "7:48 นาที", free: true },
  ]},
  { title: "Ep 2: แปลง Design เป็น Code", lessons: [
    { num: "02", title: "แปลง Design เป็น Code", duration: "เร็วๆ นี้", free: false },
  ]},
  { title: "Ep 3: Workshop แปลง Design เป็น Code", lessons: [
    { num: "03", title: "Workshop แปลง Design เป็น Code", duration: "เร็วๆ นี้", free: false },
  ]},
];

export default function FigmaToCodePage() {
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
        title="Figma to Code"
        tabs={[{id:"details",label:"รายละเอียดคอร์ส"},{id:"curriculum",label:"เนื้อหาคอร์ส"}]}
        activeTab={tab}
        onTabChange={setTab}
      />
      <div className="mx-auto max-w-5xl px-5 py-8">
        {tab==="details"&&<div>
          <h1 className="text-4xl font-bold text-gray-900">Figma to Code</h1>
          <Link href="/instructor/prinxesz-x" className="mt-3 flex items-center gap-2 group"><div className="h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-transparent transition group-hover:ring-blue-300"><img src="/prinxesz-profile.png" alt="Prinxesz X" className="h-full w-full object-cover" /></div><p className="text-sm text-gray-500">จาก <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition">Prinxesz X</span></p></Link>
          
          <p className="mt-6 text-lg text-gray-700 leading-relaxed">คอร์ส Figma to Code จะพาทุกคนมาเรียนรู้การแปลง Web Design จาก Figma ให้เป็นหน้าเว็บที่ใช้งานได้จริง ทุกคนจะได้เรียนรู้หลักการวางโครงสร้าง HTML ที่ถูกต้อง, การเขียน CSS ทำให้เว็บ Responsive ด้วย Media query และการใช้ JavaScript สำหรับทำลูกเล่นเพิ่มเติมให้เว็บไซต์มีความสวยงามและน่าสนใจมากยิ่งขึ้น</p>
          
          <VideoPlayer />
          
          <div className="mt-8 flex flex-wrap gap-6 rounded-2xl border border-gray-200 bg-white p-6">
            <span className="flex items-center gap-2 text-sm text-gray-600"><Clock className="h-4 w-4 text-gray-400" strokeWidth={2} />เร็วๆ นี้</span>
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">กำลังเตรียมเนื้อหา</span>
          </div>

          {/* ทำไมต้องเรียน */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">ทำไมทุกคนถึงควรเรียนคอร์สนี้</h2>
            <p className="text-gray-600 leading-relaxed">เพราะว่าทักษะการแปลง Design ให้เป็น Code (หน้าเว็บ) เป็นทักษะที่สำคัญอย่างมากในการพัฒนาเว็บไซต์ และเป็นทักษะที่ทุกคนสามารถนำไปสร้างรายได้ให้กับตัวเองได้ โดยงาน Design to Code จะมีเรทราคาตั้งแต่ 1,500 - 5,000 บาท ตามความยากง่าย และประสบการณ์ของเรา เป็นทักษะที่เรียนรู้แล้วจะได้ใช้ตลอด</p>
          </div>

          {/* เหมาะสำหรับใคร */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">คอร์สนี้เหมาะสำหรับใคร</h2>
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
              <p className="flex items-start gap-2 text-gray-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" strokeWidth={2.5} />เหมาะสำหรับคนที่มีพื้นฐาน HTML CSS JS แล้ว แต่ยังรู้สึกไม่ค่อยมั่นใจในการเขียน HTML CSS JS อยากจะอัพเกรดทักษะให้ชำนาญมากยิ่งขึ้น</p>
            </div>
          </div>

          {/* สิ่งที่จะได้รับ */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">สิ่งที่จะได้รับจากคอร์สนี้</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-xl bg-green-50 border border-green-100 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" strokeWidth={2.2} />
                <p className="text-gray-700">ได้เรียนรู้และเข้าใจการแปลง Design เป็น Code (หน้าเว็บ) ซึ่งเป็นทักษะที่สำคัญมาก</p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-green-50 border border-green-100 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" strokeWidth={2.2} />
                <p className="text-gray-700">ได้เรียนรู้และเข้าใจหลักการวางโครงสร้างเว็บไซต์ที่ถูกต้อง</p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-green-50 border border-green-100 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" strokeWidth={2.2} />
                <p className="text-gray-700">ได้เรียนรู้และเข้าใจการเขียน Media Query เพื่อทำ Responsive ให้กับเว็บไซต์</p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-green-50 border border-green-100 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" strokeWidth={2.2} />
                <p className="text-gray-700">ได้เรียนรู้และเข้าใจการนำ JavaScript มาใช้สำหรับเพิ่มลูกเล่นให้เว็บไซต์มีความน่าสนใจมากยิ่งขึ้น</p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-green-50 border border-green-100 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" strokeWidth={2.2} />
                <p className="text-gray-700">ได้เรียนรู้เทคนิคและวิธีการแก้ไขปัญหาต่างๆ ที่จะต้องเจอ</p>
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
