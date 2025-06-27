const mongoose = require('mongoose')
const pendingTeacherSchema = new mongoose.Schema({
    teacherId: {
        type: String,
        unique: true,
        required: true
    },
    teacherName: {
        type: String,
        required: true,
    },
    teacherMNo: { type: String },
    email: {
        type: String,
        required: true,
        unique: true
    },
    classId: {
        type: [String],
        required: true
    },
    msg: {
        type: String,
        required: true,
        default: ''
    }
})
module.exports = mongoose.model('pendingTeacher', pendingTeacherSchema)