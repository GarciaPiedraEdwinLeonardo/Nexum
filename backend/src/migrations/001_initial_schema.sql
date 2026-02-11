-- ============================================
-- ESQUEMA DE BASE DE DATOS PARA NEXUM
-- Sistema de Autenticacion de Usuarios con Roles
-- ============================================

-- Eliminar tablas si existen (solo para desarrollo)
DROP TABLE IF EXISTS user_permissions CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS verification_tokens CASCADE;
DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- ============================================
-- TABLA: roles
-- Define los roles disponibles en el sistema
-- ============================================
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT role_name_lowercase CHECK (name = LOWER(name))
);

-- ============================================
-- TABLA: permissions
-- Define los permisos disponibles en el sistema
-- ============================================
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT permission_name_lowercase CHECK (name = LOWER(name))
);

-- ============================================
-- TABLA: role_permissions
-- Relacion muchos a muchos entre roles y permisos
-- ============================================
CREATE TABLE role_permissions (
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (role_id, permission_id)
);

-- ============================================
-- TABLA: users
-- Almacena informacion principal de usuarios
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(60) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    role_id INTEGER NOT NULL REFERENCES roles(id),
    profile_picture_url VARCHAR(500),
    last_login_at TIMESTAMP WITH TIME ZONE,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT email_format CHECK (email ~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]{2,}$')
);

-- ============================================
-- TABLA: user_permissions
-- Permisos especificos adicionales por usuario
-- ============================================
CREATE TABLE user_permissions (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    granted_by UUID REFERENCES users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    PRIMARY KEY (user_id, permission_id)
);

-- ============================================
-- TABLA: verification_tokens
-- Tokens para verificacion de email
-- ============================================
CREATE TABLE verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: password_reset_tokens
-- Tokens para reseteo de contrasena
-- ============================================
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- ============================================
-- INDICES PARA OPTIMIZACION
-- ============================================

CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_verified ON users(is_verified) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_active ON users(created_at DESC) WHERE deleted_at IS NULL;

CREATE INDEX idx_verification_tokens_active ON verification_tokens(user_id, expires_at) WHERE used_at IS NULL;
CREATE INDEX idx_verification_tokens_token ON verification_tokens(token) WHERE used_at IS NULL;
CREATE INDEX idx_password_reset_tokens_active ON password_reset_tokens(user_id, expires_at) WHERE used_at IS NULL;
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token) WHERE used_at IS NULL;

CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);
CREATE INDEX idx_user_permissions_user ON user_permissions(user_id);
CREATE INDEX idx_permissions_category ON permissions(category);

-- ============================================
-- FUNCION: updated_at automatico
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCION: Limpiar tokens expirados
-- ============================================
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
    DELETE FROM verification_tokens 
    WHERE expires_at < CURRENT_TIMESTAMP - INTERVAL '7 days';
    
    DELETE FROM password_reset_tokens 
    WHERE expires_at < CURRENT_TIMESTAMP - INTERVAL '7 days';
    
    DELETE FROM user_permissions
    WHERE expires_at IS NOT NULL AND expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCION: Verificar si usuario tiene permiso
-- ============================================
CREATE OR REPLACE FUNCTION user_has_permission(
    p_user_id UUID,
    p_permission_name VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
    has_perm BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM user_permissions up
        JOIN permissions p ON up.permission_id = p.id
        WHERE up.user_id = p_user_id 
          AND p.name = p_permission_name
          AND (up.expires_at IS NULL OR up.expires_at > CURRENT_TIMESTAMP)
        
        UNION
        
        SELECT 1 FROM users u
        JOIN role_permissions rp ON u.role_id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE u.id = p_user_id 
          AND p.name = p_permission_name
          AND u.deleted_at IS NULL
    ) INTO has_perm;
    
    RETURN has_perm;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INSERTAR ROLES PREDETERMINADOS
-- ============================================
INSERT INTO roles (name, display_name, description) VALUES
('student', 'Estudiante', 'Estudiante del IPN buscando oportunidades laborales'),
('company', 'Empresa', 'Empresa reclutadora publicando vacantes'),
('admin', 'Administrador', 'Administrador del sistema con acceso total'),
('suspended', 'Suspendido', 'Usuario con cuenta suspendida temporalmente');

-- ============================================
-- INSERTAR PERMISOS PREDETERMINADOS
-- ============================================

INSERT INTO permissions (name, display_name, description, category) VALUES
('view_own_profile', 'Ver Perfil Propio', 'Ver y acceder a su propio perfil', 'profile'),
('edit_own_profile', 'Editar Perfil Propio', 'Modificar informacion de su propio perfil', 'profile'),
('delete_own_account', 'Eliminar Cuenta Propia', 'Eliminar su propia cuenta', 'profile'),
('upload_profile_picture', 'Subir Foto de Perfil', 'Cargar o cambiar foto de perfil', 'profile');

