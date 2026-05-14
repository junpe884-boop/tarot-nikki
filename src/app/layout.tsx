import type { Metadata, Viewport } from "next";
import { Geist, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const notoSerifJP = Noto_Serif_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-serif-jp",
});

export const metadata: Metadata = {
  title: "タロット日記 — 朝、カードを引く。夜、現実を記す。",
  description:
    "毎朝タロットを引いて、夜に日記を書く。月末、AIがカードと現実のつながりを読み解く。占いじゃない、内省のための静かな習慣。",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "タロット日記",
  },
  openGraph: {
    title: "タロット日記",
    description: "朝、カードを引く。夜、現実を記す。月末、物語になる。",
    locale: "ja_JP",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0618",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geist.variable} ${notoSerifJP.variable} h-full`}>
      <body className="min-h-full flex flex-col" style={{ background: "#0d0618" }}>{children}</body>
    </html>
  );
}
