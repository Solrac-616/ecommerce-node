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
        default:"https://imgs.search.brave.com/jAjU0mtUfB6D9RXZQqURGXcB7uUV73m84ojlSY5v3fk/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93d3cu/aGFsbGFtaW50ZXJu/ZXQuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIwLzAxL0lz/LWJsb2dnaW5nLXJl/bGV2YW50LWFueW1v/cmUuanBlZw",
        required: true,
    },
    subimage:{
        type:String,
        default:"https://imgs.search.brave.com/jAjU0mtUfB6D9RXZQqURGXcB7uUV73m84ojlSY5v3fk/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93d3cu/aGFsbGFtaW50ZXJu/ZXQuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIwLzAxL0lz/LWJsb2dnaW5nLXJl/bGV2YW50LWFueW1v/cmUuanBlZw",
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