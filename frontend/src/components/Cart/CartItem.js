import React from "react";
import styled from "styled-components";

export default function CartItem({ item, value }) {
  const { id, title, img, price, total, count } = item;
  const { increment, decrement, removeItem } = value;
  return (
    <div className="row my-5 mb-5 text-capitalize text-center">
      <div className="col-10 mx-auto col-lg-2">
        <img src={img} style={{ width: "5rem", height: "5rem" }} className="img-fluid" alt="product" />
      </div>
      <div className="col-10 mx-auto col-lg-2 d-flex justify-content-center align-items-center">
        <span className="d-lg-none ">product: </span> {title}
      </div>
      <div className="col-10 mx-auto col-lg-2 d-flex justify-content-center align-items-center">
        <span className="d-lg-none">price: </span> {price}
      </div>
      <div className="col-10 mx-auto col-lg-2 my-2 my-lg-0 d-flex justify-content-center align-items-center">
        <div className="d-flex justify-content-center">
          <div>
            <Span
              className="btn-lg btn-black mx-1"
              style={{ cursor: "pointer", userSelect: "none" }}
              onClick={() => decrement(id)}
            >
              -
            </Span>
            <Span className="btn-lg btn-black mx-1" style={{ cursor: "not-allowed", userSelect: "none" }}>
              {count}
            </Span>
            <Span
              className="btn-lg btn-black mx-1"
              style={{ cursor: "pointer", userSelect: "none" }}
              onClick={() => increment(id)}
            >
              +
            </Span>
          </div>
        </div>
      </div>
      {/* */}
      <div className="col-10 mx-auto col-lg-2 d-flex justify-content-center align-items-center">
        <div className="cart-icon " onClick={() => removeItem(id)}>
          <h3>
            <i className="fas fa-trash"></i>
          </h3>
        </div>
      </div>
      <div className="col-10 mx-auto col-lg-2 d-flex justify-content-center align-items-center">
        <strong>item total: {total} SEK</strong>
      </div>
    </div>
  );
}

const Span = styled.span`
  color: ${({ theme }) => theme.text};
  border: 0.1rem solid ${({ theme }) => theme.text} !important;
`;

export const FontLarge = styled.span`
  font-size: 500%;
  font-weight: 1500;
`;
