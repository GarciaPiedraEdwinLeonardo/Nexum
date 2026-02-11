const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware para verificar token JWT
 */
const auth = async (req, res, next) => {
    try {
        // Obtener token del header Authorization
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No se proporcionó token de autenticación'
            });
        }

        const token = authHeader.substring(7); // Remover "Bearer "

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar usuario
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Verificar si la cuenta está bloqueada
        const isLocked = await User.isAccountLocked(user.id);
        if (isLocked) {
            return res.status(403).json({
                success: false,
                message: 'Tu cuenta está temporalmente bloqueada'
            });
        }

        // Agregar usuario al request
        req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role_name,
            roleId: user.role_id,
            isVerified: user.is_verified
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado'
            });
        }

        console.error('Error en middleware auth:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al verificar autenticación'
        });
    }
};

/**
 * Middleware para verificar que el email está verificado
 */
const requireVerified = (req, res, next) => {
    if (!req.user.isVerified) {
        return res.status(403).json({
            success: false,
            message: 'Debes verificar tu email para acceder a este recurso'
        });
    }
    next();
};

/**
 * Middleware para verificar roles
 * @param {Array} allowedRoles - Array de roles permitidos
 */
const requireRole = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'No autenticado'
                });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para acceder a este recurso'
                });
            }

            next();
        } catch (error) {
            console.error('Error en requireRole:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al verificar permisos'
            });
        }
    };
};

/**
 * Middleware para verificar permisos específicos
 * @param {String} permission - Nombre del permiso requerido
 */
const requirePermission = (permission) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'No autenticado'
                });
            }

            // Verificar si el usuario tiene el permiso
            const hasPermission = await User.hasPermission(req.user.id, permission);

            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para realizar esta acción'
                });
            }

            next();
        } catch (error) {
            console.error('Error en requirePermission:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al verificar permisos'
            });
        }
    };
};

/**
 * Middleware opcional de autenticación (no requiere token, pero lo procesa si existe)
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(); // Continuar sin autenticación
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (user) {
            req.user = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role_name,
                roleId: user.role_id,
                isVerified: user.is_verified
            };
        }

        next();
    } catch (error) {
        // Ignorar errores y continuar sin autenticación
        next();
    }
};

module.exports = {
    auth,
    requireVerified,
    requireRole,
    requirePermission,
    optionalAuth
};