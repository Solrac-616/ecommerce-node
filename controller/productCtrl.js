const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

//CREAR PRODUCTO
const createProduct = asyncHandler (async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (error) {
        throw new Error(error);
    }
});

//ACTUALIZAR PRODUCTO
const updateProduct = asyncHandler (async (req, res) => {
    const id = req.params.id;
    console.log(id)
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findByIdAndUpdate( id, req.body, {
            new:true,
        });
        res.json(updateProduct);
    } catch (error) {
        throw new Error(error);
    }
});

//BORRAR PRODUCTO
const deleteProduct = asyncHandler (async (req, res) => {
    const id = req.params.id;
    try {
        const deleteProduct = await Product.findByIdAndDelete(id);
        res.json(deleteProduct);
    } catch (error) {
        throw new Error(error);
    }
});

//TRAER PRODUCTO POR ID
const getaProduct = asyncHandler (async (req, res) => {
    const {id} = req.params;
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});

//TRAER TODOS LOS PRODUCTOS
const getAllProduct = asyncHandler (async (req, res) => {
    try {
        // FILTERING
        const queryObj = { ...req.query};
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        console.log(queryObj);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        let query = Product.find(JSON.parse(queryStr));

        // SORTING - ORDENAR
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt");
        }

        // LIMITANDO CAMPOS
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query=query.select('-__v');
        }

        //PAGINACION
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        console.log(page, limit, skip);
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error("esta pagina no existe");
        }

        const product = await query;
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
});

const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try {
        const user = await User.findById(_id);
        const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
        if (alreadyadded) {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $pull: {wishlist: prodId},
                },
                {
                    new: true,
                }
            );
            res.json(user);
        } else {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $push: {wishlist: prodId},
                },
                {
                    new: true,
                }
            );
            res.json(user);
        }
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct, addToWishlist};