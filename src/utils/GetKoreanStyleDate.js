/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.19
*/

// 한국식 날짜 구해주는 Component

import styled from 'styled-components'


const DateText = styled.p`
    color:${({ theme }) => theme.themeGray};
    display:flex;
    justify-content:flex-end;
`
export default function GetKoreanStyleDate({ milliSecond, size }) {
    const date = new Date(parseInt(milliSecond))
    const getYear = date.getFullYear()
    const getMonth = date.getMonth() + 1
    const getDay = date.getDate()

    return (
        <DateText
            style={{
                fontSize: size,
                paddingBlock: 10,
                fontWeight: 500,
            }}
        >
            {`${getYear}년 ${getMonth}월 ${getDay}일`}
        </DateText>
    )
}
