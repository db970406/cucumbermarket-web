/* 
작성자 : SJ
작성일 : 2022.01.08
수정일 : 2022.01.18
*/

/*
1. 클릭한 User의 id를 받아 userEdit Mutation으로 수정하는 페이지
2. useLoggedInUser hook으로 받아 form의 defaultValues를 채운다.
*/

import { useForm } from 'react-hook-form';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import InputError from '../../../components/shared/form/InputError';
import Input from '../../../components/shared/form/Input';
import useLoggedInUser from '../../../hooks/useLoggedInUser';
import Button from "../../../components/shared/buttons/Button";
import { getCurrentPosition } from '../../../apis/locationApi';
import { useEffect } from 'react';
import { gql, useMutation, useReactiveVar } from '@apollo/client';
import styled from 'styled-components';
import { colors } from '../../../utils/styles';
import NotAuthorized from '../../../components/shared/utils/NotAuthorized';
import FormLayout from '../../../components/layouts/FormLayout';
import ItemPhoto from '../../../components/main/items/ItemPhoto';
import MainLayout from '../../../components/layouts/MainLayout';
import { currentLocationVar } from '../../../utils/apollo';

const Container = styled.div`
    max-width:600px;
    width:100%;
    margin:0 auto;
`;

const FileInput = styled.label`
    padding: 10px 15px;
    background-color:${colors.green};
    border-radius: 4px;
    color: white;
    cursor: pointer;
    input{
        display:none;
    }
    font-size:12px;
    text-align:center;
    display:inline-block;
    margin-right:10px;
`;

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
`;

export default function EditUser() {
    const { id } = useParams();
    const history = useHistory();
    const { state } = useLocation();
    const currentLocation = useReactiveVar(currentLocationVar);

    const { loggedInUser } = useLoggedInUser();

    const { register, handleSubmit, clearErrors, formState, watch } = useForm({
        mode: "onChange",
        defaultValues: {
            name: loggedInUser?.name
        }
    });

    // editUser 구현부
    const editUserCompleted = ({ editUser }) => {
        const { ok } = editUser;
        if (ok) {
            history.push(`/user/${loggedInUser?.id}`);
            window.location.reload();
        };
    };
    const [editUser, { loading }] = useMutation(EDIT_USER, {
        onCompleted: editUserCompleted
    });
    const onValid = (data) => {
        if (loading) return;
        const { name, introduce, location, avatar } = data;
        editUser({
            variables: {
                ...(name && { name }),
                ...(introduce && { introduce }),
                ...(avatar && { avatar }),
                location: location === "동의" ? currentLocation : undefined,
            }
        });
    };
    const clearError = () => clearErrors();

    // 유저의 현 위치를 구하는 API(카카오 맵 API 이용)
    useEffect(() => {
        getCurrentPosition();
    }, []);

    return (
        parseInt(id) === loggedInUser?.id &&
            !loggedInUser?.socialLogin ? (
            <MainLayout title={`${loggedInUser?.name} 수정`} loading={!state}>
                <Container>
                    <ItemPhoto
                        src={state?.avatar}
                        alt={loggedInUser?.name}
                        maxHeight={200}
                        maxWidth={200}
                    />
                </Container>
                <FormLayout title={`${loggedInUser?.name} 수정`}>
                    <form onSubmit={handleSubmit(onValid)}>
                        <FileInput htmlFor="file-input">
                            아바타 업로드
                            <input id="file-input"
                                {...register("avatar")}
                                type="file"
                            />
                        </FileInput>
                        {watch("avatar")?.length > 0 ? (
                            <span>저장 되었습니다.</span>
                        ) : null}
                        <Input
                            onChange={clearError}
                            {...register("name", {
                                required: "이름은 필수항목입니다.",
                                minLength: {
                                    value: 2,
                                    message: "이름은 2글자 이상이어야 합니다."
                                },
                                maxLength: {
                                    value: 8,
                                    message: "이름은 8글자 이하이어야 합니다."
                                }
                            })}
                            required
                            placeholder="이름을 입력하세요."
                            isError={Boolean(formState.errors?.name?.message)}
                        />
                        <InputError text={formState.errors?.name?.message} />

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
                        <InputError text={formState.errors?.introduce?.message} />

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
                            disabled={!formState.isValid || loading}
                            loading={loading}
                            text={`${loggedInUser?.name}님의 정보 수정`}
                            onClick={handleSubmit(onValid)}
                            isLong
                        />
                    </form>
                </FormLayout>
            </MainLayout>
        ) : (
            <NotAuthorized />
        )
    );
};