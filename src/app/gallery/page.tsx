"use client";

import { useState } from "react";
import Link from "next/link";
import { MAJOR_ARCANA, ELEMENT_COLORS } from "@/lib/tarot-data";

export default function GalleryPage() {
  const [selected, setSelected] = useState<typeof MAJOR_ARCANA[0] | null>(null);
  const [tab, setTab] = useState<"upright" | "reversed">("upright");

  return (
    <main className="min-h-screen px-4 py-8" style={{ background: "linear-gradient(180deg, #1a0a2e 0%, #0d0618 50%)" }}>

      {/* ヘッダー */}
      <header className="text-center mb-8">
        <p className="text-xs tracking-[0.3em] text-[#c9a84c] mb-2 opacity-80">TAROT NIKKI</p>
        <h1 className="serif text-2xl font-bold gold-text mb-1">大アルカナ 22枚</h1>
        <p className="text-[#c8bfad] text-xs mt-2 opacity-60">カードをタップして詳細を見る</p>
        <Link href="/" className="inline-block mt-3 text-[#c8bfad] text-xs opacity-40 hover:opacity-70 transition-opacity">
          ← アプリに戻る
        </Link>
      </header>

      {/* カードグリッド */}
      <div className="max-w-2xl mx-auto grid grid-cols-3 sm:grid-cols-4 gap-3 mb-10">
        {MAJOR_ARCANA.map((card) => {
          const ec = ELEMENT_COLORS[card.element] ?? "#c9a84c";
          const isSelected = selected?.id === card.id;
          return (
            <button
              key={card.id}
              onClick={() => {
                setSelected(isSelected ? null : card);
                setTab("upright");
              }}
              className="relative rounded-xl overflow-hidden transition-all duration-200"
              style={{
                border: isSelected ? `2px solid ${ec}` : "1.5px solid rgba(201,168,76,0.25)",
                boxShadow: isSelected ? `0 0 18px ${ec}55` : "none",
                aspectRatio: "512/820",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/cards/${card.id}.jpg`} alt={card.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(13,6,24,0.85) 100%)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-1.5 text-center">
                <p className="serif text-[#f5f0e8] text-xs font-bold leading-tight">{card.name}</p>
                <p className="text-[8px] opacity-50" style={{ color: ec }}>{card.en}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 詳細パネル */}
      {selected && (() => {
        const ec = ELEMENT_COLORS[selected.element] ?? "#c9a84c";
        const isRev = tab === "reversed";
        const keyword  = isRev ? selected.reversed_keyword  : selected.keyword;
        const message  = isRev ? selected.reversed_message  : selected.message;
        const question = isRev ? selected.reversed_question : selected.question;

        return (
          <div className="max-w-md mx-auto rounded-2xl p-6 mb-10 fade-in"
            style={{
              background: "rgba(45,27,105,0.35)",
              border: `1px solid ${ec}44`,
              backdropFilter: "blur(12px)",
            }}>

            {/* カード画像 + 基本情報 */}
            <div className="flex gap-5 mb-5">
              <div className="flex-shrink-0 w-24 rounded-xl overflow-hidden"
                style={{ border: `1.5px solid ${ec}88`, aspectRatio: "512/820" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/cards/${selected.id}.jpg`}
                  alt={selected.name}
                  className="w-full h-full object-cover"
                  style={{ transform: isRev ? "rotate(180deg)" : "none" }}
                />
              </div>
              <div className="flex-1">
                <p className="text-xs tracking-[0.2em] mb-0.5 opacity-60" style={{ color: ec }}>
                  {selected.en.toUpperCase()}
                </p>
                <p className="serif text-[#f5f0e8] font-bold text-2xl mb-2">{selected.name}</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: `${ec}22`, color: ec, border: `1px solid ${ec}44` }}>
                    {selected.element}元素
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#c8bfad", border: "1px solid rgba(255,255,255,0.1)" }}>
                    No.{selected.id}
                  </span>
                </div>
                <p className="text-xs mt-2 opacity-60" style={{ color: ec }}>{keyword}</p>
              </div>
            </div>

            {/* 正位置 / 逆位置 タブ */}
            <div className="flex rounded-xl overflow-hidden mb-4"
              style={{ border: "1px solid rgba(201,168,76,0.25)" }}>
              {(["upright", "reversed"] as const).map((t) => (
                <button key={t}
                  onClick={() => setTab(t)}
                  className="flex-1 py-2 text-xs transition-all"
                  style={{
                    background: tab === t ? "rgba(201,168,76,0.2)" : "transparent",
                    color: tab === t ? "#c9a84c" : "#c8bfad",
                  }}>
                  {t === "upright" ? "正位置" : "↓ 逆位置"}
                </button>
              ))}
            </div>

            {/* メッセージ */}
            <div className="rounded-xl p-4 mb-3"
              style={{ background: `${ec}0d`, border: `1px solid ${ec}22` }}>
              <p className="serif text-[#f5f0e8] text-sm leading-[2]">「{message}」</p>
            </div>

            {/* 問いかけ */}
            <div className="rounded-xl p-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)" }}>
              <p className="text-[#c9a84c] text-xs tracking-wider mb-1">✦ 今日の問いかけ</p>
              <p className="text-[#c8bfad] text-sm leading-relaxed">{question}</p>
            </div>

            <button onClick={() => setSelected(null)}
              className="mt-4 text-[#c8bfad] text-xs opacity-40 hover:opacity-70 transition-opacity w-full text-center">
              閉じる
            </button>
          </div>
        );
      })()}
    </main>
  );
}
