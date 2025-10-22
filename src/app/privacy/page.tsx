import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'NoCode UI Builderのプライバシーポリシー',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              NoCode UI Builder
            </span>
          </Link>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">プライバシーポリシー</h1>
        <p className="text-gray-600 mb-8">最終更新日: 2025年10月22日</p>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* はじめに */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">はじめに</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>
                Kaleido Future（以下「当社」といいます）は、NoCode UI Builder（以下「本サービス」といいます）をご利用いただくユーザーの個人情報の保護に努めています。本プライバシーポリシー（以下「本ポリシー」といいます）は、本サービスにおける個人情報の取扱いについて定めるものです。
              </p>
            </div>
          </section>

          {/* 第1条 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">第1条（収集する情報）</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>当社は、本サービスにおいて以下の情報を収集する場合があります。</p>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  <strong>アクセス情報:</strong> IPアドレス、ブラウザの種類、アクセス日時、参照元URL等
                </li>
                <li>
                  <strong>利用状況情報:</strong> 本サービスの利用状況、閲覧履歴等
                </li>
                <li>
                  <strong>Cookieおよび類似技術:</strong> Cookieやローカルストレージを使用してユーザーの設定やプロジェクトデータを保存する場合があります
                </li>
                <li>
                  <strong>作成コンテンツ:</strong> ユーザーが本サービスで作成したUIデザインやプロジェクトデータ（ローカルストレージに保存されます）
                </li>
              </ul>
            </div>
          </section>

          {/* 第2条 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">第2条（情報の利用目的）</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>当社は、収集した情報を以下の目的で利用します。</p>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li>本サービスの提供、維持、保護および改善のため</li>
                <li>本サービスの利用状況の分析のため</li>
                <li>本サービスに関するお知らせ、アップデート情報等の配信のため</li>
                <li>ユーザーからのお問い合わせへの対応のため</li>
                <li>本サービスの不正利用の防止のため</li>
                <li>利用規約違反の調査のため</li>
                <li>上記利用目的に付随する目的のため</li>
              </ul>
            </div>
          </section>

          {/* 第3条 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">第3条（データの保存場所）</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>
                本サービスは、ユーザーが作成したプロジェクトデータをユーザーのブラウザのローカルストレージに保存します。当社のサーバーには、プロジェクトデータは保存されません。
              </p>
              <p>
                ただし、サービスの改善や分析のために、匿名化されたアクセスログや利用状況データを当社のサーバーに保存する場合があります。
              </p>
            </div>
          </section>

          {/* 第4条 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">第4条（情報の第三者提供）</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>
                当社は、以下の場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。
              </p>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li>法令に基づく場合</li>
                <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難である場合</li>
                <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難である場合</li>
                <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがある場合</li>
              </ul>
            </div>
          </section>

          {/* 第5条 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">第5条（Cookieおよび類似技術）</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>
                本サービスでは、ユーザーの利便性向上のためにCookieおよびローカルストレージを使用しています。これらの技術は、ユーザーの設定やプロジェクトデータを保存するために使用されます。
              </p>
              <p>
                ユーザーは、ブラウザの設定によりCookieを無効にすることができますが、その場合、本サービスの一部機能が利用できなくなる可能性があります。
              </p>
            </div>
          </section>

          {/* 第6条 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">第6条（アクセス解析ツール）</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>
                本サービスでは、サービスの改善や利用状況の分析のために、Google Analyticsなどのアクセス解析ツールを使用する場合があります。これらのツールは、Cookieを使用してユーザーの情報を収集します。
              </p>
              <p>
                収集される情報は匿名で収集され、個人を特定するものではありません。この機能はCookieを無効にすることで収集を拒否することができます。
              </p>
            </div>
          </section>

          {/* 第7条 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">第7条（セキュリティ）</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>
                当社は、個人情報の紛失、破壊、改ざんおよび漏洩などのリスクに対して、合理的な安全対策を講じます。ただし、インターネット上での情報の送信が完全に安全であることを保証するものではありません。
              </p>
            </div>
          </section>

          {/* 第8条 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">第8条（プライバシーポリシーの変更）</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>
                当社は、法令の変更や本サービスの機能改善等に伴い、本ポリシーを変更することがあります。変更後のプライバシーポリシーは、本サービス上に掲載された時点から効力を生じるものとします。
              </p>
            </div>
          </section>

          {/* 第9条 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">第9条（お問い合わせ）</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>
                本ポリシーに関するお問い合わせは、Kaleido Futureまでご連絡ください。
              </p>
            </div>
          </section>

          {/* 運営会社情報 */}
          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">運営会社</h2>
            <div className="text-gray-700 leading-relaxed">
              <p className="font-semibold mb-2">Kaleido Future</p>
              <p>本サービスはKaleido Futureが運営しています。</p>
            </div>
          </section>
        </div>

        {/* 戻るリンク */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            ホームに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
