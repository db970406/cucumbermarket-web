/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.13
*/

// SignUp Screen

import { gql, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { kakaoLocationApi } from '../../apis/locationApi';
import FormLayout from '../../components/layouts/FormLayout';
import Button from '../../components/shared/buttons/Button';
import InputError from '../../components/shared/form/InputError';
import Input from '../../components/shared/form/Input';
import SendAnywhere from '../../components/shared/utils/SendAnywhere';

const SIGNUP_MUTATION = gql`
    mutation signUp(
        $name:String!,
        $username:String!,
        $email:String!,
        $password:String!,
        $location:String
    ){
        createUser(
            name:$name,
            username:$username,
            email:$email,
            password:$password,
            location:$location,
        ){
            ok
            error
        }
    }
`
export default function SignUp() {
    const history = useHistory()
    const [currentLocation, setCurrentLocation] = useState("")
    const { register, handleSubmit, clearErrors, formState, getValues } = useForm({
        mode: "onChange"
    })
    const clearError = (errorName) => clearErrors(errorName)

    // SignUp Mutation 처리 후 실행할 함수로 Login으로 보내면서 정보를 넘겨준다. 
    const signUpCompleted = ({ createUser }) => {
        const { ok, error } = createUser
        if (!ok) {
            alert(error)
            return;
        }
        const { name, username, password } = getValues()
        history.push("/", {
            message: `${name}님 반갑습니다!`,
            username,
            password
        })
    }
    const [signUp, { loading }] = useMutation(SIGNUP_MUTATION, {
        onCompleted: signUpCompleted
    })

    const onValid = (data) => {
        if (loading) return;

        const { name, username, email, location, password, password2 } = data
        if (password !== password2) {
            alert("비밀번호가 일치하지 않습니다.")
            return;
        }

        signUp({
            variables: {
                name,
                username,
                email,
                location: location === "동의" ? currentLocation : undefined,
                password
            }
        })
    }


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
        <FormLayout auth logo title="회원가입">
            <form onSubmit={handleSubmit(onValid)}>
                <Input
                    onChange={clearError}
                    {...register("name", {
                        required: true,
                        minLength: {
                            value: 2,
                            message: "이름은 2글자 이상이어야 합니다."
                        }
                    })}
                    placeholder="이름을 입력하세요."
                    isError={Boolean(formState.errors?.name?.message)}
                />
                <InputError text={formState.errors?.name?.message} />

                <Input
                    onChange={clearError}
                    {...register("email", {
                        required: true,
                        pattern: {
                            value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g,
                            message: "이메일 양식을 지켜주세요."
                        }
                    })}
                    placeholder="이메일을 입력하세요."
                    isError={Boolean(formState.errors?.email?.message)}
                />
                <InputError text={formState.errors?.email?.message} />

                <Input
                    onChange={clearError}
                    {...register("username", {
                        required: true,
                        minLength: {
                            value: 6,
                            message: "아이디는 6자리 이상이어야 합니다."
                        },
                        maxLength: {
                            value: 15,
                            message: "아이디는 15자리 이하이어야 합니다."
                        },
                        pattern: {
                            value: /(?=.*\d)(?=.*[a-z]).{6,15}/g,
                            message: "아이디는 영소문자, 숫자 포함 6~15자리입니다."
                        }
                    })}
                    placeholder="아이디를 입력하세요."
                    isError={Boolean(formState.errors?.username?.message)}
                />
                <InputError text={formState.errors?.username?.message} />

                <Input
                    onChange={clearError}
                    {...register("location", {
                        maxLength: 2
                    })}
                    type="text"
                    placeholder='"동의"를 입력하시면 현 위치가 공유됩니다.'
                    maxLength={2}
                />

                <Input
                    onChange={clearError}
                    {...register("password", {
                        required: true,
                        minLength: {
                            value: 8,
                            message: "비밀번호는 8자리 이상이어야 합니다."
                        },
                        maxLength: {
                            value: 15,
                            message: "비밀번호는 15자리 이하이어야 합니다."
                        },
                        pattern: {
                            value: /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/g,
                            message: "비밀번호는 영문, 숫자, 특수문자 포함 8~15자리입니다."
                        }
                    })}
                    type="password"
                    placeholder='비밀번호를 입력하세요.'
                    isError={Boolean(formState.errors?.password?.message)}
                />
                <InputError text={formState.errors?.password?.message} />

                <Input
                    onChange={clearError}
                    {...register("password2", {
                        required: true,
                        minLength: {
                            value: 8,
                            message: "비밀번호는 8자리 이상이어야 합니다."
                        },
                        maxLength: {
                            value: 15,
                            message: "비밀번호는 15자리 이하이어야 합니다."
                        },
                        pattern: {
                            value: /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/g,
                            message: "비밀번호는 영문, 숫자, 특수문자 포함 8~15자리입니다."
                        }
                    })}
                    type="password"
                    placeholder='확인 비밀번호를 입력하세요.'
                    isError={Boolean(formState.errors?.password2?.message)}
                />
                <InputError text={formState.errors?.password2?.message} />

                <Button
                    text='회원가입'
                    loading={loading}
                    disabled={!formState.isValid || loading}
                    onClick={handleSubmit(onValid)}
                    width="100%"
                    longtype
                />
                <SendAnywhere
                    link="/"
                    description="계정이 있으신가요?"
                    where="로그인"
                />
            </form>
        </FormLayout>
    )
}