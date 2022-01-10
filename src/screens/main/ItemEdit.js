/* 
작성자 : SJ
작성일 : 2022.01.10
수정일 : ------
*/

import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import FormLayout from '../../components/auth/FormLayout';
import Button from '../../components/shared/Button';
import FormError from '../../components/shared/FormError';
import Input from '../../components/shared/Input';
import { colors } from '../../utils/styles';

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

const EDIT_ITEM = gql`
    mutation editItem($id:Int!,$title:String,$description:String,$file:Upload){
        editItem(id:$id,title:$title,description:$description,file:$file){
            ok
            error
        }
    }
`

export default function ItemEdit() {
    const { id } = useParams()
    const history = useHistory()

    const { register, handleSubmit, formState, clearErrors, watch } = useForm({
        mode: "onChange"
    })
    const clearError = () => clearErrors()

    // editItem Mutation 실행과 실행 후의 처리 함수
    const editItemCompleted = ({ editItem }) => {
        const { ok, error } = editItem
        if (!ok) {
            alert(error)
            return;
        }
        history.push(`/item/${id}`)
    }
    const [editItem, { loading }] = useMutation(EDIT_ITEM, {
        onCompleted: editItemCompleted
    })

    const onValid = (data) => {
        if (loading) return;

        const { file, title, description } = data

        editItem({
            variables: {
                id: parseInt(id),
                ...(file && { file }),
                ...(title && { title }),
                ...(description && { description })
            }
        })
    }

    return (
        <FormLayout title="수정 중">
            <form onSubmit={handleSubmit(onValid)}>
                <FileInput htmlFor="file-input">
                    이미지 업로드
                    <input id="file-input"
                        {...register("file")}
                        type="file"
                    />
                </FileInput>
                {watch("file")?.length > 0 ? (
                    <span>저장 되었습니다.</span>
                ) : null}
                <Input
                    onChange={clearError}
                    {...register("title", {
                        minLength: {
                            value: 2,
                            message: "제목은 2글자 이상이어야 합니다."
                        }
                    })}
                    placeholder="제목을 입력하세요."
                    isError={Boolean(formState.errors?.title?.message)}
                />
                <FormError text={formState.errors?.title?.message} />
                <Input
                    onChange={clearError}
                    {...register("description", {
                        minLength: {
                            value: 2,
                            message: "제목은 2글자 이상이어야 합니다."
                        },
                        maxLength: {
                            value: 299,
                            message: "설명글은 300자 미만이어야 합니다."
                        }
                    })}
                    placeholder="설명글을 입력하세요."
                    isError={Boolean(formState.errors?.description?.message)}
                />
                <FormError text={formState.errors?.description?.message} />
                <Button
                    text='물건 정보 수정'
                    isLong
                    loading={loading}
                    disabled={!formState.isValid || loading}
                    onClick={handleSubmit(onValid)}
                />
            </form>
        </FormLayout>
    )
}