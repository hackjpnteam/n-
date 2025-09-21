# Google OAuth設定ガイド

## Google Cloud Consoleでの設定確認

### 1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス

### 2. OAuth 2.0 クライアントIDの設定を確認

**承認済みのリダイレクトURI**に以下が追加されているか確認：

```
https://n-gold-chi.vercel.app/api/auth/callback/google
```

### 3. 承認済みのJavaScript生成元

```
https://n-gold-chi.vercel.app
```

### 4. 重要な注意点

- URLは**https**である必要があります
- 末尾にスラッシュ(`/`)を付けないでください
- 本番環境のURLを正確に設定してください

### 5. 設定変更後

Google Cloud Consoleで設定を変更した場合：
1. 「保存」ボタンをクリック
2. 変更が反映されるまで5-10分待つ
3. ブラウザのキャッシュをクリア（Ctrl+Shift+Delete）
4. 再度ログインを試す

### トラブルシューティング

エラー「redirect_uri_mismatch」が出る場合：
- Google Cloud ConsoleのリダイレクトURIが正確に設定されているか確認
- Vercelの環境変数`NEXTAUTH_URL`が正しいか確認