import mongoose from "mongoose";
import bcrypt from "bcryptjs";

//esse schema define a estrutura do usuarrio no BD
//cada field é um atributo do usuario
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        minlength: 8,
    },
    profileImage:{
        type: String,
        default: "",
    }
}, {timestamps: true});


//antes de salvar o usuario, faz o hash da senha    
userSchema.pre("save", async function(next){
//faz o hash apenas se a senha foi modificada ou é nova
    if(!this.isModified("password")) return next();

//"salt" é um valor aleatório adicionado à senha antes de fazer o hash
//assim, mesmo que dois usuários tenham a mesma senha, os hash serão diferentes
    const salt = await bcrypt.genSalt(10);
//faz o hash da senha com o salt gerado
    this.password = await bcrypt.hash(this.password, salt);
//continua para a próxima etapa 
    //next();
 });

//método para comparar a senha fornecida com a senha armazenada
userSchema.methods.matchPassword = async function(userPassword){
    return await bcrypt.compare(userPassword, this.password);

}

const User = mongoose.model("User", userSchema);
export default User;