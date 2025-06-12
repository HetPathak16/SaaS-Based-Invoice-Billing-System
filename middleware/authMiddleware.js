const jwt = require('jsonwebtoken');
const { sendResponse } = require('../models/responsehandler')
const allowedUser = [ '/api/auth/profile'];
const notallowAdmin = ['/api/payment/:id'];
const tokenBlacklist = require('../utils/blackListToken')

exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        // console.log('this is role',req.user.role)
        const path = req.originalUrl;
        // console.log(path)
        if (tokenBlacklist.has(token)) {
            return sendResponse(res,403,'Token expired . plaease login agian')
        }
        if (req.user.role === 'user' ) {
            if (allowedUser.includes(path) || notallowAdmin.includes(path)) {
                return next();
            } else {
                return sendResponse(res,403,'User not authorized for this route')
            }
        }
        if (req.user.role === 'admin') {
            if (notallowAdmin.includes(path)) {
                return res.status(403).json({ message: 'Admin is not allowed to place' });
            } else {
                return next();
            }
        }
        return sendResponse(res,403,'invalid role')
    } catch (err) {
        console.log(err)
        return sendResponse(res,403,'invalid token',null,err.message)
    }
};
