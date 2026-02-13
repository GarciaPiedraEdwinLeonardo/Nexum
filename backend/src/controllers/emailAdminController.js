const EmailLog = require('../models/EmailLog');
const { getEmailStats, DAILY_EMAIL_LIMIT } = require('../config/email');

/**
 * @route   GET /api/admin/email-stats
 * @desc    Obtener estadísticas de emails
 * @access  Private (Admin only)
 */
const getStats = async (req, res) => {
    try {
        const stats = await getEmailStats();
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas de emails'
        });
    }
};

/**
 * @route   GET /api/admin/email-logs
 * @desc    Obtener logs recientes de emails
 * @access  Private (Admin only)
 */
const getLogs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const logs = await EmailLog.getRecentLogs(limit);
        
        res.json({
            success: true,
            data: {
                logs,
                total: logs.length
            }
        });
    } catch (error) {
        console.error('Error al obtener logs:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener logs de emails'
        });
    }
};

/**
 * @route   GET /api/admin/email-monthly
 * @desc    Obtener estadísticas mensuales
 * @access  Private (Admin only)
 */
const getMonthlyStats = async (req, res) => {
    try {
        const stats = await EmailLog.getMonthlyStats();
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error al obtener estadísticas mensuales:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas mensuales'
        });
    }
};

/**
 * @route   POST /api/admin/email-cleanup
 * @desc    Limpiar logs antiguos
 * @access  Private (Admin only)
 */
const cleanupLogs = async (req, res) => {
    try {
        const deleted = await EmailLog.cleanupOldLogs();
        
        res.json({
            success: true,
            message: `${deleted} logs antiguos eliminados`
        });
    } catch (error) {
        console.error('Error al limpiar logs:', error);
        res.status(500).json({
            success: false,
            message: 'Error al limpiar logs'
        });
    }
};

/**
 * @route   GET /api/admin/email-limit
 * @desc    Verificar estado del límite diario
 * @access  Private (Admin only)
 */
const checkLimit = async (req, res) => {
    try {
        const limitStatus = await EmailLog.canSendEmail();
        
        res.json({
            success: true,
            data: {
                ...limitStatus,
                percentage: ((limitStatus.count / limitStatus.limit) * 100).toFixed(2),
                status: limitStatus.remaining < 50 ? 'warning' : 
                       limitStatus.remaining === 0 ? 'critical' : 'ok'
            }
        });
    } catch (error) {
        console.error('Error al verificar límite:', error);
        res.status(500).json({
            success: false,
            message: 'Error al verificar límite'
        });
    }
};

module.exports = {
    getStats,
    getLogs,
    getMonthlyStats,
    cleanupLogs,
    checkLimit
};