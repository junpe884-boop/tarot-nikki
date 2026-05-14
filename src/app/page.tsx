"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MAJOR_ARCANA, ELEMENT_COLORS } from "@/lib/tarot-data";
import type { User } from "@supabase/supabase-js";

// ─── 気分リスト ────────────────────────────────────────────
const MOODS = [
  { id: "excited",   emoji: "✨", label: "ワクワク" },
  { id: "calm",      emoji: "🌙", label: "穏やか"  },
  { id: "grateful",  emoji: "🌸", label: "感謝"    },
  { id: "motivated", emoji: "⚡", label: "やる気"  },
  { id: "anxious",   emoji: "🌊", label: "不安"    },
  { id: "sad",       emoji: "🌑", label: "落ち込み" },
  { id: "tired",     emoji: "🕯️", label: "疲れた"  },
  { id: "foggy",     emoji: "🌀", label: "もやもや" },
];

// ─── 元素カラー・カードデータは tarot-data.ts からimport済み ──

// ─── 星空データ（決定論的な位置 — hydrationエラー回避）────────
const STARS = Array.from({ length: 60 }, (_, i) => ({
  x:     ((i * 2654435761) >>> 16) % 1000 / 10,
  y:     ((i * 1234567891) >>> 16) % 1000 / 10,
  size:  i % 5 === 0 ? 2 : 1,
  d:     `${2 + (i % 4)}s`,
  delay: `${(i * 0.31) % 5}s`,
}));
const SHOOTING_STARS = [
  { x: "12%",  y: "8%",  dur: "9s",  del: "3s"  },
  { x: "55%",  y: "3%",  dur: "11s", del: "13s" },
  { x: "80%",  y: "55%", dur: "8s",  del: "22s" },
];

