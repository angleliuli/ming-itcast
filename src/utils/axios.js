// 封装 axios

// 引入 axios
import axios from 'axios'

// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 导出
export default axios
