/* 
작성자 : SJ
작성일 : 2022.01.10
수정일 : ------
*/

/* 
1. 본인이 아닌 유저가 그 유저의 EditUser에 접근하는 경우
2. 소셜로그인 유저가 EditUser에 접근하려는 경우 이전 URL로 돌려보내는 Component
*/

import { useHistory } from 'react-router-dom';

export default function NotAuthorized() {
    const history = useHistory();
    history.goBack();
    return;
};