import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

interface CardReading {
  date: string;
  card_name: string;
  is_reversed: boolean;
  mood: string | null;
  diary_text: string | null;
}

const MOOD_LABELS: Record<string, string> = {
  excited:   "ワクワク",
  calm:      "穏やか",
  grateful:  "感謝",
  motivated: "やる気",
  anxious:   "不安",
  sad:       "落ち込み",
  tired:     "疲れた",
  foggy:     "もやもや",
};

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const mockAnalysis = `【テストモード — サンプル分析文】

今月、あなたが手にしたカードたちは、ひとつの物語を静かに紡いでいました。

月初に現れた「魔術師」は、あなたの内側にすでに必要な力が揃っていることを告げていました。しかし当時の日記には「なかなか踏み出せない」という言葉がありました。カードはあなたより少し先を見ていたのかもしれません。

月の中頃、「隠者」が現れた日、あなたの気分は「疲れた」でした。一人になる時間を求めていたその日は、振り返れば大切な内省の時間だったことがわかります。外の声を遮断して、自分の声に耳を傾けたその静寂が、後半の変化につながっていきます。

月末に向かうにつれ、「星」と「太陽」が続きました。希望と喜びの光が、確かにあなたの日々に差し込んでいた時期です。日記の言葉も少し柔らかくなっていました。カードはずっと、この光を予感していたのでしょう。

今月を通じて見えてくるのは、迷いながらも着実に前へ進んでいたあなたの姿です。カードはいつも、少し先のあなたを映す鏡でした。

**今月のカードからのひとこと**
迷いは弱さではありません。あなたはすでに、十分なところへたどり着いています。`;
    return NextResponse.json({ analysis: mockAnalysis });
  }

  const { readings, month } = (await request.json()) as {
    readings: CardReading[];
    month: string;
  };

  if (!readings || readings.length === 0) {
    return NextResponse.json(
      { error: "今月の記録がまだありません。" },
      { status: 400 }
    );
  }

  const readingsSummary = readings
    .map((r) => {
      const moodLabel = r.mood ? (MOOD_LABELS[r.mood] ?? r.mood) : null;
      return [
        `【${r.date}】 ${r.card_name}${r.is_reversed ? "（逆位置）" : ""}`,
        moodLabel ? `気分: ${moodLabel}` : null,
        r.diary_text ? `日記: 「${r.diary_text}」` : null,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  const prompt = `あなたはタロット日記の月次分析アシスタントです。
ユーザーの${month}の記録を読み解き、「カードが伝えていたこと」と「実際の1ヶ月」のつながりを美しい文章で分析してください。

【${month}の記録】
${readingsSummary}

【分析の視点】
- 繰り返し登場したカードや元素（火・水・地・風）のテーマのパターン
- 気分の流れとカードのメッセージの対応
- 日記の言葉とカードの予言のつながり
- この1ヶ月を通じてあなたへのメッセージ

【出力スタイル】
- 「あなた」への二人称で語りかける形式
- 静かな神秘。押しつけがましくない。内省を促す温かさ。
- 美しい日本語。詩的だが理解しやすい。
- 600〜800字程度。
- 占い師ではなく、1ヶ月を共に歩んだ伴走者として。
- 最後に「今月のカードからのひとこと」として1〜2文の締めくくりを入れる。`;

  try {
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1200,
      messages: [{ role: "user", content: prompt }],
    });

    const analysis =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ analysis });
  } catch (err) {
    console.error("Anthropic API error:", err);
    return NextResponse.json(
      { error: "分析中にエラーが発生しました。しばらく後に再試行してください。" },
      { status: 500 }
    );
  }
}
