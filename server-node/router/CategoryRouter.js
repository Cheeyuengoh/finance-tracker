const router = require("express").Router();
const CategoryController = require("../controller/CategoryController");
const MiddlewareController = require("../controller/MiddlewareController");

router.post("/create", MiddlewareController.isAuthenticated, CategoryController.createCategory);
router.get("/userCategories", MiddlewareController.isAuthenticated, CategoryController.getCategoriesByUserId);
router.post("/update", MiddlewareController.isAuthenticated, CategoryController.updateCategory);
router.post("/delete", MiddlewareController.isAuthenticated, CategoryController.deleteCategory);

module.exports = router;