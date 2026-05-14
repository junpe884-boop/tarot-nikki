"use client";

import { useState } from "react";
import Link from "next/link";
import { MAJOR_ARCANA, ELEMENT_COLORS } from "@/lib/tarot-data";

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function DemoPage() {
  const [drawnCard, setDrawnCard] = useState<typeof MAJOR_ARCANA[0] | null>(null);
  const [isReversed, setIsReversed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const drawCard = () => {
    if (isDrawing || drawnCard) return;
    setIsDrawing(true);
    setTimeout(() => {
      const card = MAJOR_ARCANA[Math.floor(Math.random() * MAJOR_ARCANA.length)];
      setDrawnCard(card);
      setIsReversed(Math.random() < 0.3);
      setIsDrawing(false);
    }, 1400);
  };

  const reset = () => {
    setDrawnCard(null);
    setIsReversed(false);
  };

  const elemColor = drawnCard ? (ELEMENT_COLORS[drawnCard.element] ?? "#c9a84c") : "#c9a84c";

  return (
    <main
      className="flex flex-col min-h-screen max-w-md mx-auto px-5 py-8"
      style={{ background: "linear-gradient(180deg, #1a0a2e 0%, #0d0618 50%)" }}
    >
      {/* ヘッダー */}
      <header className="text-center mb-8 fade-in">
        <p className="text-xs tracking-[0.3em] text-[#c9a84c] mb-2 opacity-80">TAROT NIKKI</p>
        <h1 className="text-3xl font-bold gold-text mb-1">タロット日記</h1>
        <p className="text-[#c8bfad] text-sm mt-1">{getTodayStr()}</p>
        <div className="inline-block mt-2 px-3 py-1 rounded-full text-xs"
          style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", color: "#c9a84c" }}>
          ✦ 無料体験版 — 保存機能は登録後に使えます
        </div>
      </header>

      {/* カードセクション */}
      <section className="mb-8 fade-in">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-lg">🌙</span>
            <h2 className="text-sm tracking-widest text-[#c9a84c]">今日のカード</h2>
          </div>

          {!drawnCard ? (
            /* カード裏面 */
            <div className="flex flex-col items-center gap-6">
              <button onClick={drawCard} disabled={isDrawing}
                className="relative w-44 h-72 rounded-2xl cursor-pointer group"
                aria-label="カードを引く"
              >
                <div className={`w-full h-full rounded-2xl transition-all duration-500 ${isDrawing ? "opacity-60 scale-95" : "card-glow group-hover:scale-105"}`}
                  style={{
                    background: "linear-gradient(135deg, #0d0618 0%, #2d1b69 40%, #1a0a2e 70%, #0d0618 100%)",
                    border: "1.5px solid rgba(201,168,76,0.6)",
                    boxShadow: "0 0 30px rgba(201,168,76,0.15), inset 0 0 30px rgba(45,27,105,0.5)",
                  }}
                >
                  <div className="absolute inset-3 rounded-xl" style={{ border: "1px solid rgba(201,168,76,0.25)" }} />
                  <div className="absolute inset-5 rounded-lg" style={{ border: "1px solid rgba(201,168,76,0.12)" }} />
                  {["top-3 left-3","top-3 right-3","bottom-3 left-3","bottom-3 right-3"].map((pos,i) => (
                    <div key={i} className={`absolute ${pos} text-[#c9a84c] text-xs opacity-60`}>✦</div>
                  ))}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="text-5xl opacity-40">✦</div>
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-40" />
                    <p className="text-[#c9a84c] text-xs tracking-[0.25em] opacity-50">TAROT</p>
                  </div>
                </div>
                {isDrawing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[#c9a84c] text-3xl" style={{ animation: "spin 1s linear infinite" }}>✦</div>
                  </div>
                )}
              </button>
              <p className="text-[#c8bfad] text-sm text-center leading-relaxed">
                {isDrawing ? "カードが語りかけています…" : "カードに触れて、今日の指針を受け取って"}
              </p>
            </div>
          ) : (
            /* カード表面 */
            (() => {
              const keyword  = isReversed ? drawnCard.reversed_keyword  : drawnCard.keyword;
              const message  = isReversed ? drawnCard.reversed_message  : drawnCard.message;
              const question = isReversed ? drawnCard.reversed_question : drawnCard.question;
              return (
                <div className="flex flex-col items-center gap-5 fade-in w-full">
                  <div className="relative w-44 h-72 rounded-2xl flex flex-col items-center justify-center"
                    style={{
                      background: "linear-gradient(160deg, #0d0618 0%, #2d1b69 45%, #1a0a2e 100%)",
                      border: `1.5px solid ${elemColor}99`,
                      boxShadow: `0 0 40px ${elemColor}22, 0 0 80px rgba(45,27,105,0.4)`,
                      transform: isReversed ? "rotate(180deg)" : "none",
                    }}
                  >
                    <div className="absolute inset-3 rounded-xl" style={{ border: `1px solid ${elemColor}33` }} />
                    <div className="absolute top-4 left-4 text-xs px-1.5 py-0.5 rounded-full"
                      style={{ background: `${elemColor}22`, color: elemColor, border: `1px solid ${elemColor}44` }}>
                      {drawnCard.element}
                    </div>
                    <div className="absolute top-4 right-4 text-xs opacity-60" style={{ color: elemColor }}>
                      {drawnCard.elementSymbol}
                    </div>
                    {["bottom-3 left-3","bottom-3 right-3"].map((pos,i) => (
                      <div key={i} className={`absolute ${pos} text-xs opacity-40`} style={{ color: elemColor }}>✦</div>
                    ))}
                    <div className="flex flex-col items-center gap-2"
                      style={{ transform: isReversed ? "rotate(180deg)" : "none" }}>
                      <div className="text-5xl mb-1" style={{ filter: `drop-shadow(0 0 8px ${elemColor}66)` }}>
                        {drawnCard.symbol}
                      </div>
                      <div className="text-center">
                        <p className="text-xs tracking-[0.2em] mb-0.5" style={{ color: elemColor }}>
                          {drawnCard.en.toUpperCase()}
                        </p>
                        <p className="text-[#f5f0e8] font-bold text-xl">{drawnCard.name}</p>
                        {isReversed && <p className="text-[#c8bfad] text-xs mt-1 opacity-70">↓ 逆位置</p>}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs tracking-wider text-center opacity-60" style={{ color: elemColor }}>
                    {keyword}
                  </p>

                  <div className="w-full rounded-2xl p-5"
                    style={{ background: `${elemColor}0d`, border: `1px solid ${elemColor}33` }}>
                    <p className="text-[#f5f0e8] text-sm leading-relaxed serif">
                      「{message}」
                    </p>
                  </div>

                  <div className="w-full rounded-xl p-4"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)" }}>
                    <p className="text-[#c9a84c] text-xs tracking-wider mb-1.5">✦ 今日の問いかけ</p>
                    <p className="text-[#c8bfad] text-sm leading-relaxed">{question}</p>
                  </div>

                  <button onClick={reset}
                    className="text-[#c8bfad] text-xs opacity-50 hover:opacity-80 transition-opacity">
                    ↩ 引き直す
                  </button>
                </div>
              );
            })()
          )}
        </div>
      </section>

      {/* 登録への導線 */}
      {drawnCard && (
        <section className="mb-8 fade-in">
          <div className="rounded-2xl p-6 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(45,27,105,0.4) 100%)",
              border: "1px solid rgba(201,168,76,0.35)",
            }}
          >
            <p className="text-2xl mb-3">🌙</p>
            <h3 className="text-[#f5f0e8] font-bold text-base mb-2">
              今日の気づきを、記録として残しませんか？
            </h3>
            <p className="text-[#c8bfad] text-sm leading-relaxed mb-5">
              無料登録すると、毎日のカードと日記が保存されます。<br/>
              月末にAIが「カードの予言」を読み解きます。
            </p>
            <Link href="/"
              className="btn-gold block w-full py-3 rounded-xl text-sm font-bold text-center mb-3"
            >
              無料で始める ✦
            </Link>
            <p className="text-[#c8bfad] text-xs opacity-50">
              登録無料 · クレジットカード不要 · いつでも退会可能
            </p>
          </div>
        </section>
      )}

      {/* 特徴紹介（カード引く前） */}
      {!drawnCard && !isDrawing && (
        <section className="mb-8 fade-in">
          <div className="flex flex-col gap-3">
            {[
              { icon: "🌅", title: "朝、カードを引く", desc: "大アルカナ22枚からランダムに。今日の指針を受け取って。" },
              { icon: "📓", title: "夜、日記を書く", desc: "気分を選んで、一言コメントを記録。毎日続けやすいシンプルさ。" },
              { icon: "🔮", title: "月末、AIが分析する", desc: "カードと現実のつながりをAIが読み解く。¥500/月の有料機能。" },
            ].map((f, i) => (
              <div key={i} className="glass rounded-xl p-4 flex items-start gap-4">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="text-[#c9a84c] text-sm font-bold mb-1">{f.title}</p>
                  <p className="text-[#c8bfad] text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="text-center text-[#c8bfad] text-xs opacity-40 pb-4">
        <p>タロット日記 — 内省のための静かな習慣</p>
      </footer>
    </main>
  );
}
