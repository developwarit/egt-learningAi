"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { CircleCheck, Eye, EyeOff, Loader2 } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600";

function LoginForm() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const rawNext = searchParams.get("next");
  // รับเฉพาะ path ภายในเว็บเท่านั้น กัน open redirect
  const nextPath = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : null;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        window.location.href = nextPath || "/courses";
        return;
      }
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf9f7] px-4 py-12 text-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/courses"
            className="text-xl font-bold tracking-tight text-gray-900 transition hover:text-gray-700"
          >
            EGT-Learning
          </Link>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-[0_20px_50px_-32px_rgba(15,23,42,0.4)] sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">เข้าสู่ระบบ</h1>
          <p className="mt-1.5 text-sm text-gray-600">ยินดีต้อนรับกลับมา</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {registered && (
              <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <CircleCheck size={16} className="mt-0.5 shrink-0" aria-hidden />
                สมัครสมาชิกสำเร็จ เข้าสู่ระบบเพื่อเริ่มเรียนได้เลย
              </div>
            )}

            {error && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-gray-800">
                ชื่อผู้ใช้
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
                className={inputClass}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <label htmlFor="password" className="block text-sm font-medium text-gray-800">
                  รหัสผ่าน
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-blue-600 transition hover:text-blue-700"
                >
                  ลืมรหัสผ่าน?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                  aria-pressed={showPassword}
                  className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" aria-hidden />}
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          <p className="mt-6 border-t border-gray-100 pt-5 text-center text-sm text-gray-600">
            ยังไม่มีบัญชี?{" "}
            <Link
              href={nextPath ? `/register?next=${encodeURIComponent(nextPath)}` : "/register"}
              className="font-semibold text-gray-900 transition hover:text-blue-600"
            >
              สมัครสมาชิก
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-sm">
          <Link href="/courses" className="text-gray-500 transition hover:text-gray-900">
            กลับหน้าหลัก
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
