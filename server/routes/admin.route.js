const express = require('express')
const multer = require('multer')
const routes = express.Router()
const { registerStudent, registerTeacher, viewStudent, viewTeacher, downloadExcel, editTeacher, getTeacher, viewHistory, deleteStudent } = require('../controllers/admin.controller')
const { pendingTeacher, deletePendingTeacher, editPendingTeacher } = require('../controllers/admin.pendingTeacher.controller')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })
const { viewDetails } = require('../controllers/student.controller');

routes.get('/viewStudentDetails', viewDetails);

routes.put('/updateTeacher/:id', editTeacher)
routes.post('/registerStudent', registerStudent);
routes.post('/registerTeacher', upload.single('file'), registerTeacher);
routes.get('/viewstudents', viewStudent);
routes.get('/student/viewHistory', viewHistory)
routes.get('/pendingTeacher', pendingTeacher);
routes.post('/deletePendingTeacher/', deletePendingTeacher);
routes.post('/editPendingTeacher/', editPendingTeacher);
routes.get('/viewTeacher', viewTeacher);
routes.get('/download', downloadExcel);
routes.get('/teacher/:classId', getTeacher);
routes.post('/deleteStudent', deleteStudent);

module.exports = routes