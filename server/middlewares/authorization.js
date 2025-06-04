const jwt = require('jsonwebtoken')


const verifyToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            res.status(401).json({ "message": "Not athorized" })
            return;
        }
        const token = req.headers.authorization.split(" ")[1]
        jwt.verify(token, "secret", (err, data) => {
            if (!err) {
                req.user = data.user
                next()
            }
            else
                res.status(300).json({ "message": "Not athorized" })
        })
    }
    catch (error) {
        res.status(404).json({ "message": "unable to verify" })
    }
}

const isAdmin = (req, res, next) => {
    const role = req.user.role
    if (role.toLowerCase() === "admin")
        next()
    else
        res.status(300).json({ "message": "Not an admin" })
}
const isStudent = (req, res, next) => {
    const role = req.user.role
    if (role.toLowerCase() === "student")
        next()
    else
        res.status(300).json({ "message": "Not an Student" })
    return
}
const isTeacher = (req, res, next) => {
    const role = req.user.role
    if (role.toLowerCase() === "teacher")
        next()
    else
        res.status(300).json({ "message": "Not an Teacher" })
}
const isprincipal = (req, res, next) => {
    const role = req.user.role
    if (role.toLowerCase() === "principal")
        next()
    else
        res.status(300).json({ "message": "Not an admin" })
}

module.exports = {
    verifyToken,
    isAdmin,
    isprincipal,
    isStudent,
    isTeacher
}