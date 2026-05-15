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
// CREAR NUEVO SERVICIO (CON UNA SOLA FOTO)
// ============================================
const createservice = async (req, res) => {
    try {
        // Verificar que llegue el archivo
        if (!req.file && (!req.files || !req.files.foto)) {
            return res.status(400).json({
                success: false,
                message: 'Debes subir una foto para el proyecto'
            });
        }

        // Obtener la URL de la foto (multer-storage-cloudinary)
        let fotoUrl = null;
        
        // Soporte para upload.single('foto')
        if (req.file) {
            fotoUrl = req.file.path;
        }
        // Soporte para upload.fields (por compatibilidad)
        else if (req.files && req.files.foto) {
            fotoUrl = req.files.foto[0].path;
        }
        
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

        // Si viene nueva foto
        let fotoUrl = null;
        if (req.file) {
            fotoUrl = req.file.path;
        } else if (req.files && req.files.foto) {
            fotoUrl = req.files.foto[0].path;
        }
        
        if (fotoUrl) {
            // Opcional: Eliminar la imagen anterior de Cloudinary
            if (service.foto) {
                try {
                    const publicId = extractPublicId(service.foto);
                    if (publicId) {
                        await cloudinary.uploader.destroy(publicId);
                    }
                } catch (cloudinaryError) {
                    console.error('Error al eliminar imagen anterior:', cloudinaryError);
                }
            }
            updateData.foto = fotoUrl;
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
            try {
                const publicId = extractPublicId(service.foto);
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            } catch (cloudinaryError) {
                console.error('Error al eliminar imagen de Cloudinary:', cloudinaryError);
            }
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
            where: { 
                foto: { [require('sequelize').Op.ne]: null } 
            }
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

// Función auxiliar para extraer el public_id de Cloudinary
function extractPublicId(url) {
    if (!url) return null;
    try {
        // Ejemplo de URL: https://res.cloudinary.com/.../servicios_fotos/abc123.jpg
        const parts = url.split('/');
        const filename = parts.pop();
        const folder = parts.pop();
        const publicId = `${folder}/${filename.split('.')[0]}`;
        return publicId;
    } catch (error) {
        console.error('Error al extraer public_id:', error);
        return null;
    }
}

module.exports = {
    getallservices,
    getservicebyid,
    createservice,
    updateservice,
    deleteservice,
    getservicestats
};