import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนกดถูกใจ" }, { status: 401 });
  }

  const { id } = await params;

  const post = await prisma.communityPost.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!post) {
    return NextResponse.json({ error: "ไม่พบโพสต์" }, { status: 404 });
  }

  const existing = await prisma.communityLike.findUnique({
    where: { postId_userId: { postId: id, userId: session.userId } },
    select: { id: true },
  });

  if (existing) {
    await prisma.communityLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.communityLike.create({
      data: { postId: id, userId: session.userId },
    });
  }

  const likeCount = await prisma.communityLike.count({ where: { postId: id } });

  return NextResponse.json({ liked: !existing, likeCount });
}
