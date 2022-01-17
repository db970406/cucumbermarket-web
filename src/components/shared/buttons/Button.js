/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.13
*/

/*
1. 가장 기본적인 Button Component
2. disabled를 prop으로 받으며 hover로 유저 사용성 고려한 styled-components 구성
3. form과 같이 자주 쓰이므로 longtype을 prop으로 받아 width를 다르게 지정한다.
*/

import propTypes from "prop-types"
import styled from "styled-components"
import { colors } from '../../../utils/styles'

const SButton = styled.button`
    background-color:${props => props.logout ? colors.red : colors.green} ;
    padding:10px 15px;;
    border-radius:7px;
    opacity:${props => props.disabled ? 0.3 : 0.8};
    margin:5px 0;
    &:hover{
        ${props => props.disabled ? 0.3 : 1};
    }
`
const ButtonText = styled.span`
    text-align:center;
`

export default function Button({ loading, text, disabled, onClick, longtype, logout }) {
    return (
        <SButton
            logout={logout}
            disabled={disabled}
            onClick={onClick}
            style={{
                ...(longtype && {
                    marginInline: "auto",
                    marginTop: 15,
                    width: "100%"
                })
            }}
        >
            <ButtonText>
                {loading ? "처리중입니다..." : text}
            </ButtonText>
        </SButton>
    )
}

Button.propTypes = {
    text: propTypes.string.isRequired,
    loading: propTypes.bool,
    disabled: propTypes.bool,
    onClick: propTypes.func,
    width: propTypes.string,
}