import mongoose from 'mongoose';

const livroSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    rating:{
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
    image:{
        type: String,
        required: true,
    }
    

}, { timestamps: true });

const Livro = mongoose.model('Livro', livroSchema);
export default Livro;