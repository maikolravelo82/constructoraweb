const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
  
});
console.log('Cloudinary configurado con:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '✅ existe' : '❌ falta',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ existe' : '❌ falta'
});

module.exports = cloudinary;
