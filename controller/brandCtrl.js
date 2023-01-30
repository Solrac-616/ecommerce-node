const Brand = require('../models/brandModel');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

//CREAR CATEGORIA
const createBrand = asyncHandler(async (req, res) => {
    try {
        const newBrand = await Brand.create(req.body);
        res.json(newBrand);
    } catch (error) {
        throw new Error(error);
    }
});

//ACTUALIZAR CATEGORIA CATEGORIA POR ID
const updateBrand = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updateBrand);
    } catch (error) {
        throw new Error(error);
    }
});

//BORRAR CATEGORIA CATEGORIA POR ID
const deleteBrand = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deleteBrand = await Brand.findByIdAndDelete(id);
        res.json(deleteBrand);
    } catch (error) {
        throw new Error(error);
    }
});

//TRAER CATEGORIA POR ID
const getBrand = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const getaBrand = await Brand.findById(id);
        res.json(getaBrand);
    } catch (error) {
        throw new Error(error);
    }
});

//TRAER TODAS LAS CATEGORIAS
const getAllBrand = asyncHandler(async (req, res) => {
    try {
        const getallBrand = await Brand.find();
        res.json(getallBrand);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { createBrand, updateBrand, deleteBrand, getBrand, getAllBrand};