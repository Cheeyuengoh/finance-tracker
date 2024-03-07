class CategoryNotFoundError extends Error {
    constructor(message) {
        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;

        this.message = message || "Category not found";
    }
}

module.exports = CategoryNotFoundError;