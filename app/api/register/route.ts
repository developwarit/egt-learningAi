import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getIPFromRequest } from "@/lib/rate-limit";

// Zod schema สำหรับ validate ข้อมูล
const registerSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อ"),
  username: z
    .string()
    .trim()
    .min(3, "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัว")
    .max(20, "ชื่อผู้ใช้ต้องไม่เกิน 20 ตัว")
    .regex(/^[a-zA-Z0-9_.]+$/, "ชื่อผู้ใช้ใช้ได้เฉพาะ a-z, 0-9, _ และ ."),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z
    .string()
    .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัว")
    .regex(/[A-Z]/, "ต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว")
    .regex(/[a-z]/, "ต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว")
    .regex(/[0-9]/, "ต้องมีตัวเลขอย่างน้อย 1 ตัว"),
});

export async function POST(request: Request) {
  try {
    const ip = getIPFromRequest(request);
    const { allowed, remaining } = checkRateLimit(`register:${ip}`, 3, 60000);

    if (!allowed) {
      return NextResponse.json(
        { error: "ลองใหม่อีกครั้งใน 1 นาที (จำกัด 3 ครั้ง/นาที)" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;
    // เก็บ username เป็นตัวพิมพ์เล็กเสมอ เพื่อให้ล็อกอินได้ไม่ต้องสนตัวพิมพ์
    const username = result.data.username.toLowerCase();

    // ตรวจสอบว่าอีเมลซ้ำหรือไม่
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "อีเมลนี้ถูกใช้แล้ว" },
        { status: 400 }
      );
    }

    // ตรวจสอบว่า username ซ้ำหรือไม่
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "ชื่อผู้ใช้นี้ถูกใช้แล้ว" },
        { status: 400 }
      );
    }

    // Hash รหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 12);

    // สร้างผู้ใช้ใหม่
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        hashedPassword,
        emailVerified: new Date(),
      },
    });

    return NextResponse.json(
      { message: "สมัครสมาชิกสำเร็จ", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
