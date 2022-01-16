/* 
작성자 : SJ
작성일 : 2022.01.09
수정일 : 2022.01.16
*/

// 소셜 로그인 요청으로 특정 URL로 Redirect되면 URL에 실린 code를 받아 처리할 Component

import { useLocation, useParams } from 'react-router-dom';
import { logUserIn } from './apollo';

const GetTokenFromUrl = async () => {
    const { social } = useParams()
    const location = useLocation();

    const processLogin = async () => {
        switch (social) {
            // NaverLogin으로 네이버에 요청을 보낸 후 받은 token을 추출하여 백엔드에 전달하여 처리하고 jwtToken을 json데이터로 돌려받아 localStorage에 저장
            case "naver":
                const naverCode = location.search.split('=')[1].split('&')[0];
                const naverLoginResponse = await fetch(`http://localhost:4000/social/naver`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({ naverCode })
                })
                if (naverLoginResponse.status === 200) {
                    const { jwtToken } = await naverLoginResponse.json()
                    logUserIn(jwtToken)
                }
                break;

            // GithubLogin으로 깃허브에 요청을 보낸 후 받은 code를 추출하여 백엔드에 전달하여 처리하고 json데이터로 돌려받아 localStorage에 저장
            case "github":
                const githubCode = location.search.split('=')[1].split('&')[0];
                const githubLoginResponse = await fetch(`http://localhost:4000/social/github`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({ githubCode })
                })

                if (githubLoginResponse.status === 200) {
                    const { jwtToken } = await githubLoginResponse.json()
                    logUserIn(jwtToken)
                }
                break;

            case "kakao":
                const kakaoCode = location.search.split('=')[1].split('&')[0];
                const kakaoLoginResponse = await fetch(`http://localhost:4000/social/kakao`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({ kakaoCode })
                })

                if (kakaoLoginResponse.status = 200) {
                    const { jwtToken } = await kakaoLoginResponse.json()
                    logUserIn(jwtToken)
                }
        }
    }
    processLogin()
}

export default GetTokenFromUrl