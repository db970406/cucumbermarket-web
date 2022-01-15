/* 
작성자 : SJ
작성일 : 2022.01.10
수정일 : ------
*/

/*
1. ItemDetail, ItemEdit에서 사용되는 사진 Component
2. ItemDetail에서는 기본적으로 띄워준다.
3. ItemEdit에서는 editMode를 prop으로 받아 deleteItemPhoto가 가능하게 하였다(cache 수정으로 즉각 반영). 
*/

import { gql, useMutation } from '@apollo/client'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'
import { SEE_ITEM } from '../../../screens/main/ItemDetail'
import { colors } from '../../../utils/styles'
import propTypes from "prop-types"

const DeleteContainer = styled.div`
    position:relative;
`
const DeleteBtn = styled.span`
    position:absolute;
    top:20px;
    right:20px;
    cursor:pointer;
`
const Img = styled.img`
    height:100%;
    margin:auto auto;
    border-radius:10px;
    display:flex;
    justify-content:center;
`

const DELETE_ITEM_PHOTO = gql`
    mutation deleteItemPhoto($id:Int!){
        deleteItemPhoto(id:$id){
            ok
            error
        }
    }
`


export default function ItemPhoto({ editMode, itemId, id, src, alt, maxHeight, maxWidth }) {

    // 사진을 지우기 위한 Mutation과 cache 처리
    const updateDeleteItemPhoto = (cache, { data }) => {
        const { deleteItemPhoto: { ok, error } } = data
        if (!ok) {
            alert(error);
            return;
        }
        const result = cache.readFragment({
            id: `Item:${itemId}`,
            fragment: gql`
                fragment itemPhotoCount on Item{
                    itemPhotoCount
                }
            `
        })
        const { itemPhotoCount } = result
        if (itemPhotoCount === 1) {
            alert("사진은 반드시 한 장은 필요합니다")
            return;
        } else {
            cache.evict({
                id: `ItemPhoto:${id}`
            })
        }
    }
    const [deleteItemPhoto] = useMutation(DELETE_ITEM_PHOTO, {
        variables: {
            id
        },
        update: updateDeleteItemPhoto,
        refetchQueries: [
            {
                query: SEE_ITEM,
                variables: {
                    id: parseInt(itemId)
                }
            }
        ]
    })
    return (
        editMode ? (
            <DeleteContainer>
                <DeleteBtn onClick={deleteItemPhoto}>
                    <FontAwesomeIcon icon={faTrashAlt} color={colors.red} size="2x" />
                </DeleteBtn>
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