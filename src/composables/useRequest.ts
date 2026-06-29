import axios from 'axios'

const instance = axios.create({
  baseURL: '/api'
})

// 请求拦截器：自动带上 token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：自动解包，直接返回 data.data
instance.interceptors.response.use(
  (res) => {
    if (res.data.code === 200) {
      return res.data.data
    } else {
      return Promise.reject(new Error(res.data.message || '请求失败'))
    }
  },
  (err) => {
    return Promise.reject(err)
  }
)

// 导出简化版的 http 方法，返回 Promise<any>
// 因为拦截器已经解包了响应，TypeScript 不知道，所以用 as Promise<any> 告诉它
const http = {
  get: (url: string, config?: any) => instance.get(url, config) as Promise<any>,
  post: (url: string, data?: any, config?: any) => instance.post(url, data, config) as Promise<any>,
  put: (url: string, data?: any, config?: any) => instance.put(url, data, config) as Promise<any>,
  delete: (url: string, config?: any) => instance.delete(url, config) as Promise<any>,
}

export default http
