"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
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

// ─── 元素カラー ────────────────────────────────────────────
const ELEMENT_COLORS: Record<string, string> = {
  "火": "#ff6b35",
  "水": "#4facfe",
  "地": "#c9a84c",
  "風": "#a855f7",
};

// ─── タロットカードデータ（神秘的な文言 + 問いかけ付き）────
const MAJOR_ARCANA = [
  {
    id: 0, name: "愚者", en: "The Fool", symbol: "🌟",
    element: "風", elementSymbol: "♊", keyword: "自由 · 始まり · 無限の可能性",
    message: "宇宙があなたに「踏み出せ」と囁いています。今日あなたの前に現れる偶然は、偶然ではありません。恐れを手放した瞬間に、新しい扉は静かに開かれます。",
    question: "今日、何かひとつだけ「失敗してもいい」と決めてみては？",
  },
  {
    id: 1, name: "魔術師", en: "The Magician", symbol: "✨",
    element: "火", elementSymbol: "☿", keyword: "意志 · 創造 · 顕現",
    message: "あなたはすでに、必要なすべてを持っています。才能、知識、直感——それらは今この瞬間、あなたの手の中にあります。問題は能力ではなく、動き出す勇気だけです。",
    question: "今日、ひとつだけ「できる」と信じて動くとしたら何ですか？",
  },
  {
    id: 2, name: "女教皇", en: "The High Priestess", symbol: "🌙",
    element: "水", elementSymbol: "☽", keyword: "直感 · 神秘 · 内なる知恵",
    message: "答えはすでに、あなたの内側にあります。今日は外の声より、静かな内なる声に耳を傾けてみてください。その声が小さければ小さいほど、重要なことを告げています。",
    question: "最近、直感で「なんとなく気になる」ことはありませんか？",
  },
  {
    id: 3, name: "女帝", en: "The Empress", symbol: "🌿",
    element: "地", elementSymbol: "♀", keyword: "豊かさ · 創造 · 育む",
    message: "今日はあなた自身を慈しむ日です。種を植える農夫のように、焦らず、ゆっくりと。あなたが大切に育ててきたものが、静かに根を張り始めています。",
    question: "今、あなたが密かに育てている夢や計画は何ですか？",
  },
  {
    id: 4, name: "皇帝", en: "The Emperor", symbol: "🏔️",
    element: "火", elementSymbol: "♈", keyword: "秩序 · 基盤 · 意志の力",
    message: "今日は「決める」日です。迷いを断ち切り、進む方向を定めてください。揺れない軸を持つ人間だけが、嵐の中でも前進できます。あなたにはその力があります。",
    question: "今日、ひとつだけ「これで行く」と腹を決めることは何ですか？",
  },
  {
    id: 5, name: "法王", en: "The Hierophant", symbol: "🗝️",
    element: "地", elementSymbol: "♉", keyword: "伝統 · 導き · 信頼",
    message: "今日、信頼できる人の言葉に耳を傾けてみてください。または、あなた自身が誰かにとっての道を示す存在になる日かもしれません。知恵は受け取り、そして渡すものです。",
    question: "今、あなたが本当に信頼している人は誰ですか？",
  },
  {
    id: 6, name: "恋人", en: "The Lovers", symbol: "💫",
    element: "風", elementSymbol: "♊", keyword: "選択 · 調和 · 誠実",
    message: "心が二つの間で揺れているなら、それは迷いではなく、成長の証です。今日は「正しい選択」を探すより、「心が軽くなる選択」を探してみてください。",
    question: "今、あなたの心が本当に望んでいることは何ですか？",
  },
  {
    id: 7, name: "戦車", en: "The Chariot", symbol: "⚡",
    element: "水", elementSymbol: "♋", keyword: "勝利 · 前進 · 意志の統合",
    message: "今日のあなたには、強い風が味方しています。感情と理性をひとつにまとめ、迷わず前に進んでください。立ち止まる理由は、もう十分考えたはずです。",
    question: "今日、一番あなたを前に進めるものは何ですか？",
  },
  {
    id: 8, name: "力", en: "Strength", symbol: "🦁",
    element: "火", elementSymbol: "♌", keyword: "内なる強さ · 忍耐 · 慈悲",
    message: "本当の強さとは、怒りや恐れを押さえつけることではなく、それらを優しく手なずけることです。今日あなたが感じる弱さは、実は未使用の力の予感です。",
    question: "今、「弱い」と感じている部分に、実はどんな力が眠っていますか？",
  },
  {
    id: 9, name: "隠者", en: "The Hermit", symbol: "🕯️",
    element: "地", elementSymbol: "♍", keyword: "内省 · 孤独 · 光を持つ者",
    message: "今日は少し、一人になる時間を作ってください。雑音を遮断した静寂の中でこそ、本当に大切な声が聞こえてきます。孤独は弱さではなく、知恵の源です。",
    question: "最近、自分自身と向き合う時間を取れていますか？",
  },
  {
    id: 10, name: "運命の輪", en: "Wheel of Fortune", symbol: "☯️",
    element: "火", elementSymbol: "♃", keyword: "転換点 · 流れ · 運命",
    message: "今日、何かが変わり始めています。まだ小さな変化かもしれませんが、後から振り返ると「あの日が転換点だった」と気づくでしょう。流れを信頼してください。",
    question: "今、あなたの人生でゆっくりと変化しているものは何ですか？",
  },
  {
    id: 11, name: "正義", en: "Justice", symbol: "⚖️",
    element: "風", elementSymbol: "♎", keyword: "真実 · 公平 · 因果",
    message: "今日は自分自身に正直になる日です。言い訳も自己批判も必要ありません。ただ、今の状況を冷静に、公平に見つめてみてください。真実はいつも、その先にあります。",
    question: "今、自分に正直になれていない部分はありますか？",
  },
  {
    id: 12, name: "吊られた男", en: "The Hanged Man", symbol: "🌀",
    element: "水", elementSymbol: "♆", keyword: "視点の転換 · 待機 · 解放",
    message: "今日は敢えて動かないことに価値があります。逆さまに吊られた男が世界の別の姿を見るように、視点を180度変えてみてください。思わぬ解決策が隠れています。",
    question: "今、逆の視点から見たらどう見えますか？",
  },
  {
    id: 13, name: "死神", en: "Death", symbol: "🌑",
    element: "水", elementSymbol: "♏", keyword: "変容 · 終わりと始まり · 解放",
    message: "終わりを恐れないでください。今日手放すものは、実はずっと前に役目を終えていたものです。死神は破壊者ではなく、変容の使者。何かが終わる時、必ず何かが始まります。",
    question: "今、手放す準備ができているものは何ですか？",
  },
  {
    id: 14, name: "節制", en: "Temperance", symbol: "🌊",
    element: "火", elementSymbol: "♐", keyword: "調和 · バランス · 錬金術",
    message: "今日のあなたに必要なのは、極端を避けることです。水と火を混ぜ合わせる錬金術師のように、絶妙なバランスを探してください。焦らず、少しずつ。",
    question: "今、あなたの生活で「偏りすぎている」部分はどこですか？",
  },
  {
    id: 15, name: "悪魔", en: "The Devil", symbol: "🔗",
    element: "地", elementSymbol: "♑", keyword: "執着 · 解放 · 物質",
    message: "その鎖は、実は緩く結ばれています。逃げられないと思い込んでいるだけで、本当は今すぐにでも外せます。あなたを縛っているものの正体を、静かに見つめてみてください。",
    question: "今、あなたを最も縛っているものは何ですか？",
  },
  {
    id: 16, name: "塔", en: "The Tower", symbol: "⛈️",
    element: "火", elementSymbol: "♂", keyword: "崩壊 · 啓示 · 再生",
    message: "崩れていくものは、最初から脆かったものです。今日起きる予期せぬ出来事は、より強い基盤を作るための試練かもしれません。嵐が過ぎた後に残るものが、本物です。",
    question: "今、崩れても惜しくないものは何ですか？",
  },
  {
    id: 17, name: "星", en: "The Star", symbol: "⭐",
    element: "風", elementSymbol: "♒", keyword: "希望 · 癒し · 導き",
    message: "暗い夜に輝く星のように、今日のあなたには静かな希望の光があります。傷ついていても、疲れていても、その光は消えません。ただ信じて、自分自身を解き放ってみてください。",
    question: "今、あなたの心の中で小さく輝いている希望は何ですか？",
  },
  {
    id: 18, name: "月", en: "The Moon", symbol: "🌕",
    element: "水", elementSymbol: "♓", keyword: "幻想 · 直感 · 無意識",
    message: "今日は見えているものを信じすぎないでください。月明かりは美しいですが、影を作ります。表面ではなく、その奥にある本質を見抜く直感を大切にしてください。",
    question: "今、見えていない部分に何があると感じますか？",
  },
  {
    id: 19, name: "太陽", en: "The Sun", symbol: "☀️",
    element: "火", elementSymbol: "☉", keyword: "喜び · 成功 · 輝き",
    message: "今日は素直に喜んでいい日です。太陽は隠れることなく輝きます。あなたも今日だけは、ありのままの自分で輝いてください。その光は、周りの人々をも温めます。",
    question: "今日、純粋に嬉しいと感じることは何ですか？",
  },
  {
    id: 20, name: "審判", en: "Judgement", symbol: "🎺",
    element: "火", elementSymbol: "♇", keyword: "復活 · 許し · 新たな使命",
    message: "今日、何かに呼ばれている感覚はありませんか？それは偶然ではありません。過去を清算し、より高い次元の自分へと生まれ変わる時が来ています。自分自身を許すことから始めてください。",
    question: "今日、自分の中で「もう一度始めたい」と感じることは何ですか？",
  },
  {
    id: 21, name: "世界", en: "The World", symbol: "🌍",
    element: "地", elementSymbol: "♄", keyword: "完成 · 統合 · 達成",
    message: "あなたはすでに、十分なところに来ています。今日はただ、その完成を味わってください。一つの旅が終わり、次の大きな旅への扉が開こうとしています。",
    question: "今、あなたが誇りを持って「やり遂げた」と言えることは何ですか？",
  },
];

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
      {/* 背景の星 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white opacity-20"
            style={{
              width: Math.random() * 2 + 1 + "px", height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 100 + "%", left: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      <div className="w-full fade-in relative">
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">🌙</div>
          <p className="text-xs tracking-[0.3em] text-[#c9a84c] mb-2 opacity-80">TAROT NIKKI</p>
          <h1 className="text-3xl font-bold gold-text mb-3">タロット日記</h1>
          <p className="text-[#c8bfad] text-sm leading-relaxed">
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

// ─── カードビジュアル（裏面）──────────────────────────────
function CardBack({ onClick, isDrawing }: { onClick: () => void; isDrawing: boolean }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <button onClick={onClick} disabled={isDrawing}
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
          {/* 外枠装飾 */}
          <div className="absolute inset-3 rounded-xl" style={{ border: "1px solid rgba(201,168,76,0.25)" }} />
          <div className="absolute inset-5 rounded-lg" style={{ border: "1px solid rgba(201,168,76,0.12)" }} />
          {/* 四隅の飾り */}
          {["top-3 left-3","top-3 right-3","bottom-3 left-3","bottom-3 right-3"].map((pos,i) => (
            <div key={i} className={`absolute ${pos} text-[#c9a84c] text-xs opacity-60`}>✦</div>
          ))}
          {/* 中央シンボル */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="text-5xl opacity-40" style={{ filter: "blur(0.5px)" }}>✦</div>
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
  );
}

