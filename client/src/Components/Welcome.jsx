import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Welcome = () => {
  const value = useContext(AuthContext);
  const [randomData, setRandomData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const randomData = async () => {
      const res = await axios.get("http://localhost:8080/blogs/random");
      setRandomData([...res.data]);
    };
    randomData();
  }, []);

  function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

  // useEffect(() => {
  //   const gitData = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:8080/getcookie", {
  //         withCredentials: true,
  //       });
  //       if (res.data) {
  //         const token = res.data.token;
  //         const user_id = res.data.id;
  //         const refreshToken = res.data.refreshToken;
  //         // value.toggleAuth(true);
  //         localStorage.setItem("id", user_id);
  //         localStorage.setItem("token", token);
  //         localStorage.setItem("refreshToken", refreshToken);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   gitData();
  // }, []);

  useEffect(() => {
    const googleData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/profile", {
          withCredentials: true,
        });
        if (res.data !== "hello world") {
          const token = res.data.token;
          const user_id = res.data.id;
          const refreshToken = res.data.refreshToken;
          value.toggleAuth(true);
          localStorage.setItem("id", user_id);
          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken", refreshToken);
        }
      } catch (err) {
        value.toggleAuth(false);
        console.log(err);
      }
    };
    googleData();
  }, []);

  return (
    <div className="grid-container home-div">
      {randomData &&
        randomData.map((el, index) => {
          return (
            <Card key={el._id}>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  style={{ textAlign: "left", cursor: "pointer" }}
                  onClick={() => navigate(`/blogs/${el._id}`)}
                >
                  {el.Title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  style={{ textAlign: "left", color: "white" }}
                >
                  {el.Body.length > 50 ? (
                    <span
                      style={{
                        width: "100%",
                      }}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: el.Body.slice(3, 50),
                        }}
                      ></span>
                      <span
                        style={{ color: "#007aff", cursor: "pointer" }}
                        onClick={() => navigate(`/blogs/${el._id}`)}
                      >
                        {`${" "}Read More...`}
                      </span>
                    </span>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: el.Body }}></div>
                  )}
                </Typography>
              </CardContent>
              <CardActions>
                <div className="date__">
                  <Button style={{ color: "white" }}>
                    {timeSince(new Date(el.CreatedAt))} Ago
                  </Button>
                </div>
              </CardActions>
            </Card>
          );
        })}
    </div>
  );
};

export default Welcome;
