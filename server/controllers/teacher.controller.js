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

const canSubmitTermComment = (student, section, year, term) => {
    console.log("[canSubmitComment] - ", section, year, term)
    if (term && student.currTerm !== term) {
        const lastTerm = student.section.at(-1).yearReport.at(-1).termReport.at(-1)
        const last2ndTerm = student.section.at(-1).yearReport.at(-1).termReport.at(-2)
        // console.log(last2ndTerm, last2ndTerm.term === term, Object.values(lastTerm.evaluated).every(v => !v))
        if (!(last2ndTerm && last2ndTerm.term === term && Object.values(lastTerm.evaluated).every(v => !v))) {
            return false
        }
    }
    return true
}

const submitTermTypeComment = async (req, res) => {
    try {
        const id = req.body.id
        let flag = true
        // console.log(req.body)
        const student = await studentModel.findOne({ regNo: id })
        if (!canSubmitTermComment(student, req.body.section, req.body.year, req.body.term)) {
            return res.status(501).json({ status: "error", msg: "Comments re-submission is not allowed" })
        }
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
        else if (req.body.type === "termComment") {
            // else if (termReport.comment.personalComment && termReport.comment.socialComment && termReport.comment.academicComment && termReport.comment.occupationalComment && termReport.comment.recreationalComment) {
            console.log("-------")
            termReport.comment.termComment = req.body.comments
        }
        else {
            flag = false
            res.status(201).json({ msg: "no comments updated" })
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

const nextSection = (presentSection) => {
    const sections = ['preprimary', 'primary1', 'primary2', 'passedOut']
    const idx = sections.indexOf(presentSection);
    if (idx !== -1 && idx < sections.length - 1) {
        return sections[idx + 1];
    }
    return null;
}

const updateStudentClassAllocation = async (student, prevClassId, newClassId, session) => {
    try {
        console.log(student.regNo);
        console.log(">>> update classes(): from " + prevClassId + " to " + newClassId);

        // Remove student from previous class
        await classModel.updateMany(
            { classId: prevClassId },
            { $pull: { student: student.regNo } },
            { session }
        );

        console.log("removed from prevClass");

        // Add student to new class
        await classModel.updateOne(
            { classId: newClassId },
            { $addToSet: { student: student.regNo } },
            { session }
        );

        console.log("added to newClass");
    } catch (err) {
        console.log("Error in updateStudentClassAllocation:", err);
        throw err; // Let the caller handle rollback
    }
};

const createNewTermReport = (term, section) => ({
    term,
    evaluated: {
        personal: false,
        academic: false,
        social: false,
        occupational: false,
        recreational: false,
    },
    report: findQAs(section),
    percent: {
        personalPercent: 0,
        socialPercent: 0,
        academicPercent: 0,
        occupationalPercent: 0,
        recreationalPercent: 0,
        mode: "",
    },
    comment: {
        termComment: "",
        personalComment: "",
        occupationalComment: "",
        recreationalComment: "",
        academicComment: "",
        socialComment: "",
    }
});
// Helper: Calculate year-level average percentages and mode
const calculateYearPercentages = (termReports) => {
    const totals = [0, 0, 0, 0, 0]; // personal, social, occ, acad, rec
    const modeCount = [0, 0, 0, 0, 0, 0]; // A, B, C, D, E, ""
    const modes = ["A", "B", "C", "D", "E", ""];
    const len = termReports.length;

    for (const report of termReports) {
        totals[0] += report.percent.personalPercent;
        totals[1] += report.percent.socialPercent;
        totals[2] += report.percent.occupationalPercent;
        totals[3] += report.percent.academicPercent;
        totals[4] += report.percent.recreationalPercent;

        const m = report.percent.mode;
        const modeIdx = modes.indexOf(m);
        if (modeIdx !== -1) modeCount[modeIdx]++;
    }

    const avg = totals.map(t => t / len);
    const maxModeIndex = modeCount.indexOf(Math.max(...modeCount));

    return {
        personalPercent: avg[0],
        socialPercent: avg[1],
        occupationalPercent: avg[2],
        academicPercent: avg[3],
        recreationalPercent: avg[4],
        mode: modes[maxModeIndex],
        total: avg.reduce((sum, val) => sum + val, 0) / 5
    };
};

const createNewSection = (sectionName) => ({
    status: 'ongoing',
    sec: sectionName,
    yearReport: [{
        year: '1',
        termReport: [createNewTermReport('Entry', sectionName)],
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
    }]
});

// Helper: Evaluate a single term/subject
const evaluateTermSubject = async (req, student, yearReport, termReport) => {
    let questions;
    const type = req.headers.type;
    switch (type) {
        case "personalQA": questions = termReport.report.personalQA; break;
        case "socialQA": questions = termReport.report.socialQA; break;
        case "academicQA": questions = termReport.report.academicQA; break;
        case "recreationalQA": questions = termReport.report.recreationalQA; break;
        case "occupationalQA": questions = termReport.report.occupationalQA; break;
        default: throw new Error("Invalid question type");
    }
    let result = ""
    if (type !== "recreationalQA") {
        result = findPercent(questions);
        termReport.percent[type.replace("QA", "Percent")] = result;
        termReport.evaluated[type.replace("QA", "")] = true;
    } else {
        result = findPercentForRecreational(questions);
        termReport.percent.recreationalPercent = result.percent;
        termReport.percent.mode = result.mode;
        termReport.evaluated.recreational = true;
    }

    const allEvaluated = Object.values(termReport.evaluated).every(Boolean);

    // 🟢 Auto-create next term if this is not Term III
    if (allEvaluated && termReport.term !== "III") {
        const section = student.section.find(sec => sec.sec === req.headers.section);
        const yearReport = section.yearReport.find(year => year.year === req.headers.year);

        const termOrder = ['Entry', 'I', 'II', 'III'];
        const nextTermIndex = termOrder.indexOf(termReport.term) + 1;

        if (yearReport.termReport.length === nextTermIndex) {
            const newTermReport = createNewTermReport(termOrder[nextTermIndex], req.headers.section);
            yearReport.termReport.push(newTermReport);
            student.currTerm = newTermReport.term;
        }
    } else if (allEvaluated && termReport.term === "III") {
        const data = calculateYearPercentages(yearReport.termReport);
        yearReport.percent = data;
    }

    //   return allEvaluated; // true means eligible for promotion

    return result  // return transfer flag
    // return Object.values(termReport.evaluated).every(Boolean);  // return transfer flag
};

// Handler for term 'III' transfer promotion logic
const handleTransfer = async (req, student, section, yearReport, /*termReport,*/ prevClassId, session) => {
    const total = parseFloat(yearReport.percent.total);
    const nxtSec = nextSection(student.currSection);
    let nxtClassId = "";

    if (total >= 60 && nxtSec) {
        section.status = "pass";
        if (nxtSec === "passedOut") {
            student.currYear = nxtSec;
            return;
        }

        nxtClassId = `${nxtSec}_1`;
        const nextClass = await classModel.findOne({ classId: nxtClassId }).session(session);
        if (!nextClass) throw new Error(`Class ${nxtClassId} not found`);

        const newSection = createNewSection(nxtSec);
        student.classId = nxtClassId;
        student.currSection = nxtSec;
        student.currYear = '1';
        student.currTerm = 'Entry';
        student.section.push(newSection);

    } else if (section.yearReport.length < 3) {
        const newYear = createNewYear(student.currSection);
        const nxtYear = (section.yearReport.length + 1).toString();
        nxtClassId = `${student.currSection}_${nxtYear}`;
        const nextClass = await classModel.findOne({ classId: nxtClassId }).session(session);
        if (!nextClass) throw new Error(`Class ${nxtClassId} not found`);

        student.classId = nxtClassId;
        student.currYear = nxtYear;
        student.currTerm = 'Entry';
        section.yearReport.push(newYear);
        section.status = "ongoing";

    } else if (nxtSec) {
        section.status = "promoted";
        nxtClassId = `${nxtSec}_1`;
        const nextClass = await classModel.findOne({ classId: nxtClassId }).session(session);
        if (!nextClass) throw new Error(`Class ${nxtClassId} not found`);

        const newSection = createNewSection(nxtSec);
        student.classId = nxtClassId;
        student.currSection = nxtSec;
        student.currYear = '1';
        student.currTerm = 'Entry';
        student.section.push(newSection);
    }

    if (nxtClassId) {
        await updateStudentClassAllocation(student, prevClassId, nxtClassId, session);
    }
    return nxtClassId
};

const evaluateTerm = async (req, res) => {
    const session = await studentModel.startSession();
    try {
        session.startTransaction();

        const id = req.headers.id;
        const student = await studentModel.findOne({ regNo: id }).session(session);
        if (!student) throw new Error("Student not found");

        const section = student.section.find(sec => sec.sec === req.headers.section);
        const yearReport = section.yearReport.find(year => year.year === req.headers.year);
        const termReport = yearReport.termReport.find(term => term.term === req.headers.term);

        if (yearReport.year !== student.currYear || section.sec !== student.currSection) {
            throw new Error("Evaluation not allowed for previous year/section paper");
        }

        const result = await evaluateTermSubject(req, student, yearReport, termReport);

        await student.save({ session });
        await session.commitTransaction();
        res.status(200).json({ status: "success", result });

    } catch (err) {
        console.error("evaluateTerm error:", err);
        try {
            await session.abortTransaction();
        } catch (abortErr) {
            console.error("Abort failed:", abortErr);
        }
        res.status(500).json({ status: "error", msg: err.message });
    } finally {
        session.endSession();
    }
};

// submits the year comments and handles the transfer
const promoteStudent = async (req, res) => {
    const session = await studentModel.startSession();
    try {
        session.startTransaction();

        const id = req.headers.id;
        const student = await studentModel.findOne({ regNo: id }).session(session);
        if (!student) throw new Error("Student not found");

        const section = student.section.find(sec => sec.sec === req.headers.section);
        const yearReport = section.yearReport.find(year => year.year === req.headers.year);
        // const termReport = yearReport.termReport.find(term => term.term === req.headers.term);

        const prevClassId = student.classId;
        if (!(student.currSection === req.headers.section && student.currYear === req.headers.year)) {
            throw new Error("Re-submission is not allowed");
        }

        yearReport.comment.yearComment = req.body.comments[0];
        yearReport.comment.yearPersonalComment = req.body.comments[1];
        yearReport.comment.yearOccupationalComment = req.body.comments[2];
        yearReport.comment.yearAcademicComment = req.body.comments[3];
        yearReport.comment.yearSocialComment = req.body.comments[4];
        yearReport.comment.yearRecreationalComment = req.body.comments[5];

        const nxtSec = await handleTransfer(req, student, section, yearReport, /*termReport,*/ prevClassId, session);

        await student.save({ session });
        await session.commitTransaction();
        res.status(200).json({ status: "promotion successful", nxtSec });

    } catch (err) {
        console.error("promoteStudent error:", err);
        try {
            await session.abortTransaction();
        } catch (abortErr) {
            console.error("Abort failed:", abortErr);
        }
        res.status(500).json({ status: "error", msg: err.message });
    } finally {
        session.endSession();
    }
};

// const promoteStudent = async (req, res) => {
//     const session = await studentModel.startSession();
//     try {
//         session.startTransaction();

//         const id = req.headers.id;
//         const student = await studentModel.findOne({ regNo: id }).session(session);
//         if (!student) throw new Error("Student not found");

//         const section = student.section.find(sec => sec.sec === req.headers.section);
//         const yearReport = section.yearReport.find(year => year.year === req.headers.year);
//         const termReport = yearReport.termReport.find(term => term.term === req.headers.term);

//         const prevClassId = student.classId;

//         await handleTransfer(req, student, section, yearReport, termReport, prevClassId, session);

//         await student.save({ session });
//         await session.commitTransaction();
//         res.status(200).json({ status: "promotion successful" });

//     } catch (err) {
//         console.error("promoteStudent error:", err);
//         try {
//             await session.abortTransaction();
//         } catch (abortErr) {
//             console.error("Abort failed:", abortErr);
//         }
//         res.status(500).json({ status: "error", msg: err.message });
//     } finally {
//         session.endSession();
//     }
// };

// const evaluateStudent = async (req, res) => {
//     const session = await studentModel.startSession();
//     try {
//         session.startTransaction();

//         const id = req.headers.id;
//         const student = await studentModel.findOne({ regNo: id }).session(session);
//         if (!student) throw new Error("Student not found");

//         const section = student.section.find(sec => sec.sec === req.headers.section);
//         const yearReport = section.yearReport.find(year => year.year === req.headers.year);
//         const termReport = yearReport.termReport.find(term => term.term === req.headers.term);

//         if (yearReport.year !== student.currYear || section.sec !== student.currSection) {
//             throw new Error("Evaluation not allowed for previous year/section paper");
//         }

//         let questions, result;
//         switch (req.headers.type) {
//             case "personalQA": questions = termReport.report.personalQA; break;
//             case "socialQA": questions = termReport.report.socialQA; break;
//             case "academicQA": questions = termReport.report.academicQA; break;
//             case "recreationalQA": questions = termReport.report.recreationalQA; break;
//             case "occupationalQA": questions = termReport.report.occupationalQA; break;
//             default: throw new Error("Invalid question type");
//         }

//         if (req.headers.type !== "recreationalQA") {
//             result = findPercent(questions);
//             termReport.percent[`${req.headers.type.replace("QA", "Percent")}`] = result;
//             termReport.evaluated[req.headers.type.replace("QA", "")] = true;
//         } else {
//             result = findPercentForRecreational(questions);
//             termReport.percent.recreationalPercent = result.percent;
//             termReport.percent.mode = result.mode;
//             termReport.evaluated.recreational = true;
//         }

//         const allEvaluated = Object.values(termReport.evaluated).every(v => v);
//         let transfer = false;
//         let nxtClassId = "";
//         const prevClassId = student.classId;

//         if (allEvaluated) {
//             if (termReport.term !== "III") {
//                 const termOrder = ['Entry', 'I', 'II', 'III'];
//                 const nextTermIndex = termOrder.indexOf(termReport.term) + 1;

//                 if (yearReport.termReport.length === nextTermIndex) {
//                     const newTermReport = createNewTermReport(termOrder[nextTermIndex], req.headers.section);
//                     yearReport.termReport.push(newTermReport);
//                     student.currTerm = newTermReport.term;
//                 }
//             } else {
//                 transfer = true;
//                 const data = calculateYearPercentages(yearReport.termReport);
//                 yearReport.percent = data;

//                 const total = parseFloat(data.total);
//                 const nxtSec = nextSection(student.currSection);

//                 if (total >= 60 && nxtSec) {
//                     section.status = "pass";
//                     if (nxtSec === "passedOut") {
//                         student.currYear = nxtSec;
//                         transfer = false;
//                     } else {
//                         nxtClassId = `${nxtSec}_1`;
//                         const nextClass = await classModel.findOne({ classId: nxtClassId }).session(session);
//                         if (!nextClass) throw new Error(`Class ${nxtClassId} not found`);
//                         const newSection = createNewSection(nxtSec);
//                         student.classId = nxtClassId;
//                         student.currSection = nxtSec;
//                         student.currYear = '1';
//                         student.currTerm = 'Entry';
//                         student.section.push(newSection);
//                     }
//                 } else if (section.yearReport.length < 3) {
//                     const newYear = createNewYear(student.currSection);
//                     const nxtYear = (section.yearReport.length + 1).toString();
//                     nxtClassId = `${student.currSection}_${nxtYear}`;
//                     const nextClass = await classModel.findOne({ classId: nxtClassId }).session(session);
//                     if (!nextClass) throw new Error(`Class ${nxtClassId} not found`);
//                     student.classId = nxtClassId;
//                     student.currYear = nxtYear;
//                     student.currTerm = 'Entry';
//                     section.yearReport.push(newYear);
//                     section.status = "ongoing";
//                 } else if (nxtSec) {
//                     section.status = "promoted";
//                     nxtClassId = `${nxtSec}_1`;
//                     const nextClass = await classModel.findOne({ classId: nxtClassId }).session(session);
//                     if (!nextClass) throw new Error(`Class ${nxtClassId} not found`);
//                     const newSection = createNewSection(nxtSec);
//                     student.classId = nxtClassId;
//                     student.currSection = nxtSec;
//                     student.currYear = '1';
//                     student.currTerm = 'Entry';
//                     student.section.push(newSection);
//                 }
//             }
//         }

//         if (transfer) {
//             await updateStudentClassAllocation(student, prevClassId, nxtClassId, session);
//         }

//         await student.save({ session });
//         await session.commitTransaction();
//         res.status(200).json({ result });
//     } catch (err) {
//         console.error("evaluateStudent error:", err);
//         try {
//             await session.abortTransaction();
//         } catch (abortErr) {
//             console.error("Abort failed:", abortErr);
//         }
//         res.status(500).json({ status: "error", msg: err.message });
//     } finally {
//         session.endSession();
//     }
// };

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

// to save qns/ans in db
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

module.exports = {
    historyStudent,
    getStudents,
    evaluateTerm,
    getQuestions,
    getTeacher,
    getStudentbyId,
    submitForm,
    submitTermTypeComment,
    // evaluateYearStudent,
    // submitYearTypeComment
    promoteStudent
}