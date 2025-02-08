import {Box, Center, HStack, Image, Text, VStack} from "@chakra-ui/react";
import Calendar from "../components/MyState/Calendar";
import MyPageButton from "../components/MyState/MyPageButton";
import SteampButton from "../components/MyState/SteampButton";
import StateButton from "../components/MyState/StateButton";
import EventButton from "../components/MyState/EventButton";
import {useEffect, useState} from "react";
import {
    REACT_APP_STEAMP_IMG_1,
    REACT_APP_STEAMP_IMG_10, REACT_APP_STEAMP_IMG_2,
    REACT_APP_STEAMP_IMG_3,
    REACT_APP_STEAMP_IMG_4,
    REACT_APP_STEAMP_IMG_5,
    REACT_APP_STEAMP_IMG_6,
    REACT_APP_STEAMP_IMG_7,
    REACT_APP_STEAMP_IMG_8,
    REACT_APP_STEAMP_IMG_9
} from "../components/common/path";

export default function MyState () {

    const userName = localStorage.getItem("user_name");
    const startYMD = "2025-02-07";
    // 오늘 날짜와 startYMD 를 비교해서 D + 몇일인지 계산하는 로직이 필요함
    const today = new Date();
    const start = new Date(startYMD);
    const diffDay = Math.ceil((today.getTime() - start.getTime()) / (1000 * 3600 * 24));
    const [excellentCount, setExcellentCount] = useState(0);
    const [goodCount, setGoodCount] = useState(0);
    const [m_excellentCount, setM_excellentCount] = useState(0);
    const [m_goodCount, setM_goodCount] = useState(0);
    const [steampImg, setSteampImg] = useState("");

    const steampProps = (excellentNum, goodNum, m_excellentNum, m_goodNum) => {
        setExcellentCount(excellentNum);
        setGoodCount(goodNum);
        setM_excellentCount(m_excellentNum);
        setM_goodCount(m_goodNum);

    }

    useEffect(() => {

        carculationSteamp(excellentCount, goodCount);

    }, [m_excellentCount, m_goodCount]);

    const carculationSteamp = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();

        // 이번 달의 첫 번째 날과 마지막 날
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0); // 다음 달의 0번째 날은 이번 달의 마지막 날

        let fridaysCount = 0;

        // 이번 달의 모든 날 중 금요일의 수를 계산
        for (let date = firstDay; date <= lastDay; date.setDate(date.getDate() + 1)) {
            if (date.getDay() === 5) { // 금요일은 getDay() 값이 5
                fridaysCount++;
            }
        }

        // 최대 점수는 금요일의 개수와 동일
        const maxScore = fridaysCount * 5; // 엑설런트 점수는 5점
        const myScore = excellentCount * 5; // 실제 출석한 금요일 점수
        const percent = Math.ceil((myScore / maxScore) * 100); // 점수 백분율 계산

        // 퍼센트에 따라 이미지 설정
        if (percent >= 90) {
            setSteampImg(REACT_APP_STEAMP_IMG_10);
        } else if (percent >= 80) {
            setSteampImg(REACT_APP_STEAMP_IMG_9);
        } else if (percent >= 70) {
            setSteampImg(REACT_APP_STEAMP_IMG_8);
        } else if (percent >= 60) {
            setSteampImg(REACT_APP_STEAMP_IMG_7);
        } else if (percent >= 50) {
            setSteampImg(REACT_APP_STEAMP_IMG_6);
        } else if (percent >= 40) {
            setSteampImg(REACT_APP_STEAMP_IMG_5);
        } else if (percent >= 30) {
            setSteampImg(REACT_APP_STEAMP_IMG_4);
        } else if (percent >= 20) {
            setSteampImg(REACT_APP_STEAMP_IMG_3);
        } else if (percent >= 10) {
            setSteampImg(REACT_APP_STEAMP_IMG_2);
        } else {
            setSteampImg(REACT_APP_STEAMP_IMG_1);
        }
    };


    return(
        <>
            <VStack
                margin={'30px 0 0 0'}
            >
                <Box>
                    <Text
                        fontSize={'xl'}
                        fontWeght={'bold'}
                    >
                        {userName}님의 퀘스트 진행판
                    </Text>
                </Box>
                <Center
                    bg={'#F2F2F2'}
                    w={'100%'}
                    p={'10px 0 10px 0'}
                >
                    <Calendar propFunction={steampProps}/>
                </Center>
                <center
                >
                    <Text
                        fontSize={'l'}
                        fontWeght={'bold'}
                        m={'5px 0 0 0'}
                    >
                        현재 퀘스트를 진행한지 <span style={{background:"#eee"}}>D+{diffDay}</span>일 되었어요!
                    </Text>
                    <Text
                        fontSize={'l'}
                        fontWeght={'bold'}
                        m={'5px 0 0 0'}
                    >
                        총 <span style={{color:"green"}}>{excellentCount}</span> 개의  <span style={{background:"#E5F4D4"}}>"출석 도장을"</span> 획득했습니다.
                    </Text>

                </center>
                <HStack
                    m={'10px 0'}
                    w={'100%'}
                    h={'40px'}
                >
                    <Text
                        fontSize={'l'}
                        fontWeght={'bold'}
                        color={'black'}
                        m={'12px 0 0 50px'}
                    >
                        이번달 캘린더 날씨 :
                    </Text>

                    <Image
                        src={steampImg}
                        w={'50px'}
                        h={'50px'}
                        m={'0 0 0 20px'}
                    ></Image>

                </HStack>
                <HStack
                    display={'flex'}
                    justifyContent={'space-between'}
                    m={'5px 0 0 0'}
                    w={'80%'}
                >
                    <MyPageButton/>
                    <SteampButton/>
                    <StateButton/>

                </HStack>

                <HStack
                    display={'flex'}
                    justifyContent={'space-between'}
                    m={'5px 0 0 0'}
                    w={'80%'}
                >

                    <Text fontSize={'small'}>로그아웃</Text>
                    <Text fontSize={'small'}>출석하기</Text>
                    <Text fontSize={'small'}>통계 페이지</Text>

                </HStack>

            </VStack>
        </>
    )

}
