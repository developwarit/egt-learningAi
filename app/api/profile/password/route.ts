import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";
import { isPasswordOtpEnabled } from "@/lib/email";
import { verifyPasswordOtp } from "@/lib/password-otp";

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const { currentPassword, newPassword, code } = await request.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "กรุณากรอกรหัสผ่านทั้งสองช่อง" }, { status: 400 });
  }

  if (newPassword.length < 8) {
    return NextResponse.json({ error: "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัว" }, { status: 400 });
  }

  if (!/[A-Z]/.test(newPassword)) {
    return NextResponse.json({ error: "รหัสผ่านใหม่ต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว" }, { status: 400 });
  }

  if (!/[a-z]/.test(newPassword)) {
    return NextResponse.json({ error: "รหัสผ่านใหม่ต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว" }, { status: 400 });
  }

  if (!/[0-9]/.test(newPassword)) {
    return NextResponse.json({ error: "รหัสผ่านใหม่ต้องมีตัวเลขอย่างน้อย 1 ตัว" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) {
    return NextResponse.json({ error: "ไม่พบผู้ใช้" }, { status: 404 });
  }

  if (!user.hashedPassword) {
    return NextResponse.json({ error: "บัญชีนี้ยังไม่มีรหัสผ่าน กรุณาติดต่อผู้ดูแลระบบ" }, { status: 400 });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.hashedPassword);
  if (!isMatch) {
    return NextResponse.json({ error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" }, { status: 400 });
  }

  // ต้องยืนยันรหัส OTP จากอีเมลก่อนเปลี่ยนรหัสผ่าน (ตรวจหลังเช็กรหัสเดิมแล้ว เพื่อไม่ให้เผารหัส OTP ฟรี)
  if (isPasswordOtpEnabled()) {
    if (!code) {
      return NextResponse.json(
        { error: "กรุณายืนยันรหัส OTP จากอีเมลก่อน", requireOtp: true },
        { status: 428 }
      );
    }

    const result = await verifyPasswordOtp(session.userId, String(code).replace(/\D/g, ""));
    if (result !== "ok") {
      const messages: Record<string, string> = {
        invalid: "รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง",
        expired: "รหัส OTP หมดอายุแล้ว กรุณาขอรหัสใหม่",
        locked: "กรอกรหัสผิดหลายครั้งเกินไป กรุณาขอรหัสใหม่",
      };
      return NextResponse.json(
        { error: messages[result] ?? "ยืนยันรหัส OTP ไม่สำเร็จ", otpFailed: true },
        { status: 400 }
      );
    }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: session.userId }, data: { hashedPassword } });

  return NextResponse.json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });
}
