/* 
작성자 : SJ
작성일 : 2022.01.09
수정일 : 2022.01.16
*/

// 소셜 로그인 요청으로 특정 URL로 Redirect되면 URL에 실린 code를 받아 처리할 Component

import { useLocation, useParams } from 'react-router-dom';
import { logUserIn } from './apollo';

// code를 추출하고 서버에 fetch하는 함수
const extractCodeAndFetchToServer = async (social, location) => {
    const code = location.search.split('=')[1].split('&')[0];
    const response = await fetch(`http://localhost:4000/social/${social}`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ code })
    })
    if (response.status === 200) {
        const { jwtToken } = await response.json()
        console.log(jwtToken)
        return logUserIn(jwtToken)
    }
}

const GetTokenFromUrl = async () => {
    const { social } = useParams()
    const location = useLocation();

    const processLogin = async () => {
        // 각 소셜로그인 Component로 해당 사이트에 요청을 보낸 후 받은 token을 추출하여 백엔드에 전달하여 처리하고 jwtToken을 json데이터로 돌려받아 localStorage에 저장
        switch (social) {
            case "naver":
                return extractCodeAndFetchToServer("naver", location)

            case "github":
                return extractCodeAndFetchToServer("github", location)

            case "kakao":
                return extractCodeAndFetchToServer("kakao", location)
        }
    }
    processLogin()
}

export default GetTokenFromUrl