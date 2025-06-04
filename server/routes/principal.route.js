const express = require('express')
const routes = express.Router()
const { viewStudent, viewTeacher, getTeacher, searchStudent, viewHistory } = require('../controllers/principal.controller');
const { route } = require('./student.route');
//const { viewHistory2 } = require('../controllers/student.controller');
const { viewDetails } = require('../controllers/student.controller');

routes.get('/viewStudentDetails', viewDetails);

routes.get('/viewTeacher', viewTeacher);
routes.get('/viewstudents', viewStudent);
routes.get('/teacher/:classId', getTeacher)
routes.get('/student/search', searchStudent)
routes.get('/student/viewHistory', viewHistory)

module.exports = routes