import React from "react";
import { Route, Routes } from "react-router-dom";
import BlogList from "../Components/BlogList";
import Create from "../Components/Create";
import Deleted from "../Components/Deleted";
import Edit from "../Components/Edit";
import Entity from "../Components/Entity";
import Navbar from "../Components/Navbar";
import SoftDelete from "../Components/SoftDelete";
import TextEditor from "../Components/TextEditor";
import Welcome from "../Components/Welcome";
import Test from "../Components/Test";
import Register from "../Components/Register";
import { LogIn } from "../Components/LogIn";
import { RequiredAuth } from "./RequiredAuth";
import Logout from "../Components/Logout";

const MainRoutes = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              {/* <Test /> */}
              <Welcome />
              {/* <TextEditor /> */}
            </>
          }
        />
        <Route
          path="/blogs"
          element={
            <RequiredAuth>
              <BlogList />
            </RequiredAuth>
          }
        />
        <Route
          path="/blogs/create"
          element={
            <RequiredAuth>
              <Create />
            </RequiredAuth>
          }
        />
        <Route
          path="/blogs/trash"
          element={
            <RequiredAuth>
              <Deleted />
            </RequiredAuth>
          }
        />
        <Route
          path="/blogs/:id/edit"
          element={
            <RequiredAuth>
              <Edit />
            </RequiredAuth>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <RequiredAuth>
              <Entity />
            </RequiredAuth>
          }
        />
        <Route
          path="/blogs/:id/delete"
          element={
            <RequiredAuth>
              <SoftDelete />
            </RequiredAuth>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
};

export default MainRoutes;
