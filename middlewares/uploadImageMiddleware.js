const multer = require('multer');
const AppError = require('../utils/appError');

const multerOptions = () => {
  // const multerStorage = multer.diskStorage({
  //   // 1) destination    2) filename
  //   destination: function(req, file, cb) {
  //     cb(null, 'uploads/categories');
  //   },
  //   filename: function(req, file, cb) {
  //     // mimetype: image/jpeg
  //     const extension = file.mimetype.split('/')[1];
  //     const filename = `Category-${uuidv4()}-${Date.now()}-${extension}`;
  //     cb(null, filename);
  //   }
  // });
  const multerStorage = multer.memoryStorage();
  const multerFilter = function(req, file, cb) {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(
        new AppError('Invalid file type. Only images are allowed.', 400),
        false
      );
    }
  };
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 1000000 }
  });
  return upload;
};

exports.uploadSingleImage = fieldname => {
  return multerOptions().single(fieldname);
};

exports.uploadMultipleImages = arrayOfFields => {
  return multerOptions().fields(arrayOfFields);
};
