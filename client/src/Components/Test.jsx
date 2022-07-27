import React from "react";
import parse from "html-react-parser";

const test = () => {
  //   var stringToHTML = function (str) {
  //     var parser = new DOMParser();
  //     var doc = parser.parseFromString(str, "text/html");
  //     return doc.body;
  //   };
  const text = {
    str: `<div>
  <h1>hello</h1>
  <h5>hi</h5>
</div>`,
  };
  //   console.log());
  return <div>{parse(text.str)}</div>;
};

export default test;
