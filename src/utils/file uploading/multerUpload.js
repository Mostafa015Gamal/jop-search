import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";

export const fileValidation = {
  images: ["image/png", "image/jpeg"],
  files: ["application/pdf"],
};

const upload = (fileType) => {
  const storage = diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
      cb(null, nanoid() + "__" + file.originalname);
    },
  });

  const fileFilter = function (req, file, cb) {
    if (!fileType.includes(file.mimetype))
      return cb(
        new Error(`Invalid format! we only accept ${JSON.stringify(fileType)}`),
        false
      );
    return cb(null, true);
  };
  const multerUpload = multer({ storage, fileFilter });
  return multerUpload;
};

// upload()
export default upload;
