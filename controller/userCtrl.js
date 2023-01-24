const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");

//REGISTRAR USUARIO
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email:email});
    if (!findUser) {
        //Crear nuevo usuario
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error("User Already Exists");
    }
});

//LOGIN DE USUARIO
const loginUserCtrl = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    // Buscar si existe
    const findUser = await User.findOne({email:email});
    if(findUser && await findUser.isPasswordMatched(password)){
        res.json({
            id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    } else {
        throw new Error("Credenciales Invalidas");
    }
});

//TRAER TODOS LOS USUARIOS
const getallUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers)
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { createUser, loginUserCtrl, getallUser};