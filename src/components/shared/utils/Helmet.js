/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.10
*/

// 홈페이지 타이틀의 변화를 도와줄 Helmet

import { Helmet as PageTitle } from 'react-helmet-async';
import PropTypes from "prop-types";

export default function Helmet({ title }) {
    return (
        <PageTitle>
            {title === undefined || null || "" ?
                null : (
                    <title>{title} | 오이마켓</title>
                )
            }
        </PageTitle>
    )
};

Helmet.propTypes = {
    title: PropTypes.string.isRequired
};