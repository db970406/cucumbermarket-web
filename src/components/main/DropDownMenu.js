/* 
작성자 : SJ
작성일 : 2022.01.10
수정일 : ------
*/
// 메뉴에 마우스 커서를 올리면 관련 Link를 보여주는 드랍다운 메뉴

import { useReactiveVar } from '@apollo/client';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { darkModeVar } from '../../utils/apollo';
import { colors } from '../../utils/styles';
import propTypes from "prop-types"

const DropDown = styled.div`
    padding: 4px;
    border: none;
    cursor: pointer;
    position: relative;
    &:hover{
        div{
            display: block;
        }
    }
`

const DropDownContent = styled.div`
    display: none;
    position: absolute;
    border-radius:7px;
    background-color: #f9f9f9;
    min-width: 80px;
    font-size:12px;
    text-align:center;
    z-index: 1;
    transition:all 0.5s ease-in-out;
    a{
        color: black;
        padding: 12px;
        text-decoration: none;
        display: block;
    }
    a:hover{
        background-color:  ${colors.lightgray};
        border-radius:7px;
    }
`


export default function DropDownMenu({ link1, link2, text1, text2 }) {
    const darkMode = useReactiveVar(darkModeVar)
    return (
        <DropDown>
            <FontAwesomeIcon icon={faEllipsisH} color={darkMode ? colors.white : colors.black} size="2x" />
            <DropDownContent>
                {link1 ? (
                    <Link to={link1}>
                        {text1}
                    </Link>
                ) : null}
                {link2 ? (
                    <Link to={link2}>
                        {text2}
                    </Link>
                ) : null}
            </DropDownContent>
        </DropDown>
    )
}

DropDownMenu.propTypes = {
    link1: propTypes.string.isRequired,
    link2: propTypes.string,
    text1: propTypes.string.isRequired,
    text2: propTypes.string,
}