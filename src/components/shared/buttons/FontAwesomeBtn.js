/* 
작성자 : SJ
작성일 : 2022.01.11
수정일 : ------
*/

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'
import propTypes from "prop-types"

const BtnContainer = styled.div`
`
const Btn = styled.button`
    padding-left:0;
`


export default function FontAwesomeBtn({ onClick, icon, size, color, marginRight }) {
    return (
        <BtnContainer
            style={{
                marginRight,
                marginBottom: 3
            }}
        >
            <Btn onClick={onClick}>
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
    onClick: propTypes.func.isRequired,
    size: propTypes.string,
    color: propTypes.string
}