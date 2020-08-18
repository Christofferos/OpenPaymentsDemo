/* Functional component NOT class based component */
import React from "react";

export default function Title({ name, title }) {
  // Take in name and title props
  return (
    <div className="row">
      <div className="col-10 mx-auto my-2 text-center text-title">
        <h1 className="text-capitalize font-weight-bold">
          {name} <strong>{title}</strong>
        </h1>
      </div>
    </div>
  );
}
