import React, { useEffect, useRef, useState } from 'react';
import { Box, Modal, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';
import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType } from '@zxing/library';



const QRScannerComponent = ({ onQrSuccess, onClose }) => {
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [text, setText] = useState('')

  const req = useRef<any>();
  const Camera = useRef<HTMLVideoElement>(null);

  const hints = new Map();
  const formats = [BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX, BarcodeFormat.CODE_128, BarcodeFormat.CODABAR, BarcodeFormat.EAN_13, BarcodeFormat.EAN_8, BarcodeFormat.CODE_39, BarcodeFormat.CODE_93];
  const Scan = new BrowserMultiFormatReader(hints, 500);

  hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

  const Scanning = async () => {
    // const t = await Scan.decodeOnce();
    console.log('scan');
    if (localStream && Camera.current) {
      try {
        const data = await Scan.decodeFromStream(localStream, Camera.current, (data, err) => {
          if (data) {
            onQrSuccess(data.getText());
            Scan.stopContinuousDecode();
          } else {
            setText("");
          }
        });
      } catch (error) {
        console.log(error);
      }
    }

  }
  const Stop = () => {
    if (localStream) {
      const vidTrack = localStream.getVideoTracks();
      vidTrack.forEach(track => {
        localStream.removeTrack(track);
      });
    }
  }


  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      //video: { facingMode: "user" }, //전면
      video: { facingMode: { exact: "environment" } }, //후면
    })
      .then(stream => {
        console.log(stream);
        setLocalStream(stream);
      })
    return () => {
      Stop();
    }
  }, []);


  useEffect(() => {
    if (!Camera.current)
      return;
    if (localStream && Camera.current) {
      Scanning();
    }
    return () => {
      Stop();
    }
  }, [localStream]);

  return (
    <Modal isOpen={true} onClose={onClose} isCentered>
      <ModalOverlay
        bg="blackAlpha.600" // 모달 뒤에 블러 처리
        backdropFilter="blur(10px)" // 블러 효과 추가
      />
      <ModalContent
        bg="transparent" // 배경을 투명하게 설정
        boxShadow="none"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          position="relative"
          border="5px solid white" // QR 스캐너 경계선
          borderRadius="10px"
          overflow="hidden" // 경계선 안쪽만 표시되게 설정
        >
          <video
            ref={Camera}
            id="video"
            width={'300px'}
            height={'300px'}
          />
        </Box>
      </ModalContent>
    </Modal>
  );
}

export default QRScannerComponent
