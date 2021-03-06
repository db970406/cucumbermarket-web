/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.08
*/

// CSS의 큰 틀을 담당하는 파일

import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

// 사용할 컬러들을 퍼스널화 한다.
export const colors = {
    green: "#04CF5C",
    white: "#FFFFFF",
    black: "#292A2D",
    red: "#b92b27",
    blue: "#0095f6",
    orange: "#FF8A3D",
    opacityDarkgray: "rgba(0,0,0,0.5)",
    opacityLightgray: "rgba(230,230,230,0.5)",
    darkgray: "rgb(30,30,30)",
    lightgray: "rgb(240,240,240)",
    pink: "tomato",
};

// Theme으로 부여할 prop
export const darkTheme = {
    bgColor: colors.black,
    color: colors.white,
    accent: colors.green,
    themeGray: colors.opacityLightgray,
    header: colors.darkgray,
};

export const lightTheme = {
    bgColor: colors.white,
    color: colors.black,
    accent: colors.green,
    themeGray: colors.opacityDarkgray,
    header: colors.lightgray,
};

// 전역 Styles 적용
export const GlobalStyles = createGlobalStyle`
    ${reset};
    *{
        box-sizing:border-box;
    }
    body{
        min-width:450px;
        background-color:${props => props.theme.bgColor};
        color:${props => props.theme.color};
        font-family: 'Open Sans', sans-serif;
        font-family: 'Roboto', sans-serif;
        font-size:12px;
    }
    a{
        text-decoration:none;
        color:${props => props.theme.color};
    }
    button{
        color:white;
        border:none;
        cursor:pointer;
        background:none;
    }
    input{
        background-color:${props => props.theme.bgColor};
        border:${props => props.theme.themeGray} 1.5px solid;
        color:${props => props.theme.color};
    }
`;