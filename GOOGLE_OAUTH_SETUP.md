# Google OAuth 設定手順

## 1. Google Cloud Console セットアップ

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成するか、既存のプロジェクトを選択
3. プロジェクト名: `ナレッジシェア認証` など

## 2. Google+ API の有効化

1. 左側のメニューから「APIとサービス」→「ライブラリ」
2. 「Google+ API」を検索して選択
3. 「有効にする」をクリック

## 3. OAuth 2.0 認証情報の作成

1. 左側のメニューから「APIとサービス」→「認証情報」
2. 「認証情報を作成」→「OAuth 2.0 クライアント ID」
3. アプリケーションの種類: 「ウェブアプリケーション」
4. 名前: `ナレッジシェア Web Client`

## 4. 承認済み URI の設定

### 承認済みJavaScriptオリジン:
```
http://localhost:3000
http://localhost:3001
```

### 承認済みリダイレクト URI:
```
http://localhost:3000/api/auth/google/callback
http://localhost:3001/api/auth/google/callback
```

## 5. 認証情報の取得

1. 作成完了後、「クライアント ID」と「クライアントシークレット」をコピー
2. `.env.local` ファイルを更新:

```env
GOOGLE_CLIENT_ID=your-actual-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
```

## 6. テスト

1. サーバーを再起動: `npm run dev`
2. ログインページでGoogleログインボタンをクリック
3. 実際のGoogleアカウントでログイン
4. リダイレクト後、ナレッジシェアにログインが完了

## 注意事項

- Client IDとSecretは秘匿情報です
- 本番環境では必ず実際の認証情報を使用してください
- HTTPSを使用することを強く推奨します（本番環境）