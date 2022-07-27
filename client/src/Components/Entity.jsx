import axios from "axios";
import React, { useRef } from "react";
import { useParams } from "react-router-dom";

import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

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
const Entity = () => {
  const { id } = useParams();
  const [loader, setLoader] = React.useState(true);
  const [commentState, setCommentState] = React.useState("");
  const [commentData, setCommentData] = React.useState([]);
  const [nameUser, setNameUser] = React.useState("");
  const [liked, setLiked] = React.useState(false);
  const [likedData, setLikedData] = React.useState([]);
  React.useEffect(() => {
    try {
      const GetSingle = async () => {
        let res = await axios.get(`http://localhost:8080/blogs/${id}`);
        setSingle(res.data[0]);
      };
      const GetComment = async () => {
        let res = await axios.get(`http://localhost:8080/comments/${id}`);
        let data = res.data;
        setCommentData([...data]);
      };
      GetSingle();
      GetComment();
      setTimeout(() => {
        setLoader(false);
      }, 2000);
    } catch (e) {}
  }, [id]);
  const [single, setSingle] = React.useState({});

  // const body = useRef(single.Body);
  const commentRef = useRef();

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const user_id = localStorage.getItem("id");
      const payload = {
        blog_id: id,
        user_id: user_id,
        message: commentState,
        rating: 0,
      };

      const res = await axios.post("http://localhost:8080/comments", payload);
      setCommentData([...commentData, payload]);
      commentRef.current.reset();
    } catch (err) {}
  };

  const username = (user_id) => {
    const getuser = async (user_id) => {
      const res = await axios.get(
        `http://localhost:8080/users/single?id=${user_id}`
      );

      setNameUser(res.data[0].username);
    };
    getuser(user_id);
    return nameUser;
    // setNameUser(name);
  };

  const likedOrNot = async (liked) => {
    if (liked === false) {
      const user_id = localStorage.getItem("id");
      const payload = {
        blog_id: id,
        user_id: user_id,
        emoji: "heart",
      };

      // for (let i = 0; i < likedData.length; i++) {
      //   if (
      //     likedData[i].user_id === payload.user_id &&
      //     likedData[i].emoji === payload.emoji &&
      //     likedData[i].blog_id === payload.blog_id
      //   ) {
      //     setLiked(true);
      //     break;
      //   }
      // }

      const res = await axios.post("http://localhost:8080/likes/", payload);
    } else {
      const user_id = localStorage.getItem("id");
      const del = await axios.delete(`http://localhost:8080/likes/${user_id}`);
    }
  };

  React.useEffect(() => {
    const getLikes = async () => {
      const res = await axios.get(`http://localhost:8080/likes?q=${id}`);
      setLikedData([...res.data]);
    };
    getLikes();
  }, [liked]);

  setTimeout(() => {
    const user_id = localStorage.getItem("id");
    const payload = {
      blog_id: id,
      user_id: user_id,
      emoji: "heart",
    };
    let flag = false;
    for (let i = 0; i < likedData.length; i++) {
      if (
        likedData[i].user_id === payload.user_id &&
        likedData[i].emoji === payload.emoji &&
        likedData[i].blog_id === payload.blog_id
      ) {
        flag = true;
        break;
      }
    }
    flag ? setLiked(true) : setLiked(false);
  }, 50);

  return loader ? (
    <div className="loader"></div>
  ) : (
    single && (
      <>
        <div className="Entity">
          <div
            className="like_div"
            onClick={() => {
              setLiked((prev) => !prev);
              likedOrNot(liked);
            }}
          >
            {liked ? (
              <>
                <FavoriteIcon fill="rgba(240, 19, 60, 0.899)" />
                <p
                  style={{
                    display: "inline-block",
                    marginLeft: "1rem",
                    padding: "0",
                  }}
                >
                  {likedData.length}
                </p>
              </>
            ) : (
              <>
                <FavoriteBorderIcon />
                <p
                  style={{
                    display: "inline-block",
                    marginLeft: "1rem",
                    padding: "0",
                  }}
                >
                  {likedData.length}
                </p>
              </>
            )}
          </div>
          <h2>{single.Title}</h2>
          <div
            dangerouslySetInnerHTML={{ __html: single.Body }}
            className="content__Entity"
          ></div>
          <div className="date">
            <p>Created : {timeSince(new Date(single.CreatedAt))} Ago</p>
            <p>Updated : {timeSince(new Date(single.UpdatedAt))} Ago</p>
          </div>
        </div>
        <div className="commentDiv">
          <form ref={commentRef} onSubmit={handleComment} className="input_div">
            <TextField
              id="standard-basic"
              label="Add a comment..."
              variant="standard"
              onChange={(e) => setCommentState(e.target.value)}
            />
            <Button variant="contained" type="submit">
              Post
            </Button>
          </form>
          <div className="comment_grid_div">
            {commentData &&
              commentData.map((el, index) => {
                return (
                  <Card
                    // sx={{ maxWidth: 500 }}
                    key={index}
                    className="commentCard"
                  >
                    <CardActionArea>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {username(el.user_id)}
                        </Typography>
                        <Typography variant="body2" color="text.white">
                          {el.message}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                );
              })}
          </div>
        </div>
      </>
    )
  );
};

export default Entity;
