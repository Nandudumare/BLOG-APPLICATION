import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import MultiSelectCat from "./MultiSelectCat";
var stateFromHTML = require("draft-js-import-html").stateFromHTML;
const Edit = () => {
  const { id } = useParams();
  const [value, setValue] = React.useState(2100);
  const [category, setCategory] = React.useState([]);
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );
  // const [state, setState] = React.useState(
  //   draftToHtml(convertToRaw(editorState.getCurrentContent()))
  // );

  React.useEffect(() => {
    const GetSingle = async () => {
      let res = await axios.get(`http://localhost:8080/blogs/${id}`);
      let contentState = stateFromHTML(res.data[0].Body);
      setEditorState(EditorState.createWithContent(contentState));
      setTitle(res.data[0].Title);
      setBody(res.data[0].Body);
    };

    GetSingle();
  }, [id]);
  setTimeout(() => {
    setValue(
      2100 - convertToRaw(editorState.getCurrentContent()).blocks[0].text.length
    );
  }, 50);

  // const [single, setSingle] = React.useState({});
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      Title: title,
      Body: body,
      category: category,
    };
    try {
      await axios.patch(`http://localhost:8080/blogs/${id}`, payload);
      alert("Edited");
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  const getCat = (arr) => {
    setCategory([...arr]);
  };
  return (
    <div>
      <form action="" className="createDiv" onSubmit={handleSubmit}>
        <input
          name="Title"
          type="text"
          placeholder="Enter Blog Title"
          className="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="multisel">
          <MultiSelectCat getCat={getCat} />
        </div>
        <div className="BigText">
          {/* <textarea
            id=""
            cols="30"
            rows="10"
            name="Body"
            className="textarea"
            value={formData.Body}
            placeholder="Enter the Description"
            onChange={(e) => {
              handleChange(e);
              if (e.nativeEvent.data === null) {
                setValue((prev) => prev + 1);
              } else {
                setValue((prev) => prev - 1);
              }
            }}
            required
          ></textarea> */}
          {/* <TextEditor /> */}

          <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={setEditorState}
            value={body}
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
          Edit
        </button>
      </form>
    </div>
  );
};

export default Edit;
