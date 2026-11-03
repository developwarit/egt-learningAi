import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const post = await prisma.communityPost.findUnique({
    where: { id },
    select: { image: true, imageType: true },
  });

  if (!post?.image) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(new Uint8Array(post.image), {
    headers: {
      "Content-Type": post.imageType || "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(post.image.length),
    },
  });
}