// ─── カードビジュアル（表面）──────────────────────────────
function CardFront({ card, isReversed }: { card: typeof MAJOR_ARCANA[0]; isReversed: boolean }) {
  const elemColor = ELEMENT_COLORS[card.element] ?? "#c9a84c";
  return (
    <div className="flex flex-col items-center gap-5 fade-in w-full">
      {/* カード本体 */}
      <div className="relative w-44 h-72 rounded-2xl flex flex-col items-center justify-center"
        style={{
          background: "linear-gradient(160deg, #0d0618 0%, #2d1b69 45%, #1a0a2e 100%)",
          border: `1.5px solid ${elemColor}99`,
          boxShadow: `0 0 40px ${elemColor}22, 0 0 80px rgba(45,27,105,0.4)`,
          transform: isReversed ? "rotate(180deg)" : "none",
        }}
      >
        {/* 内枠 */}
        <div className="absolute inset-3 rounded-xl" style={{ border: `1px solid ${elemColor}33` }} />
        {/* 元素バッジ */}
        <div className="absolute top-4 left-4 text-xs px-1.5 py-0.5 rounded-full"
          style={{ background: `${elemColor}22`, color: elemColor, border: `1px solid ${elemColor}44` }}>
          {card.element}
        </div>
        {/* 右上：元素記号 */}
        <div className="absolute top-4 right-4 text-xs opacity-60" style={{ color: elemColor }}>
          {card.elementSymbol}
        </div>
        {/* 四隅 */}
        {["bottom-3 left-3","bottom-3 right-3"].map((pos,i) => (
          <div key={i} className={`absolute ${pos} text-xs opacity-40`} style={{ color: elemColor }}>✦</div>
        ))}
        {/* メインコンテンツ */}
        <div className="flex flex-col items-center gap-2"
          style={{ transform: isReversed ? "rotate(180deg)" : "none" }}>
          <div className="text-5xl mb-1" style={{ filter: `drop-shadow(0 0 8px ${elemColor}66)` }}>
            {card.symbol}
          </div>
          <div className="text-center">
            <p className="text-xs tracking-[0.2em] mb-0.5" style={{ color: elemColor }}>
              {card.en.toUpperCase()}
            </p>
            <p className="text-[#f5f0e8] font-bold text-xl">{card.name}</p>
            {isReversed && <p className="text-[#c8bfad] text-xs mt-1 opacity-70">逆位置</p>}
          </div>
        </div>
      </div>

      {/* キーワード */}
      <p className="text-xs tracking-wider text-center opacity-60" style={{ color: elemColor }}>
        {card.keyword}
      </p>

      {/* メッセージ */}
      <div className="w-full rounded-2xl p-5"
        style={{ background: `${elemColor}0d`, border: `1px solid ${elemColor}33` }}>
        <p className="text-[#f5f0e8] text-sm leading-relaxed">
          「{card.message}」
        </p>
      </div>

      {/* 今日の問いかけ */}
      <div className="w-full rounded-xl p-4"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)" }}>
        <p className="text-[#c9a84c] text-xs tracking-wider mb-1.5">✦ 今日の問いかけ</p>
        <p className="text-[#c8bfad] text-sm leading-relaxed">{card.question}</p>
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
  }, [user]);

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
      }
    }
  };

  const drawCard = async () => {
    if (isDrawing || drawnCard || !user) return;
    setIsDrawing(true);
    setTimeout(async () => {
      const card = MAJOR_ARCANA[Math.floor(Math.random() * MAJOR_ARCANA.length)];
      const reversed = Math.random() < 0.3;
      setDrawnCard(card);
      setIsReversed(reversed);
      setIsDrawing(false);
      const { data, error } = await supabase.from("card_readings").insert({
        user_id: user.id, date: getTodayISO(),
        card_name: card.name, card_number: card.id,
        is_reversed: reversed, message: card.message, diary_text: null,
      }).select("id").single();
      if (!error && data) setReadingId(data.id);
    }, 1400);
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
    setDrawnCard(null); setDiaryText(""); setReadingId(null); setSelectedMood(null);
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

      {/* ヘッダー */}
      <header className="text-center mb-10 fade-in">
        <p className="text-xs tracking-[0.3em] text-[#c9a84c] mb-2 opacity-80">TAROT NIKKI</p>
        <h1 className="text-3xl font-bold gold-text mb-1">タロット日記</h1>
        <p className="text-[#c8bfad] text-sm mt-2">{getTodayStr()} · {greeting}</p>
        <button onClick={signOut}
          className="text-[#c8bfad] text-xs opacity-40 mt-1 hover:opacity-70 transition-opacity">
          ログアウト
        </button>
      </header>

      {/* カードセクション */}
      <section className="mb-8 fade-in">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-lg">🌙</span>
            <h2 className="text-sm tracking-widest text-[#c9a84c]">今日のカード</h2>
          </div>
          {!drawnCard
            ? <CardBack onClick={drawCard} isDrawing={isDrawing} />
            : <CardFront card={drawnCard} isReversed={isReversed} />
          }
        </div>
      </section>

      {/* 記録セクション */}
      <section className="mb-8 fade-in">
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

      {/* 月末AI分析（有料） */}
      <section className="mb-8 fade-in">
        <div className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(45,27,105,0.3) 100%)",
            border: "1px solid rgba(201,168,76,0.25)",
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
          <button className="w-full py-3 rounded-xl text-sm font-bold text-[#c9a84c] transition-all hover:bg-[rgba(201,168,76,0.08)]"
            style={{ border: "1px solid rgba(201,168,76,0.35)" }}>
            スタンダードプランを見る — ¥500/月
          </button>
        </div>
      </section>

      <footer className="text-center text-[#c8bfad] text-xs opacity-40 pb-4">
        <p>タロット日記 — 内省のための静かな習慣</p>
      </footer>
    </main>
  );
}
