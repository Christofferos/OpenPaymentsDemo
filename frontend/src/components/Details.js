import React, { Component } from "react";
import { ProductConsumer } from "../context";
import { Link } from "react-router-dom";
import { ButtonContainer } from "./Button";

export default class Details extends Component {
  render() {
    return (
      <ProductConsumer>
        {(value) => {
          const { id, company, img, info, price, title, inCart } = value.detailProduct;
          return (
            <div className="container py-5">
              {/*title*/}
              <div className="row ml-5">
                <h1>{title}</h1>
              </div>
              {/*end title*/}
              {/*product info*/}
              <div className="row">
                <div className="col-10 mx-auto col-md-6 my-3">
                  <img src={img} className="img-fluid" alt="product" />
                </div>
                {/*product text*/}
                <div className="col-10 mx-auto col-md-6 my-3 text-capitalize">
                  {/*<h2>model : {title}</h2>*/}
                  {/* BUTTONS */}
                  <div className="mb-3">
                    <ButtonContainer
                      cart
                      disabled={inCart ? true : false}
                      onClick={() => {
                        value.addToCart(id);
                        value.openModal(id);
                      }}
                    >
                      {inCart ? "in Cart" : "Add to cart"}
                    </ButtonContainer>
                    <Link to="/">
                      <ButtonContainer>Go to products</ButtonContainer>
                    </Link>
                  </div>
                  <h4>
                    <strong>
                      price: <span> </span>
                      {price}
                      <span> SEK</span>
                    </strong>
                  </h4>
                  <h4 className="text-title text-uppercase text-muted mt-3 mb-2">
                    Made by : <span className="text-uppercase">{company} </span>
                  </h4>
                  <p className="text-capitalize font-weight-bold mt-3 mb-0">Information about product: </p>
                  <p className="text-muted lead" style={{ textTransform: "none" }}>
                    {info}
                  </p>
                </div>
              </div>
            </div>
          );
        }}
      </ProductConsumer>
    );
  }
}
