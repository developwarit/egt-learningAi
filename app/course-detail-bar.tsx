"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export type CourseTab = { id: string; label: string };

export default function CourseDetailBar({
  title,
  tabs,
  activeTab,
  onTabChange,
}: {
  title: string;
  tabs?: CourseTab[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
}) {
  return (
    <div
      className={
        "sticky top-0 z-40 bg-white/85 backdrop-blur-md " +
        (tabs ? "" : "border-b border-gray-200/80")
      }
    >
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-3">
        <Link
          href="/courses/catalog"
          className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:text-gray-900 hover:shadow-md active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            strokeWidth={2.2}
          />
          คอร์สทั้งหมด
        </Link>
        <span aria-hidden className="hidden h-5 w-px shrink-0 bg-gray-200 sm:block" />
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900">
          {title}
        </span>
      </div>

      {tabs ? (
        <div className="mx-auto max-w-5xl border-b border-gray-200/80 px-5">
          <div className="flex gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((t) => {
              const active = t.id === activeTab;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onTabChange?.(t.id)}
                  aria-current={active ? "page" : undefined}
                  className={
                    "-mb-px whitespace-nowrap border-b-2 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 " +
                    (active
                      ? "border-blue-600 text-blue-700"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900")
                  }
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
