import axios, { AxiosError } from 'axios'
import store from '../redux/store'


const baseUrl = 'https://e-field.vercel.app/api/'

const ApiWithAuth = axios.create({baseURL : baseUrl})


// sebelum request dikirim
ApiWithAuth.interceptors.request.use(
    (config) => {
        // console.log("asdqweqwe",config)
        const token = store.getState().auth.token
        config.data = {...config.data};
        config.headers['x-access-token'] = token
        return config
    },
    (error) => Promise.reject(error)
)


// sesudah dia ngehit API
// ApiWithAuth.interceptors.response.use()

export { ApiWithAuth }