"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2, Upload } from "lucide-react";

interface UserProfile {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  image: string | null;
  role: string;
  createdAt: string;
  accounts: { provider: string }[];
}

type Flash = { type: "success" | "error"; text: string } | null;

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 aria-[invalid=true]:border-red-400";

const saveButtonClass =
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-gray-900 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400";

function initialsOf(name: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ข้อความสำเร็จหายเองใน 4 วินาที ข้อความ error ค้างไว้ให้อ่าน
function useFlash() {
  const [flash, setFlash] = useState<Flash>(null);
  useEffect(() => {
    if (flash?.type !== "success") return;
    const timer = setTimeout(() => setFlash(null), 4000);
    return () => clearTimeout(timer);
  }, [flash]);
  return [flash, setFlash] as const;
}

function Status({ flash }: { flash: Flash }) {
  if (!flash) return null;
  return (
    <p
      role="status"
      aria-live="polite"
      className={`mt-3 flex items-start gap-1.5 text-sm ${flash.type === "success" ? "text-green-700" : "text-red-600"}`}
    >
      {flash.type === "success" && <Check className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} />}
      {flash.text}
    </p>
  );
}

function SettingsCard({
  title,
  description,
  footer,
  children,
  saveLabel = "บันทึก",
  onSubmit,
  saving,
  disabled,
  disabledHint,
  flash,
}: {
  title: string;
  description: string;
  footer: string;
  children: React.ReactNode;
  saveLabel?: string;
  onSubmit?: () => void;
  saving?: boolean;
  disabled?: boolean;
  disabledHint?: string;
  flash?: Flash;
}) {
  const formId = `settings-${useId()}`;
  return (
    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition hover:border-gray-300">
      <form
        id={formId}
        onSubmit={(e) => {
          e.preventDefault();
          if (!disabled && !saving) onSubmit?.();
        }}
        className="px-5 py-5 sm:px-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">{title}</h2>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
        <div className="mt-4">{children}</div>
        <Status flash={flash ?? null} />
      </form>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-5 py-3 sm:px-6">
        <p className="text-xs text-gray-600 sm:text-sm">{disabled && disabledHint ? disabledHint : footer}</p>
        <button type="submit" form={formId} disabled={disabled || saving} className={saveButtonClass}>
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {saving ? "กำลังบันทึก..." : saveLabel}
        </button>
      </div>
    </section>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // ชื่อที่แสดง
  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameFlash, setNameFlash] = useFlash();

  // ชื่อผู้ใช้
  const [username, setUsername] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);
  const [usernameFlash, setUsernameFlash] = useFlash();

  // รูปอวตาร
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [savingImage, setSavingImage] = useState(false);
  const [imageFlash, setImageFlash] = useFlash();
  const [dragging, setDragging] = useState(false);

  // รหัสผ่าน
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordFlash, setPasswordFlash] = useFlash();
  const [passwordStep, setPasswordStep] = useState<"form" | "otp">("form");
  const [passwordOtpRequired, setPasswordOtpRequired] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  // นับถอยหลังก่อนให้กดส่งรหัส OTP ซ้ำ
  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const applyUser = (next: UserProfile) => {
    setUser(next);
    setName(next.name ?? "");
    setUsername(next.username ?? "");
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        applyUser(data.user);
        setPasswordOtpRequired(Boolean(data.passwordOtpRequired));
      } else {
        window.location.href = "/login?next=/profile";
        return;
      }
    } catch {
      window.location.href = "/login?next=/profile";
      return;
    }
    setLoading(false);
  };

  const patchProfile = async (payload: Record<string, unknown>) => {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");
    applyUser(data.user);
    return data.user as UserProfile;
  };

  const handleSaveName = async () => {
    setNameFlash(null);
    setSavingName(true);
    try {
      await patchProfile({ name });
      setNameFlash({ type: "success", text: "บันทึกชื่อที่แสดงแล้ว" });
    } catch (err) {
      setNameFlash({ type: "error", text: err instanceof Error ? err.message : "เกิดข้อผิดพลาด" });
    }
    setSavingName(false);
  };

  const handleSaveUsername = async () => {
    setUsernameFlash(null);
    setSavingUsername(true);
    try {
      await patchProfile({ username });
      setUsernameFlash({ type: "success", text: "บันทึกชื่อผู้ใช้แล้ว" });
    } catch (err) {
      setUsernameFlash({ type: "error", text: err instanceof Error ? err.message : "เกิดข้อผิดพลาด" });
    }
    setSavingUsername(false);
  };

  // ย่อรูปในเบราว์เซอร์ก่อนอัปโหลด เพื่อไม่ให้เก็บไฟล์ใหญ่ลงฐานข้อมูล
  const handlePickImage = async (file: File | undefined) => {
    if (!file) return;
    setImageFlash(null);

    if (!file.type.startsWith("image/")) {
      setImageFlash({ type: "error", text: "กรุณาเลือกไฟล์รูปภาพ (JPG, PNG หรือ WebP)" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageFlash({ type: "error", text: "ไฟล์ใหญ่เกิน 5 MB กรุณาเลือกรูปอื่น" });
      return;
    }

    setSavingImage(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("อ่านไฟล์ไม่สำเร็จ"));
        reader.readAsDataURL(file);
      });

      const resized = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const size = 256;
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("เบราว์เซอร์ไม่รองรับการย่อรูป"));
          const scale = Math.max(size / img.width, size / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, size, size);
          ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.onerror = () => reject(new Error("ไฟล์รูปเสียหาย กรุณาเลือกรูปอื่น"));
        img.src = dataUrl;
      });

      await patchProfile({ image: resized });
      setImageFlash({ type: "success", text: "อัปเดตรูปโปรไฟล์แล้ว" });
    } catch (err) {
      setImageFlash({ type: "error", text: err instanceof Error ? err.message : "อัปโหลดรูปไม่สำเร็จ" });
    }
    setSavingImage(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setDragging(false);
  };

  const handleRemoveImage = async () => {
    setImageFlash(null);
    setSavingImage(true);
    try {
      await patchProfile({ image: null });
      setImageFlash({ type: "success", text: "ลบรูปโปรไฟล์แล้ว" });
    } catch (err) {
      setImageFlash({ type: "error", text: err instanceof Error ? err.message : "เกิดข้อผิดพลาด" });
    }
    setSavingImage(false);
  };

  const passwordRules = [
    { ok: newPassword.length >= 8, label: "อย่างน้อย 8 ตัวอักษร" },
    { ok: /[A-Z]/.test(newPassword), label: "มีตัวพิมพ์ใหญ่" },
    { ok: /[a-z]/.test(newPassword), label: "มีตัวพิมพ์เล็ก" },
    { ok: /[0-9]/.test(newPassword), label: "มีตัวเลข" },
  ];
  const passwordValid = passwordRules.every((r) => r.ok);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  // ขอรหัส OTP 6 หลักทางอีเมล ก่อนยืนยันเปลี่ยนรหัสผ่าน (แบบเดียวกับ Vercel)
  const requestPasswordOtp = async () => {
    setPasswordFlash(null);
    setSendingOtp(true);
    try {
      const res = await fetch("/api/profile/password/otp", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "ส่งรหัสยืนยันไม่สำเร็จ");
      setOtpEmail(data.email || user?.email || "");
      setOtp(["", "", "", "", "", ""]);
      setResendIn(60);
      setPasswordStep("otp");
      setPasswordFlash({
        type: "success",
        text: data.delivered === false ? "โหมดพัฒนา: รหัส OTP อยู่ใน log ของ dev server" : "ส่งรหัสยืนยันแล้ว กรุณาตรวจสอบอีเมล",
      });
      setTimeout(() => otpRefs.current[0]?.focus(), 80);
    } catch (err) {
      setPasswordFlash({ type: "error", text: err instanceof Error ? err.message : "ส่งรหัสยืนยันไม่สำเร็จ" });
    }
    setSendingOtp(false);
  };

  const submitPassword = async (code?: string) => {
    setPasswordFlash(null);
    if (!passwordValid) {
      setPasswordFlash({ type: "error", text: "รหัสผ่านใหม่ยังไม่ตรงตามเงื่อนไข" });
      return;
    }
    if (!passwordsMatch) {
      setPasswordFlash({ type: "error", text: "รหัสผ่านใหม่ไม่ตรงกัน" });
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(code ? { currentPassword, newPassword, code } : { currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setPasswordFlash({ type: "success", text: "เปลี่ยนรหัสผ่านสำเร็จ" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setOtp(["", "", "", "", "", ""]);
        setPasswordStep("form");
        setResendIn(0);
      } else if (data.requireOtp) {
        // เผื่อกรณีหน้าเว็บไม่ได้ข้อมูล OTP ตั้งแต่แรก
        setPasswordOtpRequired(true);
        await requestPasswordOtp();
      } else {
        setPasswordFlash({ type: "error", text: data.error || "เกิดข้อผิดพลาด" });
        if (data.otpFailed) {
          setOtp(["", "", "", "", "", ""]);
          otpRefs.current[0]?.focus();
        }
      }
    } catch {
      setPasswordFlash({ type: "error", text: "เกิดข้อผิดพลาด กรุณาลองใหม่" });
    }
    setChangingPassword(false);
  };

  const handlePasswordSave = () => {
    if (passwordStep === "otp") return submitPassword(otp.join(""));
    if (passwordOtpRequired) return requestPasswordOtp();
    return submitPassword();
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((prev) => prev.map((d, i) => (i === index ? digit : d)));
    setPasswordFlash(null);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) otpRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!digits) return;
    e.preventDefault();
    const next = ["", "", "", "", "", ""];
    digits.split("").forEach((d, i) => {
      next[i] = d;
    });
    setOtp(next);
    setPasswordFlash(null);
    otpRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  const cancelOtpStep = () => {
    setPasswordStep("form");
    setOtp(["", "", "", "", "", ""]);
    setResendIn(0);
    setPasswordFlash(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf9f7]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  const roleLabel = user.role === "ADMIN" ? "ผู้ดูแล" : user.role === "STUDENT" ? "นักเรียน" : user.role;
  const joinedAt = new Date(user.createdAt).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <header className="border-b border-gray-200 bg-[#faf9f7]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-base font-bold text-gray-900 transition hover:opacity-70">
            <span className="text-blue-600">EGT</span>-Learning
          </Link>
          <Link href="/courses" className="inline-flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            คอร์สของฉัน
          </Link>
        </div>
      </header>

      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-3xl px-5 py-3.5 sm:px-6">
          <h1 className="text-center text-sm font-semibold text-gray-900">ตั้งค่าบัญชี</h1>
        </div>
      </div>

      <main className="mx-auto max-w-3xl space-y-5 px-5 py-7 sm:px-6 sm:py-8">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-gray-500">
          <span className="rounded-full bg-blue-50 px-2 py-0.5 font-medium text-blue-700">{roleLabel}</span>
          <span aria-hidden>·</span>
          <span>สมาชิกตั้งแต่ {joinedAt}</span>
          {user.accounts.length > 0 && (
            <>
              <span aria-hidden>·</span>
              <span>เชื่อมต่อ {user.accounts.map((a) => a.provider).join(", ")}</span>
            </>
          )}
        </div>

        {/* Avatar */}
        <SettingsCard
          title="รูปโปรไฟล์"
          description="รูปนี้จะแสดงในหน้าชุมชนและคอร์สของคุณ"
          footer="อัปโหลดได้ทั้ง JPG, PNG และ WebP (ระบบย่อรูปให้อัตโนมัติ)"
          saveLabel="เลือกไฟล์"
          onSubmit={() => fileInputRef.current?.click()}
          saving={savingImage}
          flash={imageFlash}
        >
          <div className="flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                handlePickImage(e.dataTransfer.files?.[0]);
              }}
              className={`w-full rounded-lg border border-dashed px-3 py-2.5 text-xs transition sm:max-w-xs ${
                dragging ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-gray-50/60 text-gray-500"
              }`}
            >
              {user.image ? (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={savingImage}
                  className="text-xs text-gray-600 underline-offset-2 transition hover:text-red-600 hover:underline disabled:opacity-50"
                >
                  ลบรูปปัจจุบัน
                </button>
              ) : (
                <span>ลากรูปมาวางตรงนี้ หรือกด “เลือกไฟล์”</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={savingImage}
              className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-blue-600 ring-1 ring-gray-200 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              aria-label="เปลี่ยนรูปโปรไฟล์"
            >
              {user.image ? (
                <img src={user.image} alt={user.name || "รูปโปรไฟล์"} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-xl font-bold text-white">
                  {initialsOf(user.name)}
                </span>
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                {savingImage ? (
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                ) : (
                  <Upload className="h-5 w-5 text-white" strokeWidth={2} />
                )}
              </span>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => handlePickImage(e.target.files?.[0])}
          />
        </SettingsCard>

        {/* Display Name */}
        <SettingsCard
          title="ชื่อที่แสดง"
          description="ชื่อที่เพื่อน ๆ และผู้สอนเห็นเมื่อคุณโพสต์ในชุมชน"
          footer="ใช้ได้ไม่เกิน 32 ตัวอักษร"
          disabledHint="ยังไม่มีการเปลี่ยนแปลง"
          onSubmit={handleSaveName}
          saving={savingName}
          disabled={!name.trim() || name.trim() === (user.name ?? "")}
          flash={nameFlash}
        >
          <label htmlFor="display-name" className="sr-only">
            ชื่อที่แสดง
          </label>
          <div className="relative max-w-xs">
            <input
              id="display-name"
              type="text"
              value={name}
              maxLength={32}
              onChange={(e) => {
                setName(e.target.value);
                setNameFlash(null);
              }}
              placeholder="ชื่อของคุณ"
              className={`${inputClass} pr-12`}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400">
              {name.length}/32
            </span>
          </div>
        </SettingsCard>

        {/* Username */}
        <SettingsCard
          title="ชื่อผู้ใช้"
          description="ใช้ล็อกอินและแสดงเป็นชื่อย่อของคุณในระบบ"
          footer="อย่างน้อย 3 ตัว ใช้ a-z, 0-9, _ และ . เท่านั้น"
          disabledHint="ยังไม่มีการเปลี่ยนแปลง"
          onSubmit={handleSaveUsername}
          saving={savingUsername}
          disabled={username.trim().length < 3 || username.trim() === (user.username ?? "")}
          flash={usernameFlash}
        >
          <label htmlFor="username" className="sr-only">
            ชื่อผู้ใช้
          </label>
          <div className="flex max-w-xs items-stretch">
            <span className="flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
              @
            </span>
            <input
              id="username"
              type="text"
              value={username}
              maxLength={20}
              onChange={(e) => {
                setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ""));
                setUsernameFlash(null);
              }}
              placeholder="username"
              className={`${inputClass} rounded-l-none`}
              aria-describedby="username-hint"
            />
          </div>
          <p id="username-hint" className="mt-1.5 text-xs text-gray-500">
            {username.trim().length > 0 && username.trim().length < 3
              ? "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร"
              : `${username.length}/20 ตัวอักษร`}
            {!user.username && " · บัญชีนี้ยังไม่มีชื่อผู้ใช้ ตั้งเลยเพื่อให้ล็อกอินด้วยชื่อผู้ใช้ได้"}
          </p>
        </SettingsCard>

        {/* Email */}
        <SettingsCard
          title="อีเมล"
          description="อีเมลที่ใช้เข้าสู่ระบบและรับการแจ้งเตือน"
          footer="อีเมลใช้ระบุตัวตน จึงแก้ไขเองไม่ได้"
          disabledHint="ติดต่อผู้ดูแลระบบหากต้องการเปลี่ยนอีเมล"
          disabled
        >
          <div className="flex max-w-xs items-center gap-2">
            <input type="email" value={user.email ?? ""} disabled className={inputClass} aria-label="อีเมล" />
            <Check className="h-4 w-4 shrink-0 text-green-600" strokeWidth={2.5} />
          </div>
        </SettingsCard>

        {/* Password */}
        <SettingsCard
          title="รหัสผ่าน"
          description={
            passwordStep === "otp"
              ? "ยืนยันรหัส OTP ที่ส่งไปอีเมล เพื่อเปลี่ยนรหัสผ่าน"
              : "เปลี่ยนรหัสผ่านเพื่อความปลอดภัยของบัญชี"
          }
          footer={
            passwordStep === "otp"
              ? "รหัส 6 หลักมีอายุ 10 นาที"
              : "อย่างน้อย 8 ตัว พร้อมตัวพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข"
          }
          disabledHint={passwordStep === "otp" ? "กรอกรหัส 6 หลักให้ครบ" : "กรอกรหัสผ่านให้ครบตามเงื่อนไขเพื่อบันทึก"}
          saveLabel={passwordStep === "otp" ? "ยืนยันและเปลี่ยนรหัสผ่าน" : "บันทึก"}
          onSubmit={handlePasswordSave}
          saving={changingPassword || sendingOtp}
          disabled={
            passwordStep === "otp"
              ? otp.join("").length !== 6
              : !currentPassword || !passwordValid || !passwordsMatch
          }
          flash={passwordFlash}
        >
          {passwordStep === "otp" ? (
            <div className="max-w-sm">
              <p className="text-sm text-gray-700">
                ส่งรหัส 6 หลักไปที่ <span className="font-medium text-gray-900">{otpEmail || user.email}</span> แล้ว
              </p>
              <div className="mt-3 flex gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    inputMode="numeric"
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    aria-label={`รหัส OTP หลักที่ ${i + 1}`}
                    className="h-11 w-10 rounded-md border border-gray-300 bg-white text-center text-lg font-semibold text-gray-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs">
                <button
                  type="button"
                  onClick={requestPasswordOtp}
                  disabled={resendIn > 0 || sendingOtp}
                  className="font-medium text-blue-600 transition hover:text-blue-700 disabled:cursor-not-allowed disabled:text-gray-400"
                >
                  {resendIn > 0 ? `ส่งรหัสใหม่ได้ใน ${resendIn} วิ` : "ส่งรหัสใหม่"}
                </button>
                <button
                  type="button"
                  onClick={cancelOtpStep}
                  className="text-gray-500 underline-offset-2 transition hover:text-gray-800 hover:underline"
                >
                  ย้อนกลับ
                </button>
              </div>
            </div>
          ) : (
            <>
          <div className="grid max-w-xs gap-3">
            <label className="block">
              <span className="mb-1.5 block text-sm text-gray-700">รหัสผ่านปัจจุบัน</span>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setPasswordFlash(null);
                }}
                className={inputClass}
                autoComplete="current-password"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-gray-700">รหัสผ่านใหม่</span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordFlash(null);
                }}
                className={inputClass}
                autoComplete="new-password"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-gray-700">ยืนยันรหัสผ่านใหม่</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordFlash(null);
                }}
                className={inputClass}
                autoComplete="new-password"
                aria-invalid={confirmPassword.length > 0 && !passwordsMatch}
              />
            </label>
          </div>

          {newPassword.length > 0 && (
            <ul className="mt-3 grid gap-1 text-xs sm:grid-cols-2">
              {passwordRules.map((rule) => (
                <li
                  key={rule.label}
                  className={`flex items-center gap-1.5 ${rule.ok ? "text-green-700" : "text-gray-500"}`}
                >
                  <span
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-full ${
                      rule.ok ? "bg-green-600 text-white" : "border border-gray-300"
                    }`}
                  >
                    {rule.ok && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                  </span>
                  {rule.label}
                </li>
              ))}
            </ul>
          )}
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="mt-2 text-xs text-red-600">รหัสผ่านใหม่ทั้งสองช่องยังไม่ตรงกัน</p>
          )}
            </>
          )}
        </SettingsCard>
      </main>
    </div>
  );
}
