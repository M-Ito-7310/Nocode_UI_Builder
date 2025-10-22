import { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import ParticleBackground from '@/components/ParticleBackground'
import { Header } from '@/components/Header'

export const metadata: Metadata = {
  title: 'お問い合わせ - NoCode UI Builder',
  description:
    'NoCode UI Builderに関するご質問、フィードバック、サポート依頼はこちらからお問い合わせください。',
}

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <ParticleBackground />
      <Header variant="white" />

      {/* メインコンテンツ */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          {/* タイトルセクション */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              お問い合わせ
            </h2>
            <p className="text-gray-600">
              NoCode UI
              Builderに関するご質問、フィードバック、サポート依頼など、お気軽にお問い合わせください。
            </p>
          </div>

          {/* お問い合わせフォーム */}
          <ContactForm />

          {/* 注意事項 */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              ご注意事項
            </h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>お問い合わせには2営業日以内にご返信いたします。</li>
              <li>
                お急ぎの場合は、件名に「【至急】」とご記入ください。
              </li>
              <li>
                迷惑メール対策のため、ドメイン指定受信を設定されている場合は、
                <span className="font-medium">
                  @kaleidofuture.com
                </span>
                からのメールを受信できるよう設定してください。
              </li>
            </ul>
          </div>
        </div>

        {/* その他の情報 */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            お問い合わせいただいた内容は、サービス向上のために使用させていただく場合がございます。
          </p>
        </div>
      </main>
    </div>
  )
}
