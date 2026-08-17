const BASE_URL = import.meta.env.VITE_API_BASE_URL

export default BASE_URL
// import axios from 'axios'

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
// })

// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token')
//     if(token) {
//         config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
// })

// export default api