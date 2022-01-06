/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : ------
*/

import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import AuthLayout from '../../components/auth/AuthLayout';
import Button from '../../components/shared/Button';
import FormBox from '../../components/shared/FormBox';
import FormError from '../../components/shared/FormError';
import Input from '../../components/shared/Input';
import { logUserIn } from '../../utils/apollo';

const LOGIN_MUTATION = gql`
    mutation login($username:String!,$password:String!){
        login(username:$username,password:$password){
            ok
            token
            error
        }
    }
`

export default function Login() {
    const { register, handleSubmit, clearErrors, setError, formState } = useForm({
        mode: "onChange"
    })

    const clearError = (errorName) => clearErrors(errorName)

    // Login Mutation 처리 후 실행할 함수
    const afterLogin = ({ login }) => {
        const { ok, token, error } = login
        if (!ok) {
            setError("result", {
                message: error
            })
            clearError("result")
            return;
        }
        if (token) {
            logUserIn(token)
        }
    }
    const [login, { loading }] = useMutation(LOGIN_MUTATION, {
        onCompleted: afterLogin
    })

    // form이 제출되었을 때 실행될 함수
    const onValid = (data) => {
        if (loading) return;

        const { username, password } = data
        login({
            variables: {
                username,
                password
            }
        })
    }


    // 백엔드에서 해당하는 유저를 찾지 못했을 경우 return하는 문자열을 alert로 띄울 것이다.
    if (formState.errors?.result?.message) {
        alert(formState.errors?.result?.message)
    }
    return (
        <AuthLayout title="Log In">
            <FormBox>
                <Input
                    placeholder="아이디를 입력하세요."
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
                    isError={Boolean(formState.errors?.username?.message)}
                />
                <FormError text={formState.errors?.username?.message} />

                <Input
                    type="password"
                    placeholder="비밀번호를 입력하세요."
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
                    lastOne
                    isError={Boolean(formState.errors?.password?.message)}
                />
                <FormError text={formState.errors?.password?.message} />

                <Button
                    text='Log In'
                    onClick={handleSubmit(onValid)}
                    disabled={!formState.isValid || loading}
                    loading={loading}
                />
            </FormBox>
        </AuthLayout>
    )
}