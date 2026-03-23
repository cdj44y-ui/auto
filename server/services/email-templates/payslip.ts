/**
 * P-05: 급여명세서 이메일 HTML 템플릿
 */

function fmt(n: number | undefined | null): string {
  return (n ?? 0).toLocaleString("ko-KR");
}

export function payslipHtml(
  employee: { name: string; email: string },
  record: {
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
): string {
  const year = record.period.slice(0, 4);
  const month = record.period.slice(4);
  const gross = record.grossPay ?? (record.baseSalary + (record.overtimePay ?? 0) + (record.bonus ?? 0) + (record.allowances ?? 0));
  const totalDeductions = (record.nationalPension ?? 0) + (record.healthInsurance ?? 0) + (record.longTermCare ?? 0) + (record.employmentInsurance ?? 0) + (record.incomeTax ?? 0) + (record.localIncomeTax ?? 0);

  return `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;font-family:'Pretendard',sans-serif;background:#f8fafc;">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
  <div style="background:#1e293b;color:#fff;padding:24px 32px;">
    <h1 style="margin:0;font-size:20px;">급여명세서</h1>
    <p style="margin:8px 0 0;opacity:0.8;">${year}년 ${month}월</p>
  </div>
  <div style="padding:24px 32px;">
    <p style="margin:0 0 16px;color:#475569;">안녕하세요, <strong>${employee.name}</strong>님.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr style="background:#f1f5f9;"><th colspan="2" style="padding:10px 12px;text-align:left;border-bottom:1px solid #e2e8f0;">지급 내역</th></tr>
      <tr><td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;">기본급</td><td style="text-align:right;padding:8px 12px;border-bottom:1px solid #f1f5f9;">${fmt(record.baseSalary)}원</td></tr>
      <tr><td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;">연장수당</td><td style="text-align:right;padding:8px 12px;border-bottom:1px solid #f1f5f9;">${fmt(record.overtimePay)}원</td></tr>
      <tr><td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;">상여금</td><td style="text-align:right;padding:8px 12px;border-bottom:1px solid #f1f5f9;">${fmt(record.bonus)}원</td></tr>
      <tr><td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;">수당</td><td style="text-align:right;padding:8px 12px;border-bottom:1px solid #f1f5f9;">${fmt(record.allowances)}원</td></tr>
      <tr style="font-weight:bold;"><td style="padding:10px 12px;border-bottom:2px solid #e2e8f0;">지급 합계</td><td style="text-align:right;padding:10px 12px;border-bottom:2px solid #e2e8f0;">${fmt(gross)}원</td></tr>

      <tr style="background:#f1f5f9;"><th colspan="2" style="padding:10px 12px;text-align:left;border-bottom:1px solid #e2e8f0;">공제 내역</th></tr>
      <tr><td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;">국민연금</td><td style="text-align:right;padding:8px 12px;border-bottom:1px solid #f1f5f9;">${fmt(record.nationalPension)}원</td></tr>
      <tr><td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;">건강보험</td><td style="text-align:right;padding:8px 12px;border-bottom:1px solid #f1f5f9;">${fmt(record.healthInsurance)}원</td></tr>
      <tr><td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;">장기요양보험</td><td style="text-align:right;padding:8px 12px;border-bottom:1px solid #f1f5f9;">${fmt(record.longTermCare)}원</td></tr>
      <tr><td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;">고용보험</td><td style="text-align:right;padding:8px 12px;border-bottom:1px solid #f1f5f9;">${fmt(record.employmentInsurance)}원</td></tr>
      <tr><td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;">소득세</td><td style="text-align:right;padding:8px 12px;border-bottom:1px solid #f1f5f9;">${fmt(record.incomeTax)}원</td></tr>
      <tr><td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;">지방소득세</td><td style="text-align:right;padding:8px 12px;border-bottom:1px solid #f1f5f9;">${fmt(record.localIncomeTax)}원</td></tr>
      <tr style="font-weight:bold;"><td style="padding:10px 12px;border-bottom:2px solid #e2e8f0;">공제 합계</td><td style="text-align:right;padding:10px 12px;border-bottom:2px solid #e2e8f0;">${fmt(totalDeductions)}원</td></tr>

      <tr style="background:#1e293b;color:#fff;font-weight:bold;font-size:16px;">
        <td style="padding:14px 12px;">실수령액</td>
        <td style="text-align:right;padding:14px 12px;">${fmt(record.netPay)}원</td>
      </tr>
    </table>
    <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;">본 명세서는 자동 발송되었습니다. 문의사항은 인사팀에 연락해 주세요.</p>
  </div>
</div>
</body></html>`;
}
