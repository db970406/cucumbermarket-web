/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : ------
*/

import propTypes from "prop-types"
import styled from "styled-components"
import { colors } from '../../utils/styles'

const SButton = styled.button`
    background-color:${props => props.logout ? colors.pink : colors.green} ;
    padding:10px 15px;;
    border-radius:7px;
    opacity:${props => props.disabled ? 0.3 : 1};
    margin:5px 0;
`
const ButtonText = styled.span`
    text-align:center;
`

export default function Button({ loading, text, disabled, onClick, auth, logout }) {
    return (
        <SButton
            logout={logout}
            disabled={disabled}
            onClick={onClick}
            style={{
                ...(auth && {
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