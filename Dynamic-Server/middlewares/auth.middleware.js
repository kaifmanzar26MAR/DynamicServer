const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistTokenSchema = require("../models/blacklistToken.model");

module.exports.authMiddleware = async (req, res, next) => {
    //*Get token from the request
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        //*Check if token is blacklisted
        const isTokenBlacklisted = await blacklistTokenSchema.findOne({ token });
        if(isTokenBlacklisted) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;

        return next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });   
    }

}


module.exports.adminMiddleware = async (req, res, next) => {
    //*Get token from the request
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        //*Check if token is blacklisted
        const isTokenBlacklisted = await blacklistTokenSchema.findOne({ token });
        if(isTokenBlacklisted) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await userModel.findById(decoded._id);
        if (!admin) {
            return res.status(404).json({ message: "User not found" });
        }
        if(admin.role != 'admin'){
            throw new Error("Unauthorized");
        }

        req.admin = admin;

        return next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });   
    }

}