/* 
작성자 : SJ
작성일 : 2022.01.18
수정일 : ------
*/

// DisplayItem에서 사용할 ToggleLike Mutation Component

import { gql, useMutation, useReactiveVar } from '@apollo/client'
import useLoggedInUser from '../../../hooks/useLoggedInUser'
import FontAwesomeBtn from '../../shared/buttons/FontAwesomeBtn'
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { darkModeVar } from '../../../utils/apollo';
import { colors } from '../../../utils/styles';
import { ITEM_DISPLAY_FRAGMENT } from '../../shared/utils/fragments';

const TOGGLE_LIKE_MUTATION = gql`
    mutation toggleLike($id:Int!){
        toggleLike(id:$id){
            ...ItemDisplayFragment
        }
    }
    ${ITEM_DISPLAY_FRAGMENT}
`

export default function ToggleLike({ itemId, isLiked }) {
    const { loggedInUser } = useLoggedInUser()
    const darkMode = useReactiveVar(darkModeVar)

    // 관심 Mutation과 프론트 즉각 반영을 위한 cache작업
    const updateToggleLike = (cache, { data }) => {
        const { toggleLike: item } = data
        if (item.id) {
            const photoPressedLike = cache.writeFragment({
                id: `Item:${itemId}`,
                fragment: gql`
                    fragment itemDisplay on Item{
                        id
                        title
                        user{
                            id
                            name
                            avatar
                            location
                        }
                        itemPhotos{
                            id
                            file
                        }
                        isMine
                        likeCount
                        isLiked
                    }
                `,
                data: item
            })

            cache.modify({
                id: `User:${loggedInUser?.id}`,
                fields: {
                    likeCount(prev) {
                        return isLiked ? prev - 1 : prev + 1
                    },
                    likes(prev) {
                        //관심을 누른 상태라면 존재하는 likes 배열에서 write한 fragment와 같은 값을 배열에서 제거한다.
                        const clearMyLikes = prev.filter(item => item.__ref !== photoPressedLike.__ref)

                        //관심을 누르지 않았다면 그대로 이전 배열을 사용한다.
                        return isLiked ? [...prev] : [photoPressedLike, ...clearMyLikes]
                    }
                }
            })
        }
    }
    const [toggleLike] = useMutation(TOGGLE_LIKE_MUTATION, {
        variables: {
            id: itemId
        },
        update: updateToggleLike
    })
    return (
        <FontAwesomeBtn
            onClick={toggleLike}
            icon={isLiked ? solidHeart : faHeart}
            size={"lg"}
            color={isLiked ? colors.pink : darkMode ? colors.white : colors.black}
        />
    )
}