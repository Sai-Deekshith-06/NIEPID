// const loginModel=require('../model/login.model')
const userModel = require('../models/user.model')
const teacherModel = require('../models/teacher.model')
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
    console.log(req.body)
    const { teacherId, teacherName, email, teacherMNo, classId } = req.body;
    const mno = String(teacherMNo)
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!regex.test(email)) {
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
    const session = mongoose.startSession()
    try {
        (await session).startTransaction()
        const val1 = {}
        const data = req.body
        // console.log(data)
        const arr1 = await studentDetailsModel.findOne({ 'info.regNo': data.formData.details.info.regNo })
        const arr2 = await studentModel.findOne({ regNo: data.formData.details.info.regNo })
        console.log(arr1)
        console.log(arr2)
        lable1: if (!arr1 && !arr2) {
            let flag = false

            if (data.formData.details.info.regNo) {
                const responce1 = await new studentDetailsModel(data.formData.details).save()
                    .then(() => {
                        console.log("data entered in studentDetailsModel successfully")
                    })
                    .catch((err) => {
                        flag = true
                    })
            }
            if (flag) {
                console.log("Error-405")
                res.status(405).json({ reason: "studentDetails already exists" })
                break lable1
            }
            const value1 = generateClassId(data.formData.stdCred.section, data.formData.stdCred.year)
            console.log(data.formData.stdCred)
            const arr3 = await classModel.findOne({ classId: value1 })
            // console.log(arr3.length)
            // console.log(arr3)
            if (!arr3) {
                console.log("Error-404")
                res.status(404).json({ reason: "no class exists" })
                break lable1
            } else {
                const v1 = arr3.student
                v1.push(data.formData.details.info.regNo)
                // console.log(v1)
                const searchClass = generateClassId(data.formData.stdCred.section, data.formData.stdCred.year)
                const responce2 = await classModel.findOneAndUpdate(
                    { classId: searchClass },
                    { student: v1 },
                    { new: true }
                )
                const ans = studentJsonGenerate(data, searchClass)
                // console.log(ans)
                const responce3 = await new studentModel(ans).save()
                    .then(() => {
                        // console.log("student has been saved")
                    })
                    .catch((err) => {
                        // console.log("student has not been saved \n"+err)
                        flag = true
                        // console.log(ans)
                    })
                if (flag) {
                    console.log("Error-403")
                    res.status(403).json({ reason: "student already exists" })
                    break lable1
                }
                const stdUser = {
                    id: data.formData.details.info.regNo,
                    password: data.formData.details.info.regNo,
                    role: "student"
                }
                const responce4 = await new userModel(stdUser).save()
                    .then(() => {
                        console.log("student has been saved in userDB")
                    })
                    .catch((err) => {
                        console.log("student has not been saved in userDB \n" + err)
                        flag = true
                        console.log(ans)
                    })
                if (flag) {
                    console.log("Error-402")
                    res.status(402).json({ reason: "student already exists" })
                    break lable1
                } else {
                    (await session).commitTransaction();
                    res.status(200).json("success")
                }
            }
        }
        else {
            // console.log(arr1)
            // console.log(arr2)
            console.log("Error-401: Student regNo already exists")
            res.status(401).json("Student regNo already exists")
        }
    }
    catch (error) {
        console.log("Error-404")
        console.log(error)
        res.status(404).send(false)
    } finally {
        (await session).endSession()
    }
}

// const registerTeacher = async (req, res) => {
//     try {
//         // console.log('File buffer:', req.file.buffer);
//         const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
//         // console.log('Workbook:', workbook);

//         const sheetName = workbook.SheetNames[0];
//         // console.log("sheetnames:", workbook.Sheets[sheetName])
//         const worksheet = workbook.Sheets[sheetName];
//         // console.log("worksheet:", worksheet)
//         const headers = ['teacherId', 'teacherName', 'teacherMNo', 'email', 'classId'];

//         const data1 = xlsx.utils.sheet_to_json(worksheet, {
//             header: headers,
//             defval: '',
//             range: 0
//         });
//         const data = data1.slice(1)
//         // console.log('Extracted data:', data);
//         let flag = true;

//         const newData = data.map(async (row) => {

//             const isTeacher = await teacherModel.find({ 'teacherId': row.teacherId })
//             const isUser = await userModel.find({ 'id': row.teacherId })

//             // console.log(isTeacher,"----->----->----->----->",isUser);
//             row.teacherMNo = String(row.teacherMNo)


//             if (isTeacher.length == 0 && isUser.length == 0) {
//                 if (row.teacherMNo.length == 10 && row.teacherId && row.teacherName && row.classId) {
//                     const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
//                     if (regex.test(row.email)) {
//                         const no = row.classId.indexOf(",");
//                         const cid = []
//                         if (no != -1) {
//                             row.classId.split(',').map((id) => {
//                                 cid.push(id);
//                             })
//                         }
//                         else {
//                             cid.push(row.classId);
//                         }

