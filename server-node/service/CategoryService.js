const CategoryModel = require("../model/CategoryModel");
const ObjectId = require("mongoose").Types.ObjectId;
const EmptyFieldError = require("../error/EmptyFieldError");

async function createCategory(name, type, userId) {
    if (!name || !type) {
        throw new EmptyFieldError();
    }

    const category = CategoryModel.create({
        name: name,
        type: type,
        createdBy: new ObjectId(userId)
    });

    return category;
}

async function getCategoriesByUserId(userId) {
    if (!userId) {
        throw new EmptyFieldError();
    }

    const categories = {};
    categories.default = await CategoryModel.find({ createdBy: null });
    categories.userCreated = await CategoryModel.find({ createdBy: new ObjectId(userId) });

    return categories;
}

async function updateCategory(categoryId, name, type) {
    if (!categoryId || !name || !type) {
        throw new EmptyFieldError();
    }

    const category = await CategoryModel.findOneAndUpdate({
        _id: new ObjectId(categoryId)
    }, {
        $set: {
            name: name,
            type: type
        }
    }, {
        new: true
    });

    return category;
}

async function deleteCategory(categoryId) {
    if (!categoryId) {
        throw new EmptyFieldError();
    }

    const category = await CategoryModel.findOneAndDelete({
        _id: new ObjectId(categoryId)
    });

    return category;
}

module.exports = {
    createCategory,
    getCategoriesByUserId,
    updateCategory,
    deleteCategory
}