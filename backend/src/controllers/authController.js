const jwt = require('jsonwebtoken');
const User = require('../models/User');
const VerificationToken = require('../models/VerificationToken');
const PasswordResetToken = require('../models/PasswordResetToken');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../config/email');

/**
 * Generar JWT token
 */
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
 */
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Este email ya está registrado'
            });
        }

        // Crear usuario
        const user = await User.create({ name, email, password });

        // Crear token de verificación
        const verificationToken = await VerificationToken.create(user.id);

        // Enviar email de verificación
        try {
            await sendVerificationEmail(email, verificationToken.token, name);
            console.log(`✅ Email de verificación enviado a: ${email}`);
        } catch (emailError) {
            console.error('Error al enviar email de verificación:', emailError);
            // No fallar el registro si el email no se envía
        }

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente. Por favor verifica tu email.',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    isVerified: user.is_verified
                }
            }
        });

    } catch (error) {
        console.error('Error en register:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al registrar usuario'
        });
    }
};

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Public
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar si la cuenta está bloqueada
        const isLocked = await User.isAccountLocked(user.id);
        if (isLocked) {
            return res.status(403).json({
                success: false,
                message: 'Tu cuenta está temporalmente bloqueada por múltiples intentos fallidos. Intenta más tarde.'
            });
        }

        // Verificar si está suspendido
        if (user.role_name === 'suspended') {
            return res.status(403).json({
                success: false,
                message: 'Tu cuenta ha sido suspendida. Contacta al administrador.'
            });
        }

        // Verificar contraseña
        const isValidPassword = await User.verifyPassword(password, user.password_hash);
        if (!isValidPassword) {
            // Incrementar intentos fallidos
            await User.incrementLoginAttempts(user.id);
            
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Reset intentos de login
        await User.resetLoginAttempts(user.id);

        // Generar token
        const token = generateToken(user.id);

        res.json({
            success: true,
            message: 'Inicio de sesión exitoso',
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role_name,
                    roleDisplayName: user.role_display_name,
                    isVerified: user.is_verified,
                    profilePicture: user.profile_picture_url
                }
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión'
        });
    }
};

/**
 * @route   POST /api/auth/verify-email/:token
 * @desc    Verificar email con token
 * @access  Public
 */
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        // Buscar y validar token
        const tokenData = await VerificationToken.findAndValidate(token);
        if (!tokenData) {
            return res.status(400).json({
                success: false,
                message: 'Token de verificación inválido o expirado'
            });
        }

        // Verificar si ya está verificado
        if (tokenData.is_verified) {
            return res.status(400).json({
                success: false,
                message: 'Este email ya ha sido verificado'
            });
        }

        // Marcar usuario como verificado
        await User.markAsVerified(tokenData.user_id);

        // Marcar token como usado
        await VerificationToken.markAsUsed(tokenData.id);

        // Generar token JWT para login automático
        const jwtToken = generateToken(tokenData.user_id);

        res.json({
            success: true,
            message: 'Email verificado exitosamente',
            data: {
                token: jwtToken,
                user: {
                    id: tokenData.user_id,
                    name: tokenData.name,
                    email: tokenData.email,
                    isVerified: true
                }
            }
        });

    } catch (error) {
        console.error('Error en verifyEmail:', error);
        res.status(500).json({
            success: false,
            message: 'Error al verificar email'
        });
    }
};

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Reenviar email de verificación
 * @access  Public
 */
const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;

        // Buscar usuario
        const user = await User.findByEmail(email);
        if (!user) {
            // No revelar si el usuario existe o no
            return res.json({
                success: true,
                message: 'Si el email existe, recibirás un correo de verificación'
            });
        }

        // Verificar si ya está verificado
        if (user.is_verified) {
            return res.status(400).json({
                success: false,
                message: 'Este email ya ha sido verificado'
            });
        }

        // Crear nuevo token
        const verificationToken = await VerificationToken.create(user.id);

        // Enviar email
        try {
            await sendVerificationEmail(email, verificationToken.token, user.name);
            console.log(`✅ Email de verificación reenviado a: ${email}`);
        } catch (emailError) {
            console.error('Error al reenviar email:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Error al enviar el correo electrónico'
            });
        }

        res.json({
            success: true,
            message: 'Email de verificación enviado exitosamente'
        });

    } catch (error) {
        console.error('Error en resendVerification:', error);
        res.status(500).json({
            success: false,
            message: 'Error al reenviar email de verificación'
        });
    }
};

