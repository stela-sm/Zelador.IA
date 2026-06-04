import supabase from "../lib/supabase.js";
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const UploadController = {
  uploadImagem: async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ error: "Nenhuma imagem enviada" });
      console.log("Supabase URL:", process.env.SUPABASE_URL);
      console.log("Bucket:", "chamados-imagens");
      const filename =
        Date.now() +
        "-" +
        req.file.originalname
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9._-]/g, "_");

      console.log("Iniciando upload de:", filename);
      console.log("Tamanho do arquivo:", req.file.size, "bytes");

      const { data, error } = await supabase.storage
        .from("chamados-imagens")
        .upload(filename, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (error) {
        console.error("Upload error:", error);
        return res.status(500).json({
          error: error.message,
          details: error,
        });
      }

      console.log("Upload response:", { data });

      console.log("Criando signed URL para:", filename);
      const { data: signedData, error: signedUrlError } = await supabase.storage
        .from("chamados-imagens")
        .createSignedUrl(filename, 60 * 60); // 1 hora

      console.log("SignedUrl response:", { signedData, signedUrlError });

      if (signedUrlError) {
        console.error("SignedUrl error:", signedUrlError);
        return res.status(500).json({
          error: signedUrlError.message,
          details: signedUrlError,
        });
      }

      console.log("Upload sucesso! URL:", signedData?.signedUrl);
      return res.json({ url: signedData.signedUrl });
    } catch (err) {
      console.error("Exception no upload:", err);
      return res.status(500).json({ error: err.message, stack: err.stack });
    }
  },
};

export { UploadController, upload };
