/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.10
*/

import { gql } from '@apollo/client';

// GraphQL 양식 작성 시 자주 쓰는 항목들을 fragment화 해놓은 파일

export const ITEM_DEFAULT_FRAGMENT = gql`
    fragment ItemDefaultFragment on Item{
        id
        title
        user{
            id
            name
            username
            avatar
            isMe
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
`

export const USER_DEFAULT_FRAGMENT = gql`
    fragment UserDefaultFragment on User{
        id
        socialLogin
        name
        email
        username
        avatar
    }
`