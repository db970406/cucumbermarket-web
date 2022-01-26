/* 
작성자 : SJ
작성일 : 2022.01.09
수정일 : 2022.01.26
*/

// 소셜 로그인 요청으로 특정 URL로 Redirect되면 URL에 실린 code를 받아 처리할 Component

import axios from 'axios';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { logUserIn } from './apollo';

// code를 추출하고 서버에 fetch하는 함수
const extractCode = (location) => location.search.split('=')[1].split('&')[0];

const fetchToServer = async (code, social) => {
    const response = await axios.post(`http://localhost:4000/social/${social}`,
        {
            code
        },
        {
            headers: {
                "Content-type": "application/json"
            },
        },
    );
    if (response.status === 200) {
        const { jwtToken } = await response.data;
        logUserIn(jwtToken);
    };
}

export default function GetTokenFromUrl() {
    const { social } = useParams();
    const location = useLocation();
    let code = null;
    const processLogin = async () => {
        // 각 소셜로그인 Component로 해당 사이트에 요청을 보낸 후 받은 token을 추출하여 백엔드에 전달하여 처리하고 jwtToken을 json데이터로 돌려받아 localStorage에 저장
        switch (social) {
            case "naver":
                code = extractCode(location);
                break;
            case "github":
                code = extractCode(location);
                break;
            case "kakao":
                code = extractCode(location);
                break;
        };
        fetchToServer(code, social);
    };
    useEffect(() => {
        processLogin();
    }, []);
    return (
        <span>Login...</span>
    );
};
