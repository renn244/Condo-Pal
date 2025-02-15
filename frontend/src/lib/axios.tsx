import axios from 'axios';

const apiUrl = import.meta.env.VITE_BACKEND_URL || 'localhost:5000';
const axiosFetch = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default axiosFetch;