const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
const {eAdmin} = require ("../helpers/eAdmin")

router.get('/', eAdmin, (req,res) => {
    res.render("admin/index")
})


router.get("/categorias", eAdmin, (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash('error_msg', "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
})

router.post("/categorias/nova", eAdmin, (req, res) => {
    
    let erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    }
    
    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(() => {
        req.flash('success_msg', 'Categoria criada com sucesso!')
        console.log("Categoria salva com sucesso")
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao salvar a categoria, Tente novamente!' + err)
        res.redirect("/admin")
    })
})

router.get("/categorias/add", eAdmin, (req, res) => {
    res.render("admin/addcategorias")
})


module.exports = router