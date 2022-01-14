/* 
작성자 : SJ
작성일 : 2022.01.11
수정일 : 2022.01.14
*/

import { gql, useQuery } from '@apollo/client'
import { faCommentDots } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { showChatListVar } from '../../../utils/apollo'
import { colors } from '../../../utils/styles'

const Button = styled.button`
    position:fixed;
    bottom:20px;
    right:20px;
    width:50px;
    height:50px;
    border-radius:25px;
    background-color:${colors.green};
`
const UnreadCount = styled.div`
    position:absolute;
    display:flex;
    justify-content:center;
    align-items:center;
    bottom:25px;
    right: 10px;
    width:10px;
    height:10px;
    border-radius:8px;
    padding:8px;
    background-color:${colors.pink} ;
    text-align:center;
    span{
        font-size:10px;
    }
`

const SEE_ROOMS = gql`
    query seeRooms{
        seeRooms{
            unreadCount
        }
    }
`
export default function ChatBtn() {
    const { data } = useQuery(SEE_ROOMS)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        if (data?.seeRooms) {
            const sumTotal = data?.seeRooms?.reduce((a, b) => (a.unreadCount + b.unreadCount));
            setUnreadCount(sumTotal)
        }
    }, [data])

    return (
        <Button onClick={() => showChatListVar(true)}>
            <FontAwesomeIcon icon={faCommentDots} size="lg" color={colors.white} />
            {unreadCount?.unreadCount ? (
                <UnreadCount>
                    <span>{unreadCount.unreadCount}</span>
                </UnreadCount>
            ) : null}
        </Button >
    )
}