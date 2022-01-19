/* 
작성자 : SJ
작성일 : 2022.01.19
수정일 : ------
*/

// 카카오 로그인 api에 요청을 보낼 Component
const KakaoLogin = () => {
    const baseUrl = "https://kauth.kakao.com/oauth/authorize"
    const config = {
        client_id: process.env.REACT_APP_KAKAO_REST_API_KEY,
        redirect_uri: process.env.REACT_APP_SOCIAL_KAKAO_CODE_REDIRECT,
        response_type: "code",
        state: process.env.REACT_APP_SOCIAL_KAKAO_STATE
    }
    const params = new URLSearchParams(config).toString()

    const reqUrl = `${baseUrl}?${params}`
    return (
        <div>
            <a href={reqUrl}>
                <img
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    src={require("../images/kakaotalk.png")}
                    alt="카카오 로그인"
                />
            </a>
        </div>
    )
}

export default KakaoLogin