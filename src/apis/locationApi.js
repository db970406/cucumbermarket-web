/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : 2022.01.13
*/

// 위도, 경도를 받아서 시,구(군),동을 구해주는 카카오 API
// https://developers.kakao.com/docs/latest/ko/local/dev-guide#coord-to-address
export const kakaoLocationApi = async (lat, lon) => {
    const apiUrl = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lon}&y=${lat}&input_coord=WGS84`
    const { documents } = await (
        await fetch(apiUrl, {
            headers: {
                Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`
            }
        })
    ).json()

    const { address: { region_1depth_name, region_2depth_name, region_3depth_name } } = documents[0]
    return `${region_1depth_name} ${region_2depth_name} ${region_3depth_name}`
}