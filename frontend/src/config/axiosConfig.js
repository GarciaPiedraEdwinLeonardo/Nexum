import axios from 'axios';

// URL base de tu API - Cambiar cuando tengas el backend desplegado
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Crear instancia de axios
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000, // 10 segundos
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para agregar el token a cada petición
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Si el token expiró o es inválido
        if (error.response?.status === 401) {
            // Limpiar localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            
            // Redirigir a login (solo si no estamos ya en login)
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;