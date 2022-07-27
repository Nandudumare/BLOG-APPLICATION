import React, { useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Edit from "./Edit";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, Modal } from "@mui/material";
import MultiSelectCat from "./MultiSelectCat";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AuthContext from "../context/AuthContext";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const BlogList = () => {
  const [blogData, setBlogData] = React.useState([]);
  const [loader, setLoader] = React.useState(true);
  const [time, setTime] = React.useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const deleteId = React.useRef();
  const [category, setCategory] = React.useState([]);

  const [idData, setIdData] = React.useState([]);

  const token = localStorage.getItem("token");

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

  React.useEffect(() => {
    const GetData = async () => {
      try {
        const user_id = localStorage.getItem("id");
        let res = await axios.get(
          `http://localhost:8080/blogs/user/${user_id}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setBlogData([...res.data]);
        if (res) {
          setLoader(false);
        }
      } catch (err) {
        setTimeout(() => {
          setTime(true);
        }, 3000);
        const refresh = localStorage.getItem("refreshToken");
        const res = await axios.post("http://localhost:8080/users/renewtoken", {
          refresh,
        });
        localStorage.setItem("token", res.data);
      }
    };
    GetData();
  }, []);

  React.useEffect(() => {
    const getIdData = async () => {
      const payload = {
        categoryDataString: category,
      };
      const res = await axios.post(
        "http://localhost:8080/subcat/arrayid",
        payload
      );
      setIdData([...res.data]);
    };
    getIdData();
  }, [category]);

  const handleCategoryChange = async () => {
    if (idData) {
      const user_id = localStorage.getItem("id");
      const payload = {
        category: idData,
        user_id: user_id,
      };
      const res = await axios.post(
        "http://localhost:8080/blogs/filterd",
        payload
      );
      const data = res.data;
      setBlogData([...data]);
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/blogs/${id}`);
      // alert("Item deleted successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const getCat = (arr) => {
    setCategory([...category, ...arr]);
  };

  return loader ? (
    time ? (
      <div className="scanner">
        <h3>Something Went Wrong Please Try Again</h3>
      </div>
    ) : (
      <div className="loader"></div>
    )
  ) : (
    <div className="blogListPageDiv">
      <div className="filterDiv">
        <div style={{ textAlign: "left" }}>
          <MultiSelectCat getCat={getCat} onChange={handleCategoryChange} />
          {/* <FormControl sx={{ m: 0, width: 300 }}>
            <InputLabel
              id="demo-multiple-checkbox-label"
              style={{
                padding: "0 0.25rem",
                background: "black",
                color: "white",
              }}
            >
              category
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={personName}
              onChange={handleChange}
              input={
                <OutlinedInput
                  label="Tag"
                  style={{ color: "white", border: "1px solid whitesmoke" }}
                />
              }
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {names.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={personName.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
        </div>

        {/* <FormControl sx={{ m: 0, width: 300 }}>
          <InputLabel
            id="demo-simple-select-label"
            style={{
              padding: "0 0.25rem",
              background: "black",
              color: "white",
            }}
          >
            Author
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            style={{
              color: "white",
              border: "1px solid whitesmoke",
              textAlign: "left",
            }}
            value={Singleuser}
            label="Age"
            onChange={(e) => setSingleUser(e.target.value)}
          >
            {users &&
              users.map((el, index) => (
                <MenuItem value={el.name} key={index}>
                  {el.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl> */}
      </div>

      <div className="grid-container">
        {blogData &&
          blogData.map((el, index) => {
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
                  {/* <Typography
                  variant="body2"
                  color="text.secondary"
                  style={{ textAlign: "left" }}
                >
                  {el.Body.length > 10 ? (
                    <span
                      style={{
                        width: "100%",
                      }}
                    >
                      {el.Body.slice(3, 10)}
                      <span
                        style={{ color: "#007aff", cursor: "pointer" }}
                        onClick={() => navigate(`/blogs/${el._id}`)}
                      >
                        {`${" "}Read More...`}
                      </span>
                    </span>
                  ) : (
                    el.Body
                  )}
                </Typography> */}
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="outlined"
                    // color="success"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/blogs/${el._id}/edit`)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      // navigate(`/blogs/${el._id}/delete`);
                      deleteId.current = el._id;
                      handleOpen();
                    }}
                  >
                    Delete
                  </Button>
                  {/* <Button onClick={handleOpen}>Open modal</Button> */}
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                      >
                        Do You Really Want to Delete this Blog ?
                      </Typography>
                      <CardActions
                        style={{ marginLeft: "50%", marginTop: "2rem" }}
                      >
                        <Button size="medium" onClick={handleClose}>
                          Disagree
                        </Button>
                        <Button
                          size="medium"
                          onClick={() => {
                            handleDelete(deleteId.current);
                            navigate(`/blogs/${el._id}/delete`);
                          }}
                        >
                          Agree
                        </Button>
                      </CardActions>
                    </Box>
                  </Modal>
                  <div className="button_date">
                    <Button>{timeSince(new Date(el.CreatedAt))} Ago</Button>
                  </div>
                </CardActions>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default BlogList;
