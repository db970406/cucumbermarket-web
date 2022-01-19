/* 
작성자 : SJ
작성일 : 2022.01.09
수정일 : 2022.01.19
*/

// 네이버 로그인 api에 요청을 보낼 Component

const NaverLogin = () => {
  const baseUrl = "https://nid.naver.com/oauth2.0/authorize"

  const config = {
    response_type: "code",
    client_id: process.env.REACT_APP_SOCIAL_NAVER_KEY,
    redirect_uri: process.env.REACT_APP_SOCIAL_NAVER_CODE_REDIRECT,
    state: process.env.REACT_APP_SOCIAL_NAVER_STATE
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
          src={require("../images/naver.png")}
          alt="네이버 로그인"
        />
      </a>
    </div>
  )
}
export default NaverLogin