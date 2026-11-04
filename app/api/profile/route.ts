import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";

const profileSelect = {
  id: true,
  name: true,
  username: true,
  email: true,
  image: true,
  role: true,
  createdAt: true,
  accounts: { select: { provider: true } },
} satisfies Prisma.UserSelect;

const usernamePattern = /^[a-z0-9_.]+$/;
// รูปอวตารถูกย่อฝั่ง client ก่อนส่งมาเป็น data URL จึงจำกัดขนาดไว้กัน payload ใหญ่เกิน
const maxImageLength = 400_000;

// GET - ดึงข้อมูล profile
export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: profileSelect,
  });

  if (!user) {
    return NextResponse.json({ error: "ไม่พบผู้ใช้" }, { status: 404 });
  }

  return NextResponse.json({ user });
}

// PATCH - อัปเดตข้อมูล profile (ชื่อที่แสดง, ชื่อผู้ใช้, รูปอวตาร)
export async function PATCH(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  let body: { name?: unknown; username?: unknown; image?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const data: Prisma.UserUpdateInput = {};

  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name) {
      return NextResponse.json({ error: "กรุณากรอกชื่อที่แสดง" }, { status: 400 });
    }
    if (name.length > 32) {
      return NextResponse.json({ error: "ชื่อที่แสดงต้องไม่เกิน 32 ตัวอักษร" }, { status: 400 });
    }
    data.name = name;
  }

  if (body.username !== undefined) {
    const username = String(body.username).trim().toLowerCase();
    if (username.length < 3 || username.length > 20) {
      return NextResponse.json({ error: "ชื่อผู้ใช้ต้องมี 3-20 ตัวอักษร" }, { status: 400 });
    }
    if (!usernamePattern.test(username)) {
      return NextResponse.json({ error: "ชื่อผู้ใช้ใช้ได้เฉพาะ a-z, 0-9, _ และ ." }, { status: 400 });
    }
    data.username = username;
  }

  if (body.image !== undefined) {
    if (body.image === null || body.image === "") {
      data.image = null;
    } else if (typeof body.image === "string" && body.image.startsWith("data:image/")) {
      if (body.image.length > maxImageLength) {
        return NextResponse.json({ error: "รูปมีขนาดใหญ่เกินไป กรุณาเลือกรูปใหม่" }, { status: 400 });
      }
      data.image = body.image;
    } else {
      return NextResponse.json({ error: "รูปแบบรูปภาพไม่ถูกต้อง" }, { status: 400 });
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "ไม่มีข้อมูลที่จะอัปเดต" }, { status: 400 });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: session.userId },
      data,
      select: profileSelect,
    });

    return NextResponse.json({ user: updated, message: "บันทึกข้อมูลสำเร็จ" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "ชื่อผู้ใช้นี้ถูกใช้แล้ว" }, { status: 400 });
    }
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด กรุณาลองใหม่" }, { status: 500 });
  }
}
