import axios from 'axios'
import config from '../../config'
import router from '../../router'

const BASE_URL = config.VITE_ENV === 'dev' ? config.VITE_API_BASE_URL_DEV : config.VITE_API_BASE_URL_PROD

// Ensure the baseURL has the correct protocol
const instance = axios.create({
  baseURL: BASE_URL || 'http://localhost:3001/api/',
  timeout: 10000,  // Reduced timeout
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
  },
})

// Interceptor for adding token and organization headers
instance.interceptors.request.use(
  function (config) {
    try {
      const organization = localStorage.getItem('organization')
      const lang = localStorage.getItem('lang')
      if (organization) {
        config.headers['organization-id'] = organization
      }
      if (lang) {
        config.headers['Accept-Language'] = lang
      }
      const access_token = localStorage.getItem('token')
      if (access_token) {
        config.headers.Authorization = 'Bearer ' + `${access_token}`
      }
    } catch (error) {
      console.error('Error reading localStorage', error)
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

// Response interceptor for handling errors
instance.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (error.response && (error.response.status === 403 || error.response.status === 401)) {
      console.log('401 error, redirecting to login')
      router.push({ name: 'login' })
    } else if (error.response && error.response.status === 404) {
      console.log('404 error, redirecting to not-found')
      router.push({ name: 'not-found' })
    } else if (error.response && error.response.status === 422) {
      console.log('422 error')
    }
    return Promise.reject(error)
  },
)

export default instance
