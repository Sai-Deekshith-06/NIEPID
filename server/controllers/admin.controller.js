// const loginModel=require('../model/login.model')
const userModel = require('../models/user.model')
const teacherModel = require('../models/teacher.model')
const pendingTeacherModel = require('../models/pendingTeacher.model')
const studentModel = require('../models/student.model')
const studentDetailsModel = require('../models/studentDetails.model')
const classModel = require('../models/class.model')
const path = require('path')
const xlsx = require('xlsx')

const generateClassId = require('../deriving/deriveClass')
const studentJsonGenerate = require('../deriving/deriveStd')

const jwt = require('jsonwebtoken')
const { type } = require('os')
const { default: mongoose } = require('mongoose')

const editTeacher = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    // console.log(req.body)
    const { teacherId, teacherName, email, teacherMNo, classId } = req.body;
    const mno = String(teacherMNo)
    const regexEmail = /^[a-zA-Z0-9._%+-]+@(gmail.com)$/;
    if (!regexEmail.test(email)) {
        return res.status(400).json({ message: `Invalid email: ${email}` });
    } else if (mno.length !== 10) {
        return res.status(400).json({ message: `Invalid Mobile No. : ${teacherMNo}` });
    } else if (teacherId == "" || teacherName == "") {
        return res.status(400).json({ message: `Invalid Teacher Id or Name` });
    }
    try {
        const existedTeacher = await teacherModel.findById(id);
        const updatedTeacher = await teacherModel.findByIdAndUpdate(
            id,
            { teacherId, teacherName, email, teacherMNo, classId },
            { new: true }
        );
        const updateUser = await userModel.findOneAndUpdate({ "id": existedTeacher.teacherId }, { "id": teacherId });
        for (const cls of updatedTeacher.classId) {
            await classModel.findOneAndUpdate({ "classId": cls }, { "teacherId": teacherId })
        }
        if (!updatedTeacher || !updateUser) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        res.status(200).json(updatedTeacher);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Server Error' });
    }
}
const registerStudent = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const data = req.body;
        console.log("Received student data:", JSON.stringify(data, null, 2));
        
        // Check if student already exists
        const existingStudent = await studentModel.findOne({ regNo: data.formData.details.info.regNo }).session(session);
        const existingStudentDetails = await studentDetailsModel.findOne({ 'info.regNo': data.formData.details.info.regNo }).session(session);
        
        if (existingStudent || existingStudentDetails) {
            await session.abortTransaction();
            console.log("Error: Student with this registration number already exists");
            return res.status(409).json({ success: false, message: "Student with this registration number already exists" });
        }

        // Generate class ID
        const classId = generateClassId(data.formData.stdCred.section, data.formData.stdCred.year);
        console.log("Generated classId:", classId);
        
        // Find the class
        const classInfo = await classModel.findOne({ classId }).session(session);
        if (!classInfo) {
            await session.abortTransaction();
            console.log("Error: Class not found for ID:", classId);
            return res.status(404).json({ success: false, message: "Class not found" });
        }

        // Save student details
        const studentDetails = new studentDetailsModel(data.formData.details);
        await studentDetails.save({ session });
        console.log("Student details saved successfully");

        // Add student to class
        await classModel.updateOne(
            { classId },
            { $addToSet: { student: data.formData.details.info.regNo } },
            { session }
        );

        // Generate and save student record
        const studentData = studentJsonGenerate(data, classId);
        const student = new studentModel(studentData);
        await student.save({ session });

        // Create user account
        const user = new userModel({
            id: data.formData.details.info.regNo,
            password: data.formData.details.info.regNo, // In production, hash this password
            role: "student"
        });
        await user.save({ session });

        await session.commitTransaction();
        console.log("Student registration completed successfully");
        res.status(200).json({ success: true, message: "Student registered successfully" });

    } catch (error) {
        await session.abortTransaction();
        console.error("Error in registerStudent:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: error.message 
        });
    } finally {
        session.endSession();
    }
};
// const registerStudent = async (req, res) => {
//     const session = mongoose.startSession()
//     try {
//         (await session).startTransaction()
//         const val1 = {}
//         const data = req.body
//         // console.log(data)
//         const arr1 = await studentDetailsModel.findOne({ 'info.regNo': data.formData.details.info.regNo })
//         const arr2 = await studentModel.findOne({ regNo: data.formData.details.info.regNo })
//         // console.log(arr1)
//         // console.log(arr2)
//         lable1: if (!arr1 && !arr2) {
//             let flag = false

