const { query } = require('../config/database');
const crypto = require('crypto');

class VerificationToken {
    /**
     * Generar un token seguro
     */
    static generateToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    /**
     * Crear un nuevo token de verificación
     */
    static async create(userId) {
        try {
            // Invalidar tokens anteriores del mismo usuario
            await query(
                `UPDATE verification_tokens 
                 SET used_at = CURRENT_TIMESTAMP
                 WHERE user_id = $1 AND used_at IS NULL`,
                [userId]
            );

            const token = this.generateToken();
            const expiryHours = parseInt(process.env.VERIFICATION_TOKEN_EXPIRY_HOURS) || 24;

            const result = await query(
                `INSERT INTO verification_tokens (user_id, token, expires_at)
                 VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '${expiryHours} hours')
                 RETURNING id, token, expires_at`,
                [userId, token]
            );

            return result.rows[0];
        } catch (error) {
            console.error('Error al crear token de verificación:', error);
            throw error;
        }
    }

    /**
     * Buscar y validar token
     */
    static async findAndValidate(token) {
        const result = await query(
            `SELECT vt.*, u.id as user_id, u.email, u.name, u.is_verified
             FROM verification_tokens vt
             JOIN users u ON vt.user_id = u.id
             WHERE vt.token = $1 
               AND vt.used_at IS NULL 
               AND vt.expires_at > CURRENT_TIMESTAMP
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
            `UPDATE verification_tokens 
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
            `DELETE FROM verification_tokens 
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
            `SELECT id, token, expires_at, created_at
             FROM verification_tokens
             WHERE user_id = $1 
               AND used_at IS NULL 
               AND expires_at > CURRENT_TIMESTAMP
             ORDER BY created_at DESC`,
            [userId]
        );

        return result.rows;
    }
}

module.exports = VerificationToken;