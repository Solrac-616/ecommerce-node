const Product = require("../models/productModel");
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
    console.log(req.query);
    try {
        const getallProduct = await Product.find({
            
        });
        res.json(getallProduct);
    } catch (error) {
        throw new Error(error);
    }
});

//FILTRAR PRODUCTOS
const filterProduct = asyncHandler (async (req, res) =>{
    const {minprice, maxprice, color, category, availablity, brand} = req.params;
    console.log(req.query);

    try {
        const filterProduct = await Product.find({
            price:{
                $gte: minprice,
                $lte: maxprice,
            },
            category,
            brand,
            color,
        });
        res.json(filterProduct);
    } catch (error) {
        res.json(error);
    }

    res.json({minprice, maxprice, color, category, availablity, brand});
});

module.exports = {createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct};