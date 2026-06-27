import axios, { AxiosError, type AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const Api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

Api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

Api.interceptors.response.use(
    (response: AxiosResponse) => {

        return response;
    },
    (error: AxiosError) => {
        const excludedEndpoints = ['/login'];
        const shouldSkip = excludedEndpoints.some(endpoint =>
            error.config?.url?.includes(endpoint)
        );

        if (shouldSkip) return Promise.reject(error);

        if (error.response?.status === 401) {
            Cookies.remove('token');
            Cookies.remove('user');
            Cookies.remove('permissions');

            window.location.href = '/login'
        } else if (error.response?.status === 403) {
            const isAdminRoute = error.config?.url?.includes('/admin');
            if (isAdminRoute) {
                window.location.href = '/admin/forbidden'
            }

            return Promise.reject(error);
        } else {
            return Promise.reject(error);
        }
    }
);

export default Api;