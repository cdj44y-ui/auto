/**
 * P-11: 엑셀 내보내기 서비스
 * 급여대장, 근태기록, 연차현황 + 더존 호환 포맷
 */

import * as XLSX from "xlsx";
import * as db from "../db";

function fmt(n: number | null | undefined): number {
  return n ?? 0;
}

// ============ 급여대장 엑셀 ============

export async function generatePayrollExcel(period: string, clientId?: number | null): Promise<Buffer> {
  const records = await db.getPayrollByPeriod(period, clientId);
  const employees = await db.getAllEmployees(clientId);
  const empMap = new Map(employees.map(e => [e.id, e]));

  const rows = records.map(r => {
    const emp = empMap.get(r.employeeId);
    return {
      "사번": emp?.employeeId ?? "",
      "성명": emp?.name ?? "",
      "부서": emp?.department ?? "",
      "기본급": fmt(r.baseSalary),
      "연장수당": fmt(r.overtimePay),
      "상여금": fmt(r.bonus),
      "수당": fmt((r as any).allowances),
      "지급합계": fmt((r as any).grossPay) || (fmt(r.baseSalary) + fmt(r.overtimePay) + fmt(r.bonus)),
      "국민연금": fmt((r as any).nationalPension),
      "건강보험": fmt((r as any).healthInsurance),
      "장기요양": fmt((r as any).longTermCare),
      "고용보험": fmt((r as any).employmentInsurance),
      "소득세": fmt((r as any).incomeTax),
      "지방소득세": fmt((r as any).localIncomeTax),
      "공제합계": fmt(r.deductions),
      "실수령액": fmt(r.netPay),
    };
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "급여대장");
  return Buffer.from(XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));
}

// ============ 더존 호환 급여대장 ============

export async function generateDuzonePayroll(period: string, clientId?: number | null): Promise<Buffer> {
  const records = await db.getPayrollByPeriod(period, clientId);
  const employees = await db.getAllEmployees(clientId);
  const empMap = new Map(employees.map(e => [e.id, e]));

  // 더존 iCUBE 업로드 형식: 사번 오름차순
  const sorted = [...records].sort((a, b) => {
    const empA = empMap.get(a.employeeId)?.employeeId ?? "";
    const empB = empMap.get(b.employeeId)?.employeeId ?? "";
    return empA.localeCompare(empB);
  });

  const rows = sorted.map(r => {
    const emp = empMap.get(r.employeeId);
    return {
      "사번": emp?.employeeId ?? "",
      "성명": emp?.name ?? "",
      "부서": emp?.department ?? "",
      "기본급": fmt(r.baseSalary),
      "연장수당": fmt(r.overtimePay),
      "야간수당": 0,
      "휴일수당": 0,
      "상여": fmt(r.bonus),
      "국민연금": fmt((r as any).nationalPension),
      "건강보험": fmt((r as any).healthInsurance),
      "장기요양": fmt((r as any).longTermCare),
      "고용보험": fmt((r as any).employmentInsurance),
      "소득세": fmt((r as any).incomeTax),
      "지방소득세": fmt((r as any).localIncomeTax),
      "공제합계": fmt(r.deductions),
      "실수령액": fmt(r.netPay),
    };
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "급여대장");
  return Buffer.from(XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));
}

// ============ 근태 기록 엑셀 ============

export async function generateAttendanceExcel(year: number, month: number, clientId?: number | null): Promise<Buffer> {
  const startOfMonth = new Date(year, month - 1, 1).getTime();
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999).getTime();

  const dbInst = await db.getDb();
  if (!dbInst) throw new Error("Database not available");

  const { attendanceRecords, employees } = await import("../../drizzle/schema");
  const { and, gte, lte, eq } = await import("drizzle-orm");

  const conditions: any[] = [
    gte(attendanceRecords.clockIn, startOfMonth),
    lte(attendanceRecords.clockIn, endOfMonth),
  ];
  if (clientId) conditions.push(eq(attendanceRecords.clientId, clientId));

  const records = await dbInst.select().from(attendanceRecords).where(and(...conditions));
  const emps = await db.getAllEmployees(clientId);
  const userMap = new Map(emps.map(e => [e.userId, e]));

  const rows = records.map(r => {
    const emp = userMap.get(r.userId);
    const clockInDate = new Date(r.clockIn);
    const clockOutDate = r.clockOut ? new Date(r.clockOut) : null;
    const workHours = r.clockOut ? ((r.clockOut - r.clockIn) / 3_600_000).toFixed(1) : "-";

    return {
      "날짜": clockInDate.toLocaleDateString("ko-KR"),
      "사번": emp?.employeeId ?? "",
      "성명": emp?.name ?? "",
      "부서": emp?.department ?? "",
      "출근시간": clockInDate.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      "퇴근시간": clockOutDate?.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) ?? "-",
      "근무시간(h)": workHours,
    };
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `근태기록_${year}${String(month).padStart(2, "0")}`);
  return Buffer.from(XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));
}
