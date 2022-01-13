/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.13
*/

import { gql } from '@apollo/client';

// GraphQL 양식 작성 시 자주 쓰는 항목들을 fragment화 해놓은 파일

export const ITEM_DETAIL_FRAGMENT = gql`
    fragment ItemDetailFragment on Item{
        id
        title
        description
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
        likes{
            id
            username
            avatar
        }
        isMine
        likeCount
        isLiked
    }
`

export const ITEM_DISPLAY_FRAGMENT = gql`
    fragment ItemDisplayFragment on Item{
        id
        title
        itemPhotos{
            id
            file
        }
        user{
            id
            name
            avatar
            location
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

export const MESSAGE_DEFAULT_FRAGMENT = gql`
    fragment MessageDefaultFragment on Message{
        id
        payload
        user{
            id
            name
            avatar
        }
        isMine
        read
    }
`