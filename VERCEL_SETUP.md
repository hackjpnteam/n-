# Vercel環境変数設定ガイド

## 必要な環境変数

Vercelダッシュボードで以下の環境変数を設定してください：

### MongoDB
```
MONGODB_URI=mongodb+srv://study:hj12042014@cluster0.udcucg2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### NextAuth
```
NEXTAUTH_URL=https://your-vercel-app.vercel.app
NEXTAUTH_SECRET=ZzP3u7Yh1s0mTf4xWq8kN9cB6rL2dQ5p
AUTH_TRUST_HOST=true
```

### Google OAuth
```
GOOGLE_CLIENT_ID=[Your Google OAuth Client ID]
GOOGLE_CLIENT_SECRET=[Your Google OAuth Client Secret]
```

## 設定手順

1. Vercelダッシュボードに移動
2. プロジェクトの設定画面を開く
3. Environment Variables セクションで上記の変数を追加
4. Production, Preview, Development 全ての環境に追加
5. 再デプロイを実行

## 確認事項

- 会員一覧ページが正常に表示される
- MongoDBからユーザー情報が取得できる
- Google認証が動作する

## テストアカウント

以下のアカウントでログインテストができます：

- Email: tomura@hackjpn.com
- Password: admin

これで会員一覧に4名のメンバーが表示されるはずです。