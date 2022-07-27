import { Button } from "@mui/material";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    const logout = async () => {
      await axios.post("http://localhost:8080/logout", {});
    };
    logout();
  }, []);
  return (
    <div>
      <p style={{ color: "white" }}>You are logged out successfully </p>
      {/* <Button
        onClick={() => navigate("/")}
        size="sm"
        variant="contained"
        color="success"
      > 
        Go To Home
      </Button> */}
    </div>
  );
};

export default Logout;
