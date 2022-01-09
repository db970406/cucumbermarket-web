/* 
작성자 : SJ
작성일 : 2022.01.08
수정일 : ------
*/

// 네이버 소셜 로그인 시 토큰이 부여된 채로 Redirect되면 그 토큰을 받아 처리할 Component
import { useLocation } from 'react-router-dom';
import { logUserIn } from './apollo';

const GetTokenFromUrl = async () => {
    const location = useLocation();

    const processLogin = async () => {
        const token = location.hash.split('=')[1].split('&')[0];
        const response = await fetch(`http://localhost:4000/social/naver`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                token
            })
        })
        if (response.status === 200) {
            const { jwtToken } = await response.json()
            logUserIn(jwtToken)
        }
    }
    processLogin()
}
export default GetTokenFromUrl