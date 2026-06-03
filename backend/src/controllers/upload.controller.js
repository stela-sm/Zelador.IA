const supabase = require("../lib/supabase");
const multer = require("multer");

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

      const filename = `${Date.now()}-${req.file.originalname}`;

      console.log("Iniciando upload de:", filename);
      console.log("Tamanho do arquivo:", req.file.size, "bytes");

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("chamados-imagens")
        .upload(filename, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      console.log("Upload response:", { data: uploadData, error: uploadError });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return res.status(500).json({
          error: uploadError.message,
          details: uploadError,
        });
      }

      console.log("Criando signed URL para:", filename);
      const { data, error: signedUrlError } = await supabase.storage
        .from("chamados-imagens")
        .createSignedUrl(filename, 60 * 60); // 1 hora

      console.log("SignedUrl response:", { data, error: signedUrlError });

      if (signedUrlError) {
        console.error("SignedUrl error:", signedUrlError);
        return res.status(500).json({
          error: signedUrlError.message,
          details: signedUrlError,
        });
      }

      console.log("Upload sucesso! URL:", data.signedUrl);
      // Signed URL no formato: /storage/v1/object/sign/... ?token=...
      return res.json({ url: data.signedUrl });
    } catch (err) {
      console.error("Exception no upload:", err);
      return res.status(500).json({ error: err.message, stack: err.stack });
    }
  },
};

module.exports = { UploadController, upload };
