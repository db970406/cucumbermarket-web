/* 
작성자 : SJ
작성일 : 2022.01.09
수정일 : 2022.01.13
*/

// 네이버 소셜 로그인 시 토큰이 부여된 채로 Redirect되면 그 토큰을 받아 처리할 Component
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { logUserIn } from './apollo';

const GetTokenFromUrl = async () => {
    const { social } = useParams()
    const location = useLocation();
    console.log(social);

    // NaverLogin으로 네이버에 요청을 보낸 후 받은 token을 추출하여 백엔드에 전달하여 처리하고 json데이터로 돌려받아 localStorage에 저장
    const processLogin = async () => {
        switch (social) {
            case "naver":
                const token = location.hash.split('=')[1].split('&')[0];
                const naverLoginResponse = await fetch(`http://localhost:4000/social/naver`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        token
                    })
                })

                if (naverLoginResponse.status === 200) {
                    const { jwtToken } = await naverLoginResponse.json()
                    logUserIn(jwtToken)
                }
                break;
            case "github":
                const code = location.search.split('=')[1].split('&')[0];
                console.log(code)
                const githubLoginResponse = await fetch(`http://localhost:4000/social/github`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({ code })
                })

                if (githubLoginResponse.status === 200) {
                    const { jwtToken } = await githubLoginResponse.json()
                    console.log("This is : ", jwtToken)
                    logUserIn(jwtToken)
                }
                break;
        }
    }
    useEffect(() => {
        processLogin()
    }, [social, location])
}
export default GetTokenFromUrl