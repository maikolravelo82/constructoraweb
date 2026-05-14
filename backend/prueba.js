const sequelize = require('./config/database');

async function test() {
    try {
        await sequelize.authenticate();
        console.log('✅ CONEXIÓN EXITOSA con SQLite');
        console.log('📁 Base de datos guardada en: database.sqlite');
    } catch (error) {
        console.error('❌ ERROR DE CONEXIÓN:');
        console.error(error.message);
    }
}

test();
async function test() {
    try {
        await sequelize.authenticate();
        console.log('✅ CONEXIÓN EXITOSA');
    } catch (error) {
        console.error('❌ ERROR DE CONEXIÓN:');
        console.error('Mensaje:', error.parent?.sqlMessage || error.message);
    }
}

test();