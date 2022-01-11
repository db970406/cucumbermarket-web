/* 
작성자 : SJ
작성일 : 2022.01.10
수정일 : ------
*/
// 입장 권한 없는 페이지 접근 시 전 URL로 돌려보내는 Component

import { useHistory } from 'react-router-dom';

export default function NotAuthorized() {
    const history = useHistory()
    history.goBack()
    return;
}