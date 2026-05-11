"use client";

import { useState } from "react";

const MAJOR_ARCANA = [
  { id: 0,  name: "愚者",         en: "The Fool",           symbol: "🌟", message: "新しい旅のはじまり。恐れずに、一歩を踏み出してみて。" },
  { id: 1,  name: "魔術師",       en: "The Magician",       symbol: "✨", message: "あなたには必要なものがすべて揃っている。意志の力を信じて。" },
  { id: 2,  name: "女教皇",       en: "The High Priestess", symbol: "🌙", message: "静かに内側の声に耳を傾けて。答えはすでに知っている。" },
  { id: 3,  name: "女帝",         en: "The Empress",        symbol: "🌿", message: "豊かさと創造の時。自分を大切に育てること。" },
  { id: 4,  name: "皇帝",         en: "The Emperor",        symbol: "🏔️", message: "基盤をしっかりと固める日。秩序と意志で進む。" },
  { id: 5,  name: "法王",         en: "The Hierophant",     symbol: "🗝️", message: "伝統や信頼できる人の知恵を借りる時。" },
  { id: 6,  name: "恋人",         en: "The Lovers",         symbol: "💫", message: "大切な選択の時。心が本当に望むものを選んで。" },
  { id: 7,  name: "戦車",         en: "The Chariot",        symbol: "⚡", message: "意志と行動で道を切り開く。迷わず前進して。" },
  { id: 8,  name: "力",           en: "Strength",           symbol: "🦁", message: "内なる強さで困難に向き合う。柔らかさの中に力がある。" },
  { id: 9,  name: "隠者",         en: "The Hermit",         symbol: "🕯️", message: "一人になって考える時。内省が光をもたらす。" },
  { id: 10, name: "運命の輪",     en: "Wheel of Fortune",   symbol: "☯️", message: "変化の波に乗る時。流れを受け入れて。" },
  { id: 11, name: "正義",         en: "Justice",            symbol: "⚖️", message: "公平な目で状況を見つめ直して。真実が明らかになる。" },
  { id: 12, name: "吊られた男",   en: "The Hanged Man",     symbol: "🌀", message: "立ち止まることで見えてくるものがある。視点を変えて。" },
  { id: 13, name: "死神",         en: "Death",              symbol: "🌑", message: "終わりは新しい始まり。手放すことで次が来る。" },
  { id: 14, name: "節制",         en: "Temperance",         symbol: "🌊", message: "バランスと調和の日。焦らず、ゆっくりと。" },
  { id: 15, name: "悪魔",         en: "The Devil",          symbol: "🔗", message: "何かに縛られていない？本当の自由を問いかけて。" },
  { id: 16, name: "塔",           en: "The Tower",          symbol: "⛈️", message: "突然の変化も、必要な崩壊かもしれない。" },
  { id: 17, name: "星",           en: "The Star",           symbol: "⭐", message: "希望の光がある。信じて、自分を解き放って。" },
  { id: 18, name: "月",           en: "The Moon",           symbol: "🌕", message: "見えないものに惑わされている？直感を信じて進んで。" },
  { id: 19, name: "太陽",         en: "The Sun",            symbol: "☀️", message: "喜びと活力の日。ありのままの自分で輝いて。" },
  { id: 20, name: "審判",         en: "Judgement",          symbol: "🎺", message: "過去を清算し、新たな自分へ生まれ変わる時。" },
  { id: 21, name: "世界",         en: "The World",          symbol: "🌍", message: "ひとつの完成。あなたはすでに、十分なところにいる。" },
];

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 4 && h < 11) return { text: "おはようございます", phase: "morning" };
  if (h >= 11 && h < 17) return { text: "こんにちは", phase: "afternoon" };
  return { text: "こんばんは", phase: "evening" };
}

