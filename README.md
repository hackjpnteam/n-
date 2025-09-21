# 知識プラットフォーム

Next.js App Router + TypeScript + Tailwind + MongoDB/Mongoose + NextAuth を使用した動画学習プラットフォームです。

## 機能

### 1. 講師ページ
- 講師一覧・詳細ページ
- 講師検索・並び替え
- 講師プロフィール・担当動画一覧

### 2. 視聴進捗管理
- 動画視聴完了ボタン
- ユーザーごとの進捗記録

### 3. 理解度テスト
- 動画ごとのクイズ機能
- MCQ・複数選択・○×問題対応
- 採点・合否判定・再受験機能
- 受験履歴管理

### 4. 管理ダッシュボード
- 動画別進捗統計
- クイズ成績分析
- 可視化グラフ

## セットアップ

1. 依存関係のインストール:
\`\`\`bash
npm install
\`\`\`

2. 環境変数の設定:
\`\`\`bash
cp .env.local.example .env.local
\`\`\`
`.env.local`を編集してMongoDB接続文字列とNextAuth設定を追加してください。

3. データベースのシード:
\`\`\`bash
npm run seed
\`\`\`

4. 開発サーバーの起動:
\`\`\`bash
npm run dev
\`\`\`

## URL構造

- `/` - ホーム
- `/instructors` - 講師一覧
- `/instructors/[id]` - 講師詳細
- `/videos/[id]` - 動画ページ
- `/videos/[id]/quiz` - 理解度テスト
- `/admin/analytics` - 管理ダッシュボード

## API エンドポイント

### 講師関連
- `GET /api/instructors` - 講師一覧（検索・並び替え対応）
- `GET /api/instructors/[id]` - 講師詳細

### 進捗管理
- `GET /api/progress?videoId=...` - 進捗取得
- `POST /api/progress` - 進捗更新

### クイズ関連
- `GET /api/quiz/[videoId]` - クイズ取得
- `POST /api/quiz/submit` - クイズ回答送信
- `GET /api/quiz/attempts?videoId=...` - 受験履歴

### 管理機能
- `GET /api/admin/analytics` - 分析データ

<!-- Force Vercel deployment: 2025-09-16-13:55 --># Vercel deployment force update 2025年 9月22日 月曜日 00時07分19秒 JST
