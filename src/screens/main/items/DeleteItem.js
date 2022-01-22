/* 
작성자 : SJ
작성일 : 2022.01.10
수정일 : 2022.01.12
*/

// 클릭한 Item의 id를 받아 deleteItem Mutation으로 삭제하는 페이지

import { gql, useMutation } from '@apollo/client'
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import useItemIsMine from '../../../hooks/useItemIsMine';
import useLoggedInUser from '../../../hooks/useLoggedInUser';

const DELETE_ITEM = gql`
    mutation deleteItem($id:Int!){
        deleteItem(id:$id){
            ok
            error
        }
    }
`;

export default function DeleteItem() {
    const { id } = useParams();
    const { data: loggedInUser } = useLoggedInUser();

    // 아이템의 소유자가 아니면 되돌려보내는 hook
    const { data } = useItemIsMine(id);

    const history = useHistory();

    const updateDeleteItem = (cache, { data }) => {
        const { deleteItem: { ok, error } } = data;
        if (!ok) {
            alert(error);
            return;
        };
        cache.evict({
            id: `Item:${id}`
        });
        cache.modify({
            id: `ROOT_QUERY`,
            fields: {
                seeItems(prev) {
                    const filteredItems = prev.filter(item => item.id !== parseInt(id));
                    return [...filteredItems];
                }
            }
        });
        cache.modify({
            id: `User:${loggedInUser?.seeLoggedInUser?.id}`,
            fields: {
                itemCount(prev) {
                    return prev - 1;
                }
            }
        });
        history.push("/");
        return;
    }
    const [deleteItem] = useMutation(DELETE_ITEM, {
        variables: {
            id: parseInt(id)
        },
        update: updateDeleteItem
    });

    useEffect(() => {
        if (data?.seeItem?.isMine) {
            deleteItem();
        }
    }, [data]);
    return null;
}