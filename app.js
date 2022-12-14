const express = require('express')
const { engine } = require ('express-handlebars');
const bodyParser = require('body-parser')
const app = express()
const admin = require("./routes/admin")
const path = require("path")
const mongoose = require('mongoose')
const session = require("express-session");
const flash = require("connect-flash")
const usuarios = require("./routes/usuario")
const passport = require ("passport")
require ("./config/auth")(passport) 
const db = require("./config/db")
const uploadUser = require('./middlewares/uploadImage')
//config
    //sessão
    app.use(session({
        secret: "sitedanike",
        resave: true,
        saveUninitialized: true
    }))

    app.use(passport.initialize())
    app.use(passport.session())

    app.use(flash())
    //Middleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null;
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
    mongoose.connect(db.mongoURI, {
        useNewUrlParser: true
    }).then(() => {
        console.log("MongoDB conectado....")
    }).catch((err) => {
        console.log("Houve um erro ao se conectar ao MongoDB: " + err)
    })


    //Public
    app.use(express.static(path.join(__dirname, "public")))

    app.use((req, res, next) => {
        console.log("Middleware!")
        next()
    })
//rotas
    app.get("/", (req, res) => {
        res.render("index")
    })

    app.post("/upload-image", uploadUser.single('image'), async (req, res) => {
        
        if(req.file){
            return res.json({
                erro: false,
                mensagem: "Upload realizado com sucesso"
            })
        }
        
        return res.status(400).json({
            erro:true,
            mensagem: "Erro: Upload não realizado com sucesso, necessário enviar uma imagem com extensão PNG/JPG"
        })
        
    })

    app.use('/admin', admin)
    app.use("/usuarios", usuarios)

//outros
const PORT = process.env.PORT || 8081 || 3333
app.listen(PORT, () => {
    console.log("Servidor rodando....")
})