class InvalidEmailPasswordError extends Error {
    constructor(message) {
        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;

        this.message = message || "Invalid email or password";
    }
}

module.exports = InvalidEmailPasswordError;