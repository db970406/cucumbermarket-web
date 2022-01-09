/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.08
*/

// 버튼을 만들어 네이버 로그인 api에 요청을 보낼 Component
import { useEffect } from 'react';
import { colors } from './styles';
const { naver } = window;

const NaverLogin = () => {
  const initializeNaverLogin = () => {
    const naverLogin = new naver.LoginWithNaverId({
      clientId: process.env.REACT_APP_SOCIAL_NAVER_KEY,
      callbackUrl: process.env.REACT_APP_SOCIAL_NAVER_REDIRECT,
      isPopup: false, // popup 형식으로 띄울것인지 설정
      loginButton: { color: colors.green, type: 3, height: '47' }, //버튼의 스타일, 타입, 크기를 지정
    });
    naverLogin.init();
  };

  useEffect(() => {
    initializeNaverLogin();
  }, []);

  return (
    <div id='naverIdLogin' />
  )
}
export default NaverLogin