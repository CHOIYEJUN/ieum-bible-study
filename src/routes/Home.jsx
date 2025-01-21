import { Box, Button, Center, Text, useToast } from "@chakra-ui/react";
import { Wrapper } from "../style/styles";
import { useNavigate } from "react-router-dom";
import { insertStemp } from "../hooks/stempHook";
import { useEffect, useState } from "react";
import { bibleDate } from "../data/bibleSchedule.ts";
import { getToday } from "../util/DateUtil";
import QRScannerComponent from '../components/home/QRScannerComponent';


export default function () {
    const [verses, setVerses] = useState([]);
    const [isScanning, setIsScanning] = useState(false); // QR 스캔 활성화 상태
    const navigate = useNavigate();
    const toast = useToast();

    const onClick = (e) => {
        if (e.target.name === "yes") {
            setIsScanning(true); // QR 스캔 시작
        } else if (e.target.name === "no") {
            navigate("/notyet");
        }
    };

    const validateQRCode = async (qrCode) => {
        const correctPassword = process.env.REACT_APP_QR_PASSWORD; // .env에서 비밀번호 가져오기
        return qrCode?.text === correctPassword; // 스캔된 값과 비교
    };

    // QR 코드 검증 및 출석 처리 로직
    const handleQrSuccess = async (qrCode) => {
        setIsScanning(false); // QR 스캔 종료

        const isValid = await validateQRCode(qrCode); // QR 코드 검증 로직 호출

        if (isValid) {
            const insertStempState = await insertStemp(); // 출석 처리
            if (insertStempState === "success") {
                navigate("/todayDoen");
            } else if (insertStempState === "fail") {
                toast({
                    title: "오류",
                    description: "관리자에게 문의바랍니다.",
                    status: "error",
                    isClosable: true,
                });
            } else if (insertStempState === "already") {
                toast({
                    title: "오류",
                    description: "이미 스탬프를 받았습니다",
                    status: "error",
                    isClosable: true,
                });
                navigate("/myState");
            }
        } else {
            // QR 코드가 유효하지 않은 경우
            toast({
                title: "QR 인증 실패",
                description: "유효하지 않은 QR 코드입니다.",
                status: "error",
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        setVerses(bibleDate[getToday()] || []);
    }, []);

    return (
      <>
          <Center>
              <Wrapper>
                  <Text fontSize={"2xl"} fontWeight={"bold"}>
                      안녕하세요
                  </Text>
                  <Text fontSize={"l"} name={"no"}>
                      오늘의 퀘스트 완료하셨나요?
                  </Text>

                  <Button
                    w={"100%"}
                    margin={"10px 0 10px 0"}
                    onClick={onClick}
                    name={"yes"}
                  >
                      네 완료했어요! 😊
                  </Button>
                  <Button
                    w={"100%"}
                    margin={"0 0 10px 0"}
                    name={"no"}
                    onClick={onClick}
                  >
                      아니요 아직이요! 😢
                  </Button>

                  {isScanning && (
                    <QRScannerComponent onQrSuccess={handleQrSuccess} />
                  )}
              </Wrapper>
          </Center>
      </>
    );
}

// QR 코드 검증 로직

