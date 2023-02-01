const BlogCategory = require('../models/blogCatModel');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

//CREAR CATEGORIA
const createBlogcategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await BlogCategory.create(req.body);
        res.json(newCategory);
    } catch (error) {
        throw new Error(error);
    }
});

//ACTUALIZAR CATEGORIA CATEGORIA POR ID
const updateBlogcategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const updateCategory = await BlogCategory.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updateCategory);
    } catch (error) {
        throw new Error(error);
    }
});

//BORRAR CATEGORIA CATEGORIA POR ID
const deleteBlogcategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deleteCategory = await BlogCategory.findByIdAndDelete(id);
        res.json(deleteCategory);
    } catch (error) {
        throw new Error(error);
    }
});

//TRAER CATEGORIA POR ID
const getBlogcategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const getaCategory = await BlogCategory.findById(id);
        res.json(getaCategory);
    } catch (error) {
        throw new Error(error);
    }
});

//TRAER TODAS LAS CATEGORIAS
const getAllBlogcategory = asyncHandler(async (req, res) => {
    try {
        const getallCategory = await BlogCategory.find();
        res.json(getallCategory);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
  createBlogcategory,
  updateBlogcategory,
  deleteBlogcategory,
  getBlogcategory,
  getAllBlogcategory,
};