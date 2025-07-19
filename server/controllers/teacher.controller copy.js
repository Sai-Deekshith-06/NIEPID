// const loginModel=require('../model/login.model')
// const userModel=require('../model/user.model')
const userModel = require('../models/user.model')
const teacherModel = require('../models/teacher.model')
const studentModel = require('../models/student.model')
const studentDetailsModel = require('../models/studentDetails.model')
const classModel = require('../models/class.model')
const deriveHistory = require('../deriving/deriveHistory')
const findQAs = require('../deriving/deriveQAs')


const jwt = require('jsonwebtoken')

const submitYearTypeComment = async (req, res) => {
    // try {
    const id = req.body.id
    const student = await studentModel.findOne({ regNo: id })
    const section = student.section.find(sec => sec.sec === req.body.section)
    const yearReport = section.yearReport.find(year => year.year === req.body.year)
    // console.log(req.body)
    yearReport.comment.yearComment = req.body.comments[0]
    yearReport.comment.yearPersonalComment = req.body.comments[1]
    yearReport.comment.yearOccupationalComment = req.body.comments[2]
    yearReport.comment.yearAcademicComment = req.body.comments[3]
    yearReport.comment.yearSocialComment = req.body.comments[4]
    yearReport.comment.yearRecreationalComment = req.body.comments[5]

    student.save()
    res.status(200).json("Success")
    // }
    // catch (err) {
    //     console.log(err)
    //     res.status(400).send(false)
    // }
}

const evaluateYearStudent = async (req, res) => {
    try {
        const std = await studentModel.findOne({ regNo: req.headers.regNo })
        const section = std.section.find(sec => sec.sec === req.headers.section)
        const yearReport = section.find(year => year === req.headers.year)
        let arr = [0, 0, 0, 0, 0, [0, 0, 0, 0, 0, 0]]
        let len = 0
        yearReport.map((inst) => {
            inst.termReport.map((inst1) => {
                len++
                arr[0] += inst1.percent.personalPercent
                arr[1] += inst1.percent.socialPercent
                arr[2] += inst1.percent.occupationalPercent
                arr[3] += inst1.percent.academicPercent
                arr[4] += inst1.percent.recreationalPercent
                if (inst1.percent.mode == "") { arr[5][5]++ }
                else if (inst1.percent.mode == "A") { arr[5][0]++ }
                else if (inst1.percent.mode == "B") { arr[5][1]++ }
                else if (inst1.percent.mode == "C") { arr[5][2]++ }
                else if (inst1.percent.mode == "D") { arr[5][3]++ }
                else if (inst1.percent.mode == "E") { arr[5][4]++ }
            })
        })
        for (let i = 0; i < 5; i++)
            arr[i] /= len
        let idx = ""
        const arr1 = ["A", "B", "C", "D", "E", ""]
        for (let i = 0; i < 6; i++) {
            if (Math.max(...arr[5]) == arr[5][i]) {
                idx = arr1[i]
                break
            }
        }
        yearReport.percent.personalPercent = arr[0]
        yearReport.percent.socialPercent = arr[1]
        yearReport.percent.occupationalPercent = arr[2]
        yearReport.percent.academicPercent = arr[3]
        yearReport.percent.recreationalPercent = arr[4]
        yearReport.percent.mode = idx
        std.save()
        res.status(200).json("Success")
    }
    catch (err) {
        console.log(err)
        res.status(400).send(false)
    }
}

