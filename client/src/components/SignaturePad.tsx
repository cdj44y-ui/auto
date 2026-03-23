import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Eraser, Check } from "lucide-react";

interface SignaturePadProps {
  onSave: (signatureData: string) => void;
}

export default function SignaturePad({ onSave }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const clear = () => {
    sigCanvas.current?.clear();
    setIsEmpty(true);
  };

  const save = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
      onSave(dataUrl);
    }
  };

  const handleEnd = () => {
    if (sigCanvas.current) {
      setIsEmpty(sigCanvas.current.isEmpty());
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <div className="border-2 border-dashed border-stone-300 rounded-lg bg-white overflow-hidden relative">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            className: "w-full h-48 cursor-crosshair",
          }}
          onEnd={handleEnd}
        />
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-stone-400">
            여기에 서명하세요
          </div>
        )}
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={clear} size="sm">
          <Eraser className="w-4 h-4 mr-2" /> 지우기
        </Button>
        <Button onClick={save} disabled={isEmpty} size="sm" className="bg-primary hover:bg-orange-800">
          <Check className="w-4 h-4 mr-2" /> 서명 완료
        </Button>
      </div>
    </div>
  );
}
