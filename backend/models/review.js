const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    clasificacion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'reviews',
    timestamps: true
});

module.exports = Review;