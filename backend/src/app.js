import express from "express";
import cors from "cors";
import "dotenv/config";

import chamadoRoutes from "./routes/chamado.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chamados", chamadoRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => res.json({ status: "ok" }));

// Error handler
app.use((err, req, res, next) => {
  console.error("Express error handler:", err.message);
  console.error("Error stack:", err.stack);
  res.status(500).json({ error: err.message || "Internal server error" });
});

export const listen = (port, callback) => {
  const server = app.listen(port, callback);
  return server;
};

export default app;
