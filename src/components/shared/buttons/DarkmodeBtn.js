/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.14
*/

/* 
1. MainLayout의 DarkmodeBtn
2. position:fixed로 위치 고정
3. darkModeVar이라는 Reactive Variable 활용과 GlobalStyles로 다크모드를 구현하였다.
*/

import { useReactiveVar } from '@apollo/client'
import styled from 'styled-components'
import { darkModeVar, getDarkMode, getLightMode } from '../../../utils/apollo'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMoon, faSun } from '@fortawesome/free-regular-svg-icons';
import { colors } from '../../../utils/styles'

const Button = styled.button`
    position:fixed;
    bottom:20px;
    left:20px;
    width:50px;
    height:50px;
    border-radius:25px;
    background-color:${props => props.darkMode ? colors.white : colors.black};
`

// 다크모드 버튼을 Component화해서 Layout에 부여.
export default function Darkmode() {
    const darkMode = useReactiveVar(darkModeVar)
    return (
        <Button darkMode={darkMode} onClick={() => darkMode ? getLightMode() : getDarkMode()}>
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} size="lg" color={darkMode ? colors.black : colors.white} />
        </Button>
    )
}