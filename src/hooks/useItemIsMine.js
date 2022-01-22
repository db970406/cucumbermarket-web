/* 
작성자 : SJ
작성일 : 2022.01.10
수정일 : ------
*/

/*  
1. 나의 Item이 맞는 지 확인하여 맞다면 기본적인 Item fields를 제공하는 hook
2. 나의 Item이 아니라면 돌려 보낸다.
*/

import { gql, useQuery } from "@apollo/client";
import { useHistory } from 'react-router-dom';

const CHECK_IS_MINE = gql`
    query seeItem($id:Int!){
        seeItem(id:$id){
            id
            title
            description
            isMine
            itemPhotos{
                id
                file
            }
            itemPhotoCount
        }
    }
`;

export default function useItemIsMine(id) {
    const history = useHistory();

    const isMineCompleted = ({ seeItem }) => {
        if (!seeItem?.isMine) {
            history.goBack();
        }
    };
    const { data, loading } = useQuery(CHECK_IS_MINE, {
        variables: {
            id: parseInt(id)
        },
        onCompleted: isMineCompleted
    });

    return { data, loading };
};