const evaluateStudent = async (req, res) => {
    // try {
    const id = req.headers.id
    // console.log(req.headers)
    const student = await studentModel.findOne({ regNo: id })
    const section = student.section.find(sec => sec.sec === req.headers.section)
    const yearReport = section.yearReport.find(year => year.year === req.headers.year)
    const termReport = yearReport.termReport.find(term => term.term === req.headers.term)
    // console.log(termReport)
    let questions;
    if (req.headers.type === "personalQA")
        questions = termReport.report.personalQA
    else if (req.headers.type === "socialQA")
        questions = termReport.report.socialQA
    else if (req.headers.type === "academicQA")
        questions = termReport.report.academicQA
    else if (req.headers.type === "recreationalQA")
        questions = termReport.report.recreationalQA
    else if (req.headers.type === "occupationalQA")
        questions = termReport.report.occupationalQA

    let result
    // console.log(questions)
    if (req.headers.type !== "recreationalQA") {
        result = findPercent(questions)
        if (req.headers.type === "personalQA") {
            termReport.percent.personalPercent = result
            termReport.evaluated.personal = true
        }
        else if (req.headers.type === "socialQA") {
            termReport.percent.socialPercent = result
            termReport.evaluated.social = true
        }
        else if (req.headers.type === "academicQA") {
            termReport.percent.academicPercent = result
            termReport.evaluated.academic = true
        }
        else if (req.headers.type === "occupationalQA") {
            termReport.percent.occupationalPercent = result
            termReport.evaluated.occupational = true
        }
    }
    else {
        result = findPercentForRecreational(questions)
        termReport.percent.recreationalPercent = result.percent
        termReport.percent.mode = result.mode
        termReport.evaluated.recreational = true
    }

    let newTermReport = {
        evaluated: {
            personal: false,
            academic: false,
            social: false,
            occupational: false,
            recreational: false
        },
        term: '',
        report: findQAs(req.headers.section),
        percent: {//Term Performance
            personalPercent: 0,
            socialPercent: 0,
            academicPercent: 0,
            occupationalPercent: 0,
            recreationalPercent: 0,
            mode: ""
        },
        comment: {//Term Comments
            termComment: "",
            personalComment: "",
            occupationalComment: "",
            recreationalComment: "",
            academicComment: "",
            socialComment: ""
        }
    }
    if (termReport.evaluated.academic && termReport.evaluated.occupational && termReport.evaluated.personal && termReport.evaluated.recreational && termReport.evaluated.social) {
        if (termReport.term !== "III") {
            if (termReport.term === 'Entry' && yearReport.termReport.length == 1)
                newTermReport.term = 'I'
            else if (termReport.term === 'I' && yearReport.termReport.length == 2)
                newTermReport.term = "II"
            else if (termReport.term === 'II' && yearReport.termReport.length == 3)
                newTermReport.term = "III"
            if (newTermReport.term) {
                yearReport.termReport.push(newTermReport)
                student.currTerm = newTermReport.term
            }
        }
        else {
            let personalPercent = 0, socialPercent = 0, academicPercent = 0, occupationalPercent = 0, recreationalPercent = 0, mode = ''
            let count_A = 0, count_B = 0, count_C = 0, count_D = 0, count_E = 0
            yearReport.termReport.map(term => {
                personalPercent = personalPercent + term.percent.personalPercent
                socialPercent = socialPercent + term.percent.socialPercent
                academicPercent = academicPercent + term.percent.academicPercent
                occupationalPercent = occupationalPercent + term.percent.occupationalPercent
                recreationalPercent = recreationalPercent + term.percent.recreationalPercent
                if (term.percent.mode === 'A') count_A++
                else if (term.percent.mode === 'B') count_B++
                else if (term.percent.mode === 'C') count_C++
                else if (term.percent.mode === 'D') count_D++
                else if (term.percent.mode === 'E') count_E++
            })
            if (Math.max(count_A, count_B, count_C, count_D, count_E) == count_A) mode = 'A'
            else if (Math.max(count_A, count_B, count_C, count_D, count_E) == count_B) mode = 'B'
            else if (Math.max(count_A, count_B, count_C, count_D, count_E) == count_C) mode = 'C'
            else if (Math.max(count_A, count_B, count_C, count_D, count_E) == count_D) mode = 'D'
            else if (Math.max(count_A, count_B, count_C, count_D, count_E) == count_E) mode = 'E'
            personalPercent = personalPercent / 4
            socialPercent = socialPercent / 4
            academicPercent = academicPercent / 4
            occupationalPercent = occupationalPercent / 4
            recreationalPercent = recreationalPercent / 4

            personalPercent = personalPercent.toFixed(2)
            socialPercent = socialPercent.toFixed(2)
            academicPercent = academicPercent.toFixed(2)
            occupationalPercent = occupationalPercent.toFixed(2)
            recreationalPercent = recreationalPercent.toFixed(2)

            const data = {
                personalPercent: personalPercent,
                socialPercent: socialPercent,
                academicPercent: academicPercent,
                occupationalPercent: occupationalPercent,
                recreationalPercent: recreationalPercent,
                mode: mode
            }

            yearReport.percent = data

            const newSection = {
                status: 'ongoing',
                sec: '',// 
                yearReport: [{
                    year: '1',
                    termReport: [{
                        term: 'Entry',
                        report: {},
                        comment: {
                            termComment: "",
                            personalComment: "",
                            occupationalComment: "",
                            recreationalComment: "",
                            academicComment: "",
                            socialComment: ""
                        },
                        percent: {
                            personalPercent: null,
                            socialPercent: null,
                            academicPercent: null,
                            occupationalPercent: null,
                            recreationalPercent: null,
                            mode: ""
                        }
                    }],
                    comment: {
                        yearPersonalComment: "",
                        yearOccupationalComment: "",
                        yearRecreationalComment: "",
                        yearAcademicComment: "",
                        yearSocialComment: "",
                        yearComment: ""
                    },
                    percent: {
                        personalPercent: null,
                        socialPercent: null,
                        academicPercent: null,
                        occupationalPercent: null,
                        recreationalPercent: null,
                        mode: "",
                        result: 0
                    }
                }],
            }

            const newYear = {
                year: '',
                termReport: [{
                    term: 'Entry',
                    report: findQAs(section.sec),
                    comment: {
                        termComment: "",
                        personalComment: "",
                        occupationalComment: "",
                        recreationalComment: "",
                        academicComment: "",
                        socialComment: ""
                    },
                    percent: {
                        personalPercent: null,
                        socialPercent: null,
                        academicPercent: null,
                        occupationalPercent: null,
                        recreationalPercent: null,
                        mode: ""
                    }
                }],
                comment: {
                    yearPersonalComment: "",
                    yearOccupationalComment: "",
                    yearRecreationalComment: "",
                    yearAcademicComment: "",
                    yearSocialComment: "",
                    yearComment: ""
                },
                percent: {
                    personalPercent: null,
                    socialPercent: null,
                    academicPercent: null,
                    occupationalPercent: null,
                    recreationalPercent: null,
                    mode: "",
                    result: 0
                }
            }

            const result = (parseFloat(personalPercent) + parseFloat(socialPercent) + parseFloat(academicPercent) + parseFloat(occupationalPercent)) / 4;
            //console.log(typeof(parseFloat(personalPercent)),typeof(socialPercent),typeof(academicPercent),typeof(occupationalPercent))
            console.log(result)
            if (result >= 80 && yearReport.year === student.currYear && section.sec === student.currSection) {
                section.status = "pass"
                //create new Section
                newSection.sec = 'primary1'
                student.currSection = 'primary1'
                student.currYear = '1'
                student.currTerm = 'Entry'
                student.classId = 'primary1_1'
                newSection.yearReport[0].termReport[0].report = findQAs('primary1')
                student.section.push(newSection)
            }
            else if (section.yearReport.length < 3 && yearReport.year === student.currYear && section.sec === student.currSection) {
                section.status = "ongoing"
                //create new year
                if (section.yearReport.length === 1) {
                    newYear.year = '2'
                    student.currYear = '2'
                    const currSec = student.currSection
                    student.classId = currSec + '_2'
                }
                else {
                    newYear.year = '3'
                    student.currYear = '3'
                    const currSec = student.currSection
                    student.classId = currSec + '_3'
                }
                student.currTerm = 'Entry'
                section.yearReport.push(newYear)
            }
            else if (yearReport.year === student.currYear && section.sec === student.currSection) {
                section.status = "promote"
                //create new section after failing 3 years
                newSection.sec = 'primary2'
                student.currSection = 'primary2'
                student.currYear = '1'
                student.currTerm = 'Entry'
                student.classId = 'primary2_1'
                newSection.yearReport[0].termReport[0].report = findQAs('primary2')
                student.section.push(newSection)
            }
            else {
                // //trying to evaluate previous evaluated year/section
                // console.log(yearReport.year,section.sec)
                // console.log(student.currYear,student.currSection)
                // res.status(201).json("Not allowed to evaluate previous year/section once evaluated")
            }
        }
    }

    student.save()
    res.status(200).json({ result })
    // }
    // catch (err) {
    //     console.log(err)
    //     res.status(400).send(false)
    // }
}

