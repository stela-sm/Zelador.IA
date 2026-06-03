require("dotenv").config(); // tem que ser o PRIMEIRO
const app = require("./src/app");

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
