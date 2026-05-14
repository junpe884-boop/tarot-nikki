# タロット日記 — プロジェクト引き継ぎ書

## オーナー情報
- オーナー：junpei（非エンジニア）
- 会社：株式会社マルジン・サンアップル（本業はりんご販売）
- 目標：タロット日記アプリで4ヶ月目に月売上¥100,000超

---

## プロジェクト概要

「タロット日記」は朝にタロットカードを引いて指針を受け取り、夜に日記を書き、月末にAIがカードと現実のつながりを分析するWebアプリ（PWA）。

**コアループ：** 朝カードを引く → 夜日記を書く → 月末AIが「カードの予言」を照合

**マネタイズ：**
- 無料：7日間フル利用
- スタンダード ¥500/月：月次AI振り返り機能
- プレミアム ¥980/月：相性占い・年間レポート（将来）

---

## 世界観・ブランド

- **テイスト：** 「静かな神秘」— 押しつけがましくない内省ツール
- **ターゲット：** 20〜40代女性、自己成長・スピリチュアルに関心、「占い半信半疑だけど気になる」層
- **カラー：** ディープパープル `#0d0618` / ゴールド `#c9a84c` / クリームホワイト `#f5f0e8`
- **キャッチコピー：** 朝、カードを引く。夜、現実を記す。月末、物語になる。

---

## 技術スタック

| 技術 | 用途 | 状態 |
|---|---|---|
| Next.js 16 (App Router) | フレームワーク | ✅ 完了 |
| TypeScript | 型安全 | ✅ 完了 |
| Tailwind CSS v4 | スタイリング | ✅ 完了 |
| Supabase | DB・認証 | ✅ 完了 |
| Claude API (Anthropic) | AI月次分析 | ⬜ 未実装 |
| Stripe | 決済・サブスク | ⬜ 未実装 |
| Vercel | ホスティング | ✅ 完了 |

---

## 環境情報

- **OS：** Windows 11
- **Node.js：** v24.15.0
- **npm：** v11.12.1
- **プロジェクトパス：** `C:\Users\junpei\OneDrive - 株式会社マルジン・サンアップル　＊\デスクトップ\auto-blog\tarot-nikki`
- **開発サーバー：** `http://localhost:3000`

### 開発サーバーの起動方法
```powershell
cd "C:\Users\junpei\OneDrive - 株式会社マルジン・サンアップル　＊\デスクトップ\auto-blog\tarot-nikki"
npm run dev
```

### GitHubへのプッシュ方法（コード変更後）
```powershell
cd "C:\Users\junpei\OneDrive - 株式会社マルジン・サンアップル　＊\デスクトップ\auto-blog\tarot-nikki"
git add .
git commit -m "変更内容のメモ"
git push origin main
```
※ プッシュするとVercelが自動でデプロイする

---

## インフラ情報

| サービス | 情報 |
|---|---|
| **本番URL** | https://tarot-nikki.vercel.app/ |
| **デモURL** | https://tarot-nikki.vercel.app/demo |
| **GitHub** | https://github.com/junpe884-boop/tarot-nikki |
| **GitHubアカウント** | junpe884-boop |
| **Vercel** | junpe's projects / tarot-nikki |
| **Supabase URL** | https://bkjhrxgdzqdyziktidql.supabase.co |
| **Supabase Publishable Key** | sb_publishable__6PU2uL6WpykYZCP4lrqHg_fRbstFIa |

### 環境変数（.env.local）
```
NEXT_PUBLIC_SUPABASE_URL=https://bkjhrxgdzqdyziktidql.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable__6PU2uL6WpykYZCP4lrqHg_fRbstFIa
```
※ Vercelの Environment Variables にも同じ値が設定済み

---

## DBスキーマ（Supabase）

### テーブル: `card_readings`
| カラム | 型 | 説明 |
|---|---|---|
| id | uuid | 主キー |
| user_id | uuid | ユーザーID（auth.usersと紐付け） |
| date | date | 日付（1ユーザー1日1レコード） |
| card_name | text | カード名（例：魔術師） |
| card_number | int | カードID（0〜21） |
| is_reversed | boolean | 逆位置かどうか |
| message | text | カードのメッセージ |
| diary_text | text | 日記テキスト（任意） |
| mood | text | 気分ID（例：excited, calm など） |
| created_at | timestamp | 作成日時 |

---

## ファイル構成

