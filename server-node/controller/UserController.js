const UserService = require("../service/UserService");
const JWTService = require("../service/JWTService");

async function createUser(req, res) {
    console.log("/api/user/create");

    try {
        const { email, password } = req.body;
        const result = await UserService.createUser(email, password);

        return res.status(200).send({ msg: "Created user", data: result });
    } catch (error) {
        return res.status(400).send({ msg: error.message });
    }
}

async function loginUser(req, res) {
    console.log("/api/user/login");

    try {
        const { email, password } = req.body;
        const result = await UserService.loginUser(email, password);
        const accessToken = JWTService.generateAccessToken(result);
        const refreshToken = JWTService.generateRefreshToken(result);

        res.cookie("accessToken", accessToken, { httpOnly: true });
        res.cookie("refreshToken", refreshToken, { httpOnly: true });
        return res.status(200).send({ msg: "Logged in user", data: result });
    } catch (error) {
        return res.status(400).send({ msg: error.message });
    }
}

async function updatePassword(req, res) {
    console.log("/api/user/updatePassword");

    try {
        const userId = req.authenticatedUser._id;
        const { password } = req.body;
        const result = await UserService.updatePassword(userId, password);
        return res.status(200).send({ msg: "Updated password", data: result });
    } catch (error) {
        return res.status(400).send({ msg: error.message });

    }
}

async function refreshTokens(req, res) {
    console.log("/api/user/refreshTokens");

    const token = req.cookies["refreshToken"];
    if (!token) {
        return res.status(403).send({ msg: "No token provided" });
    }

    try {
        const payload = JWTService.verifyRefreshToken(token);
        const user = await UserService.getUserById(payload._id);
        const accessToken = JWTService.generateAccessToken({ _id: user._id, email: user.email });
        const refreshToken = JWTService.generateRefreshToken({ _id: user._id, email: user.email });
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.cookie("accessToken", accessToken, { httpOnly: true });
        res.cookie("refreshToken", refreshToken, { httpOnly: true });
        return res.status(200).send({ msg: "Refreshed tokens", data: { _id: user._id, email: user.email } });
    } catch (error) {
        return res.status(403).send({ msg: "refresh token:" + error.message });
    }
}

async function logoutUser(_req, res) {
    console.log("/api/user/logout");

    try {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(200).send({ msg: "Logged out user" });
    } catch (error) {
        return res.status(403).send({ msg: error.message });
    }
}

module.exports = {
    createUser,
    loginUser,
    updatePassword,
    refreshTokens,
    logoutUser
}