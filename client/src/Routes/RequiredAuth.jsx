import React, { useContext } from "react";

import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export const RequiredAuth = ({ children }) => {
  const value = useContext(AuthContext);

  const token = localStorage.getItem("token");

  const location = useLocation();

  if (value.isAuth || token) return children;
  else return <Navigate to="/login" state={{ from: location }} replace />;
};