const findPercent = (arr) => {
    let count = 0
    let ans = 0
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].answer == "yes" || arr[i].answer == "Yes")
            ans++
        // if (arr[i].answer == "NA" || arr[i].answer == "NE")
        if (arr[i].answer == "NA")
            continue
        count++
    }
    // console.log(ans,count)
    if (ans != 0 && count != 0)
        return ((ans / count) * 100).toFixed(2)
    return 0;
}

const findPercentForRecreational = (arr) => {
    let count_A = 0
    let count_B = 0
    let count_C = 0
    let count_D = 0
    let count_E = 0
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].answer == "A") count_A++
        else if (arr[i].answer == "B") count_B++
        else if (arr[i].answer == "C") count_C++
        else if (arr[i].answer == "D") count_D++
        else if (arr[i].answer == "E") count_E++
    }
    let ans = "Z"
    // let score = 0
    let val = Math.max(count_A, count_B, count_C, count_D, count_E)
    if (val === count_A)
        ans = "A"
    else if (val === count_B)
        ans = "B"
    else if (val === count_C)
        ans = "C"
    else if (val === count_D)
        ans = "D"
    else if (val === count_E)
        ans = "E"
    // score = (val / arr.length) * 100
    return {
        mode: ans,
        // percent: score.toFixed(2)
        percent: 0
    }
}

