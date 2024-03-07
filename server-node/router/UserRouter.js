const router = require("express").Router();
const UserController = require("../controller/UserController");
const MiddlewareController = require("../controller/MiddlewareController");

router.post("/create", UserController.createUser);
router.post("/login", UserController.loginUser);
router.post("/updatePassword", MiddlewareController.isAuthenticated, UserController.updatePassword);
router.get("/refreshTokens", UserController.refreshTokens);
router.get("/logout", UserController.logoutUser);

module.exports = router;