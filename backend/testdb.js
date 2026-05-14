const sequelize = require('./config/database');

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente');
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error);
    }
}

testConnection();
