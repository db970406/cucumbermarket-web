/* 
작성자 : SJ
작성일 : 2022.01.10
수정일 : ------
*/
// 나의 Item이 맞는 지 확인해주고 기본적인 Item fields를 제공하는 hook

import { gql, useQuery } from "@apollo/client"
import { useHistory } from 'react-router-dom'

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
`

export default function useItemIsMine(id) {
    const history = useHistory()

    const isMineCompleted = ({ seeItem }) => {
        if (!seeItem?.isMine) {
            history.goBack()
        }
    }
    const { data, loading } = useQuery(CHECK_IS_MINE, {
        variables: {
            id: parseInt(id)
        },
        onCompleted: isMineCompleted
    })

    return { data, loading }
}