const { query } = require('../config/database');

class EmailLog {
    /**
     * Registrar un email enviado
     */
    static async log(recipientEmail, emailType, success = true, errorMessage = null) {
        try {
            const result = await query(
                `INSERT INTO email_logs (recipient_email, email_type, success, error_message)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id, sent_at`,
                [recipientEmail, emailType, success, errorMessage]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error al registrar email log:', error);
            // No fallar si el log falla
            return null;
        }
    }

    /**
     * Obtener cantidad de emails enviados hoy
     */
    static async getTodayCount() {
        try {
            const result = await query(
                `SELECT COUNT(*) as count
                 FROM email_logs
                 WHERE sent_at >= CURRENT_DATE
                   AND sent_at < CURRENT_DATE + INTERVAL '1 day'
                   AND success = true`
            );
            return parseInt(result.rows[0].count) || 0;
        } catch (error) {
            console.error('Error al obtener conteo de emails:', error);
            return 0;
        }
    }

    /**
     * Verificar si se puede enviar un email (dentro del límite)
     */
    static async canSendEmail() {
        const limit = parseInt(process.env.DAILY_EMAIL_LIMIT) || 300;
        const todayCount = await this.getTodayCount();
        
        return {
            canSend: todayCount < limit,
            count: todayCount,
            limit: limit,
            remaining: Math.max(0, limit - todayCount)
        };
    }

    /**
     * Obtener estadísticas de emails de hoy
     */
    static async getTodayStats() {
        try {
            const result = await query(
                `SELECT 
                    email_type,
                    COUNT(*) as total,
                    COUNT(*) FILTER (WHERE success = true) as sent,
                    COUNT(*) FILTER (WHERE success = false) as failed
                 FROM email_logs
                 WHERE sent_at >= CURRENT_DATE
                   AND sent_at < CURRENT_DATE + INTERVAL '1 day'
                 GROUP BY email_type`
            );
            return result.rows;
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            return [];
        }
    }

    /**
     * Obtener logs recientes
     */
    static async getRecentLogs(limit = 50) {
        try {
            const result = await query(
                `SELECT id, recipient_email, email_type, success, error_message, sent_at
                 FROM email_logs
                 ORDER BY sent_at DESC
                 LIMIT $1`,
                [limit]
            );
            return result.rows;
        } catch (error) {
            console.error('Error al obtener logs recientes:', error);
            return [];
        }
    }

    /**
     * Limpiar logs antiguos (mantener solo últimos 30 días)
     */
    static async cleanupOldLogs() {
        try {
            const result = await query(
                `DELETE FROM email_logs
                 WHERE sent_at < CURRENT_DATE - INTERVAL '30 days'
                 RETURNING id`
            );
            return result.rowCount;
        } catch (error) {
            console.error('Error al limpiar logs antiguos:', error);
            return 0;
        }
    }

    /**
     * Obtener resumen mensual
     */
    static async getMonthlyStats() {
        try {
            const result = await query(
                `SELECT 
                    DATE(sent_at) as date,
                    COUNT(*) as total,
                    COUNT(*) FILTER (WHERE success = true) as sent,
                    COUNT(*) FILTER (WHERE success = false) as failed
                 FROM email_logs
                 WHERE sent_at >= DATE_TRUNC('month', CURRENT_DATE)
                   AND sent_at < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
                 GROUP BY DATE(sent_at)
                 ORDER BY date DESC`
            );
            return result.rows;
        } catch (error) {
            console.error('Error al obtener estadísticas mensuales:', error);
            return [];
        }
    }
}

module.exports = EmailLog;