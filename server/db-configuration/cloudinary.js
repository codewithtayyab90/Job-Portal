const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const ext = file.originalname.split('.').pop()
        return {
            folder: 'job-portal-cvs',
            allowed_formats: ['pdf', 'doc', 'docx'],
            resource_type: 'raw',
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}.${ext}`,
        }
    },
})

module.exports = { cloudinary, storage }