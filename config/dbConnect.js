const {default: mongoose} = require("mongoose");

const dbConnect = () => {
    try{
        const conn = mongoose.connect("mongodb://127.0.0.1:27017/rippleydbecommerce?ssl=false&authSource=admin");
        console.log("Databases connect Successfully");
    } catch (error){
        console.log("Databases error");
    }
};
module.exports = dbConnect;

