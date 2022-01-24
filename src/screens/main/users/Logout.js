/* 
작성자 : SJ
작성일 : 2022.01.24
수정일 : ------
*/

import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { logUserOut } from '../../../utils/apollo'

export default function Logout() {
    const history = useHistory()
    useEffect(() => {
        logUserOut(history)
    }, [])
    return null
}