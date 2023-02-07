const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type: String,
        required: true,
    },
    brand:{
        type:String,
        required: true,
    },
    quantity:{
        type:Number,
        required: true,
    },
    sold:{
        type:Number,
        default: 0,
    },
    portimage:{
        type:String,
        default:"https://res.cloudinary.com/dxaejyiye/image/upload/v1675797401/defaultport_via596.png",
        required: true,
    },
    subimage:{
        type:String,
        default:"https://res.cloudinary.com/dxaejyiye/image/upload/v1675797401/defaultsub_l83c6i.png",
        required: true,
    },
    images:[
        {
            public_id: String,
            url: String,
        },
    ],
    color:{
        type:String,
        required: true,
    },
    tags: String,
    ratings:[
        {
            star:Number,
            comment: String,
            postedby: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: "User",
            },
        },
    ],
    totalrating: {
        type: String,
        default: 0,
    }
},
{ timestamps: true } 
);

//Export the model
module.exports = mongoose.model('Product', productSchema);