const express = require('express');
const router = express.Router();

const {
    getStats,
    getLogs,
    getMonthlyStats,
    cleanupLogs,
    checkLimit
} = require('../controllers/emailAdminController');

const { auth, requireRole } = require('../middleware/auth');

/**
 * Todas las rutas requieren autenticación y rol de admin
 */

/**
 * @route   GET /api/admin/emails/stats
 * @desc    Obtener estadísticas de emails del día
 * @access  Private (Admin)
 */
router.get('/stats', auth, requireRole('admin'), getStats);

/**
 * @route   GET /api/admin/emails/logs
 * @desc    Obtener logs recientes de emails
 * @access  Private (Admin)
 */
router.get('/logs', auth, requireRole('admin'), getLogs);

/**
 * @route   GET /api/admin/emails/monthly
 * @desc    Obtener estadísticas mensuales
 * @access  Private (Admin)
 */
router.get('/monthly', auth, requireRole('admin'), getMonthlyStats);

/**
 * @route   GET /api/admin/emails/limit
 * @desc    Verificar estado del límite diario
 * @access  Private (Admin)
 */
router.get('/limit', auth, requireRole('admin'), checkLimit);

/**
 * @route   POST /api/admin/emails/cleanup
 * @desc    Limpiar logs antiguos (>30 días)
 * @access  Private (Admin)
 */
router.post('/cleanup', auth, requireRole('admin'), cleanupLogs);

module.exports = router;