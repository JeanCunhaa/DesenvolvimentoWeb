const express = require('express')
const { engine } = require ('express-handlebars');
const bodyParser = require('body-parser')
const app = express()
const admin = require("./routes/admin")
const path = require("path")
const mongoose = require('mongoose')
const session = require("express-session");
const flash = require("connect-flash")

//config
    //sessão
    app.use(session({
        secret: "cursodenode",
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())
    //Middleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg - req.flash('error_msg')
        next()
    })
     /*app.use((req, res, next) => {
            res.locals.success_msg = req.flash(('success_msg')[0]);
            res.locals.error_msg = req.flash(('error_msg')[0]);
            next();
        })*/

    //BodyParser
    app.use(express.json());
    app.use(express.urlencoded({extended:true}))
    //Handlebars
    app.engine('handlebars', engine());
    app.set('view engine', 'handlebars');
    app.set("layouts", "main");
    //mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/blogapp", {
        useNewUrlParser: true
    }).then(() => {
        console.log("MongoDB conectado....")
    }).catch((err) => {
        console.log("Houve um erro ao se conectar ao MongoDB: " + err)
    })


    //Public
    app.use(express.static(path.join(__dirname, "public")))

    app.use((req, res, next) => {
        console.log("Oi eu sou um middleware!")
        next()
    })
//rotas

    app.use('/admin', admin)

//outros
const PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor rodando....")
})