//                         cid.map(async (cls) => {
//                             const isClass = await classModel.findOne({ 'classId': cls });
//                             if (isClass) {
//                                 res.status(400).json({ msg: `Class ${cid}//${cls} already Exist` })
//                                 return
//                             }
//                             else if (cls != "preprimary_1" && cls != "preprimary_2" && cls != "preprimary_3" && cls != "primary1_1" && cls != "primary1_2" && cls != "primary1_3" && cls != "primary2_1" && cls != "primary2_2" && cls != "primary2_3") {
//                                 flag = false
//                                 console.log("Error-1")
//                                 res.status(400).json({ msg: `Invalid classId : ${cid}` })
//                             }
//                         })

//                         const teacher = {
//                             teacherId: row.teacherId,
//                             teacherName: row.teacherName,
//                             teacherMNo: row.teacherMNo,
//                             email: row.email,
//                             classId: cid,
//                         }

//                         teacher.classId.map(async (classid) => {
//                             const demoClass = {
//                                 classId: classid,
//                                 teacherId: teacher.teacherId,
//                                 section: classid.split('_')[0],
//                                 year: classid.split('_')[1],
//                                 student: []
//                             }
//                             await classModel.create(demoClass)
//                         })
//                         await teacherModel.create(teacher)

//                         const user = {
//                             id: row.teacherId,
//                             password: row.teacherId,
//                             role: 'teacher'
//                         }
//                         await userModel.create(user)
//                     }
//                     else {
//                         flag = false
//                         console.log("Error-2")
//                         res.status(400).json({ msg: `Invalid email : ${row.email}` })
//                     }
//                 }
//                 else {
//                     flag = false
//                     console.log("Error-3")
//                     res.status(400).json({ msg: "Error-3" })
//                 }
//             }
//             else {
//                 flag = false
//                 console.log("Error-4")
//             }
//         })

//         // console.log(newData)
//         if (flag)
//             res.json({ success: true });
//     }
//     catch (error) {
//         console.error('Error reading file:', error);
//         res.status(500).json({ success: false, error: 'Error reading file' });
//     }
// }

// const viewStudent = async (req, res) => {
//     try {
//         console.log("---------")
//         const students = await studentModel.find({});
//         if (students.length) {
//             res.status(200).json({ status: "success", data: students });
//         } else {
//             res.status(200).json({ status: "success", data: [] });
//         }
//     } catch (error) {
//         console.error("Error fetching students:", error);
//         res.status(500).json({ status: "error", message: "Internal server error" });
//     }
// };

const registerTeacher = async (req, res) => {
    try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const headers = ['teacherId', 'teacherName', 'teacherMNo', 'email', 'classId'];

        const data1 = xlsx.utils.sheet_to_json(worksheet, {
            header: headers,
            defval: '',
            range: 0
        });
        const data = data1.slice(1);

        console.log("registerTeacher(): ", data)
        const regexEmail = /^[a-zA-Z0-9._%+-]+@(gmail)\.(com)$/;
        const regexClassId = /^(preprimary|primary[1-2])_[1-3]$/;

        for (const row of data) {
            const isTeacher = await teacherModel.find({ 'teacherId': row.teacherId });
            const isUser = await userModel.find({ 'id': row.teacherId });

            row.teacherMNo = String(row.teacherMNo);

            if (isTeacher.length === 0 && isUser.length === 0) {
                if (row.teacherMNo.length === 10 && row.teacherId && row.teacherName && row.classId) {
                    if (!regexEmail.test(row.email)) {
                        return res.status(400).json({ msg: `Invalid email: ${row.email}` });
                    }

                    const cid = row.classId.includes(',') ? row.classId.split(',') : [row.classId];
                    for (const cls of cid) {
                        const isClass = await classModel.findOne({ 'classId': cls });
                        if (isClass) {
                            return res.status(400).json({ msg: `Class ${cls} already exists` });
                            // } else if (!['preprimary_1', 'preprimary_2', 'preprimary_3', 'primary1_1', 'primary1_2', 'primary1_3', 'primary2_1', 'primary2_2', 'primary2_3'].includes(cls)) {
                        } else if (!regexClassId.test(cls)) {
                            return res.status(400).json({ msg: `Invalid classId: '${cls}', Valid class ID's : [ preprimary_(1,2,3), primary(1,2)_(1,2,3) ]` });
                        }
                    }

                    const teacher = {
                        teacherId: row.teacherId,
                        teacherName: row.teacherName,
                        teacherMNo: row.teacherMNo,
                        email: row.email,
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
                        id: row.teacherId,
                        password: row.teacherId,
                        role: 'teacher'
                    };
                    await userModel.create(user);

                } else {
                    return res.status(400).json({ msg: `Missing or invalid data: MNo:\n ${row.teacherMNo}, Name: ${row.teacherName}, Id: ${row.teacherId}, classId: ${row.classId}` });
                }
            }
            else {
                return res.status(400).json({ msg: "TeacherId already exist" });
            }
        }

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
        console.log(teachers)
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
    downloadExcel,
    editTeacher,
    getTeacher,
    viewHistory
}