/* 
작성자 : SJ
작성일 : 2022.01.16
수정일 : ------
*/

import { gql, useMutation } from '@apollo/client'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'
import { SEE_ITEM } from '../../../screens/main/items/SeeItem'
import { colors } from '../../../utils/styles'

const DeleteBtn = styled.span`
    position:absolute;
    top:20px;
    right:20px;
    cursor:pointer;
`

const DELETE_ITEM_PHOTO = gql`
    mutation deleteItemPhoto($id:Int!){
        deleteItemPhoto(id:$id){
            ok
            error
        }
    }
`

export default function DeleteItemPhoto({ itemId, id }) {

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
        <DeleteBtn onClick={deleteItemPhoto}>
            <FontAwesomeIcon icon={faTrashAlt} color={colors.red} size="2x" />
        </DeleteBtn>
    )
}