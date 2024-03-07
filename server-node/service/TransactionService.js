const TransactionModel = require("../model/TransactionModel");
const CategoryModel = require("../model/CategoryModel");
const ObjectId = require("mongoose").Types.ObjectId;
const EmptyFieldError = require("../error/EmptyFieldError");
const CategoryNotFoundError = require("../error/CategoryNotFoundError");
const IncompatibleTypeCategoryError = require("../error/IncompatibleTypeCategoryError");

async function createTransaction(amount, type, category, date, userId) {
    if (!amount || !type || !category || !date || !userId) {
        throw new EmptyFieldError();
    }

    //check if category exists and transaction type is equal
    const categories = await CategoryModel.find({
        $or: [{
            createdBy: null
        }, {
            createdBy: new ObjectId(userId)
        }]
    });

    const filtered = categories.filter((e) => {
        return e.name === category;
    });

    if (filtered.length === 0) {
        throw new CategoryNotFoundError();
    }

    if (filtered[0].type !== type) {
        throw new IncompatibleTypeCategoryError();
    }

    //Save to database
    const createdTransaction = await TransactionModel.create({
        amount: parseFloat(amount).toFixed(2),
        typeCategory: new ObjectId(filtered[0]._id),
        date: new Date(date),
        user: new ObjectId(userId)
    });

    const transaction = await TransactionModel.findOne({
        _id: new ObjectId(createdTransaction._id)
    }).populate("typeCategory");

    return transaction;
}

async function getTransactionsByUserId(userId) {
    if (!userId) {
        throw new EmptyFieldError();
    }

    const transactions = await TransactionModel.find({
        user: new ObjectId(userId)
    }).populate("typeCategory");

    return transactions;
}

async function updateTransaction(transactionId, amount, type, category, date, userId) {
    if (!transactionId || !amount || !type || !category || !date) {
        throw new EmptyFieldError();
    }

    //check if category exists and transaction type is equal
    const categories = await CategoryModel.find({
        $or: [{
            createdBy: null
        }, {
            createdBy: new ObjectId(userId)
        }]
    });

    const filtered = categories.filter((e) => {
        return e.name === category;
    });

    if (filtered.length === 0) {
        throw new CategoryNotFoundError();
    }

    if (filtered[0].type !== type) {
        throw new IncompatibleTypeCategoryError();
    }

    const updatedTransaction = await TransactionModel.findOneAndUpdate({
        _id: new ObjectId(transactionId)
    }, {
        $set: {
            amount: parseFloat(amount).toFixed(2),
            typeCategory: new ObjectId(filtered[0]._id),
            date: date
        }
    }, {
        new: true
    });

    const transaction = await TransactionModel.findOne({
        _id: new ObjectId(updatedTransaction._id)
    }).populate("typeCategory");

    return transaction;
}

async function deleteTransaction(transactionId) {
    if (!transactionId) {
        throw new EmptyFieldError();
    }

    const transaction = await TransactionModel.findOneAndDelete({
        _id: new ObjectId(transactionId)
    });

    return transaction;
}


module.exports = {
    createTransaction,
    getTransactionsByUserId,
    updateTransaction,
    deleteTransaction
}