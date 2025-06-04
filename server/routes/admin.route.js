const express = require('express')
const multer = require('multer')
const routes = express.Router()
const { registerStudent, registerTeacher, viewStudent, viewTeacher, downloadExcel, editTeacher, getTeacher, viewHistory } = require('../controllers/admin.controller')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })
const { viewDetails } = require('../controllers/student.controller');

routes.get('/viewStudentDetails', viewDetails);

routes.put('/updateTeacher/:id', editTeacher)
routes.post('/registerStudent', registerStudent);
routes.post('/registerTeacher', upload.single('file'), registerTeacher);
routes.get('/viewstudents', viewStudent);
routes.get('/viewTeacher', viewTeacher);
routes.get('/student/viewHistory', viewHistory)
routes.get('/download', downloadExcel);
routes.get('/teacher/:classId', getTeacher);

module.exports = routes