// ─── StarField ─────────────────────────────────────────────
function StarField() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {STARS.map((s, i) => (
        <div key={i} className="absolute rounded-full bg-white star-twinkle"
          style={{
            width: s.size + "px", height: s.size + "px",
            top: s.y + "%", left: s.x + "%",
            "--d": s.d, "--delay": s.delay,
          } as React.CSSProperties}
        />
      ))}
      {SHOOTING_STARS.map((s, i) => (
        <div key={i} className="shooting-star"
          style={{ top: s.y, left: s.x, "--dur": s.dur, "--del": s.del } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ─── ユーティリティ ────────────────────────────────────────
function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}
function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}
function getGreeting() {
  const h = new Date().getHours();
  if (h >= 4 && h < 11) return { text: "おはようございます", phase: "morning" };
  if (h >= 11 && h < 17) return { text: "こんにちは", phase: "afternoon" };
  return { text: "こんばんは", phase: "evening" };
}

// ─── 認証フォーム ──────────────────────────────────────────
function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handle = async () => {
    setLoading(true);
    setMessage("");
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else setMessage("確認メールをお送りしました。メールをご確認ください。");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage("メールアドレスかパスワードが違います。");
    }
    setLoading(false);
  };

  return (
    <main
      className="flex flex-col min-h-screen max-w-md mx-auto px-5 py-8 items-center justify-center"
      style={{ background: "linear-gradient(180deg, #1a0a2e 0%, #0d0618 40%)" }}
    >
      <StarField />

      <div className="w-full fade-in relative">
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">🌙</div>
          <p className="text-xs tracking-[0.3em] text-[#c9a84c] mb-2 opacity-80">TAROT NIKKI</p>
          <h1 className="serif text-3xl font-bold gold-text mb-3">タロット日記</h1>
          <p className="serif text-[#c8bfad] text-sm leading-relaxed">
            朝、カードを引く。夜、現実を記す。<br/>
            <span className="opacity-60">月末、物語になる。</span>
          </p>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex mb-6 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(201,168,76,0.3)" }}>
            <button
              className={`flex-1 py-2.5 text-sm transition-all ${mode === "login" ? "bg-[rgba(201,168,76,0.2)] text-[#c9a84c]" : "text-[#c8bfad]"}`}
              onClick={() => setMode("login")}
            >ログイン</button>
            <button
              className={`flex-1 py-2.5 text-sm transition-all ${mode === "signup" ? "bg-[rgba(201,168,76,0.2)] text-[#c9a84c]" : "text-[#c8bfad]"}`}
              onClick={() => setMode("signup")}
            >新規登録</button>
          </div>
          <div className="flex flex-col gap-4">
            <input type="email" placeholder="メールアドレス" value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-transparent text-[#f5f0e8] text-sm outline-none py-3 px-4 rounded-xl placeholder-[#c8bfad]"
              style={{ border: "1px solid rgba(201,168,76,0.3)" }}
            />
            <input type="password" placeholder="パスワード（6文字以上）" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handle()}
              className="w-full bg-transparent text-[#f5f0e8] text-sm outline-none py-3 px-4 rounded-xl placeholder-[#c8bfad]"
              style={{ border: "1px solid rgba(201,168,76,0.3)" }}
            />
            <button onClick={handle} disabled={loading || !email || !password}
              className="btn-gold w-full py-3 rounded-xl text-sm font-bold disabled:opacity-40"
            >
              {loading ? "処理中…" : mode === "login" ? "ログイン ✦" : "アカウントを作成 ✦"}
            </button>
            {message && <p className="text-center text-sm text-[#c8bfad] leading-relaxed">{message}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── カード裏面（3Dフリップ用・176×288の面だけ）────────────
function CardBackFace({ isDrawing }: { isDrawing: boolean }) {
  return (
    <div className="w-full h-full rounded-2xl relative"
      style={{
        background: "linear-gradient(135deg, #0d0618 0%, #2d1b69 40%, #1a0a2e 70%, #0d0618 100%)",
        border: "1.5px solid rgba(201,168,76,0.6)",
        boxShadow: "0 0 30px rgba(201,168,76,0.2), inset 0 0 30px rgba(45,27,105,0.5)",
      }}
    >
      <div className="absolute inset-3 rounded-xl" style={{ border: "1px solid rgba(201,168,76,0.25)" }} />
      <div className="absolute inset-5 rounded-lg"  style={{ border: "1px solid rgba(201,168,76,0.12)" }} />
      {["top-3 left-3","top-3 right-3","bottom-3 left-3","bottom-3 right-3"].map((pos,i) => (
        <div key={i} className={`absolute ${pos} text-[#c9a84c] text-xs opacity-60`}>✦</div>
      ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        {isDrawing ? (
          <div className="text-[#c9a84c] text-3xl" style={{ animation: "spin 1s linear infinite" }}>✦</div>
        ) : (
          <>
            <div className="text-5xl opacity-40">✦</div>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-40" />
            <p className="text-[#c9a84c] text-xs tracking-[0.25em] opacity-50">TAROT</p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── カード表面（3Dフリップ用・176×288の面だけ）────────────
function CardFrontFace({ card, isReversed }: { card: typeof MAJOR_ARCANA[0]; isReversed: boolean }) {
  const elemColor = ELEMENT_COLORS[card.element] ?? "#c9a84c";
  return (
    <div className="w-full h-full rounded-2xl relative overflow-hidden"
      style={{
        border: `1.5px solid ${elemColor}bb`,
        boxShadow: `0 0 40px ${elemColor}33, 0 0 80px rgba(45,27,105,0.5)`,
      }}
    >
      {/* カードイラスト */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/cards/${card.id}.jpg`}
        alt={card.name}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: isReversed ? "rotate(180deg)" : "none" }}
      />

      {/* 下部グラデーションオーバーレイ（テキスト可読性） */}
      <div className="absolute inset-0 rounded-2xl"
        style={{
          background: "linear-gradient(to bottom, rgba(13,6,24,0.0) 40%, rgba(13,6,24,0.88) 100%)",
        }}
      />
      {/* 上部薄いオーバーレイ */}
      <div className="absolute inset-0 rounded-2xl"
        style={{ background: "linear-gradient(to bottom, rgba(13,6,24,0.25) 0%, transparent 30%)" }}
      />

      {/* 元素バッジ（左上） */}
      <div className="absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full"
        style={{
          background: "rgba(13,6,24,0.7)",
          color: elemColor,
          border: `1px solid ${elemColor}66`,
          backdropFilter: "blur(4px)",
        }}>
        {card.element}
      </div>
      {/* 元素記号（右上） */}
      <div className="absolute top-3 right-3 text-xs opacity-70"
        style={{ color: elemColor, textShadow: `0 0 6px ${elemColor}` }}>
        {card.elementSymbol}
      </div>

      {/* カード名（下部） */}
      <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 text-center">
        <p className="text-[10px] tracking-[0.2em] mb-0.5 opacity-70" style={{ color: elemColor }}>
          {card.en.toUpperCase()}
        </p>
        <p className="serif text-[#f5f0e8] font-bold text-lg leading-tight">{card.name}</p>
        {isReversed && (
          <p className="text-[#c8bfad] text-[10px] mt-0.5 opacity-70">逆位置</p>
        )}
      </div>

      {/* 枠内側の光沢ライン */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1px ${elemColor}22` }}
      />
    </div>
  );
}

// ─── カード詳細（キーワード・メッセージ・問いかけ）───────────
function CardDetails({ card, isReversed }: { card: typeof MAJOR_ARCANA[0]; isReversed: boolean }) {
  const elemColor = ELEMENT_COLORS[card.element] ?? "#c9a84c";
  const keyword  = isReversed ? card.reversed_keyword  : card.keyword;
  const message  = isReversed ? card.reversed_message  : card.message;
  const question = isReversed ? card.reversed_question : card.question;

  return (
    <div className="flex flex-col gap-4 fade-in w-full">
      {/* 正位置 / 逆位置バッジ */}
      <p className="text-xs tracking-wider text-center opacity-60" style={{ color: elemColor }}>
        {isReversed && <span className="mr-2 opacity-80">↓ 逆位置 ·</span>}
        {keyword}
      </p>
      <div className="w-full rounded-2xl p-5"
        style={{ background: `${elemColor}0d`, border: `1px solid ${elemColor}33` }}>
        <p className="serif text-[#f5f0e8] text-sm leading-[2]">「{message}」</p>
      </div>
      <div className="w-full rounded-xl p-4"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)" }}>
        <p className="text-[#c9a84c] text-xs tracking-wider mb-1.5">✦ 今日の問いかけ</p>
        <p className="text-[#c8bfad] text-sm leading-relaxed">{question}</p>
      </div>
    </div>
  );
}

// ─── メインアプリ ──────────────────────────────────────────
export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawnCard, setDrawnCard] = useState<typeof MAJOR_ARCANA[0] | null>(null);
  const [isReversed, setIsReversed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [diaryText, setDiaryText] = useState("");
  const [diarySaved, setDiarySaved] = useState(false);
  const [savingDiary, setSavingDiary] = useState(false);
  const [readingId, setReadingId] = useState<string | null>(null);
  const [monthCount, setMonthCount] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisText, setAnalysisText] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const { text: greeting } = getGreeting();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    loadTodayReading();
    loadMonthCount();
  }, [user]);

  const loadMonthCount = async () => {
    const now = new Date();
    const firstDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
    const { count } = await supabase
      .from("card_readings")
      .select("id", { count: "exact", head: true })
      .gte("date", firstDay)
      .lte("date", lastDay);
    setMonthCount(count ?? 0);
  };

  const analyzeMonth = async () => {
    if (!user || analyzing) return;
    setAnalyzing(true);
    setAnalysisError(null);
    setAnalysisText(null);

    const now = new Date();
    const firstDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
    const monthLabel = `${now.getFullYear()}年${now.getMonth() + 1}月`;

    const { data: readings, error } = await supabase
      .from("card_readings")
      .select("date, card_name, is_reversed, mood, diary_text")
      .gte("date", firstDay)
      .lte("date", lastDay)
      .order("date", { ascending: true });

    if (error || !readings || readings.length === 0) {
      setAnalysisError("記録の取得に失敗しました。");
      setAnalyzing(false);
      return;
    }

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readings, month: monthLabel }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAnalysisError(data.error ?? "分析に失敗しました。");
      } else {
        setAnalysisText(data.analysis);
      }
    } catch {
      setAnalysisError("通信エラーが発生しました。");
    }
    setAnalyzing(false);
  };

  const loadTodayReading = async () => {
    const { data, error } = await supabase
      .from("card_readings").select("*").eq("date", getTodayISO()).single();
    if (!error && data) {
      const card = MAJOR_ARCANA.find(c => c.id === data.card_number);
      if (card) {
        setDrawnCard(card);
        setIsReversed(data.is_reversed);
        setDiaryText(data.diary_text ?? "");
        setSelectedMood(data.mood ?? null);
        setReadingId(data.id);
        setIsFlipped(true); // 今日のカードがあればすぐ表面を表示
      }
    }
  };

  const drawCard = async () => {
    if (isDrawing || drawnCard || !user) return;
    setIsDrawing(true);

    const card = MAJOR_ARCANA[Math.floor(Math.random() * MAJOR_ARCANA.length)];
    const reversed = Math.random() < 0.3;

    // フリップ開始（少し間を置いてから）
    setTimeout(() => setIsFlipped(true), 80);

    // フリップの折り返し点でカードをセット（表面に内容を描画）
    setTimeout(() => {
      setDrawnCard(card);
      setIsReversed(reversed);
    }, 500);

    // フリップ完了後に描画状態を解除しDB保存
    setTimeout(async () => {
      setIsDrawing(false);
      const { data, error } = await supabase.from("card_readings").insert({
        user_id: user.id, date: getTodayISO(),
        card_name: card.name, card_number: card.id,
        is_reversed: reversed, message: card.message, diary_text: null,
      }).select("id").single();
      if (!error && data) setReadingId(data.id);
    }, 1000);
  };

  const saveRecord = async () => {
    if (!readingId) return;
    setSavingDiary(true);
    await supabase.from("card_readings").update({
      diary_text: diaryText || null,
      mood: selectedMood,
    }).eq("id", readingId);
    setSavingDiary(false);
    setDiarySaved(true);
    setTimeout(() => setDiarySaved(false), 3000);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setDrawnCard(null); setDiaryText(""); setReadingId(null);
    setSelectedMood(null); setIsFlipped(false);
  };

  if (loading) return (
    <main className="flex min-h-screen items-center justify-center" style={{ background: "#0d0618" }}>
      <div className="text-[#c9a84c] text-3xl" style={{ animation: "spin 1s linear infinite" }}>✦</div>
    </main>
  );

  if (!user) return <AuthForm />;

  return (
    <main className="flex flex-col min-h-screen max-w-md mx-auto px-5 py-8"
      style={{ background: "linear-gradient(180deg, #1a0a2e 0%, #0d0618 50%)" }}>

      <StarField />

      {/* ヘッダー */}
      <header className="text-center mb-10 fade-in relative z-10">
        <p className="text-xs tracking-[0.3em] text-[#c9a84c] mb-2 opacity-80">TAROT NIKKI</p>
        <h1 className="serif text-3xl font-bold gold-text mb-1">タロット日記</h1>
        <p className="serif text-[#c8bfad] text-sm mt-2">{getTodayStr()} · {greeting}</p>
        <button onClick={signOut}
          className="text-[#c8bfad] text-xs opacity-40 mt-1 hover:opacity-70 transition-opacity">
          ログアウト
        </button>
      </header>

      {/* カードセクション */}
      <section className="mb-8 fade-in relative z-10">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-lg">🌙</span>
            <h2 className="text-sm tracking-widest text-[#c9a84c]">今日のカード</h2>
          </div>
          <div className="flex flex-col items-center gap-5 w-full">
            {/* 3D フリップカード */}
            <div
              className={`card-perspective w-44 h-72 ${!drawnCard && !isDrawing ? "card-glow" : ""}`}
              onClick={!drawnCard && !isDrawing ? drawCard : undefined}
              role={!drawnCard ? "button" : undefined}
              aria-label={!drawnCard ? "カードを引く" : drawnCard.name}
              style={{ cursor: !drawnCard && !isDrawing ? "pointer" : "default", borderRadius: "1rem" }}
            >
              <div className={`card-inner ${isFlipped ? "flipped" : ""}`}>
                <div className="card-face card-face-back">
                  <CardBackFace isDrawing={isDrawing} />
                </div>
                <div className="card-face card-face-front">
                  {drawnCard && <CardFrontFace card={drawnCard} isReversed={isReversed} />}
                </div>
              </div>
            </div>

            {/* ヒントテキスト（カード未選択時） */}
            {!drawnCard && (
              <p className="text-[#c8bfad] text-sm text-center leading-relaxed">
                {isDrawing ? "カードが語りかけています…" : "カードに触れて、今日の指針を受け取って"}
              </p>
            )}

            {/* カード詳細（フリップ後） */}
            {drawnCard && <CardDetails card={drawnCard} isReversed={isReversed} />}
          </div>
        </div>
      </section>

      {/* 記録セクション */}
      <section className="mb-8 fade-in relative z-10">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-lg">📓</span>
            <h2 className="text-sm tracking-widest text-[#c9a84c]">今日の記録</h2>
          </div>

          {/* 気分選択 */}
          <p className="text-[#c8bfad] text-xs mb-3 opacity-70">今の気分は？</p>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {MOODS.map(mood => (
              <button key={mood.id}
                onClick={() => setSelectedMood(prev => prev === mood.id ? null : mood.id)}
                className="flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs transition-all"
                style={{
                  background: selectedMood === mood.id
                    ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.04)",
                  border: selectedMood === mood.id
                    ? "1px solid rgba(201,168,76,0.6)" : "1px solid rgba(255,255,255,0.08)",
                  color: selectedMood === mood.id ? "#c9a84c" : "#c8bfad",
                }}
              >
                <span className="text-lg">{mood.emoji}</span>
                <span>{mood.label}</span>
              </button>
            ))}
          </div>

          {/* コメント */}
          <p className="text-[#c8bfad] text-xs mb-2 opacity-70">今日の一言（任意）</p>
          <textarea
            className="w-full h-28 bg-transparent text-[#f5f0e8] text-sm leading-relaxed resize-none outline-none placeholder-[#c8bfad] rounded-xl p-3"
            style={{ border: "1px solid rgba(201,168,76,0.15)" }}
            placeholder="カードのメッセージを受け取って、今日どんな一日でしたか…"
            value={diaryText}
            onChange={e => setDiaryText(e.target.value)}
            disabled={!drawnCard}
          />

          <div className="mt-4 flex justify-between items-center">
            <span className="text-[#c8bfad] text-xs opacity-50">{diaryText.length} 文字</span>
            <button onClick={saveRecord}
              disabled={(!selectedMood && !diaryText.trim()) || !readingId || savingDiary}
              className={`btn-gold px-6 py-2 rounded-full text-sm transition-all ${
                (!selectedMood && !diaryText.trim()) || !readingId ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              {savingDiary ? "保存中…" : diarySaved ? "✓ 記録しました" : "記録する ✦"}
            </button>
          </div>
        </div>
      </section>

      {/* 月次AI分析 */}
      <section className="mb-8 fade-in relative z-10">
        <div className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(45,27,105,0.3) 100%)",
            border: "1px solid rgba(201,168,76,0.25)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔮</span>
            <h2 className="text-sm tracking-widest text-[#c9a84c]">月次AI分析</h2>
            <span className="ml-auto text-xs text-[#c8bfad] opacity-60">
              今月 {monthCount} 日分の記録
            </span>
          </div>

          {/* 分析結果表示 */}
          {analysisText ? (
            <div className="fade-in">
              <div className="mb-4 text-[#f5f0e8] text-sm leading-[2] whitespace-pre-wrap">
                {analysisText}
              </div>
              <button
                onClick={() => setAnalysisText(null)}
                className="text-[#c8bfad] text-xs opacity-50 hover:opacity-80 transition-opacity"
              >
                ↩ 閉じる
              </button>
            </div>
          ) : (
            <>
              {!analyzing && (
                <p className="text-[#c8bfad] text-sm leading-relaxed mb-4">
                  AIがカードと日記の記録を照らし合わせて
                  <span className="text-[#f5f0e8]">「カードが予言していたこと」</span>
                  を読み解きます。
                </p>
              )}

              {analysisError && (
                <p className="text-red-400 text-xs mb-3 leading-relaxed">{analysisError}</p>
              )}

              {analyzing ? (
                <div className="flex flex-col items-center py-6 gap-3">
                  <div className="text-[#c9a84c] text-3xl" style={{ animation: "spin 1.5s linear infinite" }}>✦</div>
                  <p className="text-[#c8bfad] text-sm">物語を読み解いています…</p>
                </div>
              ) : (
                <button
                  onClick={analyzeMonth}
                  disabled={monthCount === 0}
                  className="w-full py-3 rounded-xl text-sm font-bold text-[#c9a84c] transition-all hover:bg-[rgba(201,168,76,0.08)] disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ border: "1px solid rgba(201,168,76,0.35)" }}
                >
                  {monthCount === 0 ? "記録がまだありません" : "今月の物語を読み解く ✦"}
                </button>
              )}
            </>
          )}
        </div>
      </section>

      <footer className="text-center text-[#c8bfad] text-xs opacity-40 pb-4">
        <p>タロット日記 — 内省のための静かな習慣</p>
      </footer>
    </main>
  );
}
