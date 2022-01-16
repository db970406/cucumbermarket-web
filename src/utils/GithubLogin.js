/* 
작성자 : SJ
작성일 : 2022.01.12
수정일 : 2022.01.13
*/

// 버튼을 만들어 깃허브 로그인 api에 요청을 보낼 Component

const GithubLogin = () => {

    const baseUrl = `https://github.com/login/oauth/authorize`
    const config = {
        client_id: process.env.REACT_APP_SOCIAL_GITHUB_KEY,
        redirect_uri: process.env.REACT_APP_SOCIAL_GITHUB_CODE_REDIRECT,
        state: process.env.REACT_APP_SOCIAL_GITHUB_STATE,
        scope: "read:user user:email"
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
                    src={require("../images/github.png")}
                />
            </a>
        </div>
    )
}
export default GithubLogin