/**
 * P-05: 이메일 발송 서비스
 * SendGrid 또는 SMTP(Nodemailer) 기반
 * EMAIL_PROVIDER 미설정 시 시뮬레이션 모드로 폴백
 */

import nodemailer from "nodemailer";

// ============ Types ============

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface BulkResult {
  total: number;
  sent: number;
  failed: number;
  results: { email: string; success: boolean; error?: string }[];
}

// ============ Transport ============

function getTransport() {
  const provider = process.env.EMAIL_PROVIDER;

  if (provider === "smtp") {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  if (provider === "sendgrid") {
    return nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  }

  // 시뮬레이션 모드
  return null;
}

// ============ Send Functions ============

/**
 * 단건 이메일 발송
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  attachments?: { filename: string; content: Buffer }[]
): Promise<EmailResult> {
  const transport = getTransport();

  if (!transport) {
    // 시뮬레이션 모드: 500ms 대기 후 성공 반환
    console.log(`[Email-Sim] To: ${to}, Subject: ${subject}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, messageId: `sim-${Date.now()}` };
  }

  try {
    const info = await transport.sendMail({
      from: process.env.EMAIL_FROM || "noreply@aes.co.kr",
      to,
      subject,
      html,
      attachments: attachments?.map(a => ({
        filename: a.filename,
        content: a.content,
      })),
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * 급여명세서 이메일 발송
 */
export async function sendPayslipEmail(
  employee: { name: string; email: string },
  payrollRecord: {
    period: string;
    baseSalary: number;
    overtimePay?: number;
    bonus?: number;
    allowances?: number;
    nationalPension?: number;
    healthInsurance?: number;
    longTermCare?: number;
    employmentInsurance?: number;
    incomeTax?: number;
    localIncomeTax?: number;
    grossPay?: number;
    deductions?: number;
    netPay: number;
  }
): Promise<EmailResult> {
  const { payslipHtml } = await import("./email-templates/payslip");
  const html = payslipHtml(employee, payrollRecord);
  const subject = `[AES] ${payrollRecord.period.slice(0, 4)}년 ${payrollRecord.period.slice(4)}월 급여명세서`;
  return sendEmail(employee.email, subject, html);
}

/**
 * 일괄 이메일 발송 (순차, 200ms 간격, 실패 시 3회 재시도)
 */
export async function sendBulkEmails(
  items: { to: string; subject: string; html: string }[]
): Promise<BulkResult> {
  const results: BulkResult["results"] = [];

  for (const item of items) {
    let lastError = "";
    let success = false;

    for (let attempt = 0; attempt < 3; attempt++) {
      const result = await sendEmail(item.to, item.subject, item.html);
      if (result.success) {
        success = true;
        break;
      }
      lastError = result.error || "Unknown error";
      await new Promise(resolve => setTimeout(resolve, 1000)); // 재시도 간격
    }

    results.push({ email: item.to, success, error: success ? undefined : lastError });
    await new Promise(resolve => setTimeout(resolve, 200)); // 발송 간격
  }

  return {
    total: items.length,
    sent: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results,
  };
}