//             if (data.formData.details.info.regNo) {
//                 const responce1 = await new studentDetailsModel(data.formData.details).save()
//                     .then(() => {
//                         console.log("data entered in studentDetailsModel successfully")
//                     })
//                     .catch((err) => {
//                         flag = true
//                     })
//             }
//             if (flag) {
//                 console.log("Error-405")
//                 res.status(405).json({ reason: "studentDetails already exists" })
//                 break lable1
//             }
//             const value1 = generateClassId(data.formData.stdCred.section, data.formData.stdCred.year)
//             console.log(data.formData.stdCred)
//             const arr3 = await classModel.findOne({ classId: value1 })
//             // console.log(arr3.length)
//             // console.log(arr3)
//             if (!arr3) {
//                 console.log("Error-404")
//                 res.status(404).json({ reason: "no class exists" })
//                 break lable1
//             } else {
//                 const v1 = arr3.student
//                 v1.push(data.formData.details.info.regNo)
//                 // console.log(v1)
//                 const searchClass = generateClassId(data.formData.stdCred.section, data.formData.stdCred.year)
//                 const responce2 = await classModel.findOneAndUpdate(
//                     { classId: searchClass },
//                     { student: v1 },
//                     { new: true }
//                 )
//                 const ans = studentJsonGenerate(data, searchClass)
//                 // console.log(ans)
//                 const responce3 = await new studentModel(ans).save()
//                     .then(() => {
//                         // console.log("student has been saved")
//                     })
//                     .catch((err) => {
//                         // console.log("student has not been saved \n"+err)
//                         flag = true
//                         // console.log(ans)
//                     })
//                 if (flag) {
//                     console.log("Error-403")
//                     res.status(403).json({ reason: "student already exists" })
//                     break lable1
//                 }
//                 const stdUser = {
//                     id: data.formData.details.info.regNo,
//                     password: data.formData.details.info.regNo,
//                     role: "student"
//                 }
//                 const responce4 = await new userModel(stdUser).save()
//                     .then(() => {
//                         console.log("student has been saved in userDB")
//                     })
//                     .catch((err) => {
//                         console.log("student has not been saved in userDB \n" + err)
//                         flag = true
//                         console.log(ans)
//                     })
//                 if (flag) {
//                     console.log("Error-402")
//                     res.status(402).json({ reason: "student already exists" })
//                     break lable1
//                 } else {
//                     (await session).commitTransaction();
//                     res.status(200).json("success")
//                 }
//             }
//         }
//         else {
//             // console.log(arr1)
//             // console.log(arr2)
//             console.log("Error-401: Student regNo already exists")
//             res.status(401).json("Student regNo already exists")
//         }
//     }
//     catch (error) {
//         console.log("Error-404")
//         console.log(error)
//         res.status(404).send(false)
//     } finally {
//         (await session).endSession()
//     }
// }

