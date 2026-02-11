const { Pool } = require('pg');
require('dotenv').config();

// Configuración del pool de conexiones
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'nexum_db',
    user: process.env.DB_USER || 'nexum_user',
    password: process.env.DB_PASSWORD,
    min: parseInt(process.env.DB_POOL_MIN) || 2,
    max: parseInt(process.env.DB_POOL_MAX) || 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Evento cuando se establece una nueva conexión
pool.on('connect', () => {
    if (process.env.DEBUG === 'true') {
        console.log('✅ Nueva conexión establecida con PostgreSQL');
    }
});

// Evento de error
pool.on('error', (err) => {
    console.error('❌ Error inesperado en el pool de PostgreSQL:', err);
    process.exit(-1);
});

// Función helper para ejecutar queries
const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        
        if (process.env.DEBUG === 'true') {
            console.log('Query ejecutada:', { text, duration, rows: res.rowCount });
        }
        
        return res;
    } catch (error) {
        console.error('Error en query:', error);
        throw error;
    }
};

// Función para obtener un cliente del pool (para transacciones)
const getClient = async () => {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;

    // Set timeout para evitar conexiones huérfanas
    const timeout = setTimeout(() => {
        console.error('⚠️ Cliente no ha sido liberado después de 5 segundos');
    }, 5000);

    // Monkey patch para limpiar el timeout al liberar
    client.release = () => {
        clearTimeout(timeout);
        client.query = query;
        client.release = release;
        return release.apply(client);
    };

    return client;
};

// Función para verificar conexión
const testConnection = async () => {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('✅ Conexión exitosa a PostgreSQL');
        console.log('⏰ Hora del servidor:', result.rows[0].now);
        return true;
    } catch (error) {
        console.error('❌ Error al conectar con PostgreSQL:', error.message);
        return false;
    }
};

// Función para cerrar el pool (útil al apagar el servidor)
const closePool = async () => {
    try {
        await pool.end();
        console.log('✅ Pool de conexiones cerrado correctamente');
    } catch (error) {
        console.error('❌ Error al cerrar pool:', error);
    }
};

module.exports = {
    pool,
    query,
    getClient,
    testConnection,
    closePool
};