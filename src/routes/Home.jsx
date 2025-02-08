import { Box, Button, Center, Text, useToast } from "@chakra-ui/react";
import { Wrapper } from "../style/styles";
import { useNavigate } from "react-router-dom";
import { insertStemp } from "../hooks/stempHook";
import { useEffect, useState } from "react";
import { bibleDate } from "../data/bibleSchedule.ts";
import { getToday } from "../util/DateUtil";
import QRScannerComponent from "../components/home/QRScannerComponent";

export default function () {
    const [verses, setVerses] = useState([]);
    const [isScanning, setIsScanning] = useState(false); // QR 스캔 활성화 상태
    const [isFriday, setIsFriday] = useState(false); // 금요일 여부 상태 추가
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        // 오늘이 금요일인지 확인
        const today = new Date();
        setIsFriday(today.getDay() === 5); // 금요일은 getDay()가 5
    }, []);

    const onClick = (e) => {

       if (e.target.name === "no") {
            navigate("/notyet");

            return;
        }

        // if (!isFriday) {
        //     // 금요일이 아니면 버튼 비활성화
        //     toast({
        //         title: "출석 불가",
        //         description: "출석은 금요일에만 가능합니다!",
        //         status: "error",
        //         isClosable: true,
        //     });
        //     return;
        // }

        if (e.target.name === "yes") {
            setIsScanning(true); // QR 스캔 시작
        }
    };

    const validateQRCode = async (qrCode) => {
        const correctPassword = process.env.REACT_APP_QR_PASSWORD; // .env에서 비밀번호 가져오기
        return qrCode === correctPassword; // 스캔된 값과 비교
    };

    // QR 코드 검증 및 출석 처리 로직
    const handleQrSuccess = async (qrCode) => {
        setIsScanning(false); // QR 스캔 종료

        const isValid = await validateQRCode(qrCode); // QR 코드 검증 로직 호출

        if (!isValid) {
            toast({
                title: "QR 인증 실패",
                description: "유효하지 않은 QR 코드입니다.",
                status: "error",
                isClosable: true,
            });
        }

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
                      바이블 스터디 정시에 도착 하셨나요?
                  </Text>

                  <Button
                    w={"100%"}
                    margin={"10px 0 10px 0"}
                    onClick={onClick}
                    name={"yes"}
                    //isDisabled={!isFriday} // 금요일이 아니면 버튼 비활성화
                  >
                      출석할께요! 😊
                  </Button>

                  <Button
                    w={"100%"}
                    margin={"0 0 10px 0"}
                    name={"no"}
                    onClick={onClick}
                  >
                      현황 볼래요! 😢
                  </Button>

                  {!isFriday && (
                    <Text color="red" mt="10px">
                        출석은 금요일에만 가능합니다.
                    </Text>
                  )}

                  {isScanning && (
                    <QRScannerComponent
                      onQrSuccess={handleQrSuccess}
                      onClose={() => setIsScanning(false)}
                    />
                  )}
              </Wrapper>
          </Center>
      </>
    );
}