INSERT INTO permissions (name, display_name, description, category) VALUES
('view_jobs', 'Ver Ofertas Laborales', 'Ver listado de ofertas de trabajo', 'jobs'),
('apply_to_jobs', 'Aplicar a Ofertas', 'Postularse a ofertas laborales', 'jobs'),
('create_jobs', 'Crear Ofertas', 'Publicar nuevas ofertas de trabajo', 'jobs'),
('edit_own_jobs', 'Editar Ofertas Propias', 'Modificar ofertas creadas por la empresa', 'jobs'),
('delete_own_jobs', 'Eliminar Ofertas Propias', 'Eliminar ofertas creadas por la empresa', 'jobs'),
('view_applicants', 'Ver Postulantes', 'Ver lista de postulantes a ofertas', 'jobs'),
('manage_applicants', 'Gestionar Postulantes', 'Aceptar/rechazar postulaciones', 'jobs');

INSERT INTO permissions (name, display_name, description, category) VALUES
('send_messages', 'Enviar Mensajes', 'Enviar mensajes a otros usuarios', 'messaging'),
('receive_messages', 'Recibir Mensajes', 'Recibir mensajes de otros usuarios', 'messaging');

INSERT INTO permissions (name, display_name, description, category) VALUES
('view_all_users', 'Ver Todos los Usuarios', 'Acceso a lista completa de usuarios', 'admin'),
('edit_any_user', 'Editar Cualquier Usuario', 'Modificar informacion de cualquier usuario', 'admin'),
('delete_any_user', 'Eliminar Cualquier Usuario', 'Eliminar cuentas de usuarios', 'admin'),
('suspend_users', 'Suspender Usuarios', 'Suspender temporalmente cuentas', 'admin'),
('manage_roles', 'Gestionar Roles', 'Crear, editar y eliminar roles', 'admin'),
('manage_permissions', 'Gestionar Permisos', 'Asignar y revocar permisos', 'admin'),
('view_analytics', 'Ver Analiticas', 'Acceso a estadisticas y reportes del sistema', 'admin'),
('manage_system', 'Gestionar Sistema', 'Configuracion general del sistema', 'admin');

-- ============================================
-- ASIGNAR PERMISOS A ROLES
-- ============================================

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'student' AND p.name IN (
    'view_own_profile',
    'edit_own_profile',
    'delete_own_account',
    'upload_profile_picture',
    'view_jobs',
    'apply_to_jobs',
    'send_messages',
    'receive_messages'
);

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'company' AND p.name IN (
    'view_own_profile',
    'edit_own_profile',
    'delete_own_account',
    'upload_profile_picture',
    'view_jobs',
    'create_jobs',
    'edit_own_jobs',
    'delete_own_jobs',
    'view_applicants',
    'manage_applicants',
    'send_messages',
    'receive_messages'
);

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'admin';

-- ============================================
-- COMENTARIOS PARA DOCUMENTACION
-- ============================================
COMMENT ON TABLE roles IS 'Roles disponibles en el sistema';
COMMENT ON TABLE permissions IS 'Permisos especificos del sistema';
COMMENT ON TABLE role_permissions IS 'Relacion entre roles y permisos';
COMMENT ON TABLE user_permissions IS 'Permisos excepcionales asignados a usuarios especificos';
COMMENT ON TABLE users IS 'Tabla principal de usuarios del sistema Nexum';
COMMENT ON COLUMN users.role_id IS 'Rol asignado al usuario (student, company, admin, suspended)';
COMMENT ON COLUMN users.email IS 'Email institucional (@alumno.ipn.mx)';
COMMENT ON COLUMN users.password_hash IS 'Contrasena hasheada con bcrypt';

-- ============================================
-- VISTAS UTILES
-- ============================================

CREATE OR REPLACE VIEW v_users_with_roles AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.is_verified,
    r.name as role,
    r.display_name as role_display_name,
    u.created_at,
    u.last_login_at,
    u.deleted_at,
    ARRAY_AGG(DISTINCT p.name ORDER BY p.name) FILTER (WHERE p.name IS NOT NULL) as permissions
FROM users u
JOIN roles r ON u.role_id = r.id
LEFT JOIN role_permissions rp ON r.id = rp.role_id
LEFT JOIN permissions p ON rp.permission_id = p.id
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.name, u.email, u.is_verified, r.name, r.display_name, u.created_at, u.last_login_at, u.deleted_at;

CREATE OR REPLACE VIEW v_user_stats_by_role AS
SELECT 
    r.name as role,
    r.display_name,
    COUNT(u.id) as total_users,
    COUNT(u.id) FILTER (WHERE u.is_verified = true) as verified_users,
    COUNT(u.id) FILTER (WHERE u.created_at > CURRENT_TIMESTAMP - INTERVAL '30 days') as new_users_30d,
    COUNT(u.id) FILTER (WHERE u.last_login_at > CURRENT_TIMESTAMP - INTERVAL '7 days') as active_users_7d
FROM roles r
LEFT JOIN users u ON r.id = u.role_id AND u.deleted_at IS NULL
GROUP BY r.id, r.name, r.display_name
ORDER BY total_users DESC;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================