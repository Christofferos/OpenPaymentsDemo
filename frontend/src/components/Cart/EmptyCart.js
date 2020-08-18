import React from "react";

export default function EmptyCart() {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-10 mx-auto text-center text-title" /* style={{ marginBottom: "13rem" }} */>
          <h1 className="mb-5">Your Cart is currently empty</h1>
          <img src={"img/emptyCart.png"} className="rounded-pill bg-white rounded img-fluid" alt="empty cart"></img>
        </div>
      </div>
    </div>
  );
}
