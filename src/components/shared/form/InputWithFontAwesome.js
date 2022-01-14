/* 
작성자 : SJ
작성일 : 2022.01.14
수정일 : ------
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
const SearchBtn = styled.div`
    // FontAwesomeBtn을 Input안에 있는 것 처럼 두게 하기 위함
    position:absolute;
    right:10px;
`

const InputWithFontAwesome = ({ children, onClick, icon, color, size, disabled }) => {
    return (
        <InputContainer>
            {children}
            <SearchBtn onClick={onClick}>
                <FontAwesomeBtn
                    icon={icon}
                    color={color}
                    size={size}
                    disabled={disabled}
                />
            </SearchBtn>
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