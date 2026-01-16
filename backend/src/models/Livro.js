import mongoose from 'mongoose';

const livroSchema = new mongoose.Schema({

    titulo: {
        type: String,
        required: true,
    },
    comentario:{
        type: String,
        required: true,
    },
    nota:{
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    imagem:{
        type: String,
        required: true,
    }
    

}, { timestamps: true });

const Livro = mongoose.model('Livro', livroSchema);
export default Livro;