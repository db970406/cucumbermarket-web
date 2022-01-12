/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : 2022.01.12
*/

import { gql, useQuery } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import { USER_DEFAULT_FRAGMENT } from '../components/shared/utils/fragments'
import { logUserOut } from '../utils/apollo'

// 현재 로그인한 유저의 정보를 1차적으로 가져와준다(Header에 avatar를 넣기 위한 목적이 큼).
const SEE_LOGGED_IN_USER = gql`
    query seeLoggedInUser{
        seeLoggedInUser{
            ...UserDefaultFragment
        }
    }
    ${USER_DEFAULT_FRAGMENT}
`
export default function useLoggedInUser() {
    const history = useHistory()

    const seeLoggedInUserCompleted = (data) => {
        if (data?.seeLoggedInUser === null) {
            logUserOut(history)
        }
    }
    const { data } = useQuery(SEE_LOGGED_IN_USER, {
        onCompleted: seeLoggedInUserCompleted
    })

    const loggedInUser = data?.seeLoggedInUser
    return { loggedInUser }
}