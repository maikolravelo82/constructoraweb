const Service = require('../models/service');
const cloudinary = require('../config/cloudinary');

// ============================================
// OBTENER TODOS LOS SERVICIOS
// ============================================
const getallservices = async (req, res) => {
    try {
        const services = await Service.findAll({
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: services,
            count: services.length
        });
    } catch (error) {
        console.error('Error en getallservices:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// ============================================
// OBTENER UN SERVICIO POR ID
// ============================================
const getservicebyid = async (req, res) => {
    try {
        const service = await Service.findByPk(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Servicio no encontrado'
            });
        }

        res.json({
            success: true,
            data: service
        });
    } catch (error) {
        console.error('Error en getservicebyid:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// ============================================
// CREAR NUEVO SERVICIO (CON CLOUDINARY)
// ============================================
const createservice = async (req, res) => {
    try {
        // Verificar que llegue el archivo
        if (!req.files || !req.files.foto) {
            return res.status(400).json({
                success: false,
                message: 'Debes subir una imagen'
            });
        }

        // Multer-Storage-Cloudinary ya subió la imagen
        const fotoUrl = req.files.foto[0].path; // Cloudinary URL
        
        const { Lugar, Nombre } = req.body;

        // Guardar en la base de datos
        const newService = await Service.create({
            foto: fotoUrl,
            Lugar: Lugar || null,
            Nombre: Nombre || 'Proyecto de concreto'
        });

        res.status(201).json({
            success: true,
            message: 'Servicio creado correctamente',
            data: newService
        });

    } catch (error) {
        console.error('Error en createservice:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// ============================================
// ACTUALIZAR SERVICIO
// ============================================
const updateservice = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findByPk(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Servicio no encontrado'
            });
        }

        const updateData = {};
        
        // Actualizar Lugar y Nombre si vienen
        if (req.body.Lugar !== undefined) updateData.Lugar = req.body.Lugar;
        if (req.body.Nombre !== undefined) updateData.Nombre = req.body.Nombre;

        // Si viene nueva foto, Cloudinary ya la subió
        if (req.files && req.files.foto) {
            // Opcional: Eliminar la imagen anterior de Cloudinary
            if (service.foto) {
                const publicId = service.foto.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }
            updateData.foto = req.files.foto[0].path;
        }

        await service.update(updateData);

        res.json({
            success: true,
            message: 'Servicio actualizado correctamente',
            data: service
        });

    } catch (error) {
        console.error('Error en updateservice:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// ============================================
// ELIMINAR SERVICIO
// ============================================
const deleteservice = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findByPk(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Servicio no encontrado'
            });
        }

        // Eliminar imagen de Cloudinary
        if (service.foto) {
            const publicId = service.foto.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await service.destroy();

        res.json({
            success: true,
            message: 'Servicio eliminado correctamente'
        });

    } catch (error) {
        console.error('Error en deleteservice:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// ============================================
// ESTADÍSTICAS DE SERVICIOS
// ============================================
const getservicestats = async (req, res) => {
    try {
        const totalServices = await Service.count();

        const servicesWithPhoto = await Service.count({
            where: { foto: { [require('sequelize').Op.ne]: null } }
        });

        res.json({
            success: true,
            data: {
                total: totalServices,
                conFoto: servicesWithPhoto
            }
        });

    } catch (error) {
        console.error('Error en getservicestats:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    getallservices,
    getservicebyid,
    createservice,
    updateservice,
    deleteservice,
    getservicestats
};