```
tarot-nikki/
├── src/
│   ├── app/
│   │   ├── page.tsx        ← メインページ（ログイン必須・カード引き・日記）
│   │   ├── demo/
│   │   │   └── page.tsx    ← デモページ（ログイン不要・体験版）
│   │   ├── layout.tsx      ← 共通レイアウト・メタデータ
│   │   └── globals.css     ← 世界観デザイン・アニメーション
│   └── lib/
│       └── supabase.ts     ← Supabaseクライアント設定
├── public/                 ← 画像・アイコン置き場（今後使う）
├── .env.local              ← 環境変数（Gitにはアップされない）
├── CLAUDE.md               ← この引き継ぎ書
└── package.json
```

---

## 現在の実装状況

### ✅ 完成済み（2026-05-14時点）

**インフラ**
- Vercelデプロイ・自動デプロイ設定（GitHubプッシュで自動更新）
- Supabaseプロジェクト（東京リージョン）
- DBテーブル・セキュリティポリシー（RLS）設定済み

**認証**
- メールアドレス＋パスワードでの新規登録・ログイン
- 確認メール日本語化済み
- SupabaseのリダイレクトURL設定済み（localhost問題解決済み）

**メインアプリ（ログイン必須）**
- 大アルカナ22枚（神秘的な文言＋今日の問いかけ付き）
- 元素別カラー（火🔴・水🔵・地🟡・風🟣）の神秘的なカードビジュアル
- 逆位置（30%の確率）
- カードを引くと自動でSupabaseに保存
- 気分選択（8種類：ワクワク・穏やか・感謝・やる気・不安・落ち込み・疲れた・もやもや）
- コメント（日記テキスト）入力・保存
- ページを開くと今日の記録を自動ロード
- 月末AI分析の有料訴求セクション

**デモページ（ログイン不要）**
- https://tarot-nikki.vercel.app/demo
- カードを引ける（保存はされない）
- 「引き直す」ボタンあり
- カードを引いた後に登録への導線（CTA）が表示される
- アプリの特徴紹介セクション

---

## 次にやること（優先順）

### 1. AI月次分析の実装（Claude API）★最優先
junpeiさんが「有料でのAIまとめのクオリティを見たい」と言っている。

**必要なもの：**
- Anthropic APIキー（https://console.anthropic.com/ で取得）
- 環境変数に `ANTHROPIC_API_KEY` を追加
- Vercelにも同じ環境変数を追加

**実装内容：**
- `/api/analyze` というAPIルートを作成
- その月のcard_readingsを全件取得
- Claude APIに「カードの記録」「気分の記録」「日記」を渡して分析させる
- 結果をページに表示

### 2. X（Twitter）自動投稿
毎朝8時に「今日のカード」をXに自動投稿してフォロワーを積み上げる。

**前提条件（junpeiさんが先にやること）：**
- Xアカウントを作成する（アカウント名案：`@tarot_nikki` など）
- X Developer Portalでアプリ申請（無料）

**実装内容：**
- GitHub Actionsで毎朝8時に自動実行
- Claude APIで「今日のカード」の投稿文を生成
- X APIで投稿

### 3. Stripe決済（¥500/月）
AI分析機能を有料化する。

**必要なもの：**
- Stripeアカウント作成（https://stripe.com/jp）
- APIキー取得

### 4. Google / Apple ログイン追加
メールだけでなくGoogleアカウントでログインできるようにする。
Supabase → Authentication → Sign In / Providers → Google を有効化するだけ。

---

## junpeiのTODOリスト

- [ ] **Xアカウントを作成する**（アカウント名は `tarot_nikki` 系推奨）
- [ ] **Anthropic APIキーを取得する**（https://console.anthropic.com/）
- [ ] Instagram・noteのタロット用アカウントを作成する

---

## SNSプロフィール文（作成済み）

X:
```
朝、タロットを引く。夜、日記を書く。
月末、カードと現実がつながる瞬間がある。
占いじゃない。自分を知るための、静かな習慣。
毎朝ここで今日のカードを引いています🌙
📖 タロット日記アプリ → https://tarot-nikki.vercel.app/demo
```

Instagram:
```
🌙 朝のカード × 夜の日記 × 月末のAI分析
タロットを「当てるもの」じゃなく自分の内側を知るツールに。
毎朝、今日のカードをここで引いています。
▼ タロット日記アプリはプロフリンクから
```

note:
```
タロットと日記で、自分の物語を読み解く。
「タロット日記」は毎朝カードを引いて夜に記録し、
月末にAIがカードと現実のつながりを分析するWebアプリです。
```

---

## 新しいセッションへの引き継ぎ方法

```
CLAUDE.mdを読んで、タロット日記プロジェクトの続きをお願いします。
```

---

*最終更新：2026年5月14日*
