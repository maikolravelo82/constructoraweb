const review = require('../models/review');
const { sequelize } = require('sequelize');

// obtener todas las reseñas
const getallreviews = async (req, res) => {
    try {
        const reviews = await review.findAll({  // ✅ CORREGIDO: findAll con A mayúscula
            order: [['createdAt', 'DESC']]  // ✅ CORREGIDO: createdAt con A mayúscula, DESC mayúsculas
        });
        
        res.json({
            success: true,
            data: reviews,
            count: reviews.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// obtener una reseña por id
const getreviewbyid = async (req, res) => {
    try {
        const reseña = await review.findByPk(req.params.id);  // ✅ CORREGIDO: findByPk (B mayúscula, k minúscula)
        
        if (!reseña) {
            return res.status(404).json({
                success: false,
                message: 'reseña no encontrada'
            });
        }
        
        res.json({
            success: true,
            data: reseña
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// obtener reseñas por calificación
const getreviewsbyrating = async (req, res) => {
    try {
        const { rating } = req.params;
        
        const reviews = await review.findAll({  // ✅ CORREGIDO: findAll
            where: { clasificacion: rating },
            order: [['createdAt', 'DESC']]  // ✅ CORREGIDO: createdAt
        });
        
        res.json({
            success: true,
            data: reviews,
            count: reviews.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// crear nueva reseña
const createreview = async (req, res) => {
    try {
        const { nombre, clasificacion, descripcion } = req.body;
        
        // validaciones
        if (!nombre || !clasificacion || !descripcion) {
            return res.status(400).json({
                success: false,
                message: 'todos los campos son obligatorios: nombre, clasificación y descripción'
            });
        }
        
        if (clasificacion < 1 || clasificacion > 5) {
            return res.status(400).json({
                success: false,
                message: 'la clasificación debe ser un número entre 1 y 5'
            });
        }
        
        const newreview = await review.create({
            nombre,
            clasificacion,
            descripcion
        });
        
        res.status(201).json({
            success: true,
            message: '¡gracias por tu reseña!',
            data: newreview
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// actualizar reseña
const updatereview = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, clasificacion, descripcion } = req.body;
        
        const reseña = await review.findByPk(id);  // ✅ CORREGIDO: findByPk
        
        if (!reseña) {
            return res.status(404).json({
                success: false,
                message: 'reseña no encontrada'
            });
        }
        
        if (nombre) reseña.nombre = nombre;
        if (clasificacion) reseña.clasificacion = clasificacion;
        if (descripcion) reseña.descripcion = descripcion;
        
        await reseña.save();
        
        res.json({
            success: true,
            message: 'reseña actualizada correctamente',
            data: reseña
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// eliminar reseña
const deletereview = async (req, res) => {
    try {
        const { id } = req.params;
        
        const reseña = await review.findByPk(id);  // ✅ CORREGIDO: findByPk
        
        if (!reseña) {
            return res.status(404).json({
                success: false,
                message: 'reseña no encontrada'
            });
        }
        
        await reseña.destroy();
        
        res.json({
            success: true,
            message: 'reseña eliminada correctamente'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// obtener estadísticas de reseñas
const getreviewstats = async (req, res) => {
    try {
        const totalreviews = await review.count();
        
        const avgrating = await review.findOne({  // ✅ CORREGIDO: findOne (O mayúscula, n minúscula)
            attributes: [
                [sequelize.fn('AVG', sequelize.col('clasificacion')), 'promedio']  // ✅ CORREGIDO: AVG mayúsculas
            ],
            raw: true
        });
        
        const ratingcounts = await review.findAll({  // ✅ CORREGIDO: findAll
            attributes: [
                'clasificacion',
                [sequelize.fn('COUNT', sequelize.col('clasificacion')), 'cantidad']  // ✅ CORREGIDO: COUNT mayúsculas
            ],
            group: ['clasificacion'],
            order: [['clasificacion', 'DESC']],  // ✅ CORREGIDO: DESC mayúsculas
            raw: true
        });
        
        res.json({
            success: true,
            data: {
                total: totalreviews,
                promedio: parseFloat(avgrating?.promedio || 0).toFixed(1),  // ✅ CORREGIDO: toFixed (F mayúscula)
                distribucion: ratingcounts
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// exportar todos los métodos
module.exports = {
    getallreviews,
    getreviewbyid,
    getreviewsbyrating,
    createreview,
    updatereview,
    deletereview,
    getreviewstats
};