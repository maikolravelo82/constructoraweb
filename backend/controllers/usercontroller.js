const  user  = require('../models/user');

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json({
            success: true,
            data: users,
            count: users.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Crear nuevo usuario
const createUser = async (req, res) => {
    try {
        const { name, email, age } = req.body;
        
        // Validación básica
        if (!name || !email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Nombre y email son obligatorios' 
            });
        }
        
        const newUser = await User.create({ name, email, age });
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        // Error por email duplicado
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ 
                success: false, 
                message: 'El email ya está registrado' 
            });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

// Actualizar usuario
const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        
        await user.update(req.body);
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        
        await user.destroy();
        res.json({ success: true, message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};