export default function Home() {
  const [drawnCard, setDrawnCard] = useState<(typeof MAJOR_ARCANA)[0] | null>(null);
  const [isReversed, setIsReversed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [diaryText, setDiaryText] = useState("");
  const [diarySaved, setDiarySaved] = useState(false);

  const { text: greeting, phase } = getGreeting();

  const drawCard = () => {
    if (isDrawing || drawnCard) return;
    setIsDrawing(true);
    setTimeout(() => {
      const card = MAJOR_ARCANA[Math.floor(Math.random() * MAJOR_ARCANA.length)];
      const reversed = Math.random() < 0.3;
      setDrawnCard(card);
      setIsReversed(reversed);
      setIsDrawing(false);
    }, 1200);
  };

  const saveDiary = () => {
    if (!diaryText.trim()) return;
    setDiarySaved(true);
    setTimeout(() => setDiarySaved(false), 3000);
  };

  return (
    <main
      className="flex flex-col min-h-screen max-w-md mx-auto px-5 py-8"
      style={{ background: "linear-gradient(180deg, #1a0a2e 0%, #0d0618 40%)" }}
    >

      {/* ヘッダー */}
      <header className="text-center mb-10 fade-in">
        <p className="text-xs tracking-[0.3em] text-[#c9a84c] mb-2 opacity-80">TAROT NIKKI</p>
        <h1 className="text-3xl font-bold gold-text mb-1">タロット日記</h1>
        <p className="text-[#c8bfad] text-sm mt-2">{getTodayStr()} · {greeting}</p>
      </header>

      {/* ── 朝フェーズ：カードを引く ── */}
      <section className="mb-10 fade-in">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-lg">🌙</span>
            <h2 className="text-sm tracking-widest text-[#c9a84c]">今日のカード</h2>
          </div>

          {!drawnCard ? (
            <div className="flex flex-col items-center gap-6">
              {/* カード裏面 */}
              <button
                onClick={drawCard}
                disabled={isDrawing}
                className="relative w-40 h-64 rounded-xl cursor-pointer group"
                aria-label="カードを引く"
              >
                <div
                  className={`w-full h-full rounded-xl card-float transition-transform duration-300 group-hover:scale-105 ${
                    isDrawing ? "opacity-60" : "card-glow"
                  }`}
                  style={{
                    background: "linear-gradient(135deg, #1a0a2e 0%, #2d1b69 50%, #1a0a2e 100%)",
                    border: "1px solid rgba(201,168,76,0.5)",
                  }}
                >
                  {/* カード模様 */}
                  <div className="absolute inset-3 rounded-lg border border-[rgba(201,168,76,0.3)] flex items-center justify-center">
                    <div className="text-5xl opacity-60">✦</div>
                  </div>
                  <div className="absolute top-4 left-4 text-[#c9a84c] text-xs opacity-50">✦</div>
                  <div className="absolute top-4 right-4 text-[#c9a84c] text-xs opacity-50">✦</div>
                  <div className="absolute bottom-4 left-4 text-[#c9a84c] text-xs opacity-50">✦</div>
                  <div className="absolute bottom-4 right-4 text-[#c9a84c] text-xs opacity-50">✦</div>
                </div>
                {isDrawing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[#c9a84c] text-2xl animate-spin">✦</div>
                  </div>
                )}
              </button>
              <p className="text-[#c8bfad] text-sm text-center leading-relaxed">
                {isDrawing ? "カードが語りかけています…" : "カードに触れて、今日の指針を受け取って"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-5 fade-in">
              {/* カード表面 */}
              <div
                className="relative w-40 h-64 rounded-xl card-glow flex flex-col items-center justify-center gap-3"
                style={{
                  background: "linear-gradient(135deg, #1a0a2e 0%, #2d1b69 50%, #1a0a2e 100%)",
                  border: "1px solid rgba(201,168,76,0.6)",
                  transform: isReversed ? "rotate(180deg)" : "none",
                }}
              >
                <div className="absolute inset-3 rounded-lg border border-[rgba(201,168,76,0.2)]" />
                <span className="text-5xl">{drawnCard.symbol}</span>
                <div className="text-center" style={{ transform: isReversed ? "rotate(180deg)" : "none" }}>
                  <p className="text-[#c9a84c] text-xs tracking-widest">{drawnCard.en.toUpperCase()}</p>
                  <p className="text-[#f5f0e8] font-bold text-lg">{drawnCard.name}</p>
                  {isReversed && (
                    <p className="text-[#c8bfad] text-xs mt-1">（逆位置）</p>
                  )}
                </div>
              </div>

              {/* カードメッセージ */}
              <div className="w-full rounded-xl p-4 text-center" style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.4)" }}>
                <p className="text-[#f5f0e8] text-base leading-relaxed font-medium">
                  「{drawnCard.message}」
                </p>
              </div>

              <p className="text-[#c8bfad] text-xs text-center opacity-70">
                今日のカードが引かれました。一日の終わりに日記を書きましょう。
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── 夜フェーズ：日記を書く ── */}
      <section className="mb-10 fade-in">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-lg">📓</span>
            <h2 className="text-sm tracking-widest text-[#c9a84c]">今日の日記</h2>
          </div>

          <textarea
            className="w-full h-36 bg-transparent text-[#f5f0e8] text-sm leading-relaxed resize-none outline-none placeholder-[#c8bfad] placeholder-opacity-50"
            placeholder={
              phase === "morning"
                ? "夜になったら、今日の出来事や気持ちを記録しましょう…"
                : "今日はどんな一日でしたか？カードと照らし合わせながら…"
            }
            value={diaryText}
            onChange={(e) => setDiaryText(e.target.value)}
          />

          <div className="border-t border-[rgba(201,168,76,0.15)] mt-3 pt-4 flex justify-between items-center">
            <span className="text-[#c8bfad] text-xs">{diaryText.length} 文字</span>
            <button
              onClick={saveDiary}
              disabled={!diaryText.trim()}
              className={`btn-gold px-5 py-2 rounded-full text-sm transition-all ${
                !diaryText.trim() ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              {diarySaved ? "✓ 保存しました" : "記録する"}
            </button>
          </div>
        </div>
      </section>

      {/* ── 月末AI分析プレビュー（有料訴求） ── */}
      <section className="mb-10 fade-in">
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(45,27,105,0.3) 100%)",
            border: "1px solid rgba(201,168,76,0.3)",
          }}
        >
          <div className="absolute top-3 right-3 text-xs bg-[#c9a84c] text-[#0d0618] px-2 py-0.5 rounded-full font-bold">
            有料
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔮</span>
            <h2 className="text-sm tracking-widest text-[#c9a84c]">月末AI分析</h2>
          </div>
          <p className="text-[#c8bfad] text-sm leading-relaxed mb-4">
            月末、AIがカードと日記の記録を照らし合わせて
            <span className="text-[#f5f0e8]">「カードが予言していたこと」</span>
            を読み解きます。
          </p>
          <button
            className="w-full py-3 rounded-xl text-sm font-bold text-[#c9a84c] transition-all hover:bg-[rgba(201,168,76,0.1)]"
            style={{ border: "1px solid rgba(201,168,76,0.4)" }}
          >
            スタンダードプランを見る — ¥500/月
          </button>
        </div>
      </section>

      {/* フッター */}
      <footer className="text-center text-[#c8bfad] text-xs opacity-50 pb-4">
        <p>タロット日記 — 内省のための静かな習慣</p>
      </footer>
    </main>
  );
}
