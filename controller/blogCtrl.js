const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

//CREAR BLOG
const createBlog = asyncHandler(async (req, res) =>{
    try {
        const newBlog = await Blog.create(req.body);
        res.json({
            status: "success",
            newBlog,
        });
    } catch (error) {
        throw new Error(error);
    }
});

//ACTUALIZAR BLOG POR ID
const updateBlog = asyncHandler(async (req, res) =>{
    const {id} = req.params;
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
           new: true, 
        });
        res.json(updateBlog);
    } catch (error) {
        throw new Error(error);
    }
});

//TRAER BLOG POR ID
const getBlog = asyncHandler(async (req, res) =>{
    const {id} = req.params;
    try {
        const getBlog = await Blog.findById(id);
        const updateViews = await Blog.findByIdAndUpdate(
            id,
            {
                $inc: {numViews: 1},
            },
            { new: true }
        )
        res.json(updateViews);
    } catch (error) {
        throw new Error(error);
    }
});

//TRAER TODOS LOS BLOGS


module.exports = {createBlog, updateBlog, getBlog};