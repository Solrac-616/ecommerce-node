const {default: mongoose} = require("mongoose");

const dbConnect = () => {
    try{
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log("Databases connect Successfully");
    } catch (error){
        console.log("Databases error");
    }
};
module.exports = dbConnect;

