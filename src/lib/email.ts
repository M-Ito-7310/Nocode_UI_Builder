import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

/**
 * ContactFormData型定義
 */
export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

/**
 * ContactFormResponse型定義
 */
export interface ContactFormResponse {
  success: boolean
  message: string
  error?: string
}

/**
 * Email transporter configuration
 */
const createTransporter = (): Transporter => {
  const config = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  }

  console.log('[Email] Creating transporter with config:', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.auth.user,
    passwordLength: config.auth.pass?.length || 0,
  })

  return nodemailer.createTransport(config)
}

/**
 * Check if email is configured
 */
export const isEmailConfigured = (): boolean => {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD)
}

/**
 * Format contact notification email
 */
const formatContactEmail = (contact: ContactFormData): { subject: string; html: string; text: string } => {
  const subject = `[NoCode UI Builder] 新規お問い合わせ - ${contact.subject}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border: 2px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
    .info-box { background: white; border-left: 4px solid #6366f1; padding: 15px; margin: 15px 0; border-radius: 4px; border: 1px solid #e5e7eb; }
    .label { font-weight: bold; color: #000; margin-bottom: 5px; }
    .value { color: #555; }
    .message-box { background: white; border: 1px solid #e5e7eb; padding: 20px; margin: 15px 0; border-radius: 4px; white-space: pre-wrap; }
    .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">新規お問い合わせ</h1>
      <p style="margin: 10px 0 0 0;">NoCode UI Builder Contact Form</p>
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-bottom: 20px;">
        NoCode UI Builderに新しいお問い合わせが届きました。
      </p>

      <h3 style="margin-top: 30px; color: #000;">送信者情報</h3>

      <div class="info-box">
        <div class="label">名前</div>
        <div class="value">${contact.name}</div>
      </div>

      <div class="info-box">
        <div class="label">メールアドレス</div>
        <div class="value"><a href="mailto:${contact.email}">${contact.email}</a></div>
      </div>

      <h3 style="margin-top: 30px; color: #000;">お問い合わせ内容</h3>

      <div class="info-box">
        <div class="label">件名</div>
        <div class="value">${contact.subject}</div>
      </div>

      <div class="label" style="margin-top: 20px;">メッセージ</div>
      <div class="message-box">${contact.message}</div>

      <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 4px; border: 1px solid #fbbf24; text-align: center;">
        <p style="margin: 0; color: #000;">
          このお問い合わせには2営業日以内に返信することをお勧めします。
        </p>
      </div>
    </div>
    <div class="footer">
      <p>このメールはNoCode UI Builderのお問い合わせフォームから自動送信されています。</p>
      <p>NoCode UI Builder - ドラッグ&ドロップでUIを構築</p>
    </div>
  </div>
</body>
</html>
  `

  const text = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NoCode UI Builder - 新規お問い合わせ通知
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NoCode UI Builderに新しいお問い合わせが届きました。

【送信者情報】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

名前: ${contact.name}
メール: ${contact.email}

【お問い合わせ内容】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

件名: ${contact.subject}

メッセージ:
${contact.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

このお問い合わせには2営業日以内に返信することをお勧めします。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
このメールはNoCode UI Builderのお問い合わせフォームから自動送信されています。
NoCode UI Builder - ドラッグ&ドロップでUIを構築
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `

  return { subject, html, text }
}

/**
 * Send contact form notification email to admin
 */
export const sendContactNotification = async (
  contact: ContactFormData
): Promise<{ success: boolean; error?: string }> => {
  // Check if email is configured
  if (!isEmailConfigured()) {
    console.warn('Email not configured. Skipping notification email.')
    return { success: false, error: 'Email not configured' }
  }

  try {
    console.log('Starting email notification', { email: contact.email })

    const transporter = createTransporter()
    const { subject, html, text } = formatContactEmail(contact)

    const adminEmail = process.env.ADMIN_EMAIL || 'nocode_ui_builder_contact@kaleidofuture.com'
    const fromEmail = process.env.EMAIL_FROM || 'nocode_ui_builder_contact@kaleidofuture.com'

    const mailOptions = {
      from: `"NoCode UI Builder Contact" <${fromEmail}>`,
      to: adminEmail,
      subject,
      text,
      html,
      // Reply-To should be the contact's email
      replyTo: `"${contact.name}" <${contact.email}>`,
    }

    console.log('Attempting to send email...', {
      to: adminEmail,
      from: fromEmail
    })

    const info = await transporter.sendMail(mailOptions)

    console.log('Contact notification email sent successfully', {
      messageId: info.messageId,
      to: adminEmail,
    })

    return { success: true }
  } catch (error) {
    // 詳細なエラー情報をログに出力
    console.error('[Email] Failed to send contact notification email', {
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorName: error instanceof Error ? error.name : 'UnknownError',
      errorCode: (error as any)?.code,
      errorCommand: (error as any)?.command,
      errorResponse: (error as any)?.response,
      errorResponseCode: (error as any)?.responseCode,
      stack: error instanceof Error ? error.stack : undefined,
      smtpConfig: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        user: process.env.SMTP_USER,
      },
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
