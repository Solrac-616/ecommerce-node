const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numViews:{
        type:Number,
        default:0,
    },
    isLiked:{
        type:Boolean,
        default:false,
    },
    isDisliked:{
        type:Boolean,
        default:false,
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    ],
    dislikes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

    ],
    image:{
        type:String,
        default:"https://imgs.search.brave.com/jAjU0mtUfB6D9RXZQqURGXcB7uUV73m84ojlSY5v3fk/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93d3cu/aGFsbGFtaW50ZXJu/ZXQuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIwLzAxL0lz/LWJsb2dnaW5nLXJl/bGV2YW50LWFueW1v/cmUuanBlZw"
    },
    autor:{
        type:String,
        default: "Admin",
    },
},
{
    toJson:{
        virtuals:true,
    },
    toObject:{
        virtuals:true,
    },
    timestamps:true,
}
);

//Export the model
module.exports = mongoose.model('Blog', blogSchema);