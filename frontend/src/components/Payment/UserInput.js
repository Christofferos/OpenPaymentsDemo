import React from "react";

const userInput = (props) => {
  const style = {
    width: "80%",
    height: "2.7rem",
    border: "2px solid black",
    margin: "5px 5px",
    borderRadius: "5px",
    textAlign: "center",
    fontSize: "25px",
  };

  return (
    <input
      type="text"
      style={style}
      onChange={props.onChange}
      placeholder={props.placeholder}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
    />
  );
};

export default userInput;
