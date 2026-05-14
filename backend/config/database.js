const { Sequelize } = require('sequelize');

// 🔥 FORZAR USO DE DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ ERROR: DATABASE_URL no está configurada en las variables de entorno');
  process.exit(1);
}

console.log('✅ Conectando a la base de datos...');

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

// Probar la conexión
sequelize.authenticate()
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection error:', err.message));

module.exports = sequelize;