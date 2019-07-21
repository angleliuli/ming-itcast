// 引入封装后的axios
import axios from '@/utils/axios.js'

// 登录api
export const login = data => {
  // axios 返回一个 promise 对象
  return axios({
    url: 'login',
    method: 'post',
    data
  })
}
