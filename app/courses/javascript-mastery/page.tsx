"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CourseDetailBar from "../../course-detail-bar";
import { BookOpen, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

const timestamps = [
  { time: '0:38', label: 'JavaScript คืออะไร?', seconds: 38 },
  { time: '02:29', label: 'VSCode & Extensions', seconds: 149 },
  { time: '05:24', label: 'Web Browser', seconds: 324 },
  { time: '11:23', label: 'Basic Syntax', seconds: 683 },
  { time: '15:04', label: 'ตัวแปร JavaScript 3 ตัว', seconds: 904 },
  { time: '23:54', label: 'JavaScript Output', seconds: 1434 },
  { time: '32:11', label: 'JavaScript Statements', seconds: 1931 },
  { time: '34:34', label: 'JavaScript Syntax', seconds: 2074 },
  { time: '40:07', label: 'JavaScript Comments', seconds: 2407 },
  { time: '43:18', label: 'Indent Best Practice', seconds: 2598 },
  { time: '46:03', label: 'JavaScript Variables', seconds: 2763 },
  { time: '56:24', label: 'Block and Global Scope', seconds: 3384 },
  { time: '01:00:55', label: 'JavaScript Operators', seconds: 3655 },
  { time: '01:03:04', label: 'JavaScript Data Types', seconds: 3784 },
  { time: '01:13:52', label: 'JavaScript Functions', seconds: 4432 },
  { time: '01:21:21', label: 'JavaScript Objects', seconds: 4881 },
  { time: '01:36:58', label: 'JavaScript Primitives', seconds: 5818 },
  { time: '01:38:21', label: 'JavaScript Events', seconds: 5901 },
  { time: '01:46:57', label: 'JavaScript Strings', seconds: 6417 },
  { time: '01:53:30', label: 'Template Strings', seconds: 6810 },
  { time: '01:57:49', label: 'JavaScript Numbers', seconds: 7069 },
  { time: '02:01:08', label: 'JavaScript Arrays', seconds: 7268 },
  { time: '02:06:39', label: 'Array Methods', seconds: 7599 },
  { time: '02:12:09', label: 'Array Iteration', seconds: 7929 },
  { time: '02:27:01', label: 'Conditional Statements', seconds: 8821 },
  { time: '02:31:15', label: 'Switch Statement', seconds: 9075 },
  { time: '02:34:34', label: 'Ternary Operator', seconds: 9274 },
  { time: '02:37:04', label: 'JavaScript For loop', seconds: 9424 },
  { time: '02:42:32', label: 'Loop Examples', seconds: 9752 },
  { time: '02:50:30', label: 'JavaScript Destructuring', seconds: 10230 },
  { time: '03:00:37', label: 'JavaScript Scope', seconds: 10837 },
  { time: '03:08:33', label: 'This Keyword', seconds: 11313 },
  { time: '03:16:27', label: 'Arrow Function', seconds: 11787 },
  { time: '03:20:47', label: 'JavaScript Modules', seconds: 12047 },
  { time: '03:26:36', label: 'Fetch API & JSON', seconds: 12396 },
  { time: '03:45:13', label: 'Outro', seconds: 13513 },
];

function VideoPlayer({ videoId, tsList, startTime, endTime, durationLabel }: { videoId: string; tsList: typeof timestamps; startTime: number; endTime: number; durationLabel: string }) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const seekTo = (seconds: number) => { setCurrentTime(seconds); setPlaying(true); };
  if (playing) {
    return (<div><div className="relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-black">
      <iframe src={"https://www.youtube.com/embed/" + videoId + "?autoplay=1&start=" + currentTime + "&end=" + endTime} className="w-full aspect-video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
      <p className="mt-4 text-sm text-gray-500">กดข้ามไปเนื้อหาที่ต้องการได้เลย</p>
      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">{tsList.map((t, i) => (<button key={i} onClick={() => seekTo(t.seconds)} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm hover:border-blue-400 hover:bg-blue-50 transition"><span className="font-mono text-xs font-semibold text-blue-600 whitespace-nowrap">{t.time}</span><span className="text-gray-700 truncate">{t.label}</span></button>))}</div></div>);
  }
  return (<div><div className="relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-black cursor-pointer group" onClick={() => setPlaying(true)}>
    <img src={"https://img.youtube.com/vi/" + videoId + "/maxresdefault.jpg"} alt="Video thumbnail" className="w-full aspect-video object-cover" />
    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition">
      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </div>
    </div>
    <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">{durationLabel}</div>
  </div>
  <p className="mt-4 text-sm text-gray-500">กดเพื่อเริ่มเล่น หรือเลือกช่วงเวลาด้านล่าง</p>
  <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">{tsList.map((t, i) => (<button key={i} onClick={() => seekTo(t.seconds)} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm hover:border-blue-400 hover:bg-blue-50 transition"><span className="font-mono text-xs font-semibold text-blue-600 whitespace-nowrap">{t.time}</span><span className="text-gray-700 truncate">{t.label}</span></button>))}</div></div>);
}



