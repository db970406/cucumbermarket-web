/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : 2022.01.12
*/

/* 
1. 현재 로그인한 유저의 정보를 1차적으로 가져와준다.
2. localStorage에 저장되어 있는 jwt를 백엔드에 보내서 해당 유저를 찾는다. 유효하지 않은 토큰이라면 logout시켜버린다.
*/

import { gql, useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { USER_DEFAULT_FRAGMENT } from '../components/shared/utils/fragments';
import { logUserOut } from '../utils/apollo';

const SEE_LOGGED_IN_USER = gql`
    query seeLoggedInUser{
        seeLoggedInUser{
            ...UserDefaultFragment
        }
    }
    ${USER_DEFAULT_FRAGMENT}
`;

export default function useLoggedInUser() {
    const history = useHistory();

    const seeLoggedInUserCompleted = (data) => {
        if (data?.seeLoggedInUser === null) {
            logUserOut(history);
        };
    };
    const { data } = useQuery(SEE_LOGGED_IN_USER, {
        onCompleted: seeLoggedInUserCompleted
    });

    const loggedInUser = data?.seeLoggedInUser;
    return { loggedInUser };
};