import React, { useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <div >
        {/* TODO: design something cool , Navbar , navbar should contain logout admin link and class link heading and other shit */}

        {/* <NavLink to="/login"> Admin          </NavLink>
        <NavLink to="/login"> student   </NavLink>
        <NavLink to="/login"> teacher   </NavLink>
        <NavLink to="/login"> principal   </NavLink> */}
      </div>
    </>
  );
}
