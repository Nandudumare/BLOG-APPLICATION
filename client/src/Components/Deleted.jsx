import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Modal } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";

const Deleted = () => {
  const [deletedData, setDeletedData] = React.useState([]);
  const [loader, setLoader] = React.useState(true);
  const [time, setTime] = React.useState(false);
  const navigate = useNavigate();
  const [restore, setRestore] = React.useState(true);
  const [notRestore, setNotRestore] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const deleteId = React.useRef();
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
          `http://localhost:8080/blogs/trash/user/${user_id}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setDeletedData([...res.data]);
        if (res) {
          setLoader(false);
          setNotRestore(false);
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

  const handleRestore = async (el) => {
    try {
      const res = await axios.patch(
        `http://localhost:8080/blogs/restore/${el._id}`,
        { ...el }
      );
      if (res) {
        setRestore(false);
        setNotRestore(false);
      }
    } catch (err) {
      setTimeout(() => {
        setNotRestore(false);
      }, 3000);
    }
  };

  const handlePermaDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/blogs/delete/${id}`);
    } catch (err) {}
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
      <div className="grid-container">
        {deletedData &&
          deletedData.map((el, index) => {
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
                  {el.Body.length > 5 ? (
                    <span
                      style={{
                        width: "100%",
                      }}
                    >
                      {el.Body.slice(0, 10)}
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
                  {/* <Button
                  size="small"
                  onClick={() => navigate(`/blogs/${el._id}/edit`)}
                >
                  Restore
                </Button> */}

                  <PopupState variant="popover" popupId="demo-popup-popover">
                    {(popupState) => (
                      <div onClick={() => handleRestore(el)}>
                        <Button
                          size="small"
                          {...bindTrigger(popupState)}
                          variant="outlined"
                          color="success"
                          startIcon={<RestoreFromTrashIcon />}
                          // onClick={() => handleRestore(el)}
                        >
                          Restore
                        </Button>
                        <Popover
                          {...bindPopover(popupState)}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "center",
                          }}
                        >
                          {restore ? (
                            notRestore ? (
                              "Try Again"
                            ) : (
                              <CircularProgress />
                            )
                          ) : (
                            <Typography sx={{ p: 2 }}>Restored</Typography>
                          )}
                        </Popover>
                      </div>
                    )}
                  </PopupState>

                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    style={{ marginLeft: "1rem" }}
                    onClick={() => {
                      // navigate(`/blogs/${el._id}/delete`);
                      deleteId.current = el._id;
                      handleOpen();
                    }}
                  >
                    Delete
                  </Button>
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
                        Do You Really Want to Delete this Blog Permanently ?
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
                            // handleDelete(deleteId.current);
                            // navigate(`/blogs/${el._id}/delete`);
                            handlePermaDelete(deleteId.current);
                            navigate(`/blogs/${el._id}/delete`);
                          }}
                        >
                          Agree
                        </Button>
                      </CardActions>
                    </Box>
                  </Modal>

                  <div className="button_date_delete">
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

export default Deleted;
