import React, { Component } from "react";
import styled from "styled-components";
import { ProductConsumer } from "../context";
import { ButtonContainer } from "./Button";
import { Link } from "react-router-dom";

export default class Modal extends Component {
  state = {
    closeTheModal: false,
  };

  /* componentDidMount() {
    //document.addEventListener("click", this.handleClickOutside, true);
    let skipFirstIteration = -1;
    window.addEventListener("click", function (e) {
      if (document.getElementById("modal") !== null) {
        skipFirstIteration++;
        if (document.getElementById("modal").contains(e.target)) {
          // Clicked in box
          skipFirstIteration = -1;
        } else if (skipFirstIteration === 1) {
          // Clicked outside the box
          alert("You clicked outside of me!");

          skipFirstIteration = -1;
        }
        console.log(skipFirstIteration);
      }
    });
  } */
  /* componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside, true);
  }

  handleClickOutside = (event) => {
    const domNode = ReactDOM.findDOMNode(this);
    if ((!domNode || !domNode.contains(event.target)) && this.state.modalOpen) {
      alert("You clicked outside of me!");
    }
  }; */

  render() {
    let closeTheModal = (e, closeModal) => {
      if (document.getElementById("modal") !== null) {
        if (document.getElementById("modal").contains(e.target)) {
          // Clicked in box
        } else {
          // Clicked outside the box
          closeModal();
        }
      }
    };
    return (
      <ProductConsumer>
        {(value) => {
          const { modalOpen, closeModal } = value;
          const { img, title, price } = value.modalProduct;

          if (!modalOpen) {
            return null;
          } else {
            return (
              <ModalContainer onClick={(e) => closeTheModal(e, closeModal)}>
                <div className="container">
                  <div className="row">
                    <div id="modal" className="col-8 mx-auto col-md-6 col-lg-4 text-center text-capitalize p-5">
                      <h5 id="titleModal">Item added to the cart!</h5>
                      <img src={img} className="img-fluid" alt="product"></img>
                      <h5>{title}</h5>
                      <h5 className="text-muted">price: {price} SEK</h5>
                      <Link to="/">
                        <ButtonContainer onClick={() => closeModal()}>Back To Products</ButtonContainer>
                      </Link>
                      <Link to="/cart">
                        <ButtonContainer cart onClick={() => closeModal()}>
                          Go to cart
                        </ButtonContainer>
                      </Link>
                    </div>
                  </div>
                </div>
              </ModalContainer>
            );
          }
        }}
      </ProductConsumer>
    );
  }
}

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  #modal {
    background: ${({ theme }) => theme.background};
  }
  #titleModal {
    color: green;
    padding-bottom: 1rem;
  }
`;
