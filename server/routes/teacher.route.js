const express = require('express')
const routes = express.Router()
const { historyStudent, evaluateTerm, getStudents, getQuestions, getTeacher, getStudentbyId, submitForm, submitTermTypeComment, promoteStudent } = require('../controllers/teacher.controller')

const { viewDetails } = require('../controllers/student.controller');
routes.get('/viewStudentDetails', viewDetails);

routes.get('/hist1', historyStudent)
routes.get('/abc', historyStudent)
routes.get('/evaluate', evaluateTerm)
routes.get('/getStudents', getStudents)
routes.get('/evaluate/questions', getQuestions)
routes.get('/getTeacher', getTeacher)
routes.get('/getStudentbyId', getStudentbyId)
// routes.get('/evaluateYear', evaluateYearStudent)
routes.post('/eval/form', submitForm)
routes.post('/termTypeComment', submitTermTypeComment)
routes.post('/yearEndTransfer', promoteStudent)

module.exports = routes