import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";
import { createPasswordOtp } from "@/lib/password-otp";
import { isPasswordOtpEnabled, maskEmail, sendOtpEmail } from "@/lib/email";

// POST - ส่งรหัส OTP 6 หลักไปยังอีเมลของผู้ใช้ ก่อนเปลี่ยนรหัสผ่าน
export async function POST(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  if (!isPasswordOtpEnabled()) {
    return NextResponse.json({ error: "ระบบยังไม่ได้ตั้งค่าการส่งอีเมล" }, { status: 503 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { email: true, hashedPassword: true },
  });

  if (!user?.email) {
    return NextResponse.json({ error: "บัญชีนี้ไม่มีอีเมลสำหรับรับรหัสยืนยัน" }, { status: 400 });
  }

  // จำกัดการขอรหัส 3 ครั้งต่อ 10 นาที ต่อบัญชี
  const { allowed } = checkRateLimit(`pwd-otp:${session.userId}`, 3, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "ขอรหัสบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่" },
      { status: 429 }
    );
  }

  try {
    const { code } = await createPasswordOtp(session.userId);
    const { delivered } = await sendOtpEmail({ to: user.email, code });

    return NextResponse.json({
      message: "ส่งรหัสยืนยันแล้ว",
      email: maskEmail(user.email),
      delivered,
    });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "EMAIL_NOT_CONFIGURED") {
      return NextResponse.json({ error: "ระบบยังไม่ได้ตั้งค่าการส่งอีเมล" }, { status: 503 });
    }
    console.error("Send password OTP error:", error);
    return NextResponse.json({ error: "ส่งรหัสยืนยันไม่สำเร็จ กรุณาลองใหม่" }, { status: 500 });
  }
}
