import axios from 'axios';

const isProduction = import.meta.env.VITE_SOFTWARE_ENV === 'production';
const apiUrl = isProduction ? '/api' : import.meta.env.VITE_BACKEND_URL;

const axiosFetch = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    validateStatus: (status) => {
        if(status === 401) {
            return false
        }
        return true
    }
})

axiosFetch.interceptors.request.use((config) => {
    const access_token = localStorage.getItem('access_token');

    if(access_token) {
        config.headers.Authorization = `Bearer ${access_token}`
    }

    return config
}, (error) => Promise.reject(error))

axiosFetch.interceptors.response.use((response) => {
    return response
}, async (error) => {
    const originalRequest = error.config;

    if(error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refresh_token = localStorage.getItem('refresh_token');

        if(!refresh_token) {
            return Promise.reject(error);
        }

        const response = await axiosFetch.post('/auth/refresh-token', {
            refreshToken: refresh_token
        }, { validateStatus: () => true })

        if(response.status >= 400) {
            return Promise.reject(error);
        }

        // setting the new tokens
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);

        axiosFetch.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;

        return axiosFetch(originalRequest);
    }

    return Promise.reject(error);
})

export default axiosFetch;