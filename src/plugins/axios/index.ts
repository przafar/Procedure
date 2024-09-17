import axios from 'axios'
import config from '../../config'
import router from '../../router'

const BASE_URL = config.VITE_ENV === 'dev' ? config.VITE_API_BASE_URL_DEV : config.VITE_API_BASE_URL_PROD

// Ensure the baseURL has the correct protocol
const instance = axios.create({
  baseURL: 'http://localhost:3001/api/',
  timeout: 200000,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
  },
})

//send token header
instance.interceptors.request.use(
  function (config) {
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
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

//404 or 401 error use this response
instance.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      router.push({ name: 'login' })
      // const authStorage = authStore();
      // await authStorage.REFRESH_TOKEN()
    }
    return Promise.reject(error)
  },
)

// Handle error processing with status code 422
instance.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    const { data } = error

    if (error.response && error.response.status === 422) {
      console.log('422 error')
    }
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  function (response) {
    return response
  },
  async function (error) {
    if (error.response && error.response.status === 404) {
      console.log('404 error')
      if (router.currentRoute.value.name.includes('-show')) {
        router.push({ name: 'not-found' })
      }
    }
    return Promise.reject(error)
  },
)

export default instance
