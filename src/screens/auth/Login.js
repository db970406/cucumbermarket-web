/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.13
*/

import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import FormLayout from '../../components/layouts/FormLayout';
import Button from '../../components/shared/buttons/Button';
import Divider from '../../components/shared/utils/Divider';
import SendAnywhere from '../../components/shared/utils/SendAnywhere';
import { logUserIn } from '../../utils/apollo';
import NaverLogin from '../../utils/NaverLogin';
import { colors } from '../../utils/styles';
import Input from '../../components/shared/form/Input';
import InputError from '../../components/shared/form/InputError';
import GithubLogin from '../../utils/GithubLogin';

const SocialLogins = styled.div`
    margin-top:5px;
    display:flex;
    justify-content:center;
    align-items:center;
    margin:0 auto;
    gap:10px;
`

const Greeting = styled.span`
    color:${colors.green};
    text-align:center;
`

const GithubLoginBox = styled.div`
`

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
    const { state } = useLocation()

    // SignUp이 성공하면 form에 자동적으로 username과 password를 세팅하게 둠
    const { register, handleSubmit, clearErrors, formState } = useForm({
        mode: "onChange"
    })

    const clearError = (errorName) => clearErrors(errorName)

    // Login Mutation 처리 후 실행할 함수
    const afterLogin = ({ login }) => {
        const { ok, token, error } = login
        if (!ok) {
            alert(error)
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


    return (
        <FormLayout auth logo title="로그인">
            <form onClick={handleSubmit(onValid)}>
                {state?.message ? (
                    <Greeting>{state?.message}</Greeting>
                ) : null}
                <Input
                    defaultValue={state?.username}
                    placeholder="아이디를 입력하세요."
                    onFocus={() => clearError('username')}
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
                <InputError text={formState.errors?.username?.message} />

                <Input
                    defaultValue={state?.password}
                    type="password"
                    placeholder="비밀번호를 입력하세요."
                    onFocus={() => clearError("password")}
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
                <InputError text={formState.errors?.password?.message} />

                <Button
                    text="로그인"
                    disabled={!formState.isValid || loading}
                    loading={loading}
                    width="100%"
                    longtype
                />
                <SendAnywhere
                    link="sign-up"
                    description="계정이 없으시다면? "
                    where='회원가입'
                />
            </form>
            <Divider />
            <SocialLogins>
                <NaverLogin />
                <GithubLogin />
            </SocialLogins>
        </FormLayout>
    )
}