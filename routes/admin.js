const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
const {eAdmin} = require ("../helpers/eAdmin")

router.get('/', eAdmin, (req,res) => {
    res.render("admin/index")
})


router.get("/categorias", (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash('error_msg', "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })

    /*for(i of Categoria.querySelectorAll('[search]')){
        try{
            busca(i,Categoria.querySelector("#"+i.getAttribute('search')))
        }catch(e){}
    }
    
    function busca(input_field,div){
        input_field.onkeyup=function(e){
            for(di of div.children){
                r  = new RegExp(this.value,"g")
                if(di.getAttribute("nome").toLowerCase().match(r) != null)
                    di.style.removeProperty('display')
                else
                    di.style.display = "none"
            }
        }
    }*/

})

router.post("/categorias/nova", eAdmin, (req, res) => {
    
    let erros = []

    if(!req.body.logradouro || typeof req.body.logradouro == undefined || req.body.logradouro == null || req.body.logradouro.length < 3){
        erros.push({texto: "Logradouro inválido"})
    }
    if(!req.body.cep || typeof req.body.cep == undefined || req.body.cep == null || req.body.cep.length < 3){
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

router.get("/categorias/add", eAdmin,  (req, res) => {
    res.render("admin/addcategorias")
})


module.exports = router