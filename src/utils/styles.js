/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : ------
*/
// CSS의 큰 틀을 담당하는 파일

import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'

// 사용할 컬러들을 퍼스널화 한다.
export const colors = {
    green: "#04CF5C",
    white: "#FFFFFF",
    black: "#292A2D",
    red: "#b92b27",
    blue: "#0095f6",
    orange: "#FF8A3D",
    darkgray: "rgba(0,0,0,0.4)",
    lightgray: "rgba(255,255,255,0.5)"
}

// Theme으로 부여할 prop
export const darkTheme = {
    bgColor: colors.black,
    color: colors.white,
    accent: colors.green,
    themeGray: colors.lightgray,
}
export const lightTheme = {
    bgColor: colors.white,
    color: colors.black,
    accent: colors.green,
    themeGray: colors.darkgray
}

// 전역 Styles 적용
export const GlobalStyles = createGlobalStyle`
    ${reset}
    *{
        box-sizing:border-box;
    }
    body{
        background-color:${props => props.theme.bgColor};
        color:${props => props.theme.color};
        font-family: 'Open Sans', sans-serif;
        font-family: 'Roboto', sans-serif;
        font-size:14px;
    }
    a{
        text-decoration:none;
        color:${props => props.theme.color};
    }
    button{
        color:white;
        border:none;
        cursor:pointer;
    }
    input{
        background-color:${props => props.theme.bgColor};
        border:${props => props.theme.themeGray} 1.5px solid;
        color:${props => props.theme.color};
    }
`