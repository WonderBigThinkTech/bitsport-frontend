import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

const qrCode = new QRCodeStyling({
  width: 250,
  height: 250,
  type: "svg",
  data: "https://bitsport.gg/",
  dotsOptions: {
    color: "#000000",
    type: "rounded",
  },
  cornersSquareOptions: {
    color: "#000000",
  },
  backgroundOptions: {
    color: "#fff",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 8,
  },
});

const QRCode = ({ qrValue }: { qrValue: string }) => {
  const componentRef: any = useRef();
  const ref: any = useRef(null);

  useEffect(() => {
    qrCode.append(ref.current);
  }, []);

  useEffect(() => {
    qrCode.update({
      data: qrValue,
    });
  }, [qrValue]);

  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <div className="bg-white p-8" ref={componentRef}>
        <div ref={ref} />
      </div>
    </div>
  );
};

export default QRCode;
