import { Box, Button } from "@mui/material";
import axios from "axios";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const SoftDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <h2 style={{ color: "white" }}>Blog Deleted</h2>
      <Box sx={{ display: "flex", gap: 2, margin: "auto", marginLeft: "40%" }}>
        <Button
          onClick={() => navigate("/")}
          size="sm"
          variant="contained"
          color="success"
        >
          Go To Home
        </Button>
        <Button
          onClick={() => navigate("/blogs/trash")}
          size="sm"
          variant="contained"
          color="error"
        >
          Go To Trash
        </Button>
      </Box>
    </div>
  );
};

export default SoftDelete;
