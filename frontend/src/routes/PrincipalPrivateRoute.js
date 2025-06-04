import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from "react-toastify";

function principalPrivateRoute() {

  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });

  const role = localStorage.getItem('role');

  if (role !== 'principal') {
    generateError("Not a principal");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default principalPrivateRoute;
