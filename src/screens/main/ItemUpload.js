/* 
작성자 : SJ
작성일 : 2022.01.10
수정일 : 2022.01.12
*/

import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import FormLayout from '../../components/layouts/FormLayout';
import Input from '../../components/shared/form/Input';
import { ITEM_DISPLAY_FRAGMENT } from '../../components/shared/utils/fragments';
import { colors } from '../../utils/styles';
import InputError from '../../components/shared/form/InputError';
import Button from '../../components/shared/buttons/Button';
import MainLayout from '../../components/layouts/MainLayout';
import useLoggedInUser from '../../hooks/useLoggedInUser';

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
`

const UPLOAD_ITEM = gql`
    mutation uploadItem(
        $title:String!,
        $description:String,
        $files:Upload!
    ){
        uploadItem(
            title:$title,
            description:$description,
            files:$files
        ){
            ...ItemDisplayFragment
        }
    }
    ${ITEM_DISPLAY_FRAGMENT}
`

export default function ItemUpload() {
    const history = useHistory()
    const { register, handleSubmit, clearErrors, formState } = useForm()
    const clearError = (errorName) => clearErrors(errorName)
    const { loggedInUser } = useLoggedInUser()

    const updateUploadItem = (cache, { data }) => {
        const { uploadItem } = data
        if (uploadItem.id) {
            cache.modify({
                id: `ROOT_QUERY`,
                fields: {
                    seeItems(prev) {
                        return [uploadItem, ...prev]
                    }
                }
            })
            cache.modify({
                id: `User:${loggedInUser?.id}`,
                fields: {
                    itemCount(prev) {
                        return prev + 1
                    },
                    items(prev) {
                        return [uploadItem, ...prev]
                    }
                }
            })

            history.push("/")
        }
    }

    const [uploadItemMutation, { loading }] = useMutation(UPLOAD_ITEM, {
        update: updateUploadItem
    })

    const onValid = (data) => {
        if (loading) return;
        const { title, description, files } = data
        console.log(files)
        uploadItemMutation({
            variables: {
                title,
                description,
                files
            }
        })
    }

    return (
        <MainLayout title="물건 업로드">
            <FormLayout title="물건 업로드">
                <form onSubmit={handleSubmit(onValid)}>

                    <input id="file-input"
                        {...register("files", {
                            require: true,
                        })}
                        type="file"
                        accept='.jpg,.jpeg,.png'
                        required
                    />

                    <Input
                        onChange={clearError}
                        {...register("title", {
                            require: true,
                            minLength: {
                                value: 2,
                                message: "제목은 2글자 이상이어야 합니다."
                            }
                        })}
                        required
                        placeholder="제목을 입력하세요."
                        isError={Boolean(formState.errors?.title?.message)}
                    />
                    <InputError text={formState.errors?.title?.message} />

                    <Input
                        onChange={clearError}
                        {...register("description", {
                            maxLength: {
                                value: 299,
                                message: "설명글은 300자 미만이어야 합니다."
                            }
                        })}
                        placeholder="설명글을 입력하세요."
                        isError={Boolean(formState.errors?.description?.message)}
                    />
                    <InputError text={formState.errors?.description?.message} />

                    <Button
                        text='물건 업로드'
                        longtype
                        loading={loading}
                        disabled={!formState.isValid || loading}
                        onClick={handleSubmit(onValid)}
                    />
                </form>
            </FormLayout >
        </MainLayout>
    )
}
