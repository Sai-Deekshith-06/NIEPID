// const loginModel=require('../model/login.model')
// const userModel=require('../model/user.model')
const userModel = require('../models/user.model')
const teacherModel = require('../models/teacher.model')
const studentModel = require('../models/student.model')
const studentDetailsModel = require('../models/studentDetails.model')
const classModel = require('../models/class.model')


const jwt = require('jsonwebtoken')


const viewEvaluation = async (req, res) => {
    try {


    }
    catch (error) {
        res.status(404).send(false)
    }
}

const viewDetails = async (req, res) => {
    try {
        console.log("frllo")
        await studentDetailsModel.findOne({ 'info.regNo': req.headers.regno })
            .then((std) => {
                console.log(std)
                res.status(200).json(std)
            }).catch((err) => {
                console.log(err)
            })

    } catch (error) {
        console.log("failed\n" + error)
        res.status(500).json({ message: "internal server error" });
    }
}

const viewHistory = async (req, res) => {//expecting student details form req 
    try {
        const regNo_request = req.headers.id
        const std = await studentModel.findOne({ "regNo": regNo_request })
        // console.log(std)
        if (!std) {
            res.status(203).json({ message: "stdent doesnt exists" })
        }
        // else if (std.section.length === 1 && std.section[0].yearReport.length === 1) {
        //     res.status(202).json({ data: "Year not completed" });
        // }
        else {
            // console.log(std)
            res.status(200).json(std)
        }
    }
    catch (error) {
        console.log(error)
        res.status(404).send(false)
    }
}

module.exports = {
    viewDetails,
    viewEvaluation,
    viewHistory
}
