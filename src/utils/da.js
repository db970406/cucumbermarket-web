const { naver } = window;

export const NaverLogin = () => {
    Naver();
    UserProfile();
}
export const Naver = () => {
    const naverLogin = new naver.LoginWithNaverId({
        clientId: process.env.REACT_APP_SOCIAL_NAVER_KEY,
        callbackUrl: process.env.REACT_APP_SOCIAL_NAVER_REDIRECT,
        isPopup: false,
        loginButton: { color: 'green', type: 3, height: '50' }
    });
    naverLogin.init();
    return (
        <div id='naverIdLogin' />
    )
};

export const UserProfile = () => {
    window.location.href.includes('access_token') && GetUser();
    console.log(window.location.href)
    function GetUser() {
        const location = window.location.href.split('=')[1];
        const form_data = new FormData();
        const item = {
            token: location.split('&')[0],
        };
        for (const key in item) {
            form_data.append(key, item[key]);
        }
        fetch(`http://localhost:4000/naver/finish}`, {
            method: 'POST',
            body: form_data,
        }).then((res) => res.json())
            .then((resjson) => {
                if (resjson.responseCode == '403') {
                    // 사용자가 없으니 회원가입 창으로
                } else if (resjson.responseCode == '200') {
                    // 로그인이 되었으니 이 후 process 로 이동
                }
            }).catch((err) => console.log(err));
    }
};