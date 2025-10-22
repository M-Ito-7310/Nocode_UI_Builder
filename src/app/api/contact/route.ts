/**
 * POST /api/contact
 *
 * お問い合わせフォーム送信API
 * - Zodバリデーション
 * - メール送信（Xserver経由）
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendContactNotification } from '@/lib/email'
import type { ContactFormResponse } from '@/lib/email'

// バリデーションスキーマ
const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'お名前を入力してください')
    .max(30, 'お名前は30文字以内で入力してください'),
  email: z
    .string()
    .email('有効なメールアドレスを入力してください'),
  subject: z
    .string()
    .min(1, '件名を入力してください')
    .max(100, '件名は100文字以内で入力してください'),
  message: z
    .string()
    .min(10, 'お問い合わせ内容は10文字以上で入力してください')
    .max(2000, 'お問い合わせ内容は2000文字以内で入力してください'),
})

export async function POST(request: NextRequest) {
  try {
    // 1. リクエストボディの取得とバリデーション
    const body = await request.json()
    const validationResult = contactSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'バリデーションエラー',
          error: validationResult.error.errors[0]?.message || 'バリデーションエラーが発生しました',
        } as ContactFormResponse,
        { status: 400 }
      )
    }

    const data = validationResult.data

    // 2. メール通知送信
    console.log('[Contact API] About to send email notification')
    const emailResult = await sendContactNotification(data)
    console.log('[Contact API] Email notification result:', emailResult)

    if (!emailResult.success) {
      console.error('[Contact API] Email notification failed:', {
        error: emailResult.error,
      })

      return NextResponse.json(
        {
          success: false,
          message: 'メール送信に失敗しました。しばらく時間をおいて再度お試しください。',
          error: emailResult.error,
        } as ContactFormResponse,
        { status: 500 }
      )
    }

    // 3. 成功レスポンス
    return NextResponse.json(
      {
        success: true,
        message: 'お問い合わせを受け付けました。ご連絡ありがとうございます。',
      } as ContactFormResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('Error submitting contact form:', error)

    // エラーハンドリング
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: 'サーバーエラーが発生しました。しばらく待ってから再度お試しください。',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        } as ContactFormResponse,
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: '不明なエラーが発生しました',
        error: '不明なエラー',
      } as ContactFormResponse,
      { status: 500 }
    )
  }
}
