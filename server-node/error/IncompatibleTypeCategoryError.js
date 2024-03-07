class IncompatibleTypeCategoryError extends Error {
    constructor(message) {
        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;

        this.message = message || "Type and category are incompatible";
    }
}

module.exports = IncompatibleTypeCategoryError;