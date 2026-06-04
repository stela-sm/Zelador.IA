import "dotenv/config";
import { listen } from "./src/app.js";

const PORT = process.env.PORT || 3001;
listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
