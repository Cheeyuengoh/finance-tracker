const router = require("express").Router();
const TransactionController = require("../controller/TransactionController");
const MiddlewareController = require("../controller/MiddlewareController");

router.post("/create", MiddlewareController.isAuthenticated, TransactionController.createTransaction);
router.get("/userTransactions", MiddlewareController.isAuthenticated, TransactionController.getTransactionsByUserId);
router.post("/update", MiddlewareController.isAuthenticated, TransactionController.updateTransaction);
router.post("/delete", MiddlewareController.isAuthenticated, TransactionController.deleteTransaction);

module.exports = router;