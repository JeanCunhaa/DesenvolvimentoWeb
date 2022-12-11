const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
const {eAdmin} = require ("../helpers/eAdmin")

router.get('/', (req,res) => {
    res.render("admin/index")
})


router.get("/categorias", (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash('error_msg', "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
})

router.post("/categorias/nova", (req, res) => {
    
    let erros = []

    if(!req.body.logradouro || typeof req.body.logradouro == undefined || req.body.logradouro == null){
        erros.push({texto: "Logradouro inválido"})
    }
    if(!req.body.cep || typeof req.body.cep == undefined || req.body.cep == null){
        erros.push({texto: "Cep inválido"})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    }
    
    const novaCategoria = {
        logradouro: req.body.logradouro,
        cep: req.body.cep
    }

    new Categoria(novaCategoria).save().then(() => {
        req.flash('success_msg', 'Categoria criada com sucesso!')
        console.log("Categoria salva com sucesso")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao salvar a categoria, Tente novamente!' + err)
        res.redirect("/admin/categorias")
    })
})

router.get("/categorias/add", (req, res) => {
    res.render("admin/addcategorias")
})


module.exports = router