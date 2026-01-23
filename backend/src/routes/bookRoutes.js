import express from 'express';
import cloudinary from '../lib/cloudinary.js';
import Livro from '../models/Livro.js';
import protectRoute from '../middleware/auth_middleware.js';

const router = express.Router();
// rota para adicionar um novo livro
//antes de adicionar, verifica se o usuário está autenticado
router.post("/", protectRoute, async (req, res) => {
//antes, usa protectRoute para garantir que o usuário está autenticado
    try {
        const {user, title, description, rating, image} = req.body;

        if(!image || !title || !description || !rating){
            return res.status(400).json({ message: "Preencha todos os campos." });

        }
            //upar a imagem para o Cloudinary
        const upload = await cloudinary.uploader.upload(image)
        const imageUrl = upload.secure_url;

        //criar o novo livro
        const livro = new Livro({
            user: req.user._id,
            title,
            description,
            rating,
            image: imageUrl,
        });

        livro.save();
        res.status(201).json(livro);

    } catch (error) {
        console.log("Algo deu errado ao criar o livro")
        res.status(500).json({message: "o erro ocorreu aqui"})
    }
});

// const retornoLivro = await fetch("http://localhost:3000/api/books?page=1&limit=5")

//rota para obter todos os livros do usuário autenticado
router.get("/", protectRoute, async (req, res) => {
    try {
        const page = req.query.page || 1;//página padrão é 1
        const limit = req.query.limit || 10;//o limite padrão será 10 caso não seja fornecido
        const skip = (page - 1) * limit;//pula os livros das páginas anteriores

        const livros = await Livro.find()
        .sort({ createdAt: -1 })//ordena do mais recente para o mais antigo
        .skip(skip)//
        .limit(limit)//limita o número de livros retornados
        .populate("user", "username profileImage");

        const totalLivros = await Livro.countDocuments();
        
        res.send({
            livros,
            page: Number(page),
            totalLivros,
            totalPages: Math.ceil(totalLivros / limit),//calcula o total de páginas
        });
    } catch (error) {
        console.log("Erro ao obter livros:", error);
        res.status(500).json({ message: "Erro ao obter livros." });
    }
})

//obter is livros recomendaodos pelo usuario logado
// CASO HAJA UM PROBLEMA
// VER AQUI
// LEMBRAR!!!
router.get("/user", protectRoute, async (req, res) => {
    try {
        const livros = await Livro.find({ user: req.user._id }).sort({ createdAt: -1 })
        .populate("user", "username profileImage");
        // res.json(livros);
    } catch (error) {
        console.log("Erro ao obter livros do usuário:", error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});

//rota para deletar um livro pelo ID
router.delete("/:id", protectRoute, async (req, res) => {

    try {
        const livro = await Livro.findById(req.params.id);

        if(!livro){
            return res.status(404).json({ message: "Livro não encontrado." });
        }
//verifica se o user é o criador do livro
//se o user que quer deletar o livro
        if(livro.user.toString() 
        //não for igual ao user autenticado
            !== req.user._id.toString()){
        //retorna um erro de não autorizado
            return res.status(403).json({ message: "Ação não autorizada." });
     
        }

// exemplo de URL da imagem no Cloudinary
//https://res.cloudinary.com/dy3n0mzzd/image/upload/v1695768283/abc123.jpg

// excluir a imagem do Cloudinary
        if(livro.image && livro.image.includes("res.cloudinary.com")){
            try {//extrai o public_id da URL da imagem
                //split divide a string em partes
                //pega a última parte da URL (nome do arquivo com extensão)
                const publicId = livro.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (deleteError) {
                console.log("Erro ao deletar imagem do Cloudinary:", deleteError);
            } 
        }    
        await livro.deleteOne();

        res.json({ message: "Livro removido." });
    } catch (error) {
        console.log("Erro ao deletar livro:", error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
})

export default router