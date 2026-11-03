import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const { id } = await params;

  const post = await prisma.communityPost.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!post) {
    return NextResponse.json({ error: "ไม่พบโพสต์" }, { status: 404 });
  }

  if (post.authorId !== session.userId) {
    return NextResponse.json({ error: "ลบได้เฉพาะโพสต์ของตัวเอง" }, { status: 403 });
  }

  await prisma.communityPost.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
