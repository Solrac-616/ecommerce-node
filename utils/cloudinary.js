const cloudinary = require ("cloudinary");

// Configuration 
cloudinary.config({
    cloud_name: "dxaejyiye",
    api_key: "375848217581894",
    api_secret: "K75LwqNqrEh3Y9vpBxYglIBRxh8"
  });

const cloudinaryUploadImg = async (fileToUploads) =>  {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUploads, (result) => {
            resolve(
                {
                    url: result.secure_url,

                },
                {
                    resource_type: "auto",
                }
            );
        });
    });
};

module.exports = cloudinaryUploadImg;