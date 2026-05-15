const express = require('express');
const path = require('path');
const cors = require('cors');
const sequelize = require('./config/database');
const userroutes = require('./routes/userroutes');
const serviceroutes = require('./routes/serviceroutes');
const reviewroutes = require('./routes/reviewroutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;  // ✅ CORREGIDO: PORT mayúscula

console.log('=== DB CONFIGURATION DEBUG ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_USER exists?', !!process.env.DB_USER);
console.log('DB_PASSWORD exists?', !!process.env.DB_PASSWORD);
console.log('DB_HOST exists?', !!process.env.DB_HOST);
console.log('DB_NAME exists?', !!process.env.DB_NAME);
console.log('DB_USER value:', process.env.DB_USER);
console.log('DB_HOST value:', process.env.DB_HOST);
console.log('DB_NAME value:', process.env.DB_NAME);
console.log('DB_PASSWORD length:', process.env.DB_PASSWORD?.length);
console.log('============================');

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// servir archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));

// rutas de api
app.use('/api/users', userroutes);
app.use('/api/services', serviceroutes);
app.use('/api/reviews', reviewroutes);

// ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({ message: 'api funcionando con sqlite 🚀', status: 'ok' });
});

// manejo de rutas no-api
app.use((req, res, next) => {
    // si la ruta empieza con /api, no la manejamos aqui
    if (req.originalUrl && req.originalUrl.startsWith('/api')) {  // ✅ CORREGIDO: originalUrl y startsWith
        return res.status(404).json({ error: 'api endpoint no encontrado' });
    }
    // para cualquier otra ruta, enviamos index.html
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));  // ✅ CORREGIDO: sendFile con F mayúscula
});

// sincronizar base de datos y levantar servidor
// sincronizar base de datos y levantar servidor
async function startServer() {
    try {
        await sequelize.sync({ force: true });
        console.log('📦 base de datos sincronizada');
        
        // 🔥 CAMBIO IMPORTANTE: Escuchar en 0.0.0.0
        app.listen(port, '0.0.0.0', () => {
            console.log(`🔥 servidor corriendo en puerto ${port}`);
        });
    } catch (error) {
        console.error('❌ error:', error);
    }
}

startServer();