const deleteStudent = async (req, res) => {
    console.log('Delete student request received:', req.body);
    const session = await mongoose.startSession();
    
    try {
        if (!session) {
            console.error('Failed to create database session');
            return res.status(500).json({ success: false, message: 'Database session error' });
        }

        await session.startTransaction();
        const { regNo, adminID, confirmationPassword } = req.body || {};

        // Input validation
        if (!regNo || !adminID || !confirmationPassword) {
            console.log('Missing required fields:', { regNo, adminID, hasPassword: !!confirmationPassword });
            await session.abortTransaction();
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields" 
            });
        }

        // Verify admin credentials
        console.log('Looking for admin with ID:', adminID);
        let admin;
        try {
            admin = await userModel.findOne({ id: adminID }).session(session).lean();
            console.log('Admin found:', !!admin);
        } catch (adminError) {
            console.error('Error finding admin:', adminError);
            await session.abortTransaction();
            return res.status(500).json({ 
                success: false, 
                message: 'Error verifying admin',
                error: adminError.message 
            });
        }
        if (!admin) {
            await session.abortTransaction();
            return res.status(404).json({ 
                success: false, 
                message: "Admin not found" 
            });
        }

        if (admin.password !== confirmationPassword) {
            await session.abortTransaction();
            return res.status(401).json({ 
                success: false, 
                message: "Incorrect password" 
            });
        }

        // Delete student records in a transaction
        console.log('Deleting student records for regNo:', regNo);
        try {
            const studentDelete = await studentModel.findOneAndDelete({ regNo }).session(session);
            console.log('Student deleted from studentModel:', !!studentDelete);
            
            const studentDetailsDelete = await studentDetailsModel.findOneAndDelete({ 'info.regNo': regNo }).session(session);
            console.log('Student deleted from studentDetailsModel:', !!studentDetailsDelete);
            
            const userDelete = await userModel.findOneAndDelete({ id: regNo }).session(session);
            console.log('User deleted from userModel:', !!userDelete);
            
            if (!studentDelete || !studentDetailsDelete || !userDelete) {
                console.error('One or more delete operations failed:', {
                    student: !!studentDelete,
                    studentDetails: !!studentDetailsDelete,
                    user: !!userDelete
                });
                throw new Error('Failed to delete one or more student records');
            }

            // Commit the transaction if all operations succeed
            await session.commitTransaction();
            
            res.status(200).json({ 
                success: true, 
                message: "Student deleted successfully" 
            });
        } catch (deleteError) {
            console.error('Error during student deletion:', deleteError);
            await session.abortTransaction();
            throw deleteError; // This will be caught by the outer catch block
        }

    } catch (error) {
        // Abort transaction on error
        console.error("Error in deleteStudent:", error);
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        
        // More specific error handling
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false, 
                message: "Validation error",
                error: error.message 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: error.message 
        });
    } finally {
        // End the session
        await session.endSession();
    }
};

const vaildateTeacherDetails = async (row) => {
    msg = "";
    const isTeacher = await teacherModel.find({ 'teacherId': row.TeacherId });
    const isUser = await userModel.find({ 'id': row.TeacherId });
    if (isTeacher.length === 0 && isUser.length === 0) {
        const regexEmail = /^[a-zA-Z0-9._%+-]+@(gmail.com)$/;
        const regexClassId = /^(preprimary|primary[1-2])_[1-3]$/;
        if (row.MobileNo.length !== 10) {
            msg += `Invalid Mobile No, `;
        }
        if (!row.Name || row.Name.trim() === "") {
            msg += `Invalid Name, `;
        }
        if (!row.TeacherId) {
            msg += `Invalid TeacherId, `;
        }
        if (!regexEmail.test(row.Email)) {  //regex -> regexEmail
            msg += `Invalid email, `;
        }

        const cid = row.ClassId.includes(',') ? row.ClassId.split(',') : [row.ClassId];
        for (const cls of cid) {
            const isClass = await classModel.findOne({ 'classId': cls });
            if (isClass) {
                msg += `Class ${cls} already exists, `;
            } else if (!regexClassId.test(cls)) {
                msg += `Invalid classId: '${cls}', `;
            }
        }

    } else {
        msg += `${row.TeacherId}: TeacherId already exists `;
    }

    if (msg === "") {
        return { status: true, msg: "Valid" };
    } else {
        return { status: false, msg: msg };
    }
}

