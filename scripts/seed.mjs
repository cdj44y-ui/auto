import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { users, clients, employees, consultations } from "../drizzle/schema.ts";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL 환경변수가 필요합니다.");
  process.exit(1);
}

async function seed() {
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);
  const now = new Date();

  console.log("시드 데이터 삽입을 시작합니다...");

  // 1. 고객사 6개 생성
  const clientNames = ["가나다제조", "라마바물류", "사아자IT", "카타파건설", "하가나유통", "다라마의료"];
  for (let i = 0; i < 6; i++) {
    await db.insert(clients).values({
      companyName: clientNames[i],
      businessNumber: `123-45-678${i}`,
      representativeName: `대표${i + 1}`,
      email: `client${i + 1}@test.kr`,
      phone: `02-1234-567${i}`,
      contractStatus: "active",
      contractStartDate: now,
      contractEndDate: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
      maxEmployees: 50,
      isActive: true,
    });
  }
  console.log("✅ 고객사 6개 생성 완료");

  // 2. 고객사별 직원 5명씩 (총 30명)
  const departments = ["개발팀", "인사팀", "영업팀", "마케팅팀", "재무팀"];
  const positions = ["사원", "대리", "과장", "차장", "부장"];
  let empSeq = 1;
  for (let c = 1; c <= 6; c++) {
    for (let e = 0; e < 5; e++) {
      const empId = `EMP${String(empSeq).padStart(4, "0")}`;
      await db.insert(employees).values({
        employeeId: empId,
        name: `${clientNames[c - 1]}_직원${e + 1}`,
        email: `${empId.toLowerCase()}@test.kr`,
        phone: `010-${String(1000 + empSeq).slice(-4)}-${String(5000 + empSeq).slice(-4)}`,
        department: departments[e],
        position: positions[e],
        status: "active",
        joinDate: new Date(2024, 0, 1),
        clientId: c,
        salary: 3000000 + e * 500000,
        bankName: "국민은행",
        bankAccount: `110-${String(100 + empSeq)}-${String(400000 + empSeq)}`,
      });
      empSeq++;
    }
  }
  console.log("✅ 직원 30명 생성 완료 (고객사별 5명)");

  // 3. 자문이력 12건 (고객사별 2건)
  const consultTypes = ["labor_law", "payroll", "hr_policy", "compliance", "contract", "general"];
  const statuses = ["completed", "scheduled", "in_progress"];
  for (let i = 0; i < 12; i++) {
    const clientIdx = (i % 6) + 1;
    const consultDate = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    await db.insert(consultations).values({
      clientId: clientIdx,
      consultantId: 1,
      title: `${clientNames[clientIdx - 1]} ${consultTypes[i % 6]} 자문 ${Math.floor(i / 6) + 1}차`,
      description: `${clientNames[clientIdx - 1]}에 대한 ${consultTypes[i % 6]} 관련 자문 내용입니다.`,
      consultationType: consultTypes[i % 6],
      consultationDate: consultDate,
      startTime: "10:00",
      endTime: "11:30",
      duration: 90,
      status: statuses[i % 3],
      outcome: i % 3 === 0 ? "자문 완료. 후속 조치 필요 없음." : null,
      recommendations: i % 3 === 0 ? "현행 정책 유지 권고" : null,
      followUpRequired: i % 3 === 0 ? "no" : "yes",
    });
  }
  console.log("✅ 자문이력 12건 생성 완료");

  console.log("\n========================================");
  console.log("시드 데이터 삽입 완료!");
  console.log("========================================");
  console.log(`고객사: ${clientNames.join(", ")}`);
  console.log(`직원: 총 30명 (고객사별 5명)`);
  console.log(`자문이력: 총 12건 (고객사별 2건)`);

  await connection.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error("시드 실패:", err);
  process.exit(1);
});
