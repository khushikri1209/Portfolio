const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const createStorage = (folder, allowedFormats, resourceType = "image") =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: allowedFormats,
      resource_type: resourceType,
    },
  });

const uploadImage = multer({
  storage: createStorage("portfolio/images", ["jpg", "jpeg", "png", "webp"]),
});

const uploadPdf = multer({
  storage: createStorage("portfolio/resume", ["pdf"], "raw"),
});

module.exports = { uploadImage, uploadPdf };
