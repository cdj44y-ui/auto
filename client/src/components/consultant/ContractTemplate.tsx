import { Card, CardContent } from "@/components/ui/card";

interface ContractTemplateProps {
  companyName: string;
  representative: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  position: string;
  baseSalary: number;
  fixedOvertimeAllowance: number;
  fixedNightAllowance: number;
  fixedHolidayAllowance: number;
  mealAllowance: number;
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
  fixedNightAllowance,
  fixedHolidayAllowance,
  mealAllowance,
  totalSalary
}: ContractTemplateProps) {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <Card className="w-full max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none print:border-none">
      <CardContent className="p-[20mm] space-y-8 font-serif text-[10.5pt] leading-[1.8] text-slate-900 tracking-tight">
        
        {/* 헤더 */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-[24pt] font-bold tracking-[0.2em] border-b-[3px] border-black pb-4 inline-block">
            표준 근로계약서
          </h1>
          <p className="text-[11pt] text-slate-600 font-medium">(포괄임금제 적용)</p>
        </div>

        {/* 서문 */}
        <div className="space-y-2 text-justify">
          <p>
            <strong className="text-[11pt]">{companyName}</strong> (이하 "사업주"라 함)와 <strong className="text-[11pt]">{employeeName}</strong> (이하 "직원"이라 함)은 다음과 같이 근로계약을 체결하고 이를 성실히 준수할 것을 서약한다.
          </p>
        </div>

        {/* 제1조 ~ 제4조 */}
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-[12pt] mb-2">제1조 [근로계약기간]</h3>
            <p className="text-justify">
              근로계약기간은 <strong>{startDate}</strong>부터 <strong>{endDate}</strong>까지로 한다.
              (단, 수습기간은 입사일로부터 3개월로 하며, 수습기간 중 업무능력 부족 또는 근무태도 불량 시 본 채용을 거부할 수 있다.)
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[12pt] mb-2">제2조 [근무장소 및 업무내용]</h3>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>근무장소: {companyName} 본사 및 지정된 사업장</li>
              <li>업무내용: {position} 및 관련 제반 업무 ("사업주"의 지시에 따라 변경될 수 있음)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-[12pt] mb-2">제3조 [근로시간 및 휴게시간]</h3>
            <p className="text-justify">
              1. 소정근로시간은 1일 8시간, 주 40시간을 원칙으로 하되, 업무상 필요에 따라 연장, 야간, 휴일근로를 실시할 수 있으며 "직원"은 이에 동의한다.<br/>
              2. 휴게시간은 근로시간 4시간당 30분 이상, 8시간당 1시간 이상을 근무 도중에 부여한다.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[12pt] mb-2">제4조 [임금]</h3>
            <p className="mb-2 text-justify">
              1. 임금은 포괄임금제를 적용하여 다음과 같이 구성하며, 이는 제수당 및 식대 등을 포함한 금액이다.
            </p>
            
            {/* 임금 구성 테이블 (세분화 반영) */}
            <table className="w-full border-collapse border border-slate-800 text-[10pt] mb-4">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border border-slate-400 p-2 w-1/3 font-bold">구분</th>
                  <th className="border border-slate-400 p-2 w-1/3 font-bold">금액 (원)</th>
                  <th className="border border-slate-400 p-2 w-1/3 font-bold">비고</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-400 p-2 text-center">기본급</td>
                  <td className="border border-slate-400 p-2 text-right font-medium">{baseSalary.toLocaleString()}</td>
                  <td className="border border-slate-400 p-2 text-center text-[9pt]">주 40시간분</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 text-center">고정 연장근로수당</td>
                  <td className="border border-slate-400 p-2 text-right font-medium">{fixedOvertimeAllowance.toLocaleString()}</td>
                  <td className="border border-slate-400 p-2 text-center text-[9pt]">연장근로 포함</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 text-center">고정 야간근로수당</td>
                  <td className="border border-slate-400 p-2 text-right font-medium">{fixedNightAllowance.toLocaleString()}</td>
                  <td className="border border-slate-400 p-2 text-center text-[9pt]">야간가산 포함</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 text-center">고정 휴일근로수당</td>
                  <td className="border border-slate-400 p-2 text-right font-medium">{fixedHolidayAllowance.toLocaleString()}</td>
                  <td className="border border-slate-400 p-2 text-center text-[9pt]">휴일근로 포함</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 text-center">식대 (비과세)</td>
                  <td className="border border-slate-400 p-2 text-right font-medium">{mealAllowance.toLocaleString()}</td>
                  <td className="border border-slate-400 p-2 text-center text-[9pt]">월 20만원 한도</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="border border-slate-400 p-2 text-center">월 지급총액</td>
                  <td className="border border-slate-400 p-2 text-right text-black">{totalSalary.toLocaleString()}</td>
                  <td className="border border-slate-400 p-2 text-center text-[9pt]">세전 금액</td>
                </tr>
              </tbody>
            </table>
            
            <p className="text-justify">
              2. 임금 지급일은 매월 <strong>10일</strong>로 하며, 지급일이 휴일인 경우 전일에 지급한다.<br/>
              3. 상기 임금에는 주휴수당 및 연장, 야간, 휴일근로에 대한 포괄산정 수당이 포함되어 있다.
            </p>
          </div>
        </div>

        {/* 페이지 분리 (인쇄 시) */}
        <div className="break-before-page"></div>

        {/* 제5조 ~ 제9조 (2페이지 내용 반영) */}
        <div className="space-y-6 mt-8">
          <div>
            <h3 className="font-bold text-[12pt] mb-2">제5조 [연차유급휴가]</h3>
            <p className="text-justify">
              연차유급휴가는 근로기준법에서 정하는 바에 따르며, 회사의 귀책사유가 없는 한 미사용 연차에 대한 수당은 지급하지 아니할 수 있다. (연차사용촉진제도 시행 시)
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[12pt] mb-2">제6조 [휴일 및 휴가]</h3>
            <p className="text-justify">
              1. 유급휴일은 관공서에 의한 공휴일, 주휴일(매주 일요일), 근로자의 날(5월 1일)로 하며, 주휴일은 소정근로 개근 시에만 유급으로 인정한다. 또한 근무일 및 유급휴일을 제외한 날은 무급휴무일로 하되, "사업주"는 근로시간 운영에 따라 주휴일 및 무급휴무일의 구체적인 요일을 탄력적으로 변경하여 적용할 수 있다.<br/>
              2. 연차휴가는 통상근로자의 근로기준법에 따라 부여하고, 시기는 최소 7일 전에 협의하도록 한다.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[12pt] mb-2">제7조 [퇴직절차 등]</h3>
            <p className="text-justify">
              1. "직원"은 사직하고자 할 경우 사직예정일 30일 전에 "사업주"에게 회사가 정한 소정의 사직서를 반드시 작성하여 제출하고, "사업주"의 승인이 있기 전까지 성실히 근무하여야 한다.<br/>
              2. 퇴직 시 "직원"은 "사업주"의 지시에 따라 후임자에게 성실히 업무 인수인계를 하여야 한다.<br/>
              3. 제1항 및 제2항의 절차를 준수하지 않고 퇴사하여 "사업주"에게 손해가 발생한 경우에는 그 발생한 손해액을 "직원"이 전부 부담한다.<br/>
              4. 퇴직급여는 근로자퇴직급여 보장법에 따라 지급한다.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[12pt] mb-2">제8조 [근로계약 해지]</h3>
            <p className="mb-2 text-justify">"사업주"는 다음 각 호의 경우에는 이 근로계약을 해지할 수 있다.</p>
            <ol className="list-decimal list-inside pl-2 space-y-1 text-[10pt]">
              <li>"직원"의 3일 연속된 무단결근으로 근무 의사가 없다고 판단되는 경우</li>
              <li>"직원"의 잦은 지각, 조퇴, 결근 등 근무태도가 불량하고 그 개전의 정이 없는 경우</li>
              <li>"직원"의 불친절 등으로 "사업주" 고객의 불만이 반복되는 경우</li>
              <li>"직원"이 정당한 업무지시를 거부하거나, "사업주" 소유 금품·물품 사취하거나 횡령한 경우</li>
              <li>"직원"이 직원간 불화를 일으켜 사업장 질서를 문란하게 한 경우</li>
              <li>"직원"이 근무를 계속할 수 없는 업무 외 상병에 걸린 경우</li>
              <li>"직원"의 근무능력이 현저히 저조하다고 판단되는 경우</li>
              <li>"사업주"의 사업운영에 대한 사정이 악화되어 고용조정이 불가피한 경우</li>
              <li>"직원"이 고의 또는 중대한 과실로 인해 "사업주" 사업장의 기물을 훼손한 경우</li>
              <li>"직원"이 사업주의 영업비밀 및 재산적 정보 등을 제3자에게 누설 또는 공개할 경우</li>
              <li>기타 상기에 준하는 사유로 이 계약을 계속적으로 유지할 신뢰관계가 훼손된 경우</li>
            </ol>
          </div>

          <div>
            <h3 className="font-bold text-[12pt] mb-2">제9조 [기 타]</h3>
            <p className="text-justify">
              1. 본 계약서에 명시되지 않은 사항은 노동관계법령에 따른다.<br/>
              2. "직원"은 이 근로계약서 1부를 교부받았음을 확인한다.
            </p>
          </div>
        </div>

        {/* 서명란 */}
        <div className="mt-16 pt-8 border-t border-slate-300">
          <div className="text-center mb-12">
            <p className="text-[14pt] font-bold tracking-wide">상기 계약사항으로 근로계약을 체결하며, 상호 확인한다.</p>
            <p className="mt-6 text-[12pt]">{formattedDate}</p>
          </div>

          <div className="flex justify-between items-start px-8">
            <div className="space-y-3 w-1/2">
              <p className="font-bold text-[12pt] mb-4 border-b border-slate-400 pb-2 inline-block">[사업주]</p>
              <p>상 호 : {companyName}</p>
              <p>대 표 자 : {representative} (인)</p>
            </div>
            <div className="space-y-3 w-1/2">
              <p className="font-bold text-[12pt] mb-4 border-b border-slate-400 pb-2 inline-block">[직 원]</p>
              <p>성 명 : {employeeName} (인)</p>
              <p>생년월일 : _________________</p>
              <p>연 락 처 : _________________</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
