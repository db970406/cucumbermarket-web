

//카카오로그인
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
                />
            </a>
        </div>
    )
}

export default KakaoLogin