const sections = [
  { title: "รายการเรียนทั้งหมด", lessons: [
    { num: "01", title: "Introduction", duration: "1 นาที 39 วินาที", free: true },
    { num: "02", title: "JavaScript คืออะไร?", duration: "1 นาที 51 วินาที", free: true },
    { num: "03", title: "Vscode & Extensions", duration: "2 นาที 55 วินาที", free: true },
    { num: "04", title: "แนะนำ Web Browser & ก้าวสู่ JavaScript ใน Web Browser", duration: "5 นาที 59 วินาที", free: true },
    { num: "05", title: "พื้นฐาน JavaScript Syntax", duration: "3 นาที 41 วินาที", free: true },
  ]},
  { title: "JavaScript Fundamentals", lessons: [
    { num: "06", title: "3 ตัวแปร JavaScript", duration: "8 นาที 50 วินาที" , free: false },
    { num: "07", title: "การแสดงผลข้อมูลบน JavaScript ( JavaScript Output )", duration: "8 นาที 16 วินาที" , free: false },
    { num: "08", title: "รู้จัก JavaScript Statement", duration: "2 นาที 23 วินาที" , free: false },
    { num: "09", title: "รู้จัก JavaScript Syntax", duration: "5 นาที 32 วินาที" , free: false },
    { num: "10", title: "รู้จัก JavaScript Comments", duration: "3 นาที 11 วินาที" , free: false },
  ]},
  { title: "Operators & Conditions", lessons: [
    { num: "11", title: "JavaScript Operators", duration: "6 นาที 20 วินาที" , free: false },
    { num: "12", title: "JavaScript Comparison", duration: "4 นาที 45 วินาที" , free: false },
    { num: "13", title: "JavaScript If Else", duration: "7 นาที 30 วินาที" , free: false },
    { num: "14", title: "JavaScript Switch Case", duration: "5 นาที 10 วินาที" , free: false },
    { num: "15", title: "Ternary Operator", duration: "3 นาที 20 วินาที" , free: false },
  ]},
  { title: "Loops & Functions", lessons: [
    { num: "16", title: "JavaScript For Loop", duration: "8 นาที 10 วินาที" , free: false },
    { num: "17", title: "JavaScript While Loop", duration: "5 นาที 30 วินาที" , free: false },
    { num: "18", title: "JavaScript Do While", duration: "4 นาที 15 วินาที" , free: false },
    { num: "19", title: "JavaScript Break & Continue", duration: "6 นาที 40 วินาที" , free: false },
    { num: "20", title: "JavaScript Functions", duration: "9 นาที 15 วินาที" , free: false },
    { num: "21", title: "Parameters & Arguments", duration: "7 นาที 20 วินาที" , free: false },
    { num: "22", title: "Return Statement", duration: "5 นาที 45 วินาที" , free: false },
  ]},
  { title: "Arrays & Objects", lessons: [
    { num: "23", title: "JavaScript Arrays", duration: "10 นาที 30 วินาที" , free: false },
    { num: "24", title: "Array Methods", duration: "12 นาที 15 วินาที" , free: false },
    { num: "25", title: "Spread Operator", duration: "6 นาที 50 วินาที" , free: false },
    { num: "26", title: "Destructuring Arrays", duration: "5 นาที 20 วินาที" , free: false },
    { num: "27", title: "JavaScript Objects", duration: "11 นาที 40 วินาที" , free: false },
    { num: "28", title: "Object Methods", duration: "8 นาที 10 วินาที" , free: false },
    { num: "29", title: "Destructuring Objects", duration: "4 นาที 55 วินาที" , free: false },
    { num: "30", title: "JSON", duration: "6 นาที 30 วินาที" , free: false },
  ]},
  { title: "DOM Manipulation", lessons: [
    { num: "31", title: "DOM คืออะไร?", duration: "7 นาที 20 วินาที" , free: false },
    { num: "32", title: "querySelector & querySelectorAll", duration: "9 นาที 45 วินาที" , free: false },
    { num: "33", title: "textContent & innerHTML", duration: "6 นาที 15 วินาที" , free: false },
    { num: "34", title: "getAttribute & setAttribute", duration: "5 นาที 30 วินาที" , free: false },
    { num: "35", title: "classList", duration: "7 นาที 10 วินาที" , free: false },
    { num: "36", title: "addEventListener", duration: "10 นาที 20 วินาที" , free: false },
    { num: "37", title: "Event Object", duration: "8 นาที 35 วินาที" , free: false },
    { num: "38", title: "Form Handling", duration: "11 นาที 50 วินาที" , free: false },
    { num: "39", title: "createElement & appendChild", duration: "9 นาที 25 วินาที" , free: false },
    { num: "40", title: "removeChild & replaceChild", duration: "6 นาที 40 วินาที" , free: false },
  ]},
  { title: "Advanced Topics", lessons: [
    { num: "41", title: "setTimeout & setInterval", duration: "7 นาที 55 วินาที" , free: false },
    { num: "42", title: "Fetch API", duration: "12 นาที 30 วินาที" , free: false },
    { num: "43", title: "Async/Await", duration: "10 นาที 15 วินาที" , free: false },
    { num: "44", title: "Promise", duration: "9 นาที 40 วินาที" , free: false },
    { num: "45", title: "Error Handling", duration: "6 นาที 20 วินาที" , free: false },
    { num: "46", title: "LocalStorage & SessionStorage", duration: "8 นาที 10 วินาที" , free: false },
    { num: "47", title: "Regular Expressions", duration: "11 นาที 45 วินาที" , free: false },
    { num: "48", title: "Map, Filter, Reduce", duration: "13 นาที 20 วินาที" , free: false },
    { num: "49", title: "Closure", duration: "8 นาที 50 วินาที" , free: false },
    { num: "50", title: "Hoisting & Scope", duration: "7 นาที 30 วินาที" , free: false },
  ]},
  { title: "Workshop & Projects", lessons: [
    { num: "51", title: "Calculator Project", duration: "15 นาที 10 วินาที" , free: false },
    { num: "52", title: "Todo List Project", duration: "18 นาที 25 วินาที" , free: false },
    { num: "53", title: "Weather App Project", duration: "14 นาที 50 วินาที" , free: false },
    { num: "54", title: "Quiz App Project", duration: "12 นาที 35 วินาที" , free: false },
    { num: "55", title: "Final Summary & Next Steps", duration: "4 นาที 20 วินาที" , free: false },
  ]},
];

