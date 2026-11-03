"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Heart,
  ImagePlus,
  Loader2,
  LogIn,
  MessageCircle,
  Send,
  Trash2,
  Users,
  X,
} from "lucide-react";

type Author = { id: string; name: string | null; image: string | null };

type Post = {
  id: string;
  caption: string | null;
  createdAt: string;
  author: Author;
  likeCount: number;
  commentCount: number;
  comments: Comment[];
  liked: boolean;
  hasImage: boolean;
};

type Comment = {
  id: string;
  body: string;
  createdAt: string;
  author: Author;
};

type Me = { id: string; name: string | null; email: string | null; image: string | null } | null;

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "เมื่อสักครู่";
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} วันที่แล้ว`;
  return new Date(iso).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function initials(name: string | null) {
  if (!name) return "EG";
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

async function prepareImage(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/")) {
    throw new Error("ไฟล์ต้องเป็นรูปภาพ");
  }
  try {
    const bitmap = await createImageBitmap(file);
    const maxEdge = 1600;
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85)
    );
    bitmap.close();
    return blob ?? file;
  } catch {
    return file;
  }
}

export default function CommunityPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me>(null);
  const [meLoaded, setMeLoaded] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<Post | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [sendingComment, setSendingComment] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFeed = useCallback(async (cursor?: string) => {
    const response = await fetch(
      `/api/community/posts${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ""}`
    );
    const data = await response.json();
    return {
      posts: (data.posts ?? []) as Post[],
      nextCursor: (data.nextCursor ?? null) as string | null,
    };
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const meResponse = await fetch("/api/auth/me");
        const meData = await meResponse.json();
        if (!active) return;

        const currentUser = (meData.user ?? null) as Me;
        setMe(currentUser);
        setMeLoaded(true);

        if (!currentUser) {
          setLoading(false);
          return;
        }

        const { posts: items, nextCursor: cursor } = await loadFeed();
        if (!active) return;
        setPosts(items);
        setNextCursor(cursor);
      } catch {
        if (active) setError("โหลดฟีดไม่สำเร็จ ลองรีเฟรชอีกครั้ง");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [loadFeed]);

  const closeGate = useCallback(() => {
    router.replace("/courses");
  }, [router]);

  useEffect(() => {
    if (!meLoaded || me) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeGate();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [meLoaded, me, closeGate]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!lightbox) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightbox]);

  const handleLoadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const { posts: items, nextCursor: cursor } = await loadFeed(nextCursor);
      setPosts((current) => [...current, ...items]);
      setNextCursor(cursor);
    } catch {
      setError("โหลดโพสต์เพิ่มไม่สำเร็จ");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (posting) return;
    if (!caption.trim() && !file) {
      setError("ใส่รูปหรือข้อความก่อนโพสต์");
      return;
    }

    setPosting(true);
    setError(null);
    try {
      const form = new FormData();
      if (caption.trim()) form.append("caption", caption.trim());
      if (file) {
        const prepared = await prepareImage(file);
        form.append("image", prepared, "community.jpg");
      }

      const response = await fetch("/api/community/posts", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "โพสต์ไม่สำเร็จ");
        return;
      }

      setPosts((current) => [data.post as Post, ...current]);
      setCaption("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setError("อัปโหลดไม่สำเร็จ ลองอีกครั้ง");
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (post: Post) => {
    if (!me) {
      window.location.href = "/login";
      return;
    }
    setPosts((current) =>
      current.map((item) =>
        item.id === post.id
          ? {
              ...item,
              liked: !item.liked,
              likeCount: item.likeCount + (item.liked ? -1 : 1),
            }
          : item
      )
    );
    try {
      const response = await fetch(`/api/community/posts/${post.id}/like`, { method: "POST" });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setPosts((current) =>
        current.map((item) =>
          item.id === post.id ? { ...item, liked: data.liked, likeCount: data.likeCount } : item
        )
      );
    } catch {
      setPosts((current) =>
        current.map((item) =>
          item.id === post.id
            ? {
                ...item,
                liked: post.liked,
                likeCount: post.likeCount,
              }
            : item
        )
      );
    }
  };

  const handleDelete = async (post: Post) => {
    if (!window.confirm("ลบโพสต์นี้?")) return;
    const response = await fetch(`/api/community/posts/${post.id}`, { method: "DELETE" });
    if (response.ok) {
      setPosts((current) => current.filter((item) => item.id !== post.id));
    } else {
      setError("ลบโพสต์ไม่สำเร็จ");
    }
  };

  const handleComment = async (event: React.FormEvent, postId: string) => {
    event.preventDefault();
    if (!me) {
      router.push("/login?next=/community");
      return;
    }
    const draft = (commentDrafts[postId] || "").trim();
    if (!draft || sendingComment) return;

    setSendingComment(postId);
    setError(null);
    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: draft }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "ส่งความคิดเห็นไม่สำเร็จ");
        return;
      }
      const newComment = data.comment as Comment;
      setPosts((current) =>
        current.map((item) =>
          item.id === postId
            ? {
                ...item,
                comments: [...item.comments, newComment],
                commentCount: item.commentCount + 1,
              }
            : item
        )
      );
      setCommentDrafts((current) => ({ ...current, [postId]: "" }));
      setExpandedComments((current) => ({ ...current, [postId]: true }));
    } catch {
      setError("ส่งความคิดเห็นไม่สำเร็จ ลองอีกครั้ง");
    } finally {
      setSendingComment(null);
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    const response = await fetch(`/api/community/comments/${commentId}`, { method: "DELETE" });
    if (!response.ok) {
      setError("ลบความคิดเห็นไม่สำเร็จ");
      return;
    }
    setPosts((current) =>
      current.map((item) =>
        item.id === postId
          ? {
              ...item,
              comments: item.comments.filter((comment) => comment.id !== commentId),
              commentCount: Math.max(0, item.commentCount - 1),
            }
          : item
      )
    );
  };

  return (
    <main className="min-h-screen bg-[#faf9f7] text-gray-900">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-[#faf9f7]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link href="/courses" className="text-lg font-bold tracking-tight text-gray-900">
            EGT-Learning
          </Link>
          <Link
            href="/courses"
            className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:bg-white hover:text-gray-900 hover:shadow"
          >
            <ArrowLeft
              size={16}
              strokeWidth={2}
              className="transition group-hover:-translate-x-0.5"
              aria-hidden
            />
            <span className="hidden sm:inline">กลับหน้าหลัก</span>
            <span className="sm:hidden">กลับ</span>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-5 pb-24 pt-28 sm:px-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">ชุมชน</h1>
        <p className="mt-2 text-sm text-gray-600">
          รูปและเรื่องราวจากห้องเรียน — สำหรับสมาชิกที่เข้าสู่ระบบแล้ว
        </p>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5">
          {!meLoaded ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 size={16} className="animate-spin" aria-hidden />
              กำลังตรวจสอบบัญชี…
            </div>
          ) : me ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {me.image ? (
                    <img
                      src={me.image}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    initials(me.name)
                  )}
                </div>
                <textarea
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                  rows={2}
                  maxLength={2000}
                  placeholder={`เขียนอะไรสักหน่อย ${me.name || ""}`.trim()}
                  className="min-w-0 flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-gray-400 focus:bg-white"
                />
              </div>

              {preview && (
                <div className="relative overflow-hidden rounded-xl border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="ตัวอย่างรูปที่จะโพสต์" className="max-h-80 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                    aria-label="เอารูปออก"
                  >
                    <X size={16} aria-hidden />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                  <ImagePlus size={16} aria-hidden />
                  เลือกรูป
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const selected = event.target.files?.[0] ?? null;
                      if (selected && selected.size > 10 * 1024 * 1024) {
                        setError("รูปใหญ่เกิน 10MB");
                        return;
                      }
                      setError(null);
                      setFile(selected);
                    }}
                  />
                </label>
                <button
                  type="submit"
                  disabled={posting}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {posting ? (
                    <Loader2 size={16} className="animate-spin" aria-hidden />
                  ) : (
                    <Send size={16} aria-hidden />
                  )}
                  โพสต์
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-600">เข้าสู่ระบบเพื่อลงรูปในชุมชน</p>
              <Link
                href="/login"
                className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-8 space-y-5">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-500">
              <Loader2 size={18} className="animate-spin" aria-hidden />
              กำลังโหลดฟีด…
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white/60 py-16 text-center">
              <p className="font-semibold text-gray-900">ยังไม่มีโพสต์ในชุมชน</p>
              <p className="mt-1 text-sm text-gray-500">ลงรูปแรกเพื่อเริ่มฟีดของที่นี่</p>
            </div>
          )}

          {posts.map((post) => (
            <article
              key={post.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
            >
              <div className="flex items-center gap-3 px-5 pt-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {post.author.image ? (
                    <img
                      src={post.author.image}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    initials(post.author.name)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-gray-900">
                    {post.author.name || "สมาชิก EGT-Learning"}
                  </p>
                  <p className="text-xs text-gray-500">{timeAgo(post.createdAt)}</p>
                </div>
                {me?.id === post.author.id && (
                  <button
                    type="button"
                    onClick={() => handleDelete(post)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-red-600"
                    aria-label="ลบโพสต์"
                  >
                    <Trash2 size={16} aria-hidden />
                  </button>
                )}
              </div>

              {post.caption && (
                <p className="whitespace-pre-wrap px-5 py-3 text-[15px] leading-relaxed text-gray-800">
                  {post.caption}
                </p>
              )}

              {post.hasImage && (
                <button
                  type="button"
                  onClick={() => setLightbox(post)}
                  className="block w-full cursor-zoom-in bg-gray-50"
                  aria-label="ดูรูปเต็ม"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/community/media/${post.id}`}
                    alt={post.caption || "รูปจากชุมชน"}
                    loading="lazy"
                    className="mx-auto max-h-[560px] w-full object-contain"
                  />
                </button>
              )}

              <div className="flex items-center gap-1 px-3 py-2">
                <button
                  type="button"
                  onClick={() => handleLike(post)}
                  aria-pressed={post.liked}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    post.liked
                      ? "bg-red-50 text-red-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Heart
                    size={17}
                    strokeWidth={2}
                    className={post.liked ? "fill-current" : ""}
                    aria-hidden
                  />
                  {post.likeCount > 0 ? post.likeCount : "ถูกใจ"}
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById(`comment-input-${post.id}`)?.focus()}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                >
                  <MessageCircle size={17} strokeWidth={2} aria-hidden />
                  {post.commentCount > 0 ? post.commentCount : "ความคิดเห็น"}
                </button>
              </div>

              {post.comments.length > 0 && (
                <div className="space-y-3 border-t border-gray-100 px-5 py-4">
                  {post.comments
                    .slice(0, expandedComments[post.id] ? post.comments.length : 2)
                    .map((comment) => (
                      <div key={comment.id} className="flex items-start gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                          {comment.author.image ? (
                            <img
                              src={comment.author.image}
                              alt=""
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            initials(comment.author.name)
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="rounded-2xl bg-gray-50 px-3.5 py-2">
                            <p className="text-sm font-semibold text-gray-900">
                              {comment.author.name || "สมาชิก EGT-Learning"}
                            </p>
                            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-700">
                              {comment.body}
                            </p>
                          </div>
                          <div className="mt-1 flex items-center gap-3 pl-1 text-xs text-gray-500">
                            <span>{timeAgo(comment.createdAt)}</span>
                            {me?.id === comment.author.id && (
                              <button
                                type="button"
                                onClick={() => handleDeleteComment(post.id, comment.id)}
                                className="transition hover:text-red-600"
                              >
                                ลบ
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                  {!expandedComments[post.id] && post.comments.length > 2 && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedComments((current) => ({ ...current, [post.id]: true }))
                      }
                      className="pl-11 text-sm font-medium text-gray-600 transition hover:text-gray-900"
                    >
                      ดูความคิดเห็นทั้งหมด ({post.commentCount})
                    </button>
                  )}
                </div>
              )}

              <form
                onSubmit={(event) => handleComment(event, post.id)}
                className="flex items-center gap-2 border-t border-gray-100 px-4 py-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-[11px] font-bold text-gray-600">
                  {me ? initials(me.name) : "?"}
                </div>
                <input
                  id={`comment-input-${post.id}`}
                  type="text"
                  value={commentDrafts[post.id] || ""}
                  onChange={(event) =>
                    setCommentDrafts((current) => ({ ...current, [post.id]: event.target.value }))
                  }
                  maxLength={500}
                  placeholder="เขียนความคิดเห็น..."
                  className="min-w-0 flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-gray-400 focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={sendingComment === post.id || !(commentDrafts[post.id] || "").trim()}
                  aria-label="ส่งความคิดเห็น"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-40"
                >
                  {sendingComment === post.id ? (
                    <Loader2 size={16} className="animate-spin" aria-hidden />
                  ) : (
                    <Send size={16} aria-hidden />
                  )}
                </button>
              </form>
            </article>
          ))}
        </div>

        {nextCursor && !loading && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-white disabled:opacity-60"
            >
              {loadingMore && <Loader2 size={16} className="animate-spin" aria-hidden />}
              โหลดโพสต์เพิ่ม
            </button>
          </div>
        )}
      </section>

      {meLoaded && !me && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="community-gate-title"
        >
          <div
            className="absolute inset-0 bg-[#faf9f7]/92 backdrop-blur-xl"
            onClick={closeGate}
            aria-hidden
          />

          <div className="relative w-full max-w-sm rounded-[28px] border border-gray-200/80 bg-white p-7 shadow-[0_28px_70px_-25px_rgba(15,23,42,0.45)]">
            <button
              type="button"
              onClick={closeGate}
              aria-label="ปิด"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <X size={17} aria-hidden />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
              <Users size={22} strokeWidth={2} aria-hidden />
            </div>

            <h2
              id="community-gate-title"
              className="mt-5 text-xl font-bold tracking-tight text-gray-900"
            >
              เข้าสู่ระบบก่อนเข้าชมชุมชน
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              ชุมชนนี้เปิดให้สมาชิกเท่านั้น เข้าสู่ระบบเพื่อดูรูปและเรื่องราวจากห้องเรียน
            </p>

            <div className="mt-6 space-y-2">
              <Link
                href="/login?next=/community"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <LogIn size={16} aria-hidden />
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="flex w-full items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                สมัครสมาชิกใหม่
              </Link>
            </div>

            <button
              type="button"
              onClick={closeGate}
              className="mt-4 w-full text-center text-sm text-gray-500 transition hover:text-gray-800"
            >
              ไว้ก่อน กลับหน้าหลัก
            </button>
          </div>
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-[120] flex flex-col bg-black/90 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="ดูรูปเต็ม"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 text-white/90">
            <p className="truncate text-sm font-medium">
              {lightbox.author.name || "สมาชิก EGT-Learning"}
            </p>
            <div className="flex shrink-0 items-center gap-1">
              <a
                href={`/api/community/media/${lightbox.id}`}
                target="_blank"
                rel="noreferrer"
                aria-label="เปิดรูปในแท็บใหม่"
                className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <ExternalLink size={18} aria-hidden />
              </a>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                aria-label="ปิด"
                className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <X size={20} aria-hidden />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="ปิด"
            className="flex flex-1 items-center justify-center overflow-hidden px-2 pb-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/community/media/${lightbox.id}`}
              alt={lightbox.caption || "รูปจากชุมชน"}
              className="max-h-full max-w-full rounded-lg object-contain"
            />
          </button>

          {lightbox.caption && (
            <p className="mx-auto max-w-2xl px-4 pb-6 text-center text-sm leading-relaxed text-white/80">
              {lightbox.caption}
            </p>
          )}
        </div>
      )}
    </main>
  );
}
