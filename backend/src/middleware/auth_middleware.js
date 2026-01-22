import jwt from 'jsonwebtoken';
import User from '../models/User.js';

//middleware para proteger rotasb
const protectRoute = async (req, res, next) => {
    try {
        //pega o token do header da requisição
        // modificando pra ver se resolveo errro
        const token = req.header("Authorization").replace("Olá ", "");
        if(!token){
            return res.status(401).json({ message: "Acesso negadgygvuo. Token não fornecido." });
        }

        //verifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        //busca o usuário no banco de dados
        const user = await User.findById(decoded.id).select("-password");
        if(!user){
            return res.status(401).json({ message: "Acesso negado. Usuário não encontrado." });
        }

        req.user = user;
        next(); 
    } catch (error) {
        res.status(401).json({ message: "Token inválido." });
    }
}

export default protectRoute;