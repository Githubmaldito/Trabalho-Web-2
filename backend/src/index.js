import "dotenv/config";
// importando as variáveis de ambiente do arquivo .env

import cors from 'cors';//importando o middleware CORS para permitir requisições de diferentes origens
import express from 'express';
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import { connectDB } from "./lib/db.js";

const app = express();
// usando .env.PORT para definir a porta dinamicamente
const PORT = process.env.PORT || 3000;

//middleware para interpretar JSON nas requisições
app.use(express.json());


// importando as rotas de autenticação
//vai usar as rotas de - para completar o caminho
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);


app.listen(PORT, () => {
  
    console.log(`Rodando na porta ${PORT}`);
    connectDB();
});