import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./language-context";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "EGT-LearningAi",
  icons: {
    icon: "/favicon.svg",
  },
  description:
    "Portfolio of Warit Panyeam, a fullstack developer building modern web applications from polished interfaces to reliable backend logic.",
  keywords: ["fullstack developer", "frontend developer", "React", "Next.js", "TypeScript", "portfolio"],
  authors: [{ name: "Warit Panyeam" }],
  openGraph: {
    title: "Warit Panyeam | Portfolio",
    description:
      "Portfolio of Warit Panyeam, a fullstack developer building modern web applications from polished interfaces to reliable backend logic.",
    url: "https://portofolio-rho-sand-92.vercel.app/",
    siteName: "Warit Panyeam Portfolio",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${kanit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-kanit)]">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
