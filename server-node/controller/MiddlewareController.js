const JWTService = require("../service/JWTService");
const UserService = require("../service/UserService");

async function isAuthenticated(req, res, next) {
    console.log("Authenticating...");

    const token = req.cookies["accessToken"];
    if (!token) {
        return res.status(403).send({ msg: "no token provided" });
    }

    try {
        const payload = JWTService.verifyAccessToken(token);
        const user = await UserService.getUserById(payload._id);
        req.authenticatedUser = user;
        next();
    } catch (error) {
        return res.status(403).send({ msg: "access token:" + error.message });
    }
}

module.exports = {
    isAuthenticated
}