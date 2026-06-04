import express from "express";
import { UploadController, upload } from "../controllers/upload.controller.js";

const router = express.Router();

router.post(
  "/",
  (req, res, next) => {
    console.log("Upload POST recebido");
    console.log("Content-Type:", req.get("content-type"));
    console.log("Body:", req.body);
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

export default router;
