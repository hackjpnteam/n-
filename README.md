# N- 研修管理システム

MongoDB、Next.js、NextAuthを使用した本格的な研修管理Webアプリケーションです。

## 機能

### 🎯 ユーザー機能
- ユーザー登録・ログイン
- 動画視聴・進捗管理
- クイズ受講・結果確認
- プロフィール管理

### 👨‍💼 管理者機能
- **ゲスト管理**: 講師の追加・編集・削除
- **動画管理**: 研修動画の追加・編集・削除
- **メンバー管理**: 一般ユーザーの管理・権限設定
- **管理者管理**: 管理者ユーザーの管理・権限変更

### 📊 分析機能
- 動画別進捗統計
- クイズ成績分析
- ユーザー行動分析

## 技術スタック

- **フロントエンド**: Next.js 14, React, TypeScript, TailwindCSS
- **バックエンド**: Next.js API Routes
- **データベース**: MongoDB with Mongoose
- **認証**: NextAuth.js
- **デプロイ**: Vercel

## 開発環境セットアップ

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd N-
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 環境変数の設定
`.env.local`ファイルを作成し、以下を設定：

```env
# MongoDB接続文字列
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database_name

# NextAuth設定
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-32-chars-or-more
AUTH_TRUST_HOST=true

# Google OAuth（オプション）
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. 開発サーバーの起動
```bash
npm run dev
```

## Vercelデプロイ手順

### 1. Vercel CLIのインストール
```bash
npm i -g vercel
```

### 2. Vercelにログイン
```bash
vercel login
```

### 3. プロジェクトの初期化
```bash
vercel
```

### 4. 環境変数の設定
Vercelダッシュボードまたは CLI で以下の環境変数を設定：

```bash
vercel env add MONGODB_URI
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add NEXT_PUBLIC_BASE_URL
```

各変数の値：
- `MONGODB_URI`: MongoDB Atlas接続文字列
- `NEXTAUTH_URL`: `https://your-app.vercel.app`
- `NEXTAUTH_SECRET`: 32文字以上のランダム文字列
- `GOOGLE_CLIENT_ID`: Google OAuth クライアントID
- `GOOGLE_CLIENT_SECRET`: Google OAuth クライアントシークレット
- `NEXT_PUBLIC_BASE_URL`: `https://your-app.vercel.app`

### 5. デプロイ
```bash
vercel --prod
```

## MongoDB Atlas セットアップ

1. [MongoDB Atlas](https://cloud.mongodb.com/) でアカウント作成
2. 新しいクラスターを作成
3. データベースユーザーを作成
4. ネットワークアクセスを設定（Vercelの場合は `0.0.0.0/0` を許可）
5. 接続文字列を取得

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
