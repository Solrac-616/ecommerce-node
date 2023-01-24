const express = require("express");
const { createUser, loginUserCtrl, getallUser } = require("../controller/userCtrl");
const router = express.Router();
createUser

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.get("/all-users", getallUser);

module.exports = router;