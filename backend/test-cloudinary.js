require('dotenv').config();
const cloudinary = require('./config/cloudinary');

async function test() {
  console.log('=== Probando Cloudinary ===');
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
  console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '✅ existe' : '❌ falta');
  console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ existe' : '❌ falta');
  
  try {
    console.log('Intentando subir imagen de prueba...');
    const result = await cloudinary.uploader.upload(
      'https://picsum.photos/200/300',
      { folder: 'servicios_fotos' }
    );
    console.log('✅ Cloudinary funciona!');
    console.log('URL:', result.secure_url);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();