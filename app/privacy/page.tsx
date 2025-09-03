export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>
      
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 mb-6">
          最終更新日: 2024年1月1日
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">個人情報の取得</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            hackjpn, inc.（以下「当社」）は、以下の場合に個人情報を取得いたします。
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>サービスへの会員登録時</li>
            <li>お問い合わせ時</li>
            <li>サービス利用時の学習履歴</li>
            <li>クッキーやアクセスログ</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">個人情報の利用目的</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            当社は、取得した個人情報を以下の目的で利用いたします。
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>サービスの提供・運営のため</li>
            <li>利用者からのお問い合わせに回答するため</li>
            <li>サービスの改善・開発のため</li>
            <li>重要なお知らせの通知のため</li>
            <li>利用規約に違反した利用者の特定のため</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">個人情報の第三者提供</h2>
          <p className="text-gray-700 leading-relaxed">
            当社は、個人情報保護法その他の法令に基づき開示が認められる場合を除き、あらかじめ利用者の同意を得ることなく、第三者に個人情報を提供することはありません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">個人情報の開示・訂正等</h2>
          <p className="text-gray-700 leading-relaxed">
            利用者ご本人から個人情報の開示を求められたときは、遅滞なく開示いたします。
            個人情報の利用目的の通知や訂正、追加、削除、利用停止、消去および第三者提供の停止については、当社所定の手続きに従い、利用者ご本人であることを確認の上で対応いたします。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookieについて</h2>
          <p className="text-gray-700 leading-relaxed">
            当社のサービスでは、利用者の利便性向上のためにCookieを使用しています。
            Cookieの使用を希望されない場合は、ブラウザの設定でCookieを無効にすることができますが、サービスの一部機能が利用できなくなる可能性があります。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">プライバシーポリシーの変更</h2>
          <p className="text-gray-700 leading-relaxed">
            当社は、必要に応じて本プライバシーポリシーを変更することがあります。
            変更後のプライバシーポリシーは、当社ウェブサイトに掲載したときから効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">お問い合わせ窓口</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            本プライバシーポリシーに関するお問い合わせは、以下までご連絡ください。
          </p>
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">
              hackjpn, inc.<br/>
              個人情報保護責任者<br/>
              Email: team@hackjpn.com
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}