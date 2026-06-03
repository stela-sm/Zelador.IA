const express = require("express");
const cors = require("cors");
require("dotenv").config();

const chamadoRoutes = require("./routes/chamado.routes");
const uploadRoutes = require("./routes/upload.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chamados", chamadoRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => res.json({ status: "ok" }));

app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working",
    supabaseUrl: process.env.SUPABASE_URL,
    hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const supabase = require("./lib/supabase");
    const { data, error } = await supabase
      .from("chamados")
      .select("*")
      .limit(1);

    if (error) {
      return res.status(500).json({
        error: error.message,
        details: error,
        code: error.code,
      });
    }

    res.json({
      message: "Database connection successful",
      data: data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// Logging middleware para debug
app.use((req, res, next) => {
  if (req.path.includes("/upload")) {
    console.log("Upload request:", {
      method: req.method,
      path: req.path,
      contentType: req.get("content-type"),
      headers: req.headers,
    });
  }
  next();
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Express error handler:", err.message);
  console.error("Error stack:", err.stack);
  res.status(500).json({ error: err.message || "Internal server error" });
});

module.exports = app;
