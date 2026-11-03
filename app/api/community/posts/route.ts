import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

const PAGE_SIZE = 8;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_CAPTION_LENGTH = 2000;

function adminEmails(): string[] {
  return (process.env.COMMUNITY_ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

type CommentRow = {
  id: string;
  body: string;
  createdAt: Date;
  author: { id: string; name: string | null; image: string | null };
};

type PostRow = {
  id: string;
  caption: string | null;
  createdAt: Date;
  imageType: string | null;
  author: { id: string; name: string | null; image: string | null };
  _count: { likes: number; comments: number };
  likes?: { id: string }[];
  comments?: CommentRow[];
};

function toPost(row: PostRow) {
  return {
    id: row.id,
    caption: row.caption,
    createdAt: row.createdAt.toISOString(),
    author: row.author,
    likeCount: row._count.likes,
    commentCount: row._count.comments,
    comments: (row.comments ?? []).map((comment) => ({
      id: comment.id,
      body: comment.body,
      createdAt: comment.createdAt.toISOString(),
      author: comment.author,
    })),
    liked: Array.isArray(row.likes) && row.likes.length > 0,
    hasImage: Boolean(row.imageType),
  };
}

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบเพื่อเข้าชมชุมชน" }, { status: 401 });
  }

  const cursor = new URL(request.url).searchParams.get("cursor");

  const rows = (await prisma.communityPost.findMany({
    take: PAGE_SIZE + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: {
      id: true,
      caption: true,
      createdAt: true,
      imageType: true,
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { likes: true, comments: true } },
      likes: { where: { userId: session.userId }, select: { id: true }, take: 1 },
      comments: {
        orderBy: { createdAt: "asc" },
        take: 50,
        select: {
          id: true,
          body: true,
          createdAt: true,
          author: { select: { id: true, name: true, image: true } },
        },
      },
    },
  })) as PostRow[];

  const hasMore = rows.length > PAGE_SIZE;
  const page = hasMore ? rows.slice(0, PAGE_SIZE) : rows;

  return NextResponse.json({
    posts: page.map(toPost),
    nextCursor: hasMore ? page[page.length - 1].id : null,
  });
}

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนโพสต์" }, { status: 401 });
  }

  const allowed = adminEmails();
  if (allowed.length > 0 && !allowed.includes((session.email || "").toLowerCase())) {
    return NextResponse.json({ error: "บัญชีนี้ยังไม่ได้รับสิทธิ์โพสต์" }, { status: 403 });
  }

  const limited = checkRateLimit(`community-post:${session.userId}`, 10, 60_000);
  if (!limited.allowed) {
    return NextResponse.json({ error: "โพสต์ถี่เกินไป ลองใหม่อีกครั้งในอีกสักครู่" }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "ข้อมูลที่ส่งมาไม่ถูกต้อง" }, { status: 400 });
  }

  const captionRaw = form.get("caption");
  const caption = typeof captionRaw === "string" ? captionRaw.trim() : "";
  const file = form.get("image");

  if (caption.length > MAX_CAPTION_LENGTH) {
    return NextResponse.json({ error: "ข้อความยาวเกินไป" }, { status: 400 });
  }

  let image: Uint8Array<ArrayBuffer> | undefined;
  let imageType: string | undefined;

  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "ไฟล์ต้องเป็นรูปภาพ" }, { status: 400 });
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "รูปใหญ่เกิน 5MB" }, { status: 413 });
    }
    const bytes = await file.arrayBuffer();
    image = new Uint8Array(bytes);
    imageType = file.type;
  }

  if (!image && !caption) {
    return NextResponse.json({ error: "ใส่รูปหรือข้อความก่อนโพสต์" }, { status: 400 });
  }

  const created = await prisma.communityPost.create({
    data: {
      caption: caption || null,
      image,
      imageType,
      authorId: session.userId,
    },
    select: {
      id: true,
      caption: true,
      createdAt: true,
      imageType: true,
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  return NextResponse.json({ post: toPost({ ...created, likes: [], comments: [] }) }, { status: 201 });
}
