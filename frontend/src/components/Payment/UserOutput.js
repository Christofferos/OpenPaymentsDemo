import React from "react";
import "./UserOutput.css";

const userOutput = (props) => {
  const style = { fontSize: "20px", color: props.promtMsgColor };

  return (
    <div className={props.promtMsgColor === "red" ? "incorrect" : null}>
      <p style={style}>{props.promtMsg}</p>
    </div>
  );
};

export default userOutput;
