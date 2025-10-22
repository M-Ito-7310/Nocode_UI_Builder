import Link from 'next/link';
import type { Metadata } from 'next';
import ParticleBackground from '@/components/ParticleBackground';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: '利用規約',
  description: 'NoCode UI Builderの利用規約',
};

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ParticleBackground />
      <Header variant="white" />

      {/* メインコンテンツ */}
      <main className="relative z-10 container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">利用規約</h1>
        <p className="text-gray-600 mb-8">最終更新日: 2025年10月22日</p>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* 第1条 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">第1条（適用）</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>
                1. この利用規約（以下「本規約」といいます）は、Kaleido Future（以下「当社」といいます）が提供するNoCode UI Builder（以下「本サービス」といいます）の利用条件を定めるものです。
              </p>
              <p>
                2. 本規約は、本サービスの利用に関する当社とユーザーとの間の権利義務関係を定めることを目的とし、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されます。
              </p>
              <p>
                3. ユーザーは、本サービスを利用することにより、本規約の全ての内容に同意したものとみなされます。
              </p>
            </div>
          </section>

          {/* 第2条 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">第2条（定義）</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>本規約において使用する用語の定義は、次の各号に定めるとおりとします。</p>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  「本サービス」とは、当社が提供するNoCode UI Builderという名称のサービス（理由の如何を問わずサービスの名称または内容が変更された場合は、当該変更後のサービスを含みます）を意味します。
                </li>
                <li>
                  「ユーザー」とは、本サービスを利用する全ての方を意味します。
                </li>
                <li>
                  「知的財産権」とは、著作権、特許権、実用新案権、商標権、意匠権その他の知的財産権（それらの権利を取得し、またはそれらの権利につき登録等を出願する権利を含みます）を意味します。
                </li>
              </ul>
            </div>
          </section>

          {/* 第3条 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">第3条（本サービスの内容）</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>
                1. 本サービスは、ユーザーがプログラミング不要でWebユーザーインターフェースを作成できるノーコードビルダーツールを提供します。
              </p>
              <p>
                2. 本サービスは無料で提供されますが、当社は将来的に有料プランを導入する場合があります。
              </p>
              <p>
                3. 当社は、ユーザーへの事前の通知なく、本サービスの内容を変更、追加、または廃止することができるものとします。
              </p>
            </div>
          </section>

          {/* 第4条 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">第4条（禁止事項）</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。</p>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li>法令に違反する行為または犯罪行為に関連する行為</li>
                <li>当社、他のユーザー、または第三者に対する詐欺または脅迫行為</li>
                <li>公序良俗に反する行為</li>
                <li>当社、他のユーザー、または第三者の知的財産権、肖像権、プライバシー、名誉、その他の権利または利益を侵害する行為</li>
                <li>本サービスのネットワークまたはシステム等に過度な負荷をかける行為</li>
                <li>本サービスの運営を妨害する行為</li>
                <li>当社のネットワークまたはシステム等への不正アクセス</li>
                <li>第三者になりすます行為</li>
                <li>本サービスの他のユーザーのIDまたはパスワードを利用する行為</li>
                <li>当社が事前に許諾しない本サービス上での宣伝、広告、勧誘、または営業行為</li>
                <li>本サービスの他のユーザーの情報の収集</li>
                <li>反社会的勢力等への利益供与</li>
                <li>その他、当社が不適切と判断する行為</li>
              </ul>
            </div>
          </section>

          {/* 第5条 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">第5条（免責事項）</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>
                1. 当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます）がないことを保証するものではありません。
              </p>
              <p>
                2. 当社は、本サービスに起因してユーザーに生じたあらゆる損害について、一切の責任を負いません。
              </p>
              <p>
                3. 当社は、本サービスの利用によりユーザーが作成したコンテンツについて、一切の責任を負いません。
              </p>
            </div>
          </section>

          {/* 第6条 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">第6条（知的財産権）</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>
                1. 本サービスに関する知的財産権は、全て当社または当社にライセンスを許諾している者に帰属します。
              </p>
              <p>
                2. ユーザーが本サービスを利用して作成したコンテンツの知的財産権は、ユーザーに帰属します。
              </p>
            </div>
          </section>

          {/* 第7条 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">第7条（本規約の変更）</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>
                当社は、ユーザーへの事前の通知なく、本規約を変更することができるものとします。変更後の本規約は、本サービス上に掲載された時点から効力を生じるものとします。
              </p>
            </div>
          </section>

          {/* 第8条 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">第8条（準拠法および管轄裁判所）</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p>
                1. 本規約の準拠法は日本法とします。
              </p>
              <p>
                2. 本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄裁判所とします。
              </p>
            </div>
          </section>

          {/* お問い合わせ */}
          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">お問い合わせ</h2>
            <p className="text-gray-700 leading-relaxed">
              本規約に関するお問い合わせは、Kaleido Futureまでご連絡ください。
            </p>
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