const registerTeacher = async (req, res) => {
    try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const headers = ['TeacherId', 'Name', 'MobileNo', 'Email', 'ClassId'];

        const data1 = xlsx.utils.sheet_to_json(worksheet, {
            header: headers,
            defval: '',
            range: 0
        });
        const data = data1.slice(2);

        console.log("registerTeacher(): ", data)

        for (const row of data) {
            row.MobileNo = String(row.MobileNo);
            const vaildateTeacherDetailsRow = await vaildateTeacherDetails(row)
            const cid = row.ClassId.includes(',') ? row.ClassId.split(',') : [row.ClassId];
            if (vaildateTeacherDetailsRow.status) {
                const teacher = {
                    teacherId: row.TeacherId,
                    teacherName: row.Name,
                    teacherMNo: row.MobileNo,
                    email: row.Email,
                    classId: cid,
                };

                for (const classid of cid) {
                    const demoClass = {
                        classId: classid,
                        teacherId: teacher.teacherId,
                        section: classid.split('_')[0],
                        year: classid.split('_')[1],
                        student: []
                    };
                    await classModel.create(demoClass);
                }

                await teacherModel.create(teacher);

                const user = {
                    id: row.TeacherId,
                    password: row.TeacherId,
                    role: 'teacher'
                };
                await userModel.create(user);

            } else {

                const pendingTeacher = {
                    teacherId: row.TeacherId,
                    teacherName: row.Name,
                    teacherMNo: row.MobileNo,
                    email: row.Email,
                    classId: cid,
                    msg: vaildateTeacherDetailsRow.msg
                };
                await pendingTeacherModel.create(pendingTeacher);
                // return res.status(400).json({ msg: `${row.TeacherId}: Missing or invalid data: MNo: ${row.MobileNo}, Name: ${row.Name}, Id: ${row.TeacherId}, classId: ${row.ClassId}` });
            }
        }
        //             else {
        //     return res.status(400).json({ msg: `${row.TeacherId}: TeacherId already exist` });
        // }
        res.json({ success: true });
    } catch (error) {
        console.error('registerTeacher(): Error reading file:', error);
        res.status(500).json({ success: false, msg: `Error reading file:\n ${error}` });
    }
};


const viewStudent = async (req, res) => {
    console.log("hello")
    try {
        console.log("hello")
        const students = await studentModel.find({})
        if (students) {
            res.status(200).json({ status: "success", data: students })
        }
        else {
            res.status(405).json({ status: "success", data: [] })
        }
    }
    catch (error) {
        res.status(404).json("Error")
    }
}

const viewTeacher = async (req, res) => {
    try {
        const teachers = await teacherModel.find({})
        if (teachers) {
            res.status(200).json({ status: "success", data: teachers })
        }
        else {
            res.status(405).json({ status: "success", data: [] })
        }
    }
    catch (error) {
        res.status(404).send(false)
    }
}

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

const downloadExcel = async (req, res) => {
    console.log("hii")
    const file = await path.join(__dirname, '..', 'samplesheets', 'sampleDataTeacher.xlsx'); // Adjust the path to your file
    console.log("File path:", file); // Log the file path for debugging
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Set the CORS header for this route
    res.download(file, (err) => {
        if (err) {
            console.error("File not found:", err);
            res.status(404).send("File not found");
        }
    });
};

const getTeacher = async (req, res) => {
    const { classId } = req.params;

    try {
        const teacherDetails = await teacherModel.findOne({ classId }).populate('teacherId');
        if (!teacherDetails) {
            return res.status(404).json({ message: 'teacher not found' });
        }

        res.json({ teacher: teacherDetails.teacherName });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
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
    registerStudent,
    registerTeacher,
    viewStudent,
    viewTeacher,
    pendingTeacher,
    downloadExcel,
    editTeacher,
    getTeacher,
    viewHistory,
    deleteStudent
}