export default function JavaScriptMasteryPage() {
  const router = useRouter();
  const [tab, setTab] = useState("details");
  const [open, setOpen] = useState([0]);
  const [completed, setCompleted] = useState(false);
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
        title="JavaScript Mastery"
        tabs={[{id:"details",label:"รายละเอียดคอร์ส"},{id:"curriculum",label:"เนื้อหาคอร์ส"},{id:"reviews",label:"รีวิวผู้เรียน"}]}
        activeTab={tab}
        onTabChange={setTab}
      />
      <div className="mx-auto max-w-5xl px-5 py-8">
        {tab==="details"&&<div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">JavaScript Mastery</h1>
          <Link href="/instructor/milerdev" className="mt-3 flex items-center gap-2 group"><div className="h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-transparent transition group-hover:ring-blue-300"><img src="/milerdev-profile.png" alt="MilerDev" className="h-full w-full object-cover" /></div><p className="text-sm text-gray-500">จาก <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition">MilerDev</span></p></Link>
          <p className="mt-6 text-lg text-gray-700 leading-relaxed">คอร์ส JavaScript Mastery คอร์สที่จะพาทุกคนมาเป็น "เซียน" เขียนเว็บด้วย JavaScript ซึ่งเป็นอีกหนึ่งภาษาที่มีความสำคัญอย่างมากในการเป็น Web Developer ในคอร์สจะพาทุกคนมาเรียนรู้ตั้งแต่พื้นฐานสำคัญหลักๆ ใน JavaScript ที่จะต้องรู้, เข้าใจเรื่องของ DOM, และจะพาทุกคนมาทำ Workshop แบบจัดเต็ม รวมเนื้อหาในคอร์สทั้งหมดเน้นๆ 50 กว่าบทเรียน</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-gray-200 bg-white px-6 py-4"><span className="flex items-center gap-2 text-sm text-gray-600"><Clock className="h-4 w-4 text-gray-400" strokeWidth={2} />55 บทเรียน · 6 ชม. 50 นาที</span><span className="flex items-center gap-2 text-sm text-gray-600"><BookOpen className="h-4 w-4 text-gray-400" strokeWidth={2} />รวม 7 ห้อง</span><span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">ฟรี</span></div>
          <div className="mt-8"><h2 className="text-xl font-bold text-gray-900 mb-4">วิดีโอการสอน</h2><VideoPlayer videoId="sNicJct3dcI" tsList={timestamps} startTime={38} endTime={13513} durationLabel="3:45:13" /></div>
        </div>}
        {tab==="curriculum"&&<div>
          <div className="flex items-center justify-between mb-6"><h1 className="text-3xl font-bold text-gray-900">เนื้อหาการเรียน</h1><span className="text-sm text-gray-500">{total} บท · 6 ชม. 50 นาที · 7 ห้อง</span></div>
          <div className="space-y-4">{sections.map((sec,sIdx)=>(<div key={sIdx} className="rounded-2xl border border-gray-200 bg-white overflow-hidden"><button onClick={()=>setOpen((p: number[])=>p.includes(sIdx)?p.filter(i=>i!==sIdx):[...p,sIdx])} className="flex w-full items-center justify-between p-5 text-left hover:bg-gray-50"><span className="font-bold text-gray-900">{sec.title}</span><svg className={"h-5 w-5 text-gray-400 transition-transform "+(open.includes(sIdx)?"rotate-180":"")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg></button>{open.includes(sIdx)&&<div className="border-t border-gray-100">{sec.lessons.map((l,lIdx)=>(<div key={lIdx} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 border-b border-gray-50 last:border-0"><div className="flex items-center gap-4"><span className="w-8 text-sm text-gray-400 font-medium">{l.num}</span><div><p className="font-medium text-gray-900">{l.title}</p><p className="text-xs text-gray-500 mt-0.5">{l.duration}</p></div></div>{l.free ? <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 whitespace-nowrap">ดูฟรี</span> : <span className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>ล็อก</span>}</div>))}</div>}</div>))}</div>
        </div>}
        {tab==="reviews"&&<div><h1 className="text-3xl font-bold text-gray-900 mb-6">รีวิวผู้เรียน</h1><div className="rounded-2xl border border-gray-200 bg-white py-16 text-center"><p className="text-lg font-semibold text-gray-900">ยังไม่มีรีวิว</p></div></div>}
      </div>

      {completed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
            <div className="mb-4 text-6xl">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900">ยินดีด้วย!</h2>
            <p className="mt-3 text-gray-600">คุณเรียนคอร์สนี้จบแล้ว</p>
            <button onClick={() => setCompleted(false)} className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">ปิด</button>
          </div>
        </div>
      )}
    </main>
  );
}
