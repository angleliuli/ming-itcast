// 引入封装后的 axios
import axios from '@/utils/axios.js'

export const getAllRoleList = () => axios.get('roles')
