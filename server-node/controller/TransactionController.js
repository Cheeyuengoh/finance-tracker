const TransactionService = require("../service/TransactionService");

async function createTransaction(req, res) {
    console.log("/api/transaction/create");

    try {
        const userId = req.authenticatedUser._id;
        const { amount, type, category, date } = req.body;
        const result = await TransactionService.createTransaction(amount, type, category, date, userId);

        return res.status(200).send({ msg: "Created transaction", data: result });
    } catch (error) {
        return res.status(400).send({ msg: error.message });
    }
}

async function getTransactionsByUserId(req, res) {
    console.log("/api/transaction/userTransactions");

    try {
        const userId = req.authenticatedUser._id;
        const result = await TransactionService.getTransactionsByUserId(userId);

        return res.status(200).send({ msg: "Fetched transactions", data: result });
    } catch (error) {
        return res.status(400).send({ msg: error.message });
    }
}

async function updateTransaction(req, res) {
    console.log("/api/transaction/update");

    try {
        const userId = req.authenticatedUser._id;
        const { transactionId, amount, type, category, date } = req.body;
        const result = await TransactionService.updateTransaction(transactionId, amount, type, category, date, userId);

        return res.status(200).send({ msg: "Updated transaction", data: result });
    } catch (error) {
        return res.status(400).send({ msg: error.message });
    }
}

async function deleteTransaction(req, res) {
    console.log("/api/transaction/delete");

    try {
        const { transactionId } = req.body;
        const result = await TransactionService.deleteTransaction(transactionId);

        return res.status(200).send({ msg: "Deleted transaction", data: result });
    } catch (error) {
        return res.status(400).send({ msg: error.message });

    }
}

module.exports = {
    createTransaction,
    getTransactionsByUserId,
    updateTransaction,
    deleteTransaction
}