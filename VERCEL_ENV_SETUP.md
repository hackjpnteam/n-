# Vercel環境変数設定ガイド

## 重要: Vercelダッシュボードで以下の環境変数を設定してください

1. **Vercelダッシュボード**にログイン
2. プロジェクトの **Settings** → **Environment Variables** へ移動
3. 以下の環境変数をすべて追加:

### 必須環境変数

```
MONGODB_URI=[MongoDB接続文字列を設定してください]

NEXTAUTH_URL=https://n-gold-chi.vercel.app

NEXTAUTH_SECRET=[ランダムな文字列を生成して設定してください]

GOOGLE_CLIENT_ID=[Google Cloud ConsoleからClient IDを取得して設定]

GOOGLE_CLIENT_SECRET=[Google Cloud ConsoleからClient Secretを取得して設定]
```

**注意**: 実際の値は.env.localファイルを参照するか、管理者に確認してください。

### 環境設定

各環境変数は以下の環境で有効にしてください:
- ✅ Production
- ✅ Preview
- ✅ Development

### 設定後の手順

1. 環境変数を保存
2. Vercelでプロジェクトを再デプロイ
3. デプロイ完了後、ログイン機能をテスト

### トラブルシューティング

エラーが続く場合:
1. すべての環境変数が正しく設定されているか確認
2. NEXTAUTH_URLがデプロイされたURLと一致しているか確認
3. Vercelのログで詳細なエラーを確認