const { query } = require('../config/database');
const crypto = require('crypto');

class PasswordResetToken {
    /**
     * Generar un token seguro
     */
    static generateToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    /**
     * Crear un nuevo token de reseteo de contraseña
     */
    static async create(userId, ipAddress = null, userAgent = null) {
        try {
            // Invalidar tokens anteriores del mismo usuario
            await query(
                `UPDATE password_reset_tokens 
                 SET used_at = CURRENT_TIMESTAMP
                 WHERE user_id = $1 AND used_at IS NULL`,
                [userId]
            );

            const token = this.generateToken();
            const expiryHours = parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRY_HOURS) || 1;

            const result = await query(
                `INSERT INTO password_reset_tokens (user_id, token, expires_at, ip_address, user_agent)
                 VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '${expiryHours} hours', $3, $4)
                 RETURNING id, token, expires_at`,
                [userId, token, ipAddress, userAgent]
            );

            return result.rows[0];
        } catch (error) {
            console.error('Error al crear token de reset:', error);
            throw error;
        }
    }

    /**
     * Buscar y validar token
     */
    static async findAndValidate(token) {
        const result = await query(
            `SELECT prt.*, u.id as user_id, u.email, u.name
             FROM password_reset_tokens prt
             JOIN users u ON prt.user_id = u.id
             WHERE prt.token = $1 
               AND prt.used_at IS NULL 
               AND prt.expires_at > CURRENT_TIMESTAMP
               AND u.deleted_at IS NULL`,
            [token]
        );

        return result.rows[0];
    }

    /**
     * Marcar token como usado
     */
    static async markAsUsed(tokenId) {
        const result = await query(
            `UPDATE password_reset_tokens 
             SET used_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING id, used_at`,
            [tokenId]
        );

        return result.rows[0];
    }

    /**
     * Eliminar tokens expirados (limpieza)
     */
    static async cleanupExpired() {
        const result = await query(
            `DELETE FROM password_reset_tokens 
             WHERE expires_at < CURRENT_TIMESTAMP - INTERVAL '7 days'
             RETURNING id`
        );

        return result.rowCount;
    }

    /**
     * Obtener tokens activos de un usuario
     */
    static async getActiveByUser(userId) {
        const result = await query(
            `SELECT id, token, expires_at, created_at, ip_address
             FROM password_reset_tokens
             WHERE user_id = $1 
               AND used_at IS NULL 
               AND expires_at > CURRENT_TIMESTAMP
             ORDER BY created_at DESC`,
            [userId]
        );

        return result.rows;
    }

    /**
     * Obtener historial de resets de un usuario (seguridad)
     */
    static async getHistoryByUser(userId, limit = 10) {
        const result = await query(
            `SELECT id, created_at, used_at, ip_address, expires_at
             FROM password_reset_tokens
             WHERE user_id = $1
             ORDER BY created_at DESC
             LIMIT $2`,
            [userId, limit]
        );

        return result.rows;
    }
}

module.exports = PasswordResetToken;