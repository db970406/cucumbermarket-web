/* 
작성자 : SJ
작성일 : 2022.01.08
수정일 : ------
*/
// 본인인 유저만이 입장할 수 있는 페이지로 정보를 수정하는 페이지이다.

import { useForm } from 'react-hook-form'
import { useHistory, useParams } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout'
import FormError from '../../components/shared/FormError'
import Input from '../../components/shared/Input'
import useLoggedInUser from '../../hooks/useLoggedInUser'
import Button from "../../components/shared/Button"
import { kakaoLocationApi } from '../../apis/locationApi'
import { useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'

const EDIT_USER = gql`
    mutation editUser(
        $name:String,
        $introduce:String,
        $avatar:Upload,
        $location:String,
    ){
        editUser(
            name:$name,
            introduce:$introduce,
            avatar:$avatar,
            location:$location
        ){
            ok
            error
        }
    }
`
export default function UserEditProfile() {
    const { id } = useParams()
    const history = useHistory()
    const [currentLocation, setCurrentLocation] = useState("")
    const { data: userData } = useLoggedInUser()

    const { register, handleSubmit, clearErrors, formState } = useForm({
        mode: "onChange",
        defaultValues: {
            name: userData?.seeLoggedInUser.name
        }
    })

    const editUserCompleted = ({ editUser }) => {
        const { ok, error } = editUser
        console.log(error)
        if (ok) {
            history.push(`/user/${userData?.seeLoggedInUser?.id}`);
            window.location.reload()
        }
    }
    const [editUser, { loading }] = useMutation(EDIT_USER, {
        onCompleted: editUserCompleted
    })
    const onValid = (data) => {
        if (loading) return;
        const { name, introduce, location, avatar } = data

        editUser({
            variables: {
                name,
                ...(introduce && { introduce }),
                ...(avatar && { avatar }),
                location: location === "동의" ? currentLocation : undefined,
            }
        })
    }
    const clearError = () => clearErrors()

    // 유저의 현 위치를 구하는 API(카카오 맵 API 이용)
    useEffect(() => {
        const success = async (position) => {
            const { latitude: lat, longitude: lon } = position.coords
            const getLocation = await kakaoLocationApi(lat, lon)
            setCurrentLocation(getLocation)
        }
        navigator.geolocation.getCurrentPosition(success)
    }, [])
    return (
        parseInt(id) === userData?.seeLoggedInUser?.id &&
            !userData?.seeLoggedInUser?.socialLogin ? (
            <AuthLayout title={`${userData?.seeLoggedInUser?.name} 수정`}>
                <form onSubmit={handleSubmit(onValid)}>
                    <input
                        {...register("avatar")}
                        type="file"
                    />
                    <Input
                        onChange={clearError}
                        {...register("name", {
                            minLength: {
                                value: 2,
                                message: "이름은 2글자 이상이어야 합니다."
                            },
                            maxLength: {
                                value: 8,
                                message: "이름은 8글자 이하이어야 합니다."
                            }
                        })}
                        placeholder="이름을 입력하세요."
                        isError={Boolean(formState.errors?.name?.message)}
                    />
                    <FormError text={formState.errors?.name?.message} />

                    <Input
                        onChange={clearError}
                        {...register("introduce", {
                            maxLength: {
                                value: 49,
                                message: "소개글은 50글자 이하까지만 가능합니다."
                            }
                        })}
                        placeholder="소개를 입력하세요."
                        maxLength={50}
                        isError={Boolean(formState.errors?.introduce?.message)}
                    />
                    <FormError text={formState.errors?.introduce?.message} />

                    <Input
                        onChange={clearError}
                        {...register("location", {
                            maxLength: 2
                        })}
                        type="text"
                        placeholder='"동의"를 입력하시면 현 위치가 공유됩니다.'
                        maxLength={2}
                    />
                    <Button
                        auth
                        loading={loading}
                        text={`${userData?.seeLoggedInUser?.name}님의 정보 수정`}
                        onClick={handleSubmit(onValid)}
                    />
                </form>
            </AuthLayout>
        ) : null
    )
}