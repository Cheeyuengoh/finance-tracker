class UserNotFoundError extends Error {
    constructor(message) {
        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;

        this.message = message || "User not found";
    }
}

module.exports = UserNotFoundError;