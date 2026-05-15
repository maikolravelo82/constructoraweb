const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Service = sequelize.define('Service', {
    foto: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Lugar: {
        type: DataTypes.TEXT,
        allowNull: true
    },
     Nombre: {
        type: DataTypes.TEXT,
        allowNull: true
    },
}, {
    tableName: 'servicios',
    timestamps: true
});

module.exports = Service;