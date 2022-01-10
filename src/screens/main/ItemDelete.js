/* 
작성자 : SJ
작성일 : 2022.01.10
수정일 : ------
*/

import { gql, useMutation } from '@apollo/client'
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

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
    const history = useHistory()
    console.log(id)

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
        deleteItem()
    }, [])

    return null;
}