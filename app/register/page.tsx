"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return { label: "อ่อน", color: "bg-red-500", width: "33%" };
  if (score <= 3) return { label: "กลาง", color: "bg-amber-500", width: "66%" };
  return { label: "แข็งแรง", color: "bg-emerald-500", width: "100%" };
}

const baseInput =
  "w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:bg-white focus:ring-1";

function fieldClass(hasError: boolean) {
  return `${baseInput} ${
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
      : "border-gray-200 focus:border-blue-600 focus:ring-blue-600"
  }`;
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const strength = getPasswordStrength(password);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "กรุณากรอกชื่อ";
    if (!username.trim()) newErrors.username = "กรุณากรอกชื่อผู้ใช้";
    else if (!/^[a-zA-Z0-9_.]{3,20}$/.test(username.trim()))
      newErrors.username = "ชื่อผู้ใช้ 3-20 ตัว ใช้ได้เฉพาะ a-z, 0-9, _ และ .";
    if (!email.trim()) newErrors.email = "กรุณากรอกอีเมล";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    if (password.length < 8) newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัว";
    else if (!/[A-Z]/.test(password)) newErrors.password = "ต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว";
    else if (!/[a-z]/.test(password)) newErrors.password = "ต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว";
    else if (!/[0-9]/.test(password)) newErrors.password = "ต้องมีตัวเลขอย่างน้อย 1 ตัว";
    if (password !== confirmPassword) newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    if (!agreed) newErrors.agreed = "กรุณายอมรับเงื่อนไข";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ submit: data.error || "เกิดข้อผิดพลาด" });
        setLoading(false);
        return;
      }
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");
      const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
      window.location.href = `/login?registered=true${safeNext ? `&next=${encodeURIComponent(safeNext)}` : ""}`;
    } catch {
      setErrors({ submit: "เกิดข้อผิดพลาด กรุณาลองใหม่" });
      setLoading(false);
    }
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">สมัครสมาชิก</h1>
          <p className="mt-1.5 text-sm text-gray-600">สร้างบัญชีเพื่อเข้าเรียนและร่วมชุมชน</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-800">
                ชื่อ
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ชื่อที่ใช่จริง จะแสดงในชุมชน"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                className={fieldClass(Boolean(errors.name))}
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

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
                aria-invalid={Boolean(errors.username)}
                className={fieldClass(Boolean(errors.username))}
              />
              {errors.username ? (
                <p className="mt-1 text-xs text-red-600">{errors.username}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">3-20 ตัว ใช้ a-z, 0-9, _ และ . เท่านั้น</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-800">
                อีเมล
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                className={fieldClass(Boolean(errors.email))}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-800">
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="อย่างน้อย 8 ตัว มี A-z และตัวเลข"
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.password)}
                  className={`${fieldClass(Boolean(errors.password))} pr-12`}
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

              {password.length > 0 && (
                <div className="mt-2">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs text-gray-500">ความแข็งแรง</span>
                    <span className="text-xs font-medium text-gray-700">{strength.label}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full transition-all ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                </div>
              )}
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-gray-800"
              >
                ยืนยันรหัสผ่าน
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.confirmPassword)}
                className={fieldClass(Boolean(errors.confirmPassword))}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <div>
              <label className="flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-blue-600"
                />
                <span className="text-sm leading-relaxed text-gray-600">
                  ฉันยอมรับ{" "}
                  <span className="font-medium text-blue-600">เงื่อนไขการใช้งาน</span> และ{" "}
                  <span className="font-medium text-blue-600">นโยบายความเป็นส่วนตัว</span>
                </span>
              </label>
              {errors.agreed && <p className="mt-1 text-xs text-red-600">{errors.agreed}</p>}
            </div>

            {errors.submit && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errors.submit}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" aria-hidden />}
              {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
            </button>
          </form>

          <p className="mt-6 border-t border-gray-100 pt-5 text-center text-sm text-gray-600">
            มีบัญชีอยู่แล้ว?{" "}
            <Link href="/login" className="font-semibold text-gray-900 transition hover:text-blue-600">
              เข้าสู่ระบบ
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
