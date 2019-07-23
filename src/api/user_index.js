// 引入封装后的axios
import axios from '@/utils/axios.js'

// 登录验证
export const login = data => {
  // axios 返回一个 promise 对象
  return axios({
    url: 'login',
    method: 'post',
    data
  })
}

// 获取用户数据列表
export const getUserList = obj => axios.get('users', { params: obj })

// 添加用户
export const addUserList = obj => axios.post('users', obj)

// 删除用户
export const delUserList = id => axios.delete(`users/${id}`)

// 编辑用户
export const editUserList = obj => axios.put(`users/${obj.id}`, obj)

// 修改用户状态
export const updateUserState = (id, type) => axios.put(`users/${id}/state/${type}`)

// 分配用户角色
export const allotUserRoleById = (id, rid) => axios.put(`users/${id}/role`, { rid: rid })
