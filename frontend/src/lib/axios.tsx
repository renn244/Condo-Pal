import axios from 'axios';

const apiUrl = import.meta.env.VITE_BACKEND_URL || 'localhost:5000';
const axiosFetch = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
})

axiosFetch.interceptors.request.use((config) => {
    const access_token = localStorage.getItem('access_token');

    if(access_token) {
        config.headers.Authorization = `Bearer ${access_token}`
    }

    return config
}, (error) => Promise.reject(error))

export default axiosFetch;