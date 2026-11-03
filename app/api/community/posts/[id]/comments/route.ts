import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

const MAX_BODY_LENGTH = 500;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนคอมเมนต์" }, { status: 401 });
  }

  const limited = checkRateLimit(`community-comment:${session.userId}`, 20, 60_000);
  if (!limited.allowed) {
    return NextResponse.json({ error: "คอมเมนต์ถี่เกินไป ลองใหม่ในอีกสักครู่" }, { status: 429 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    const payload = await request.json();
    body = typeof payload?.body === "string" ? payload.body.trim() : "";
  } catch {
    return NextResponse.json({ error: "ข้อมูลที่ส่งมาไม่ถูกต้อง" }, { status: 400 });
  }

  if (typeof body !== "string" || body.length === 0) {
    return NextResponse.json({ error: "พิมพ์ความคิดเห็นก่อนส่ง" }, { status: 400 });
  }
  if (body.length > MAX_BODY_LENGTH) {
    return NextResponse.json({ error: "ความคิดเห็นยาวเกินไป" }, { status: 400 });
  }

  const post = await prisma.communityPost.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!post) {
    return NextResponse.json({ error: "ไม่พบโพสต์" }, { status: 404 });
  }

  const comment = await prisma.communityComment.create({
    data: { postId: id, authorId: session.userId, body },
    select: {
      id: true,
      body: true,
      createdAt: true,
      author: { select: { id: true, name: true, image: true } },
    },
  });

  return NextResponse.json(
    { comment: { ...comment, createdAt: comment.createdAt.toISOString() } },
    { status: 201 }
  );
}
