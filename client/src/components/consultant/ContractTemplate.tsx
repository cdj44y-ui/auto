import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContractTemplateProps {
  companyName: string;
  representative: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  position: string;
  baseSalary: number;
  fixedOvertimeAllowance: number;
  fixedNightAllowance?: number;
  fixedHolidayAllowance?: number;
  mealAllowance?: number;
  totalSalary: number;
}

export default function ContractTemplate({
  companyName,
  representative,
  employeeName,
  startDate,
  endDate,
  position,
  baseSalary,
  fixedOvertimeAllowance,
  fixedNightAllowance = 0,
  fixedHolidayAllowance = 0,
  mealAllowance = 0,
  totalSalary
}: ContractTemplateProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto bg-white shadow-lg print:shadow-none print:border-none">
      <CardHeader className="text-center border-b pb-6">
        <CardTitle className="text-2xl font-bold">근 로 계 약 서</CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6 text-sm leading-relaxed">
        <p>
          <strong>{companyName}</strong>(대표 {representative}, 이하 "사업주"라 한다)과 <strong>{employeeName}</strong>(이하 "직원"이라 한다)은(는) 다음과 같이 근로계약을 체결하고 이를 상호 성실히 이행할 것을 약정한다.
        </p>

        <div className="space-y-4">
          <section>
            <h3 className="font-bold mb-1">제1조 【목적】</h3>
            <p>본 계약은 "사업주"의 사업장에서 "직원"이 근로를 제공함에 따라 필요한 제반 근로조건에 관한 사항을 정함을 목적으로 한다.</p>
          </section>

          <section>
            <h3 className="font-bold mb-1">제2조 【계약기간 및 수습】</h3>
            <p>① 계약기간은 {startDate} 부터 {endDate} 까지로 한다.</p>
            <p>② 입사 후 3개월은 수습기간으로 하며, 수습기간 중 업무태도, 업무능력 등을 종합적으로 고려하여 본 채용을 거절할 수 있다.</p>
          </section>

          <section>
            <h3 className="font-bold mb-1">제3조 【근무장소 및 업무】</h3>
            <p>① 근무장소 : "사업주" 사업장 주소지 및 "사업주"가 지정한 장소</p>
            <p>② 담당업무 : {position}</p>
            <p>③ 제1항 및 제2항의 근무장소 및 담당업무는 업무상 필요에 따라 변경될 수 있다.</p>
          </section>

          <section>
            <h3 className="font-bold mb-1">제4조 【근로시간 및 휴게】</h3>
            <p>① 근무일 및 근로시간, 휴게시간은 다음과 같다. 단, 근무일 및 휴게시간은 월 근무 스케줄에 따라 정해지며, "직원"은 이에 동의한다.</p>
            <div className="border p-2 my-2 bg-slate-50 text-center">
              <p><strong>근무일:</strong> 월~일 중 5일 / <strong>시간:</strong> 10:30~20:00 (9시간) / <strong>휴게:</strong> 14:00~15:00 (1시간)</p>
            </div>
            <p>③ "사업주"는 업무 특성을 고려하여 시간외근로를 실시할 수 있으며, "직원"은 "사업주"의 업무지시에 따라 시간외근로를 제공함에 동의한다.</p>
            <p>④ "직원"은 제3항에서 정한 시간외근로 외에 추가로 근무를 하고자 할 경우에는 "사업주"가 정한 시간외근로 신청서를 반드시 작성하여 제출하고 "사업주"의 승인을 얻어야 하며, 승인을 얻지 못한 때에는 자발적 근로로 간주하여 이를 인정하지 아니한다.</p>
            <p>⑤ "사업주"는 사업장 운영형태 및 업무상 필요에 따라 "직원"과 합의를 통해 위 근무일 및 근로시간, 휴(무)일 등에 관한 사항을 변경하여 운영할 수 있으며 직원은 이에 동의한다.</p>
          </section>

          <section>
            <h3 className="font-bold mb-1">제5조 【임금】</h3>
            <p>① "직원"의 월급은 다음 항목으로 구성된다.</p>
            <table className="w-full border-collapse border border-slate-300 mt-2 text-center">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-2">구분</th>
                  <th className="border border-slate-300 p-2">금액</th>
                  <th className="border border-slate-300 p-2">비고</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2">기본급</td>
                  <td className="border border-slate-300 p-2 text-right">{baseSalary.toLocaleString()} 원</td>
                  <td className="border border-slate-300 p-2 text-left">209시간 (주휴포함)</td>
                </tr>
                {mealAllowance > 0 && (
                  <tr>
                    <td className="border border-slate-300 p-2">식대</td>
                    <td className="border border-slate-300 p-2 text-right">{mealAllowance.toLocaleString()} 원</td>
                    <td className="border border-slate-300 p-2 text-left">비과세</td>
                  </tr>
                )}
                <tr>
                  <td className="border border-slate-300 p-2">고정 연장근로수당</td>
                  <td className="border border-slate-300 p-2 text-right">{fixedOvertimeAllowance.toLocaleString()} 원</td>
                  <td className="border border-slate-300 p-2 text-left">연장근로 포괄산정</td>
                </tr>
                {fixedNightAllowance > 0 && (
                  <tr>
                    <td className="border border-slate-300 p-2">고정 야간근로수당</td>
                    <td className="border border-slate-300 p-2 text-right">{fixedNightAllowance.toLocaleString()} 원</td>
                    <td className="border border-slate-300 p-2 text-left">야간근로 포괄산정</td>
                  </tr>
                )}
                {fixedHolidayAllowance > 0 && (
                  <tr>
                    <td className="border border-slate-300 p-2">고정 휴일근로수당</td>
                    <td className="border border-slate-300 p-2 text-right">{fixedHolidayAllowance.toLocaleString()} 원</td>
                    <td className="border border-slate-300 p-2 text-left">휴일근로 포괄산정</td>
                  </tr>
                )}
                <tr className="font-bold bg-slate-50">
                  <td className="border border-slate-300 p-2">계 (Total)</td>
                  <td className="border border-slate-300 p-2 text-right text-indigo-600">{totalSalary.toLocaleString()} 원</td>
                  <td className="border border-slate-300 p-2"></td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2">② "사업주"는 "직원"에게 매월 10일에 직원이 설정한 급여계좌로 월급을 지급하며 단, 10일이 휴(무)일인 경우에는 그 전일에 지급한다. 지급하는 월급의 계산기간은 매월 1일부터 말일까지로 하며, 익월 해당 기간의 임금을 정산하여 지급한다.</p>
            <p>③ "사업주"는 "직원"의 임금에서 관계법령에 따른 세금 등 금원을 공제 후 지급한다.</p>
          </section>

          <section>
            <h3 className="font-bold mb-1">제6조 【휴일 및 휴가】</h3>
            <p>① 유급휴일은 관공서에 의한 공휴일, 주휴일(매주 일요일), 근로자의 날(5월 1일)로 하며, 주휴일은 소정근로 개근 시에만 유급으로 인정한다. 또한 근무일 및 유급휴일을 제외한 날은 무급휴무일로 하되, "사업주"는 근로시간 운영에 따라 주휴일 및 무급휴무일의 구체적인 요일을 탄력적으로 변경하여 적용할 수 있다.</p>
            <p>② 연차휴가는 통상근로자의 근로기준법에 따라 부여하고, 시기는 최소 7일 전에 협의하도록 한다.</p>
          </section>

          <section>
            <h3 className="font-bold mb-1">제7조 【퇴직절차 등】</h3>
            <p>① "직원"은 사직하고자 할 경우 사직예정일 30일 전에 "사업주"에게 회사가 정한 소정의 사직서를 반드시 작성하여 제출하고, "사업주"의 승인이 있기 전까지 성실히 근무하여야 한다.</p>
            <p>② 퇴직시 "직원"은 "사업주"의 지시에 따라 후임자에게 성실히 업무 인수인계를 하여야 한다.</p>
            <p>③ 제1항 및 제2항의 절차를 준수하지 않고 퇴사하여 "사업주"에게 손해가 발생한 경우에는 그 발생한 손해액을 "직원"이 전부 부담한다.</p>
            <p>④ 퇴직급여는 근로자퇴직급여 보장법에 따라 지급한다.</p>
          </section>

          <section>
            <h3 className="font-bold mb-1">제8조 【근로계약 해지】</h3>
            <p>"사업주"는 다음 각 호의 경우에는 이 근로계약을 해지할 수 있다.</p>
            <ol className="list-decimal list-inside pl-2 space-y-1">
              <li>"직원"의 3일 연속된 무단결근으로 근무 의사가 없다고 판단되는 경우</li>
              <li>"직원"의 잦은 지각, 조퇴, 결근 등 근무태도가 불량하고 그 개전의 정이 없는 경우</li>
              <li>"직원"의 불친절 등으로 "사업주" 고객의 불만이 반복되는 경우</li>
              <li>"직원"이 정당한 업무지시를 거부하거나, "사업주" 소유 금품·물품 사취하거나 횡령한 경우</li>
              <li>"직원"이 직원간 불화를 일으켜 사업장 질서를 문란하게 한 경우</li>
              <li>"직원"이 근무를 계속할 수 없는 업무 외 상병에 걸린 경우</li>
              <li>"직원"의 근무능력이 현저히 저조하다고 판단되는 경우</li>
              <li>"사업주"의 사업운영에 대한 사정이 악화되어 고용조정이 불가피한 경우</li>
              <li>"직원"이 고의 또는 중대한 과실로 인해 "사업주" 사업장의 기물을 훼손한 경우</li>
              <li>"직원"이 사업주의 영업비밀 및 재산적 정보 등을 제 3자에게 누설 또는 공개할 경우</li>
              <li>기타 상기에 준하는 사유로 이 계약을 계속적으로 유지할 신뢰관계가 훼손된 경우</li>
            </ol>
          </section>

          <section>
            <h3 className="font-bold mb-1">제9조 【기 타】</h3>
            <p>① 본 계약서에 명시되지 않은 사항은 노동관계법령에 따른다.</p>
            <p>② "직원"은 이 근로계약서 1부를 교부받았음을 확인한다.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t text-center">
          <p className="mb-8">상기 계약사항으로 근로계약을 체결하며, 상호 확인한다.</p>
          <p className="mb-8 font-bold text-lg">{new Date().getFullYear()}년 {new Date().getMonth() + 1}월 {new Date().getDate()}일</p>
          
          <div className="flex justify-between px-12">
            <div className="text-left">
              <p className="font-bold mb-2">"사업주"</p>
              <p>상호: {companyName}</p>
              <p>대표자: {representative} (인)</p>
            </div>
            <div className="text-left">
              <p className="font-bold mb-2">"직원"</p>
              <p>성명: {employeeName} (인)</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
