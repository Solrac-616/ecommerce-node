const express = require("express");
const { createUser, loginUserCtrl, getallUser, getaUser, deleteaUser, updateUser } = require("../controller/userCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();
createUser

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.get("/all-users", getallUser);
router.get("/:id", authMiddleware , getaUser);
router.delete("/:id", deleteaUser);
router.put("/:id", updateUser);

module.exports = router;