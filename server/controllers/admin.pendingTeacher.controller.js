const pendingTeacherModel = require('../models/pendingTeacher.model')
const userModel = require('../models/user.model')
const teacherModel = require('../models/teacher.model')
const classModel = require('../models/class.model')
const mongoose = require('mongoose')

const jwt = require('jsonwebtoken')
const { type } = require('os')

const pendingTeacher = async (req, res) => {
    try {
        const pendingteachers = await pendingTeacherModel.find({});
        if (pendingteachers) {
            res.status(200).json({ status: "success", data: pendingteachers, count: pendingteachers.length })
        }
        else {
            res.status(405).json({ status: "success", data: [], count: 0 })
        }
    } catch (error) {
        res.status(404).json("Error")
    }
}

const deletePendingTeacher = async (req, res) => {
    try {
        // console.log(req)
        const { id } = req.params;
        console.log("deletePendingTeacher(): ", id);
        // console.log(req.body)
        const { teacherId, teacherName, email, teacherMNo, classId } = req.body;
        const mno = String(teacherMNo)
        const deleted = await pendingTeacherModel.findOneAndDelete({ teacherId: teacherId, teacherName: teacherName })
        // console.log(deleted)
        res.status(200).json({ status: "success", msg: `Teacher: ${teacherId} - ${teacherName} is deleted` })
    } catch (err) {
        res.status(500).json({ status: "error", msg: err })
    }
}

const validateTeacherDetails = async (row) => {
    msg = "";
    const isTeacher = await teacherModel.find({ 'teacherId': row.teacherId });
    const isUser = await userModel.find({ 'id': row.teacherId });
    if (isTeacher.length === 0 && isUser.length === 0) {
        const regexEmail = /^[a-zA-Z0-9._%+-]+@(gmail.com)$/;
        const regexClassId = /^(preprimary|primary[1-2])_[1-3]$/;
        if (row.teacherMNo.length !== 10) {
            msg += `Invalid Mobile No, `;
        }
        if (!row.teacherName || row.teacherName.trim() === "") {
            msg += `Invalid Name, `;
        }
        if (!row.teacherId) {
            msg += `Invalid teacherId, `;
        }
        if (!regexEmail.test(row.email)) {  //regex -> regexEmail
            msg += `Invalid email, `;
        }

        const cid = row.classId.includes(',') ? row.classId.split(',') : [row.classId];
        for (const cls of cid) {
            const isClass = await classModel.findOne({ 'classId': cls });
            if (isClass) {
                msg += `Class ${cls} already exists, `;
            } else if (!regexClassId.test(cls)) {
                msg += `Invalid classId: '${cls}', `;
            }
        }

    } else {
        msg += `${row.teacherId}: TeacherId already exists `;
    }

    if (msg === "") {
        return { status: true, msg: "Valid" };
    } else {
        return { status: false, msg: msg };
    }
}

// edit and save valid teacher details to TeacherModel from pendingTeacherModel
// This version is adapted for standalone MongoDB and does NOT use transactions.
// Be aware of potential data inconsistencies if an error occurs between operations.
const editPendingTeacher = async (req, res) => {
    try {
        console.log("editPendingTeacher(): ", req.body.updatedTeacher); // For debugging, remove in production
        const teacher = req.body.updatedTeacher;

        // Ensure validateTeacherDetails handles errors internally and returns consistent structure
        const validationResult = await validateTeacherDetails(teacher);
        console.log(validationResult); // For debugging, remove in production

        if (validationResult.status) {
            // Operation 1: Find and delete from pendingTeacherModel
            // No .session(session) here as we are not using transactions
            const teacherDetails = await pendingTeacherModel.findOneAndDelete({ _id: teacher._id });

            if (!teacherDetails) {
                return res.status(404).json({ status: "error", msg: "Teacher not found in pending list" });
            }

            // Important: Convert classId to an array if your schema expects it
            let classIdsArray = [];
            if (teacher.classId) {
                if (Array.isArray(teacher.classId)) {
                    classIdsArray = teacher.classId;
                } else if (typeof teacher.classId === 'string') {
                    classIdsArray = teacher.classId.split(',').map(id => id.trim());
                } else {
                    // Handle other cases or throw an error if unexpected type
                    classIdsArray = [teacher.classId]; // Treat as a single item if not string/array
                }
            }

            // Check for existing teacher to prevent duplicates
            const existingTeacher = await teacherModel.findOne({ $or: [{ teacherId: teacher.teacherId }, { email: teacher.email }] });
            if (existingTeacher) {
                // IMPORTANT: Since findOneAndDelete has already occurred (and is not rolled back),
                // if a duplicate is found here, the pending teacher has already been removed.
                // You might need to re-add it to pendingTeacherModel or handle this edge case.
                // For simplicity, this code just returns an error, implying a potential inconsistency.
                return res.status(409).json({ status: "error", msg: "Teacher with this ID or Email already exists." });
            }

            const newTeacher = new teacherModel({
                teacherId: teacher.teacherId,
                teacherName: teacher.teacherName,
                teacherMNo: teacher.teacherMNo,
                email: teacher.email,
                classId: classIdsArray, // Use the converted array
            });

            for (const classid of classIdsArray) {
                const demoClass = {
                    classId: classid,
                    teacherId: newTeacher.teacherId,
                    section: classid.split('_')[0],
                    year: classid.split('_')[1],
                    student: []
                };
                await classModel.create(demoClass);
            }

            // Operation 2: Create new teacher in teacherModel
            await teacherModel.create(newTeacher);

            const user = {
                id: newTeacher.teacherId,
                password: newTeacher.teacherId,
                role: 'teacher'
            };
            await userModel.create(user);

            console.log("new user & teacher with respective classes are created successfully (without transaction)"); // For debugging, remove in production
            res.status(200).json({ status: "success", msg: "Teacher details updated successfully" });

        } else {
            // Update the pendingTeacherModel with validation message
            await pendingTeacherModel.findOneAndUpdate(
                { _id: teacher._id },
                { msg: validationResult.msg }
            );
            console.log("pending teacher details updated with validation error (without transaction)"); // For debugging, remove in production
            res.status(400).json({ status: "error", msg: `Invalid teacher details: ${validationResult.msg}` });
        }
    } catch (error) {
        console.error("Error in editPendingTeacher (standalone mode):", error);
        res.status(500).json({ status: "error", msg: error.message });
    }
};


module.exports = {
    pendingTeacher,
    deletePendingTeacher,
    editPendingTeacher
}