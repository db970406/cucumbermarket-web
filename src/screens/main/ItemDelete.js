/* 
작성자 : SJ
작성일 : 2022.01.10
수정일 : ------
*/
// Item

import { gql, useMutation } from '@apollo/client'
import { useEffect } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import NotAuthorized from '../../components/shared/NotAuthorized';
import useItemIsMine from '../../hooks/useItemIsMine';

const DELETE_ITEM = gql`
    mutation deleteItem($id:Int!){
        deleteItem(id:$id){
            ok
            error
        }
    }
`
export default function ItemDelete() {
    const { id } = useParams()

    // 아이템의 소유자가 아니면 되돌려보내는 hook
    const { data, loading } = useItemIsMine(id)

    const history = useHistory()

    const deleteItemCompleted = ({ deleteItem }) => {
        const { ok, error } = deleteItem
        if (!ok) {
            alert(error);
            return;
        }
        history.push("/")
        return;
    }
    const [deleteItem] = useMutation(DELETE_ITEM, {
        variables: {
            id: parseInt(id)
        },
        onCompleted: deleteItemCompleted
    })

    useEffect(() => {
        if (!loading) {
            data?.seeItem?.isMine ? deleteItem() : <NotAuthorized />
        }
    }, [data])
    return null
}