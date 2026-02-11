const { body, validationResult } = require('express-validator');

/**
 * Middleware para manejar errores de validación
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    
    next();
};

/**
 * Validaciones para registro
 */
const validateRegister = [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre es requerido')
        .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Debe ser un email válido')
        .isLength({ max: 60 }).withMessage('El email no puede tener más de 60 caracteres')
        .custom((value) => {
            if (!value.endsWith('@alumno.ipn.mx')) {
                throw new Error('Solo se permiten correos institucionales (@alumno.ipn.mx)');
            }
            return true;
        })
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 8, max: 20 }).withMessage('La contraseña debe tener entre 8 y 20 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe contener mayúsculas, minúsculas y números'),
    
    handleValidationErrors
];

/**
 * Validaciones para login
 */
const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Debe ser un email válido')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('La contraseña es requerida'),
    
    handleValidationErrors
];

/**
 * Validaciones para forgot password
 */
const validateForgotPassword = [
    body('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Debe ser un email válido')
        .normalizeEmail(),
    
    handleValidationErrors
];

/**
 * Validaciones para reset password
 */
const validateResetPassword = [
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 8, max: 20 }).withMessage('La contraseña debe tener entre 8 y 20 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe contener mayúsculas, minúsculas y números'),
    
    handleValidationErrors
];

/**
 * Validaciones para resend verification
 */
const validateResendVerification = [
    body('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Debe ser un email válido')
        .normalizeEmail(),
    
    handleValidationErrors
];

/**
 * Validaciones para actualizar perfil
 */
const validateUpdateProfile = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
    
    body('profile_picture_url')
        .optional()
        .trim()
        .isURL().withMessage('Debe ser una URL válida')
        .isLength({ max: 500 }).withMessage('La URL no puede tener más de 500 caracteres'),
    
    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validateForgotPassword,
    validateResetPassword,
    validateResendVerification,
    validateUpdateProfile,
    handleValidationErrors
};