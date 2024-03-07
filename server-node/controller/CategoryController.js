const CategoryService = require("../service/CategoryService");

async function createCategory(req, res) {
    console.log("/api/category/create")

    try {
        const userId = req.authenticatedUser._id;
        const { name, type } = req.body;
        const result = await CategoryService.createCategory(name, type, userId);

        return res.status(200).send({ msg: "Created category", data: result });
    } catch (error) {
        return res.status(400).send({ msg: error.message });
    }
}

async function getCategoriesByUserId(req, res) {
    console.log("/api/category/userCategories");

    try {
        const userId = req.authenticatedUser._id;
        const result = await CategoryService.getCategoriesByUserId(userId);

        return res.status(200).send({ msg: "Fetched categories", data: result });
    } catch (error) {
        return res.status(400).send({ msg: error.message });
    }
}

async function updateCategory(req, res) {
    console.log("/api/category/update");

    try {
        const { categoryId, name, type } = req.body;
        const result = await CategoryService.updateCategory(categoryId, name, type);

        return res.status(200).send({ msg: "Updated category", data: result });
    } catch (error) {
        return res.status(400).send({ msg: error.message });
    }
}

async function deleteCategory(req, res) {
    console.log("/api/category/delete");

    try {
        const { categoryId } = req.body;
        const result = await CategoryService.deleteCategory(categoryId);

        return res.status(200).send({ msg: "Deleted category", data: result });
    } catch (error) {
        return res.status(400).send({ msg: error.message });
    }
}

module.exports = {
    createCategory,
    getCategoriesByUserId,
    updateCategory,
    deleteCategory
}