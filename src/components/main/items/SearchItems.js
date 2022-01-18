/* 
작성자 : SJ
작성일 : 2022.01.16
수정일 : ------
*/

// Header에서 사용할 SearchItems Mutation Component

import { gql, useLazyQuery, useReactiveVar } from "@apollo/client"
import Input from '../../shared/form/Input'
import { useForm } from 'react-hook-form'
import { ITEM_DISPLAY_FRAGMENT } from '../../shared/utils/fragments'
import InputWithFontAwesome from '../../shared/form/InputWithFontAwesome'
import { darkModeVar, searchDataVar, searchModeVar } from '../../../utils/apollo'
import { useHistory } from 'react-router-dom'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { colors } from '../../../utils/styles'

const SEARCH_ITEMS = gql`
    query searchItems($keyword:String!){
        searchItems(keyword:$keyword){
            ...ItemDisplayFragment
        }
    }
    ${ITEM_DISPLAY_FRAGMENT}
`

export default function SearchItems() {
    const searchMode = useReactiveVar(searchModeVar)
    const darkMode = useReactiveVar(darkModeVar)
    const history = useHistory()

    // searchItems 구현부
    // searchItems로 받은 data를 Home으로 보내주어 사용할 것이다.
    const { register, handleSubmit, formState, setValue } = useForm({
        mode: "onChange"
    })

    // searchItems 성공 시 searchDataVar를 Reactive Variables로 data를 받아놓는다.
    const searchCompleted = ({ searchItems }) => {
        if (searchItems.length < 1) {
            alert("검색 결과가 없습니다.")
            return
        }
        searchDataVar(searchItems)
        history.push("/")
    }
    const [searchItems, { loading }] = useLazyQuery(SEARCH_ITEMS, {
        onCompleted: searchCompleted
    })
    const onValid = ({ keyword }) => {
        if (loading) return;

        searchItems({
            variables: {
                keyword
            }
        })
        setValue("keyword", "")
    }

    // Reactive Variables를 이용하여 searchMode라면 Input창을, 아니라면 search 버튼을 띄워줄 것이다.
    const getSearchMode = (bool) => searchModeVar(bool)

    return (
        <InputWithFontAwesome
            onClick={formState.isValid && searchMode ? handleSubmit(onValid) : () => getSearchMode(false)}
            icon={faSearch}
            color={darkMode ? colors.white : colors.black}
            size={"lg"}
            disabled={!formState.isValid || loading}
        >
            <Input
                placeholder='동네 등 키워드'
                {...register("keyword", {
                    required: true,
                    minLength: {
                        value: 2,
                        message: "두 글자 이상을 입력하세요."
                    }
                })}
                required
            />
        </InputWithFontAwesome>
    )
}