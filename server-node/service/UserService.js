const UserModel = require("../model/UserModel");
const bcrypt = require("bcrypt");
const ObjectId = require("mongoose").Types.ObjectId;
const EmptyFieldError = require("../error/EmptyFieldError");
const DuplicateEmailError = require("../error/DuplicateEmailError");
const InvalidEmailPasswordError = require("../error/InvalidEmailPasswordError");
const UserNotFoundError = require("../error/UserNotFoundError");

async function createUser(email, password) {
    if (!email || !password) {
        throw new EmptyFieldError();
    }

    //Check if email exists
    const emailExists = await UserModel.findOne({ email });
    if (emailExists) {
        throw new DuplicateEmailError();
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Save to database
    const user = UserModel.create({
        email: email,
        password: hashedPassword
    });

    return user;
}

async function loginUser(email, password) {
    if (!email || !password) {
        throw new EmptyFieldError();
    }

    //Check if email exists
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new InvalidEmailPasswordError();
    }

    //Check if password match
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
        throw new InvalidEmailPasswordError();
    }

    return {
        _id: user._id,
        email: user.email
    };
}

async function updatePassword(userId, password) {
    if (!userId || !password) {
        throw new EmptyFieldError();
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Update to database
    const user = await UserModel.findOneAndUpdate({
        _id: new ObjectId(userId)
    }, {
        $set: {
            password: hashedPassword
        }
    }, {
        new: true
    });

    return user;
}

async function getUserById(userId) {
    if (!userId) {
        throw new EmptyFieldError();
    }

    const user = await UserModel.findOne({ _id: new ObjectId(userId) });
    if (!user) {
        throw new UserNotFoundError();
    }

    return user;
}

module.exports = {
    createUser,
    loginUser,
    updatePassword,
    getUserById
}