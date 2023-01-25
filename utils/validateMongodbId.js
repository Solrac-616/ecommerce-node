const mongoose = require("mongoose");
const validateMongoDbId = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error("La id no es valida");
};

module.exports = validateMongoDbId;