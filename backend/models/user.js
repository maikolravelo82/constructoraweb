const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const user = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: [2, 100]
        }
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    age: {
        type: DataTypes.INTEGER,
        validate: {
            min: 0,
            max: 120
        }
    }
}, {
    tableName: 'users',
    timestamps: true // Añade createdAt y updatedAt automáticamente
});

module.exports = user;