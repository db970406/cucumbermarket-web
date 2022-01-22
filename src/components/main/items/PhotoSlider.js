/* 
작성자 : SJ
작성일 : 2022.01.10
수정일 : ------
*/

/*
1. 사진이 여러 장일 때 slider로 보여주는 Component
2. react-slick을 사용하였고 css 커스터마이징을 위해 styled-components에 작성.
*/

import Slider from 'react-slick';
import styled from 'styled-components';
import { colors } from '../../../utils/styles';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Slider Setting
const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    dots: true,
};

const PhotoCase = styled.div`
    width:100%;
    background-color:${({ theme }) => theme.bgColor} ;
    position:relative;
    .slick-dots li button:before{
        opacity: .25;
        color: ${colors.green};
    }
    .slick-dots li.slick-active button:before{
        opacity: .75;
        color: ${colors.green};
    }
`;

export default function PhotoSlider({ children }) {
    return (
        <PhotoCase>
            <Slider {...settings}>
                {children}
            </Slider>
        </PhotoCase>
    )
};