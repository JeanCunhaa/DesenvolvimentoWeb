const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Categoria = new Schema({
    logradouro: {
        type: String,
        required: true
    },
    cep: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("categorias", Categoria)