if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://jeancunha:jeanjean213@cluster0.dy4avxc.mongodb.net/?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/sitenike"}
}