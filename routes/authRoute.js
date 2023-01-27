const express = require("express");
const { createUser, loginUserCtrl, getallUser, getaUser, deleteaUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword } = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();
createUser

router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.post("/login", loginUserCtrl);
router.get("/logout", logout);
router.get("/all-users", getallUser);
//Ruta para refrescar Token
router.get("/refresh", handleRefreshToken);
//ACTUALIZAR CONTRASEÑA
router.put("/password", authMiddleware, updatePassword)

router.get("/:id", authMiddleware, isAdmin, getaUser);
router.delete("/:id", authMiddleware, isAdmin, deleteaUser);
router.put("/edit-user", authMiddleware, updateUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);


module.exports = router;