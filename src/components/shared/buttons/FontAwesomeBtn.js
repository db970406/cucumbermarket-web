/* 
작성자 : SJ
작성일 : 2022.01.11
수정일 : 2022.01.14
*/

/*
1. FontAwesome과 버튼을 결합하여 자주 쓰므로 Component화 하였다.
2. disabled를 prop으로 받아 유저 사용성 고려한 styled-component 구성
*/

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'
import propTypes from "prop-types"

const BtnContainer = styled.div`
`
const Btn = styled.button`
    padding-left:0;
    opacity:${props => props.disabled ? 0.4 : 1};
`

export default function FontAwesomeBtn({ onClick, icon, size, color, marginRight, disabled }) {
    return (
        <BtnContainer
            style={{
                marginRight,
                marginBottom: 3
            }}
        >
            <Btn onClick={onClick} disabled={disabled}>
                <FontAwesomeIcon
                    icon={icon}
                    size={size}
                    color={color}
                />
            </Btn>
        </BtnContainer>
    )
}

FontAwesomeBtn.propTypes = {
    onClick: propTypes.func,
    size: propTypes.string,
    color: propTypes.string
}