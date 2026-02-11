const rateLimit = require('express-rate-limit');

/**
 * Rate limiter general para la API
 */
const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requests
    message: {
        success: false,
        message: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Demasiadas peticiones, por favor intenta más tarde',
            retryAfter: Math.ceil(req.rateLimit.resetTime - Date.now() / 1000)
        });
    }
});

/**
 * Rate limiter estricto para autenticación
 */
const authLimiter = rateLimit({
    windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
    max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 5, // 5 intentos
    skipSuccessfulRequests: true, // No contar requests exitosos
    message: {
        success: false,
        message: 'Demasiados intentos de inicio de sesión, por favor intenta más tarde'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        console.warn(`🚨 Rate limit excedido para IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            message: 'Demasiados intentos fallidos. Tu IP ha sido bloqueada temporalmente.',
            retryAfter: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000)
        });
    }
});

/**
 * Rate limiter para registro de usuarios
 */
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 3, // 3 registros por hora
    message: {
        success: false,
        message: 'Demasiados registros desde esta IP, por favor intenta más tarde'
    },
    skipSuccessfulRequests: false,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Has excedido el límite de registros. Intenta nuevamente en 1 hora.'
        });
    }
});

/**
 * Rate limiter para reseteo de contraseña
 */
const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 3, // 3 solicitudes por hora
    message: {
        success: false,
        message: 'Demasiadas solicitudes de reseteo de contraseña'
    },
    skipSuccessfulRequests: false,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Has excedido el límite de solicitudes. Intenta nuevamente en 1 hora.'
        });
    }
});

/**
 * Rate limiter para reenvío de emails de verificación
 */
const resendEmailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 2, // 2 reenvíos cada 15 minutos
    message: {
        success: false,
        message: 'Demasiadas solicitudes de reenvío de email'
    },
    skipSuccessfulRequests: false,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Has excedido el límite de reenvíos. Espera 15 minutos.'
        });
    }
});

module.exports = {
    apiLimiter,
    authLimiter,
    registerLimiter,
    passwordResetLimiter,
    resendEmailLimiter
};