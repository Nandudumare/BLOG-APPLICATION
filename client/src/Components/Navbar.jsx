import React, { useContext } from "react";
import Styles from "./Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
const Navbar = () => {
  // const [navbar, setNavbar] = React.useState(false);
  const value = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // React.useEffect(() => {
  //   if (token) {
  //     setNavbar(true);
  //   }
  // }, [token]);

  const handleLogOut = () => {
    // setNavbar(false);
    // navigate("/logout");
    value.toggleAuth(false);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("id");
  };

  return value.isAuth || token ? (
    <>
      <div className={Styles.container}>
        <div className={Styles.menu}>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/blogs">Blogs List</Link>
            </li>
            <li>
              <Link to="/blogs/create">New blog</Link>
            </li>
            <li>
              <Link to="/blogs/trash">Deleted Blogs</Link>
            </li>
            <li onClick={handleLogOut}>
              <Link to="/logout">LogOut</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  ) : (
    <>
      <div className={Styles.container}>
        <div className={Styles.menu}>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
