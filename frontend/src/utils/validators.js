export const MIN_NAME_LENGTH = 3;
export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 60; 
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 20;

/**
 * Validates an email address.
 * @param {string} email - The email to validate.
 * @returns {string|null} - Error message or null if valid.
 */
export const validateEmail = (email) => {
    if (!email) {
        return 'El correo electrónico es requerido';
    }
    if (email.length > MAX_EMAIL_LENGTH) {
        return `El correo no puede tener más de ${MAX_EMAIL_LENGTH} caracteres`;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        return 'El correo electrónico no es válido';
    }
    // if (!email.endsWith('@alumno.ipn.mx')) {
    //     return 'Solo se permiten correos institucionales (@alumno.ipn.mx)';
    // }
    return null;
};

/**
 * Validates a password.
 * @param {string} password - The password to validate.
 * @returns {string|null} - Error message or null if valid.
 */
export const validatePassword = (password) => {
    if (!password) {
        return 'La contraseña es requerida';
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
        return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`;
    }
    if (password.length > MAX_PASSWORD_LENGTH) {
        return `La contraseña no puede tener más de ${MAX_PASSWORD_LENGTH} caracteres`;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        return 'Debe contener mayúsculas, minúsculas y números';
    }
    return null;
};

/**
 * Validates a password confirmation.
 * @param {string} password - The original password.
 * @param {string} confirmPassword - The password confirmation.
 * @returns {string|null} - Error message or null if valid.
 */
export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
        return 'Debes confirmar tu contraseña';
    }
    if (password !== confirmPassword) {
        return 'Las contraseñas no coinciden';
    }
    return null;
};

/**
 * Validates a name.
 * @param {string} name - The name to validate.
 * @returns {string|null} - Error message or null if valid.
 */
export const validateName = (name) => {
    if (!name || !name.trim()) {
        return 'El nombre es requerido';
    }
    if (name.trim().length < MIN_NAME_LENGTH) {
        return `El nombre debe tener al menos ${MIN_NAME_LENGTH} caracteres`;
    }
    if (name.length > MAX_NAME_LENGTH) {
        return `El nombre no puede tener más de ${MAX_NAME_LENGTH} caracteres`;
    }
    return null;
};
