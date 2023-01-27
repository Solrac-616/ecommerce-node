const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
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
    const findUser = await User.findOne({email});
    if(findUser && await findUser.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateuser = await User.findByIdAndUpdate(
        findUser.id,
        {
            refreshToken: refreshToken,
        },
        {
            new: true
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
        res.json(updateuser);
    } else {
        throw new Error("Credenciales Invalidas");
    }
});

// HANDLE - MANEJO DE REFRESCAR TOKEN
const handleRefreshToken = asyncHandler (async(req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No hay token nuevo en Cookies");
    const refreshToken = cookie.refreshToken;
    
    const user = await User.findOne({ refreshToken });
    
    if (!user) throw new Error("No existe el refresh token en la database o no se encontro");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("Algo esta mal con el Nuevo Token");
        }
        const accesToken = generateToken(user?._id);
        res.json({accesToken});
    });
});

//CERRAR SESION
const logout = asyncHandler(async(req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No hay token en Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204);
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: ""
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204);
});

// UPDATE - ACTUALIZAR USUARIO
const updateUser = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    validateMongoDbId(_id);
    try {
        const updateUser = await User.findByIdAndUpdate(
        _id,
        {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile
        },
        {
            new: true,
        }
    );
    res.json(updateUser);
    } catch (error) {
        throw new Error(error);
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

//TRAER USUARIO ESPECIFICO POR ID
const getaUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const getaUser = await User.findById(id);
        res.json({
            getaUser,
        });
    } catch (error) {
        throw new Error(error);
    }
});

//BORRAR USUARIO ESPECIFICO POR ID
const deleteaUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({
            deleteaUser,
        });
    } catch (error) {
        throw new Error(error);
    }
});

//Bloquear Usuario
const blockUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const blockusr = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true,
            },
            {
                new: true,
            }
        );
        res.json(blockusr);
    } catch (error) {
        throw new Error(error);
    }
});

//Desbloquear Usuario
const unblockUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false,
            },
            {
                new: true,
            }
        );
        res.json(unblock);
    } catch (error) {
        throw new Error(error);
    }
});

//CAMBIAR CONTRASEÑA
const updatePassword = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    const {password} = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    } else {
        res.json(user);
    }
});

module.exports = { createUser, loginUserCtrl, getallUser, getaUser, deleteaUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword};