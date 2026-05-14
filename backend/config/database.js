const { Sequelize } = require('sequelize');

// Solo cargar dotenv en desarrollo
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

let sequelize;

if (process.env.NODE_ENV === 'production') {
  // Usar variables separadas (las que ya tienes en Render)
  sequelize = new Sequelize(
    process.env.DB_NAME,      // dh_electrical
    process.env.DB_USER,      // dh_user
    process.env.DB_PASSWORD,  // tu contraseña
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    }
  );
} else {
  // Usar SQLite en desarrollo local
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  });
}

module.exports = sequelize;