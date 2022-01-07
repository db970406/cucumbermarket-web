/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : ------
*/

import { gql, useQuery } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import { logUserOut } from '../utils/apollo'

const SEE_LOGGED_IN_USER = gql`
    query seeLoggedInUser{
        seeLoggedInUser{
            id
            username
            avatar
        }
    }
`
export default function useLoggedInUser() {
    const history = useHistory()

    const seeLoggedInUserCompleted = () => {
        if (data?.seeLoggedInUser === null) {
            logUserOut(history)
        }
    }
    const { data } = useQuery(SEE_LOGGED_IN_USER, {
        onCompleted: seeLoggedInUserCompleted
    })

    return { data }
}