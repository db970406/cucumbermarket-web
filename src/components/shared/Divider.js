/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : ------
*/

import styled from 'styled-components'

const SDivider = styled.div`
    padding:0 20px;
    text-transform:uppercase;
    display:flex;
    justify-content:center;
    width:100%;
    align-items:center;
    span{
        margin: 0 10px;
        font-weight:600;
        font-size:10px;
    };
    div {
        width: 100%;
        height: 1px;
        background-color: ${props => props.theme.themeGray};
    }
`


const Divider = () => {
    return (
        <SDivider>
            <div></div>
            <span>or</span>
            <div></div>
        </SDivider>
    )
}

export default Divider