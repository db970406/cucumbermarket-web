/* 
작성자 : SJ
작성일 : 2022.01.10
수정일 : 2022.01.16
*/

/*
1. SeeItem, EditItem에서 사용되는 사진 Component
2. SeeItem에서는 기본적으로 사진을 띄워주는 용도
3. EditItem에서 editMode를 prop으로 받아 deleteItemPhoto가 가능하게 하였다(cache 수정으로 즉각 반영). 
*/

import styled from 'styled-components';
import propTypes from "prop-types";
import DeleteItemPhoto from './DeleteItemPhoto';

const DeleteContainer = styled.div`
    position:relative;
`;

const Img = styled.img`
    height:100%;
    margin:auto auto;
    border-radius:10px;
    display:flex;
    justify-content:center;
`;

export default function ItemPhoto({ editMode, itemId, id, src, alt, maxHeight, maxWidth }) {
    return (
        editMode ? (
            <DeleteContainer>
                <DeleteItemPhoto itemId={itemId} id={id} />
                <Img
                    style={{
                        width: "100%",
                        maxHeight: maxHeight,
                        maxWidth: maxWidth,
                    }}
                    src={src}
                    alt={alt}
                />
            </DeleteContainer>
        ) : (
            <Img
                style={{
                    width: "100%",
                    maxHeight: maxHeight,
                    maxWidth: maxWidth,
                }}
                src={src}
                alt={alt}
            />
        )
    )
}

ItemPhoto.propTypes = {
    editMode: propTypes.bool,
    itemId: propTypes.string,
    id: propTypes.number,
    src: propTypes.string,
    maxHeight: propTypes.number,
    maxWidth: propTypes.number
}