/* 
작성자 : SJ
작성일 : 2022.01.08
수정일 : ------
*/
// 본인인 유저만이 입장할 수 있는 페이지로 정보를 수정하는 페이지이다.

import { useParams } from 'react-router-dom'
import FormBox from '../../components/auth/FormBox'
import MainLayout from '../../components/main/MainLayout'
import Input from '../../components/shared/Input'
import NotFound from '../../components/shared/NotFound'
import useLoggedInUser from '../../hooks/useLoggedInUser'

export default function UserEditProfile() {
    const { id } = useParams()
    const { data: userData } = useLoggedInUser()
    console.log(userData?.seeLoggedInUser?.socialLogin)
    return (
        parseInt(id) === userData?.seeLoggedInUser?.id && !userData?.seeLoggedInUser?.socialLogin ? (
            <MainLayout>
                <FormBox>
                    <Input

                    />
                </FormBox>
            </MainLayout>
        ) : <NotFound />
    )
}