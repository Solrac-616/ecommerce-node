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
    validateMongoDbId(id);
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
    validateMongoDbId(id);
    try {
        const getBlog = await Blog.findById(id)
        .populate("likes")
        .populate("dislikes");
        const updateViews = await Blog.findByIdAndUpdate(
            id,
            {
                $inc: {numViews: 1},
            },
            { new: true }
        )
        res.json({
            getBlog,
            updateViews
        });
    } catch (error) {
        throw new Error(error);
    }
});

//TRAER TODOS LOS BLOGS
const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const getBlogs = await Blog.find();
        res.json(getBlogs);
    } catch (error) {
        throw new Error(error);
    }
});

//BORRAR BLOG POR ID
const deleteBlog = asyncHandler(async (req, res) =>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.json(deletedBlog);
    } catch (error) {
        throw new Error(error);
    }
});

//LIKE DE BLOG
const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);
    
    //ENCONTRAR EL BLOG DEL ID
    const blog = await Blog.findById(blogId);
    //VERIFICAR EL USUARIO LOGUEADO
    const loginUserId = req?.user?._id;
    //VERIFICAR SI EL USUARIO DIO LIKE AL BLOG
    const isLiked = blog?.isLiked;
    //VERIFICAR SU EL USUARIO DIO DISLIKE AL BLOG
    const alreadyDisliked = blog?.dislikes?.find(
        (userId) => userId.toString() === loginUserId?.toString()
    );
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: {dislikes: loginUserId},
                isDisliked: false,
            },
            { new: true }
        );
        res.json(blog);
    };
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: {likes: loginUserId},
                isLiked: false,
            },
            { new: true }
        );
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: {likes: loginUserId},
                isLiked: true,
            },
            { new: true } 
        );
        res.json(blog);
    }

});

//DISLIKE DE BLOG
const dislikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);
    
    //ENCONTRAR EL BLOG DEL ID
    const blog = await Blog.findById(blogId);
    //VERIFICAR EL USUARIO LOGUEADO
    const loginUserId = req?.user?._id;
    //VERIFICAR SI EL USUARIO DIO LIKE AL BLOG
    const isDisLiked = blog?.isDisliked;
    //VERIFICAR SU EL USUARIO DIO DISLIKE AL BLOG
    const alreadyLiked = blog?.likes?.find(
        (userId) => userId.toString() === loginUserId?.toString()
    );
    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: {likes: loginUserId},
                isLiked: false,
            },
            { new: true }
        );
        res.json(blog);
    };
    if (isDisLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: {dislikes: loginUserId},
                isDisliked: false,
            },
            { new: true }
        );
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: {dislikes: loginUserId},
                isDisliked: true,
            },
            { new: true } 
        );
        res.json(blog);
    }

});

module.exports = {createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, dislikeBlog};