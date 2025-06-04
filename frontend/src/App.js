import React, { useEffect } from "react";
import Register from "./pages/Register";
import AddStudents from "./pages/AddStudents";

import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Teacher from "./pages/Teacher";
import Principal from "./pages/Principal";
import Student from "./pages/Student";
import StudentEval from "./pages/StudentEval";
import ViewTeachers from "./pages/ViewTeachers";
import ViewStudents from "./pages/ViewStudents";
import PrincipalViewStudents from "./pages/PrincipalViewStudents";
import Front from "./pages/evaluate/Front";
import History from "./pages/History";
import Personal from "./pages/evaluate/Personal";
import Social from "./pages/evaluate/Social";
import Recreational from "./pages/evaluate/Recreational";
import Occupational from "./pages/evaluate/Occupational";
import Academic from "./pages/evaluate/Academic";
import Term from "./pages/Term";
import TermEntry from "./pages/TermEntry";


import "react-toastify/dist/ReactToastify.css";
import Class from "./pages/Class";
// import StudentHistory from "./pages/StudentHistory";
import PrivateRoute from './routes/PrivateRoute';
import AdminPrivateRoute from "./routes/AdminPrivateRoute";
import PrincipalPrivateRoute from "./routes/PrincipalPrivateRoute";
import StudentPrivateRoute from "./routes/StudentPrivateRoute";
import TeacherPrivateRoute from "./routes/TeacherPrivateRoute";

//import pages for stdent 
import StudentDetails from "./pages/StudentDetails";

export default function App() {
  // useEffect(()=>{
  //   localStorage.clear()
  // })

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route exact path="/" element={<Home />} />
        <Route exact path="/register" element={<Register />} /> */}
        <Route exact path="/" element={<Login />} />

        <Route element={<PrivateRoute />}>
          <Route exact path="/" element={<Login />} />
          <Route element={<AdminPrivateRoute />}>
            <Route exact path="/admin" element={<Admin />} />
            <Route exact path="/admin/addstudents" element={<AddStudents />} />
            <Route exact path="/admin/viewteachers" element={<ViewTeachers />} />
            <Route exact path="/admin/viewstudents" element={<ViewStudents />} />
            <Route exact path="/admin/viewstudents/details/:studentId" element={<StudentDetails />} />
            <Route exact path="/admin/viewstudents/history/:studentId" element={<History />} />
          </Route>
          <Route element={<StudentPrivateRoute />}>
            <Route exact path="/student" element={<Student />} />
            <Route exact path="/student/details" element={<StudentDetails />} />
            <Route exact path="/student/history" element={<History />} />
          </Route>
          <Route element={<TeacherPrivateRoute />}>
            <Route exact path="/teacher" element={<Teacher />} />
            <Route exact path="/teacher/eval" element={<Front />} />
            <Route exact path="/teacher/hist" element={<History />} />
            <Route exact path="/teacher/term/termEntry/eval/personal" element={<Personal />} />
            <Route exact path="/teacher/term/termEntry/eval/social" element={<Social />} />
            <Route exact path="/teacher/term/termEntry/eval/occupational" element={<Occupational />} />
            <Route exact path="/teacher/term/termEntry/eval/recreational" element={<Recreational />} />
            <Route exact path="/teacher/term/termEntry/eval/academic" element={<Academic />} />
            <Route exact path="/teacher/term" element={<Term />} />
            <Route exact path="/teacher/term/termEntry" element={<TermEntry />} />

          </Route>
          <Route element={<PrincipalPrivateRoute />}>
            <Route exact path="/principal" element={<Principal />} />
            <Route exact path="/principal/viewteachers" element={<ViewTeachers />} />
            <Route exact path="/principal/viewstudents" element={<PrincipalViewStudents />} />
            <Route exact path="/principal/viewstudents/history/:stdentId" element={<History />} />
            <Route exact path="/principal/viewstudents/details/:studentId" element={<StudentDetails />} />
          </Route>

        </Route>
        {/* <Route exact path="/profile/:username" element={<AddStudents />} /> */}
        <Route exact path="/class" element={<Class />} />
        <Route path="/eval/:username" element={<StudentEval />} />
        {/* <Route path="/hist/:username" element={<StudentHistory />} /> */}
      </Routes>
    </BrowserRouter>
  );
}




// In every axios call mention

// headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