const historyStudent = async (req, res) => {//expecting student details form req 
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


/**
 * @desc Retrieves students grouped by classId for a given teacher.
 * @param {Object} req - The request object (expects teacherId in headers).
 * @param {Object} res - The response object.
 * @returns {Object} JSON response with grouped student data or error.
 */
const getStudents = async (req, res) => {
    try {
        console.log("/getStudents endpoint hit");
        const teacherId = req.headers.id; // Teacher ID from headers

        const teacher = await teacherModel.findOne({ "teacherId": teacherId });
        if (!teacher) {
            return res.status(404).json({ status: "error", msg: `Teacher with ID: ${teacherId} not found` });
        }

        if (!teacher.classId || teacher.classId.length === 0) {
            return res.status(200).json({ status: "success", students: [], msg: `Teacher ID: ${teacherId} has no assigned classes.` });
        }

        // Fetch all students whose classId is in the teacher's classId array
        const allStudents = await studentModel.find({ classId: { $in: teacher.classId } });

        // Create a map to group students by classId
        const studentsGroupedByClassId = new Map();
        teacher.classId.forEach(cid => {
            studentsGroupedByClassId.set(cid, []); // Initialize with empty arrays to preserve order
        });

        allStudents.forEach(student => {
            if (studentsGroupedByClassId.has(student.classId)) {
                studentsGroupedByClassId.get(student.classId).push(student);
            }
            // else: Handle students with classId not assigned to this teacher if necessary,
            // though the $in query should prevent this.
        });

        // Convert the Map values to an array of arrays, maintaining the order of teacher.classId
        const orderedGroupedStudents = Array.from(studentsGroupedByClassId.values());

        res.status(200).json({ status: "success", students: orderedGroupedStudents, count: allStudents.length });

    } catch (error) {
        console.error("Error in getStudents:", error);
        res.status(500).json({ status: "error", msg: "Server error while fetching students." });
    }
};

const getQuestions = async (req, res) => {
    try {
        const id = req.headers.id
        // const id = "S000"
        // console.log(id)
        const student = await studentModel.findOne({ "regNo": id })
        if (student) {
            // console.log(student)
            res.json({ status: "success", data: student })
        }
        else {
            res.status(405).send(false)
        }
    }
    catch (error) {
        res.status(404).send(false)
    }
}

const getTeacher = async (req, res) => {
    try {
        const id = req.headers.id
        // console.log(id)
        const teacher = await teacherModel.findOne({ "teacherId": id })
        if (teacher) {
            // console.log(student)
            res.json({ status: "success", data: teacher })
        }
        else {
            res.status(405).send(false)
        }
    }
    catch (error) {
        res.status(404).send(false)
    }
}

const submitForm = async (req, res) => {
    try {
        // console.log(req.body)
        const id = req.body.id
        const type = req.body.type
        const data = req.body.data
        // const year = req.body.year
        // const section = req.body.section
        // const term = req.body.term
        // console.log(data)
        const std = await studentModel.findOne({
            regNo: id,
        })

        const section = std.section.find(sec => sec.sec === req.body.section)
        const yearReport = section.yearReport.find(report => report.year === req.body.year)
        const termReport = yearReport.termReport.find(report => report.term === req.body.term)

        if (type === "personalQA")
            termReport.report.personalQA = data.questions
        else if (type === "academicQA")
            termReport.report.academicQA = data.questions
        else if (type === "recreationalQA")
            termReport.report.recreationalQA = data.questions
        else if (type === "socialQA")
            termReport.report.socialQA = data.questions
        else if (type === "occupationalQA")
            termReport.report.occupationalQA = data.questions

        // console.log(termReport.report.personalQA)
        std.save()
        {
            // let i=0,j=0,k=0;
            // for (let index = 0; index < std.section.length; index++) {
            //     if(std.section[index].sec === section)
            //     {
            //         k = index
            //         break
            //     }
            // }
            // for (let index = 0; index < std.section[k].yearReport.length; index++) {
            //     if(std.section[k].yearReport[index].year === year)
            //     {
            //         i = index
            //         break
            //     }
            // }
            // for (let index = 0; index < std.section[k].yearReport[i].termReport.length; index++) {
            //     if(std.section[k].yearReport[i].termReport[index].term === term)
            //     {
            //         j = index
            //         break
            //     }
            // }

            // if(type === "personalQA")
            //     std.section[k].yearReport[i].termReport[k].report.personalQA[0].answer = data.questions
            // else if(type === "academicQA")
            //     std.section[k].yearReport[i].termReport[k].report.academicQA = data.questions
            // else if(type === "recreationalQA")
            //     std.section[k].yearReport[i].termReport[k].report.recreationalQA = data.questions
            // else if(type === "socialQA")
            //     std.section[k].yearReport[i].termReport[k].report.socialQA = data.questions
            // else if(type === "occupationalQA")
            //     std.section[k].yearReport[i].termReport[k].report.occupationalQA = data.questions
            // console.log(std.section[k].yearReport[i].termReport[j].report.personalQA)
            // const stud = await studentModel.findOneAndUpdate({
            //     regNo:id,
            //     section:std.section
            // })
        }

        res.json({ data: std })
    }
    catch (error) {
        // console.log("-----------------")
        res.status(400).send(false)
    }
}

const getStudentbyId = async (req, res) => {
    try {
        const data = req.headers.id
        const std = await studentModel.findOne({ regNo: data })
        if (!std) {
            // console.log('stdent not found')
            res.status("Bad request").json({ message: "invalid regNo" })
        }
        else {
            // console.log("-------------------------------", std, "------------------------------------")
            res.json(std)
        }
    } catch (err) {
        // console.log(err)
        res.status(500).json({ message: "internal server error" })
    }
}

const submitTermTypeComment = async (req, res) => {
    try {
        const id = req.body.id
        let flag = true
        // console.log(req.body)
        const student = await studentModel.findOne({ regNo: id })
        const section = student.section.find(sec => sec.sec === req.body.section)
        const yearReport = section.yearReport.find(year => year.year === req.body.year)
        const termReport = yearReport.termReport.find(term => term.term === req.body.term)

        if (req.body.type === "personalQA")
            termReport.comment.personalComment = req.body.comments
        else if (req.body.type === "socialQA")
            termReport.comment.socialComment = req.body.comments
        else if (req.body.type === "academicQA")
            termReport.comment.academicComment = req.body.comments
        else if (req.body.type === "recreationalQA")
            termReport.comment.recreationalComment = req.body.comments
        else if (req.body.type === "occupationalQA")
            termReport.comment.occupationalComment = req.body.comments
        else if (termReport.comment.personalComment && termReport.comment.socialComment && termReport.comment.academicComment && termReport.comment.occupationalComment && termReport.comment.recreationalComment) {
            // console.log("-------")
            termReport.comment.termComment = req.body.comments
        }
        else {
            flag = false
            res.status(201).json("no comments updated")
        }

        // console.log(termReport.comment.termComment)
        // console.log(termReport)
        if (flag) {
            student.save()
            res.status(200).json("Success")
        }
    } catch (err) {
        // console.log(err)
        res.status(400).send(false)
    }
}



module.exports = {
    historyStudent,
    getStudents,
    evaluateStudent,
    getQuestions,
    getTeacher,
    getStudentbyId,
    submitForm,
    submitTermTypeComment,
    evaluateYearStudent,
    submitYearTypeComment
}