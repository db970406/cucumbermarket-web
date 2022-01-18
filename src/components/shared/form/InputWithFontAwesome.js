/* 
작성자 : SJ
작성일 : 2022.01.14
수정일 : 2022.01.18`
*/

/*
1. Input Component와 FontAwesomeBtn Component의 결합
2. Input 내에 Icon이 있는 것 같은 시각적 효과를 주기 위한 Component
*/

import styled from 'styled-components'
import FontAwesomeBtn from '../buttons/FontAwesomeBtn'
import propTypes from "prop-types"

const InputContainer = styled.div`
    // FontAwesomeBtn을 Input안에 있는 것 처럼 두게 하고 Input의 길이 조절을 위함
    display:flex;
    align-items:center;
    position:relative;
    width:95%;
    margin:0 auto;
`
const BtnContainer = styled.div`
    // FontAwesomeBtn을 Input안에 있는 것 처럼 두게 하기 위함
    position:absolute;
    right:10px;
`

const InputWithFontAwesome = ({ children, onClick, icon, color, size, disabled }) => {
    return (
        <InputContainer>
            {children}
            <BtnContainer onClick={onClick}>
                <FontAwesomeBtn
                    icon={icon}
                    color={color}
                    size={size}
                    disabled={disabled}
                />
            </BtnContainer>
        </InputContainer>
    )
}

InputWithFontAwesome.propTypes = {
    onClick: propTypes.func,
    icon: propTypes.object,
    color: propTypes.string,
    size: propTypes.string,
    disabled: propTypes.bool,
}

export default InputWithFontAwesome