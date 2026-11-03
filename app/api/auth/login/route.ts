import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signSession } from "@/lib/session";
import { checkRateLimit, getIPFromRequest } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getIPFromRequest(request);
    const { allowed, remaining } = checkRateLimit(`login:${ip}`, 5, 60000);

    if (!allowed) {
      return NextResponse.json(
        { error: "ลองใหม่อีกครั้งใน 1 นาที (จำกัด 5 ครั้ง/นาที)" },
        { status: 429 }
      );
    }

    const body = await request.json();
    // รองรับทั้ง username และอีเมล (เผื่อบัญชีเก่าที่ตั้งไว้ก่อนมี username)
    const identifier = String(body.username ?? body.email ?? "").trim();
    const password = String(body.password ?? "");

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" },
        { status: 400 }
      );
    }

    const user = identifier.includes("@")
      ? await prisma.user.findUnique({ where: { email: identifier } })
      : await prisma.user.findUnique({ where: { username: identifier.toLowerCase() } });

    if (!user || !user.hashedPassword) {
      return NextResponse.json(
        { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // Create JWT session
    const token = await signSession({
      userId: user.id,
      email: user.email ?? "",
      name: user.name,
    });

    const response = NextResponse.json({
      message: "เข้าสู่ระบบสำเร็จ",
      user: { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role },
    });

    // Set JWT cookie
    response.headers.append(
      "Set-Cookie",
      `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
