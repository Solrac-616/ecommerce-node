const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const uniqid = require("uniqid");

const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("./emailCtrl");

//REGISTRAR USUARIO
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email:email});
    if (!findUser) {
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
    if(findUser && (await findUser.isPasswordMatched(password))){
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

// INICIAR SESION PARA ADMIN
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check if user exists or not
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== "admin") throw new Error("Acceso no Autorizado");
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findAdmin?._id);
      const updateuser = await User.findByIdAndUpdate(
        findAdmin.id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.json({
        _id: findAdmin?._id,
        firstname: findAdmin?.firstname,
        lastname: findAdmin?.lastname,
        email: findAdmin?.email,
        mobile: findAdmin?.mobile,
        token: generateToken(findAdmin?._id),
      });
    } else {
      throw new Error("Invalid Credentials");
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
        refreshToken: "",
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

// DIRECCION DE USUARIO
const saveAddress = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
          address: req?.body?.address,
        },
        {
          new: true,
        }
      );
      res.json(updatedUser);
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

//RECUPERAR CONTRASEÑA
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if (!user) throw new Error("No se encontro usuario con este email");
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Por favor ingresa al siguiente Link para resetear tu contraseña en los siguientes 10 minutos <a href='http://localhost:4000/api/user/auth/reset-password/${token}'> click aquí </a>`
        const data = {
            to: email,
            text: "Rippley - Eso ta' listo",
            subject: "Recuperar contraseña",
            html: resetURL,
        };
        sendEmail(data);
        res.json(token);
    } catch (error) {
        throw new Error(error);
    }
});

//RESETEAR CONTRASEÑA
const resetPassword = asyncHandler (async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now()},
    });
    if (!user) throw new Error("El token ha Expirado");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExperis = undefined;
    await user.save();
    res.json(user);
});

//TRAER LISTA DE DESEOS
const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
      const findUser = await User.findById(_id).populate("wishlist");
      res.json(findUser);
    } catch (error) {
        throw new Error(error);
    }
});

//CARRITO DE USUARIO
const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    let products = [];
    const user = await User.findById(_id);
    // check if user already have product in cart
    const alreadyExistCart = await Cart.findOne({ orderby: user._id });
    if (alreadyExistCart) {
      alreadyExistCart.remove();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user?._id,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

//TRAER CARRITO DE USUARIO
const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.findOne({ orderby: _id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

//VACIAR CARRITO DE USUARIO
const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndRemove({ orderby: user._id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

//USAR CUPON DE DESCUENTO
const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon === null) {
    throw new Error("Invalid Coupon");
  }
  const user = await User.findOne({ _id });
  let { cartTotal } = await Cart.findOne({
    orderby: user._id,
  }).populate("products.product");
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
});

//CREAR ORDEN DE COMPRA
const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    if (!COD) throw new Error("Create cash order failed");
    const user = await User.findById(_id);
    let userCart = await Cart.findOne({ orderby: user._id });
    let finalAmout = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmout = userCart.totalAfterDiscount;
    } else {
      finalAmout = userCart.cartTotal;
    }

    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmout,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderby: user._id,
      orderStatus: "Cash on Delivery",
    }).save();
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});
    res.json({ message: "success" });
  } catch (error) {
    throw new Error(error);
  }
});

//TRAER UNA ORDEN DE USUARIO
const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const userorders = await Order.findOne({ orderby: _id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
});

//TRAER TODAS LAS ORDENES
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const alluserorders = await Order.find()
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(alluserorders);
  } catch (error) {
    throw new Error(error);
  }
});

//ACTUALIZAR ORDEN
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    res.json(updateOrderStatus);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
  getAllOrders,
};