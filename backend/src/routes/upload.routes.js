const express = require("express");
const router = express.Router();
const {
  UploadController,
  upload,
} = require("../controllers/upload.controller");

// Middleware para logar requisições
router.post(
  "/",
  (req, res, next) => {
    console.log("Upload POST recebido");
    console.log("Content-Type:", req.get("content-type"));
    console.log("Body keys:", Object.keys(req.body));
    console.log("Files:", req.files);
    next();
  },
  upload.single("imagem"),
  (req, res, next) => {
    console.log(
      "Após multer - req.file:",
      req.file
        ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            size: req.file.size,
          }
        : "null",
    );
    next();
  },
  UploadController.uploadImagem,
);

module.exports = router;
