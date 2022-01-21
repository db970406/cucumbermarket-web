/* 
작성자 : SJ
작성일 : 2022.01.10
수정일 : 2022.01.21
*/

// 클릭한 Item의 id를 받아 editItem Mutation으로 수정하는 페이지

import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import FormLayout from '../../../components/layouts/FormLayout';
import ItemPhoto from '../../../components/main/items/ItemPhoto';
import MainLayout from '../../../components/layouts/MainLayout';
import PhotoSlider from '../../../components/main/items/PhotoSlider';
import Button from '../../../components/shared/buttons/Button';
import InputError from '../../../components/shared/form/InputError';
import Input from '../../../components/shared/form/Input';
import useItemIsMine from '../../../hooks/useItemIsMine';
import { colors } from '../../../utils/styles';
import { useState, useEffect } from "react"

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
    margin-right:5px;
`

const Container = styled.div`
    max-width:600px;
    width:100%;
    margin:0 auto;
`

const EDIT_ITEM = gql`
    mutation editItem($id:Int!,$title:String,$description:String,$file:Upload){
        editItem(id:$id,title:$title,description:$description,file:$file){
            id
            title
            description
            itemPhotos{
                id
                file
            }
        }
    }
`

export default function EditItem() {
    const [itemData, setItemData] = useState({})

    const { id } = useParams()

    // 아이템의 소유자가 아니면 되돌려보내는 hook
    const { data, loading } = useItemIsMine(id)

    const history = useHistory()
    const { register, handleSubmit, formState, clearErrors, watch } = useForm({
        mode: "onChange",
    })
    const clearError = () => clearErrors()

    // editItem Mutation 실행과 실행 후의 cache 처리를 위한 함수
    const updateEditItem = (cache, { data }) => {
        const { editItem } = data
        if (editItem.id) {
            cache.modify({
                id: `Item:${id}`,
                fields: {
                    title(prev) {
                        return editItem.title
                    },
                    description(prev) {
                        return editItem.description
                    },
                    itemPhotos(prev) {
                        return editItem.itemPhotos
                    }
                }
            })
            history.push(`/item/${id}`)
        }
    }
    const [editItem] = useMutation(EDIT_ITEM, {
        update: updateEditItem
    })

    const onValid = (data) => {
        if (loading) return;
        const { file, title, description } = data
        editItem({
            variables: {
                id: parseInt(id),
                ...(file.length > 0 && { file }),
                ...(title && { title }),
                ...(description && { description })
            }
        })
    }

    useEffect(() => {
        setItemData(data)
    }, [data])
    return (
        <MainLayout title="수정 중" loading={loading}>
            <Container>
                <PhotoSlider>
                    {itemData?.seeItem?.itemPhotos?.map(photo =>
                        <ItemPhoto
                            editMode
                            key={photo.id}
                            itemId={id}
                            id={photo.id}
                            src={photo.file}
                            maxHeight={400}
                        />
                    )}
                </PhotoSlider>
            </Container>
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
                        defaultValue={itemData?.seeItem?.title}
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
                    <InputError text={formState.errors?.title?.message} />
                    <Input
                        defaultValue={itemData?.seeItem?.description}
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
                        text='물건 정보 수정'
                        longtype
                        loading={loading}
                        disabled={!formState.isValid || loading}
                        onClick={handleSubmit(onValid)}
                    />
                </form>
            </FormLayout>
        </MainLayout>
    )
}