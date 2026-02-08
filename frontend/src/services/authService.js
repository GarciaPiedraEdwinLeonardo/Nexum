import axiosInstance from '../config/axiosConfig';

/**
 * Servicio de autenticación
 * Contiene todas las llamadas al backend relacionadas con auth
 */
const authService = {
    /**
     * Registrar nuevo usuario
     * @param {Object} userData - { name, email, password }
     * @returns {Promise}
     */
    register: async (userData) => {
        try {
            const response = await axiosInstance.post('/auth/register', {
                name: userData.name,
                email: userData.email,
                password: userData.password
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al registrar usuario' };
        }
    },

    /**
     * Iniciar sesión
     * @param {Object} credentials - { email, password }
     * @returns {Promise}
     */
    login: async (credentials) => {
        try {
            const response = await axiosInstance.post('/auth/login', {
                email: credentials.email,
                password: credentials.password
            });
            
            // Guardar token y usuario en localStorage
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al iniciar sesión' };
        }
    },

    /**
     * Cerrar sesión
     * @returns {Promise}
     */
    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            
            // Limpiar localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            
            return { success: true };
        } catch (error) {
            // Limpiar localStorage aunque falle la petición
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            
            throw error.response?.data || { message: 'Error al cerrar sesión' };
        }
    },

    /**
     * Verificar email con token
     * @param {string} token - Token de verificación
     * @returns {Promise}
     */
    verifyEmail: async (token) => {
        try {
            const response = await axiosInstance.post(`/auth/verify-email/${token}`);
            
            // Guardar token y usuario si viene en la respuesta
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al verificar email' };
        }
    },

    /**
     * Reenviar email de verificación
     * @param {string} email - Email del usuario
     * @returns {Promise}
     */
    resendVerificationEmail: async (email) => {
        try {
            const response = await axiosInstance.post('/auth/resend-verification', {
                email: email
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al reenviar email' };
        }
    },

    /**
     * Solicitar recuperación de contraseña
     * @param {string} email - Email del usuario
     * @returns {Promise}
     */
    forgotPassword: async (email) => {
        try {
            const response = await axiosInstance.post('/auth/forgot-password', {
                email: email
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al solicitar recuperación' };
        }
    },

    /**
     * Resetear contraseña con token
     * @param {string} token - Token de recuperación
     * @param {string} newPassword - Nueva contraseña
     * @returns {Promise}
     */
    resetPassword: async (token, newPassword) => {
        try {
            const response = await axiosInstance.post(`/auth/reset-password/${token}`, {
                password: newPassword
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al resetear contraseña' };
        }
    },

    /**
     * Obtener perfil del usuario autenticado
     * @returns {Promise}
     */
    getProfile: async () => {
        try {
            const response = await axiosInstance.get('/auth/profile');
            
            // Actualizar usuario en localStorage
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener perfil' };
        }
    },

    /**
     * Verificar si el usuario está autenticado
     * @returns {boolean}
     */
    isAuthenticated: () => {
        const token = localStorage.getItem('authToken');
        return !!token;
    },

    /**
     * Obtener usuario del localStorage
     * @returns {Object|null}
     */
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (error) {
                return null;
            }
        }
        return null;
    }
};

export default authService;