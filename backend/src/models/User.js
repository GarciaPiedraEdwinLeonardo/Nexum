const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    /**
     * Crear un nuevo usuario
     */
    static async create({ name, email, password, roleId = null }) {
        try {
            // Si no se proporciona roleId, usar 'student' por defecto
            let role_id = roleId;
            if (!roleId) {
                const roleResult = await query(
                    'SELECT id FROM roles WHERE name = $1',
                    ['student']
                );
                role_id = roleResult.rows[0]?.id;
            }

            // Hash de la contraseña
            const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
            const passwordHash = await bcrypt.hash(password, salt);

            const result = await query(
                `INSERT INTO users (name, email, password_hash, role_id, is_verified)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING id, name, email, is_verified, role_id, created_at`,
                [name, email, passwordHash, role_id, false]
            );

            return result.rows[0];
        } catch (error) {
            if (error.code === '23505') { // Unique violation
                throw new Error('Este email ya está registrado');
            }
            throw error;
        }
    }

    /**
     * Buscar usuario por email
     */
    static async findByEmail(email) {
        const result = await query(
            `SELECT u.*, r.name as role_name, r.display_name as role_display_name
             FROM users u
             JOIN roles r ON u.role_id = r.id
             WHERE u.email = $1 AND u.deleted_at IS NULL`,
            [email]
        );
        return result.rows[0];
    }

    /**
     * Buscar usuario por ID
     */
    static async findById(id) {
        const result = await query(
            `SELECT u.*, r.name as role_name, r.display_name as role_display_name
             FROM users u
             JOIN roles r ON u.role_id = r.id
             WHERE u.id = $1 AND u.deleted_at IS NULL`,
            [id]
        );
        return result.rows[0];
    }

    /**
     * Verificar contraseña
     */
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    /**
     * Marcar email como verificado
     */
    static async markAsVerified(userId) {
        const result = await query(
            `UPDATE users 
             SET is_verified = true, verified_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING id, name, email, is_verified, verified_at`,
            [userId]
        );
        return result.rows[0];
    }

    /**
     * Actualizar contraseña
     */
    static async updatePassword(userId, newPassword) {
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        const result = await query(
            `UPDATE users 
             SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING id, email`,
            [passwordHash, userId]
        );
        return result.rows[0];
    }

    /**
     * Incrementar intentos de login fallidos
     */
    static async incrementLoginAttempts(userId) {
        const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
        const lockTime = parseInt(process.env.ACCOUNT_LOCK_TIME_MINUTES) || 15;

        const result = await query(
            `UPDATE users 
             SET login_attempts = login_attempts + 1,
                 locked_until = CASE 
                     WHEN login_attempts + 1 >= $2 
                     THEN CURRENT_TIMESTAMP + INTERVAL '${lockTime} minutes'
                     ELSE locked_until 
                 END
             WHERE id = $1
             RETURNING id, login_attempts, locked_until`,
            [userId, maxAttempts]
        );
        return result.rows[0];
    }

    /**
     * Resetear intentos de login
     */
    static async resetLoginAttempts(userId) {
        await query(
            `UPDATE users 
             SET login_attempts = 0, locked_until = NULL, last_login_at = CURRENT_TIMESTAMP
             WHERE id = $1`,
            [userId]
        );
    }

    /**
     * Verificar si la cuenta está bloqueada
     */
    static async isAccountLocked(userId) {
        const result = await query(
            `SELECT locked_until FROM users WHERE id = $1`,
            [userId]
        );
        
        const user = result.rows[0];
        if (!user || !user.locked_until) return false;

        const now = new Date();
        const lockedUntil = new Date(user.locked_until);
        
        return now < lockedUntil;
    }

    /**
     * Obtener permisos del usuario
     */
    static async getPermissions(userId) {
        const result = await query(
            `SELECT DISTINCT p.name, p.display_name, p.category
             FROM permissions p
             WHERE p.id IN (
                 -- Permisos por rol
                 SELECT rp.permission_id
                 FROM users u
                 JOIN role_permissions rp ON u.role_id = rp.role_id
                 WHERE u.id = $1
                 
                 UNION
                 
                 -- Permisos directos del usuario
                 SELECT up.permission_id
                 FROM user_permissions up
                 WHERE up.user_id = $1
                 AND (up.expires_at IS NULL OR up.expires_at > CURRENT_TIMESTAMP)
             )
             ORDER BY p.category, p.name`,
            [userId]
        );
        return result.rows;
    }

    /**
     * Verificar si usuario tiene un permiso específico
     */
    static async hasPermission(userId, permissionName) {
        const result = await query(
            `SELECT user_has_permission($1, $2) as has_permission`,
            [userId, permissionName]
        );
        return result.rows[0]?.has_permission || false;
    }

    /**
     * Obtener estadísticas del usuario
     */
    static async getStats() {
        const result = await query(
            `SELECT 
                COUNT(*) as total_users,
                COUNT(*) FILTER (WHERE is_verified = true) as verified_users,
                COUNT(*) FILTER (WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '30 days') as new_users_30d,
                COUNT(*) FILTER (WHERE last_login_at > CURRENT_TIMESTAMP - INTERVAL '7 days') as active_users_7d
             FROM users
             WHERE deleted_at IS NULL`
        );
        return result.rows[0];
    }

    /**
     * Soft delete de usuario
     */
    static async softDelete(userId) {
        const result = await query(
            `UPDATE users 
             SET deleted_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING id, email, deleted_at`,
            [userId]
        );
        return result.rows[0];
    }

    /**
     * Actualizar perfil
     */
    static async updateProfile(userId, updates) {
        const allowedFields = ['name', 'profile_picture_url'];
        const fields = [];
        const values = [];
        let paramIndex = 1;

        for (const [key, value] of Object.entries(updates)) {
            if (allowedFields.includes(key)) {
                fields.push(`${key} = $${paramIndex}`);
                values.push(value);
                paramIndex++;
            }
        }

        if (fields.length === 0) {
            throw new Error('No hay campos válidos para actualizar');
        }

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(userId);

        const result = await query(
            `UPDATE users 
             SET ${fields.join(', ')}
             WHERE id = $${paramIndex}
             RETURNING id, name, email, profile_picture_url, updated_at`,
            values
        );

        return result.rows[0];
    }
}

module.exports = User;