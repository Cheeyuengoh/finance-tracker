class EmptyFieldError extends Error {
    constructor(message) {
        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;

        this.message = message || "All fields must be filled";
    }
}

module.exports = EmptyFieldError;