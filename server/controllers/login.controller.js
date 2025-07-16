// const loginModel=require('../model/login.model')
// const userModel=require('../model/user.model')
const userModel = require('../models/user.model')
const teacherModel = require('../models/teacher.model')
const studentModel = require('../models/student.model')
const studentDetailsModel = require('../models/studentDetails.model')
const classModel = require('../models/class.model')


const jwt = require('jsonwebtoken')


const checkUser = async (req, res) => {
    try {
        const { id, password } = req.body;
        console.log(`[checkingUser] - id: '${id}'`)

        const user = await userModel.findOne({ "id": id })
        if (user && user.password === password) {
            const userId = user.id
            const role = user.role

            jwt.sign({ user }, "secret", (err, token) => {
                if (!err) {
                    console.log(`[checkingUser] - token allocated to ${id}`)
                    res.json({ status: "success", token, role, userId })
                }
                else
                    res.json({ status: "error", msg: "jwt error" })
            })
        }
        else {
            console.log(`[checkingUser] - ${id}: "Invalid credentials"`)
            res.json({ status: "error", msg: "Invalid credentials" }).status(401)
        }
    }
    catch (error) {
        res.json({ status: "error", msg: "Unexpected Server Error" }).status(500)
    }
}


const saveUser = async (req, res) => {
    const user = req.body
    console.log(user)
    try {
        const existingUser = await userModel.findOne({ "email": user.email })
        console.log(`[saveUser] - ${user}`)
        if (existingUser) {
            res.status(409).send({ "message": "user already exists !" })
        }
        else {
            await userModel.create(user)

            res.status(200).send("true")
        }
    }
    catch (error) {
        res.status(404).send("false")
    }
}


module.exports = {
    checkUser,
    saveUser
}
