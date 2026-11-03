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

  const comment = await prisma.communityComment.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!comment) {
    return NextResponse.json({ error: "ไม่พบความคิดเห็น" }, { status: 404 });
  }

  if (comment.authorId !== session.userId) {
    return NextResponse.json({ error: "ลบได้เฉพาะความคิดเห็นของตัวเอง" }, { status: 403 });
  }

  await prisma.communityComment.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
