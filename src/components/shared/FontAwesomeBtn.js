/* 
작성자 : SJ
작성일 : 2022.01.11
수정일 : ------
*/

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'

const BtnContainer = styled.div`
    margin-bottom:3px;
`
const Btn = styled.button`
    padding-left:0;
`


export default function FontAwesomeBtn({ onClick, checkState, icon, size, color }) {
    return (
        <BtnContainer>
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