// CONTINÚA EN PARTE 2...
// CONTINUACIÓN DE authController_part1.js

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Solicitar reseteo de contraseña
 * @access  Public
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Buscar usuario
        const user = await User.findByEmail(email);
        
        // Por seguridad, siempre responder lo mismo (no revelar si existe el usuario)
        if (!user) {
            return res.json({
                success: true,
                message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña'
            });
        }

        // Obtener IP y User Agent para seguridad
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];

        // Crear token de reset
        const resetToken = await PasswordResetToken.create(user.id, ipAddress, userAgent);

        // Enviar email
        try {
            await sendPasswordResetEmail(email, resetToken.token, user.name);
            console.log(`✅ Email de reset enviado a: ${email}`);
        } catch (emailError) {
            console.error('Error al enviar email de reset:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Error al enviar el correo electrónico'
            });
        }

        res.json({
            success: true,
            message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña'
        });

    } catch (error) {
        console.error('Error en forgotPassword:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar solicitud'
        });
    }
};

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Resetear contraseña con token
 * @access  Public
 */
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Buscar y validar token
        const tokenData = await PasswordResetToken.findAndValidate(token);
        if (!tokenData) {
            return res.status(400).json({
                success: false,
                message: 'Token de reseteo inválido o expirado'
            });
        }

        // Actualizar contraseña
        await User.updatePassword(tokenData.user_id, password);

        // Marcar token como usado
        await PasswordResetToken.markAsUsed(tokenData.id);

        // Resetear intentos de login por si estaba bloqueado
        await User.resetLoginAttempts(tokenData.user_id);

        res.json({
            success: true,
            message: 'Contraseña actualizada exitosamente'
        });

    } catch (error) {
        console.error('Error en resetPassword:', error);
        res.status(500).json({
            success: false,
            message: 'Error al resetear contraseña'
        });
    }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión
 * @access  Private
 */
const logout = async (req, res) => {
    try {
        // En una implementación con tokens en DB, aquí se invalidaría el token
        // Por ahora, solo confirmamos el logout (el frontend debe borrar el token)
        
        res.json({
            success: true,
            message: 'Sesión cerrada exitosamente'
        });

    } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cerrar sesión'
        });
    }
};

/**
 * @route   GET /api/auth/profile
 * @desc    Obtener perfil del usuario autenticado
 * @access  Private
 */
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Obtener permisos del usuario
        const permissions = await User.getPermissions(user.id);

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role_name,
                    roleDisplayName: user.role_display_name,
                    isVerified: user.is_verified,
                    profilePicture: user.profile_picture_url,
                    lastLogin: user.last_login_at,
                    createdAt: user.created_at,
                    permissions: permissions.map(p => ({
                        name: p.name,
                        displayName: p.display_name,
                        category: p.category
                    }))
                }
            }
        });

    } catch (error) {
        console.error('Error en getProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener perfil'
        });
    }
};

/**
 * @route   PUT /api/auth/profile
 * @desc    Actualizar perfil del usuario
 * @access  Private
 */
const updateProfile = async (req, res) => {
    try {
        const updates = {};
        
        if (req.body.name) updates.name = req.body.name;
        if (req.body.profile_picture_url) updates.profile_picture_url = req.body.profile_picture_url;

        const updatedUser = await User.updateProfile(req.user.id, updates);

        res.json({
            success: true,
            message: 'Perfil actualizado exitosamente',
            data: {
                user: updatedUser
            }
        });

    } catch (error) {
        console.error('Error en updateProfile:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al actualizar perfil'
        });
    }
};

/**
 * @route   GET /api/auth/me
 * @desc    Verificar estado de autenticación (similar a /profile pero más ligero)
 * @access  Private
 */
const me = async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                user: {
                    id: req.user.id,
                    email: req.user.email,
                    name: req.user.name,
                    role: req.user.role,
                    isVerified: req.user.isVerified
                }
            }
        });
    } catch (error) {
        console.error('Error en me:', error);
        res.status(500).json({
            success: false,
            message: 'Error al verificar autenticación'
        });
    }
};

module.exports = {
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
};