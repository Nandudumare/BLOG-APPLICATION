import axios from "axios";
import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Styles from "./Register.module.css";
import fb from "../Components/icons/fb.svg";
import google from "../Components/icons/google.svg";
import github from "../Components/icons/github.svg";

export const LogIn = () => {
  const [formData, setFormData] = React.useState({});
  const value = useContext(AuthContext);
  const formRef = React.useRef();
  // const tokenRef = React.useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const [loader, setLoader] = React.useState(false);

  let from = location.state?.from?.pathname || "/";

  const handleChange = (event) => {
    const name = event.target.name; //
    setFormData({
      ...formData,
      [name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    formRef.current.reset();
    setLoader(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/users/login",
        formData
      );
      const token = res.data.token;
      const user_id = res.data.id;
      const refreshToken = res.data.refreshToken;
      value.toggleAuth(true);
      localStorage.setItem("id", user_id);
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      setLoader(false);
      navigate(from, { replace: true });
    } catch (err) {
      setTimeout(() => {
        setLoader(false);
        alert("Try Again");
      }, 2000);
    }
  };

  return (
    <div className={Styles.login_box}>
      {loader ? <div className="loader absoloted"></div> : ""}
      <h2>Login</h2>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className={Styles.user_box}>
          <input type="text" name="email" required onChange={handleChange} />
          <label>Email</label>
        </div>
        <div className={Styles.user_box}>
          <input
            type="password"
            name="password"
            required
            onChange={handleChange}
          />
          <label>Password</label>
        </div>
        <button type="submit">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Submit
        </button>

        <div style={{ color: "white", marginTop: "1rem" }}>
          Don't have an Account ? <Link to="/register">Register Here</Link>
        </div>
        <div className={Styles.icons_wrapper}>
          <a href="http://localhost:8080/google">
            <img
              className={Styles.icon}
              src={google}
              alt=""
              width={"40px"}
              height={"40px"}
              style={{
                background: "white",
                borderRadius: "30px",
                marginTop: "15%",
                cursor: "pointer",
              }}
            />
          </a>
          <img
            src={fb}
            alt=""
            className={Styles.icon}
            style={{ cursor: "pointer" }}
          />
          <a
            // href={`https://github.com/login/oauth/authorize?client_id=1b0195b662d33c65bb7a`}
            href="http://localhost:8080/auth/github"
          >
            <img
              className={Styles.icon}
              src={github}
              alt=""
              width={"48px"}
              height={"48px"}
              style={{ cursor: "pointer" }}
            />
          </a>
        </div>
      </form>
    </div>
  );
};
