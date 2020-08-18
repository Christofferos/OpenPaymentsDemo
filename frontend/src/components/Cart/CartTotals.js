import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export default function CartTotals({ value, history }) {
  const { cartSubTotal, cartTax, cartTotal, clearCart } = value;
  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col-12 text-capitalize text-center pt-4">
            <h5>
              <span className="text-title">subtotal: </span>
              <strong>{cartSubTotal} SEK</strong>
            </h5>
            <h5>
              <span className="text-title">country tax: </span>
              <strong>{cartTax} SEK</strong>
            </h5>
            <h5>
              <span className="text-title">total cost: </span>
              <strong>{cartTotal} SEK</strong>
            </h5>

            <br></br>

            <Link to="/payment">
              <Button className="btn-lg btn-outline-success text-uppercase mt-3 mb-3 px-5" type="button">
                Start Payment
              </Button>
            </Link>

            <br></br>

            <Link to="/">
              <Button
                className="btn-lg btn-outline-danger text-uppercase mb-3 px-5"
                type="button"
                onClick={() => clearCart()}
              >
                clear cart
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

const Button = styled.button`
  background: ${({ theme }) => theme.background} !important;
  &:hover {
    color: ${({ theme }) => theme.text} !important;
  }
`;
