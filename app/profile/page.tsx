"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

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

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500";

const saveButtonClass =
  "shrink-0 rounded-md bg-gray-900 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400";

const fieldErrorClass = "mt-1.5 text-xs text-red-600";

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

function SettingsCard({
  title,
  description,
  footer,
  children,
  saveLabel = "บันทึก",
  onSave,
  saving,
  disabled,
  message,
  error,
}: {
  title: string;
  description: string;
  footer: string;
  children: React.ReactNode;
  saveLabel?: string;
  onSave?: () => void;
  saving?: boolean;
  disabled?: boolean;
  message?: string;
  error?: string;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="px-6 py-5">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="mt-1.5 text-sm text-gray-600">{description}</p>
        <div className="mt-4">{children}</div>
        {message && <p className="mt-3 text-sm text-green-700">{message}</p>}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-6 py-3">
        <p className="text-sm text-gray-600">{footer}</p>
        <button type="button" onClick={onSave} disabled={disabled || saving} className={saveButtonClass}>
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
  const [nameMsg, setNameMsg] = useState("");
  const [nameError, setNameError] = useState("");

  // ชื่อผู้ใช้
  const [username, setUsername] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);
  const [usernameMsg, setUsernameMsg] = useState("");
  const [usernameError, setUsernameError] = useState("");

  // รูปอวตาร
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [savingImage, setSavingImage] = useState(false);
  const [imageMsg, setImageMsg] = useState("");
  const [imageError, setImageError] = useState("");

  // รหัสผ่าน
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

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
      } else {
        window.location.href = "/login";
      }
    } catch {
      window.location.href = "/login";
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
    setNameMsg("");
    setNameError("");
    setSavingName(true);
    try {
      await patchProfile({ name });
      setNameMsg("บันทึกชื่อที่แสดงแล้ว");
    } catch (err) {
      setNameError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    }
    setSavingName(false);
  };

  const handleSaveUsername = async () => {
    setUsernameMsg("");
    setUsernameError("");
    setSavingUsername(true);
    try {
      await patchProfile({ username });
      setUsernameMsg("บันทึกชื่อผู้ใช้แล้ว");
    } catch (err) {
      setUsernameError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    }
    setSavingUsername(false);
  };

  // ย่อรูปในเบราว์เซอร์ก่อนอัปโหลด เพื่อไม่ให้เก็บไฟล์ใหญ่ลงฐานข้อมูล
  const handlePickImage = async (file: File | undefined) => {
    if (!file) return;
    setImageMsg("");
    setImageError("");

    if (!file.type.startsWith("image/")) {
      setImageError("กรุณาเลือกไฟล์รูปภาพ");
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
          ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.onerror = () => reject(new Error("ไฟล์รูปเสียหาย"));
        img.src = dataUrl;
      });

      await patchProfile({ image: resized });
      setImageMsg("อัปเดตรูปโปรไฟล์แล้ว");
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "อัปโหลดรูปไม่สำเร็จ");
    }
    setSavingImage(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = async () => {
    setImageMsg("");
    setImageError("");
    setSavingImage(true);
    try {
      await patchProfile({ image: null });
      setImageMsg("ลบรูปโปรไฟล์แล้ว");
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    }
    setSavingImage(false);
  };

  const handleChangePassword = async () => {
    setPasswordMsg("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setPasswordMsg("เปลี่ยนรหัสผ่านสำเร็จ");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(data.error || "เกิดข้อผิดพลาด");
      }
    } catch {
      setPasswordError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
    setChangingPassword(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  const roleLabel = user.role === "ADMIN" ? "ผู้ดูแล" : user.role === "STUDENT" ? "นักเรียน" : user.role;

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <header className="border-b border-gray-200 bg-[#faf9f7]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-base font-bold text-gray-900">
            <span className="text-blue-600">EGT</span>-Learning
          </Link>
          <Link href="/courses" className="text-sm text-gray-500 transition hover:text-gray-900">
            ไปที่คอร์สของฉัน
          </Link>
        </div>
      </header>

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <h1 className="text-center text-sm font-semibold text-gray-900">ตั้งค่าบัญชี</h1>
        </div>
      </div>

      <main className="mx-auto max-w-3xl space-y-6 px-6 py-8">
        <p className="text-center text-xs text-gray-500">
          {roleLabel} · สมัครเมื่อ {new Date(user.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" })}
          {user.accounts.length > 0 && ` · เชื่อมต่อ ${user.accounts.map((a) => a.provider).join(", ")}`}
        </p>

        {/* Avatar */}
        <SettingsCard
          title="รูปโปรไฟล์"
          description="รูปนี้จะแสดงในหน้าชุมชนและคอร์สของคุณ"
          footer="รูปโปรไฟล์ไม่บังคับ แต่แนะนำให้ตั้งไว้"
          saveLabel="เลือกไฟล์"
          onSave={() => fileInputRef.current?.click()}
          saving={savingImage}
          message={imageMsg}
          error={imageError}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {user.image ? (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={savingImage}
                  className="text-xs text-gray-500 underline-offset-2 transition hover:text-red-600 hover:underline disabled:opacity-50"
                >
                  ลบรูปปัจจุบัน
                </button>
              ) : (
                <p className="text-xs text-gray-500">ยังไม่มีรูปโปรไฟล์</p>
              )}
            </div>
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-blue-600 ring-1 ring-gray-200">
              {user.image ? (
                <img src={user.image} alt={user.name || "รูปโปรไฟล์"} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-xl font-bold text-white">
                  {initialsOf(user.name)}
                </span>
              )}
            </div>
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
          onSave={handleSaveName}
          saving={savingName}
          disabled={!name.trim() || name.trim() === (user.name ?? "")}
          message={nameMsg}
          error={nameError}
        >
          <input
            type="text"
            value={name}
            maxLength={32}
            onChange={(e) => {
              setName(e.target.value);
              setNameMsg("");
              setNameError("");
            }}
            placeholder="ชื่อของคุณ"
            className={`${inputClass} max-w-xs`}
          />
        </SettingsCard>

        {/* Username */}
        <SettingsCard
          title="ชื่อผู้ใช้"
          description="ใช้ล็อกอินและแสดงเป็นชื่อย่อของคุณในระบบ"
          footer="อย่างน้อย 3 ตัว ใช้ a-z, 0-9, _ และ . เท่านั้น"
          onSave={handleSaveUsername}
          saving={savingUsername}
          disabled={!username.trim() || username.trim() === (user.username ?? "")}
          message={usernameMsg}
          error={usernameError}
        >
          <div className="flex max-w-sm items-stretch">
            <span className="flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
              @
            </span>
            <input
              type="text"
              value={username}
              maxLength={20}
              onChange={(e) => {
                setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ""));
                setUsernameMsg("");
                setUsernameError("");
              }}
              placeholder="username"
              className={`${inputClass} rounded-l-none`}
            />
          </div>
          {!user.username && <p className={fieldErrorClass}>บัญชีนี้ยังไม่มีชื่อผู้ใช้ ตั้งเลยเพื่อให้ล็อกอินด้วยชื่อผู้ใช้ได้</p>}
        </SettingsCard>

        {/* Email */}
        <SettingsCard
          title="อีเมล"
          description="อีเมลที่ใช้เข้าสู่ระบบและรับการแจ้งเตือน"
          footer="อีเมลใช้ระบุตัวตน จึงแก้ไขเองไม่ได้"
          saveLabel="บันทึก"
          disabled
        >
          <input type="email" value={user.email ?? ""} disabled className={`${inputClass} max-w-sm`} />
        </SettingsCard>

        {/* Password */}
        <SettingsCard
          title="รหัสผ่าน"
          description="เปลี่ยนรหัสผ่านเพื่อความปลอดภัยของบัญชี"
          footer="อย่างน้อย 8 ตัว พร้อมตัวพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข"
          onSave={handleChangePassword}
          saving={changingPassword}
          disabled={!currentPassword || !newPassword || !confirmPassword}
          message={passwordMsg}
          error={passwordError}
        >
          <div className="grid max-w-sm gap-3">
            <label className="block">
              <span className="mb-1.5 block text-sm text-gray-700">รหัสผ่านปัจจุบัน</span>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setPasswordError("");
                  setPasswordMsg("");
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
                  setPasswordError("");
                  setPasswordMsg("");
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
                  setPasswordError("");
                  setPasswordMsg("");
                }}
                className={inputClass}
                autoComplete="new-password"
              />
            </label>
          </div>
        </SettingsCard>
      </main>
    </div>
  );
}
