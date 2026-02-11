const express = require('express');
const router = express.Router();

// Controladores
const {
    register,
    login,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    logout,
    getProfile,
    updateProfile,
    me
} = require('../controllers/authController');

// Middlewares
const { auth } = require('../middleware/auth');
const {
    validateRegister,
    validateLogin,
    validateForgotPassword,
    validateResetPassword,
    validateResendVerification,
    validateUpdateProfile
} = require('../middleware/validation');
const {
    registerLimiter,
    authLimiter,
    passwordResetLimiter,
    resendEmailLimiter
} = require('../middleware/rateLimiter');

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
 */
router.post('/register', registerLimiter, validateRegister, register);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Public
 */
router.post('/login', authLimiter, validateLogin, login);

/**
 * @route   POST /api/auth/verify-email/:token
 * @desc    Verificar email con token
 * @access  Public
 */
router.post('/verify-email/:token', verifyEmail);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Reenviar email de verificación
 * @access  Public
 */
router.post('/resend-verification', resendEmailLimiter, validateResendVerification, resendVerification);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Solicitar reseteo de contraseña
 * @access  Public
 */
router.post('/forgot-password', passwordResetLimiter, validateForgotPassword, forgotPassword);

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Resetear contraseña con token
 * @access  Public
 */
router.post('/reset-password/:token', validateResetPassword, resetPassword);

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión
 * @access  Private
 */
router.post('/logout', auth, logout);

/**
 * @route   GET /api/auth/profile
 * @desc    Obtener perfil completo del usuario autenticado
 * @access  Private
 */
router.get('/profile', auth, getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Actualizar perfil del usuario
 * @access  Private
 */
router.put('/profile', auth, validateUpdateProfile, updateProfile);

/**
 * @route   GET /api/auth/me
 * @desc    Verificar estado de autenticación (ligero)
 * @access  Private
 */
router.get('/me', auth, me);

module.exports = router;