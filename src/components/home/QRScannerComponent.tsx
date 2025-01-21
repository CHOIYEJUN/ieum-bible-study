import React from "react";
import QrScanner from "react-qr-scanner";

const QRScannerComponent = ({ onQrSuccess }) => {
  const handleScan = (data) => {
    if (data) {
      onQrSuccess(data); // QR 스캔 성공 시 부모 컴포넌트로 데이터 전달
    }
  };

  const handleError = (err) => {
    console.error("QR 스캔 에러:", err);
  };

  return (
    <div>
      <QrScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "100%" }}
      />
    </div>
  );
}

export default QRScannerComponent
