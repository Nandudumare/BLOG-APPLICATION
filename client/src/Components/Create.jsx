import axios from "axios";
import React from "react";
// import TextEditor from "./TextEditor";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import MultiSelectCat from "./MultiSelectCat";

const Create = () => {
  const [loader, setLoader] = React.useState(false);
  // const [formData, setformData] = React.useState({});
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [value, setValue] = React.useState(2100);

  const formRef = React.useRef();
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("id");

  const [category, setCategory] = React.useState([]);

  const getCat = (arr) => {
    setCategory([...category, ...arr]);
  };

  // React.useEffect(() => {
  //   const getUsers = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:8080/users");
  //       // console.log("res:", res);
  //       const data = res.data;
  //       setUsers([...data]);
  //       setUserLoader(false);
  //     } catch (err) {}
  //   };
  //   getUsers();
  // }, []);

  function uploadImageCallBack(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader(); // eslint-disable-line no-undef
      reader.onload = (e) => resolve({ data: { link: e.target.result } });
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (body.length < 10 || body === "") {
      alert("Please Fill Description part");
    } else {
      // const UserId = users.filter((el) => el.name === Singleuser);
      // const user_id = UserId[0]._id;

      const payload = {
        user_id: user_id,
        Title: title,
        Body: body,
        category: category,
      };

      setLoader(true);
      try {
        await axios.post("http://localhost:8080/blogs", payload, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        alert("created successfully");
        formRef.current.reset();
        setLoader(false);
        setEditorState("");
      } catch (err) {
        setTimeout(() => {
          setLoader(false);
          alert("Try Again");
        }, 2000);
        const refresh = localStorage.getItem("refreshToken");
        const res = await axios.post("http://localhost:8080/users/renewtoken", {
          refresh,
        });
        localStorage.setItem("token", res.data);
      }
    }
  };

  return (
    <div className="createDivMain">
      {loader ? <div className="loader absoloted"></div> : ""}
      <form
        ref={formRef}
        action=""
        className="createDiv"
        onSubmit={handleSubmit}
        // onEditorStateChange={}
      >
        <input
          name="Title"
          type="text"
          placeholder="Enter Blog Title"
          className="Title"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="multisel">
          <MultiSelectCat getCat={getCat} />
          {/* {userLoader ? (
            <div style={{ textAlign: "left" }}>
              <CircularProgress />
            </div>
          ) : (
            <FormControl sx={{ m: 0, width: 300 }}>
              <InputLabel
                id="demo-simple-select-label"
                style={{
                  padding: "0 0.25rem",
                  background: "#050a0e",
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
            </FormControl>
          )} */}
        </div>
        <div className="BigText">
          <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={setEditorState}
            toolbar={{
              image: {
                uploadCallback: uploadImageCallBack,
                previewImage: true,
                alt: { present: true, mandatory: false },
              },
            }}
            onChange={(e) => {
              setBody(
                draftToHtml(convertToRaw(editorState.getCurrentContent()))
              );
              setValue(
                2100 -
                  convertToRaw(editorState.getCurrentContent()).blocks[0].text
                    .length
              );
            }}
          />

          <div className="value">{value}/2100</div>
        </div>

        <button type="submit" className="createButton">
          Create
        </button>
      </form>
    </div>
  );
};

export default Create;
