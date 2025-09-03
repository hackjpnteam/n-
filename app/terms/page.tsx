export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">利用規約</h1>
      
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 mb-6">
          最終更新日: 2024年1月1日
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">第1条（適用）</h2>
          <p className="text-gray-700 leading-relaxed">
            本規約は、hackjpn, inc.（以下「当社」）が提供するオンライン学習プラットフォーム「ナレッジシェア」（以下「本サービス」）の利用に関して、当社と利用者との間の権利義務関係を定めることを目的とし、利用者と当社との間の本サービスの利用に関わる一切の関係に適用されます。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">第2条（利用登録）</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            本サービスにおいては、登録希望者が本規約に同意の上、当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。
          </p>
          <p className="text-gray-700 leading-relaxed">
            当社は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">第3条（禁止事項）</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            利用者は、本サービスの利用にあたり、以下の行為をしてはなりません。
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>法令または公序良俗に反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>当社のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
            <li>本サービスの運営を妨害するおそれのある行為</li>
            <li>他の利用者に関する個人情報等を収集または蓄積する行為</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">第4条（本サービスの提供の停止等）</h2>
          <p className="text-gray-700 leading-relaxed">
            当社は、以下のいずれかの事由があると判断した場合、利用者に事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">第5条（利用制限および登録抹消）</h2>
          <p className="text-gray-700 leading-relaxed">
            当社は、利用者が以下のいずれかに該当する場合には、事前の通知なく、利用者に対して、本サービスの全部もしくは一部の利用を制限し、または利用者としての登録を抹消することができるものとします。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">第6条（免責事項）</h2>
          <p className="text-gray-700 leading-relaxed">
            当社の債務不履行責任は、当社の故意または重過失によらない場合には免責されるものとします。
            当社は、本サービスに関して、利用者と他の利用者または第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">第7条（規約の変更）</h2>
          <p className="text-gray-700 leading-relaxed">
            当社は、必要と判断した場合には、利用者に通知することなくいつでも本規約を変更することができるものとします。
            なお、本規約の変更後、本サービスの利用を開始した場合には、当該利用者は変更後の規約に同意したものとみなします。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">お問い合わせ</h2>
          <p className="text-gray-700 leading-relaxed">
            本規約に関するお問い合わせは、当社までご連絡ください。
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">
              hackjpn, inc.<br/>
              Email: team@hackjpn.com
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}