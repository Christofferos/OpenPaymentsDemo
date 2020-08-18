import React from "react";

export default function CartColumns() {
  return (
    <div className="container-md text-center d-none d-lg-block">
      <div className="row py-3">
        <div className="col-10 mx-auto col-lg-2 d-flex justify-content-center align-items-center">
          <p className="text-uppercase mb-0">products</p>
        </div>
        <div className="col-10 mx-auto col-lg-2 d-flex justify-content-center align-items-center">
          <p className="text-uppercase mb-0">name of product</p>
        </div>
        <div className="col-10 mx-auto col-lg-2 d-flex justify-content-center align-items-center">
          <p className="text-uppercase mb-0">price</p>
        </div>
        <div className="col-10 mx-auto col-lg-2 d-flex justify-content-center align-items-center">
          <p className="text-uppercase mb-0">quantity</p>
        </div>
        <div className="col-10 mx-auto col-lg-2 d-flex justify-content-center align-items-center">
          <p className="text-uppercase mb-0">Remove</p>
        </div>
        <div className="col-10 mx-auto col-lg-2 d-flex justify-content-center align-items-center">
          <p className="text-uppercase mb-0">Total</p>
        </div>
      </div>
    </div>
  );
}
