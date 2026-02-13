require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');

// Importar configuraciones
const { testConnection, closePool } = require('./config/database');
const { verifyEmailConfig } = require('./config/email');

// Importar rutas
const authRoutes = require('./routes/auth');
const emailAdminRoutes = require('./routes/emailAdmin')

// Importar middlewares
const { apiLimiter } = require('./middleware/rateLimiter');

// Crear app
const app = express();

// ============================================
// MIDDLEWARES GLOBALES
// ============================================

// Seguridad
app.use(helmet());

// CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parseo de body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookies
app.use(cookieParser());

// Compresión
app.use(compression());

// Logging (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Rate limiting general
app.use(apiLimiter);

// ============================================
// RUTAS
// ============================================

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Nexum API',
        version: '1.0.0',
        documentation: '/api/docs'
    });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);
app.use('/api/admin/emails', emailAdminRoutes);

// ============================================
// MANEJO DE ERRORES
// ============================================

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        path: req.originalUrl
    });
});

// Error handler global
app.use((err, req, res, next) => {
    console.error('❌ Error no manejado:', err);

    // Error de validación de Joi/express-validator
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Error de validación',
            errors: err.details || err.errors
        });
    }

    // Error de JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expirado'
        });
    }

    // Error de PostgreSQL
    if (err.code && err.code.startsWith('23')) {
        return res.status(400).json({
            success: false,
            message: 'Error de base de datos',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }

    // Error genérico
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err : undefined
    });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Verificar conexión a base de datos
        console.log('🔄 Verificando conexión a PostgreSQL...');
        const dbConnected = await testConnection();
        
        if (!dbConnected) {
            console.error('❌ No se pudo conectar a la base de datos');
            console.error('💡 Verifica las credenciales en tu archivo .env');
            process.exit(1);
        }

        // Verificar configuración de email
        console.log('🔄 Verificando configuración de email...');
        const emailConfigured = verifyEmailConfig();
        
        if (!emailConfigured) {
            console.warn('⚠️  Email no configurado. Los correos no se enviarán.');
            console.warn('💡 Configura BREVO_API_KEY en tu archivo .env');
        }

        // Iniciar servidor
        const server = app.listen(PORT, () => {
            console.log('\n' + '='.repeat(50));
            console.log('✅ Servidor Nexum iniciado correctamente');
            console.log('='.repeat(50));
            console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🚀 Puerto: ${PORT}`);
            console.log(`📡 API: http://localhost:${PORT}`);
            console.log(`💊 Health: http://localhost:${PORT}/health`);
            console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
            console.log('='.repeat(50) + '\n');
        });

        // Manejo de cierre graceful
        const gracefulShutdown = async () => {
            console.log('\n🔄 Cerrando servidor gracefully...');
            
            server.close(async () => {
                console.log('✅ Servidor HTTP cerrado');
                
                try {
                    await closePool();
                    console.log('✅ Conexiones de base de datos cerradas');
                    console.log('👋 Servidor cerrado correctamente');
                    process.exit(0);
                } catch (error) {
                    console.error('❌ Error al cerrar conexiones:', error);
                    process.exit(1);
                }
            });

            // Forzar cierre después de 10 segundos
            setTimeout(() => {
                console.error('⚠️  Forzando cierre del servidor...');
                process.exit(1);
            }, 10000);
        };

        // Escuchar señales de terminación
        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);

        // Manejo de errores no capturados
        process.on('uncaughtException', (error) => {
            console.error('❌ Uncaught Exception:', error);
            gracefulShutdown();
        });

        process.on('unhandledRejection', (reason, promise) => {
            console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
            gracefulShutdown();
        });

    } catch (error) {
        console.error('❌ Error fatal al iniciar servidor:', error);
        process.exit(1);
    }
};

// Iniciar servidor
startServer();

module.exports = app;