import axios from "axios";
import React, { useEffect } from "react";
import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Styles from "./Register.module.css";
// import InstagramIcon from "@mui/icons-material/Instagram";

const Register = () => {
  const [formData, setFormData] = React.useState({});
  const value = useContext(AuthContext);
  const [loader, setLoader] = React.useState(false);
  const formRef = React.useRef();
  const location = useLocation();
  const navigate = useNavigate();

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
        "http://localhost:8080/users/signin",
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
      <h2>Register</h2>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className={Styles.user_box}>
          <input type="text" name="name" required onChange={handleChange} />
          <label>Name</label>
        </div>
        <div className={Styles.user_box}>
          <input type="text" name="username" required onChange={handleChange} />
          <label>Username</label>
        </div>
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
          Already have an Account ? <Link to="/login">Login Here</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
