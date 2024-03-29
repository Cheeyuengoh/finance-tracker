class DuplicateEmailError extends Error {
    constructor(message) {
        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;

        this.message = message || "Email is already in use";

    }
}

module.exports = DuplicateEmailError;