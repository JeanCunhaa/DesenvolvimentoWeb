module.exports = {
    eAdmin: function(req, res, next){
        if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next();
        }
        req.flash('error.msg', 'Você precisar sem um administrador!')
        res.redirect("/")
    }
    
}