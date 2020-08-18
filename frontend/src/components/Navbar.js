import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../logo.png";
import styled from "styled-components";
import { ButtonContainerNav } from "./Button";
import Toggle from "./Toggler";
// import { ProductConsumer } from "../context";
import { ProductContext } from "../context";

export default class Navbar extends Component {
  render() {
    let cartIcon = (
      /*value.cart.length*/
      <span className="desktopOnly">Cart ({this.context.cart.length})</span>
    );

    return (
      <NavWrapper className="navbar navbar-expand-sm navbar-dark px-sm-5 py-2">
        <Link to="/" className="logo">
          <img src={logo} alt="store" />
        </Link>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="openpayments">
              Open Payments <span style={{ fontSize: "1rem", padding: "0.5rem" }}>1.0.6</span>
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav">
          <li className="nav-item mr-4">
            <Link to="/" className="nav-link">
              PIS
              {/*Products*/
              /*.li mr-4 */}
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav">
          <li className="nav-item mr-4">
            <Link to="/ais" className="nav-link">
              AIS{/*.li no mr-4 */}
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav">
          <li className="nav-item mr-4">
            <Link to="/api" className="nav-link">
              API
            </Link>
          </li>
        </ul>
        {/*
        <ul className="navbar-nav">
          <li className="nav-item ml-3">
            <input type="text" placeholder="Search among 8 products" />
          </li>
        </ul>
        */}
        {/* <ul className="navbar-nav">
          <li className="nav-item">
            <div className="toggle-switch mt-2">
              <i className="fa fa-sun-o" aria-hidden="true" style={{ color: "white" }}></i>
              <label className="switch">
                <input id="switch-style" type="checkbox" onChange={console.log("Hi")}></input>
                <div className="slider round"></div>
              </label>
              <i className="fa fa-moon-o" aria-hidden="true" style={{ color: "white" }}></i>
            </div>
          </li>
        </ul> */}
        <Link to="/cart" className="ml-auto">
          <ButtonContainerNav>
            <span className="mr-1">
              <i className="fas fa-cart-plus"></i>
            </span>
            {/* Add dark mode to the left of the cart, in desktop view*/}
            {cartIcon}
          </ButtonContainerNav>
        </Link>
        <ul className="navbar-nav">
          <li className="nav-item toggle">
            <Toggle theme={this.props.theme} toggleTheme={this.props.toggleTheme} />
          </li>
        </ul>
      </NavWrapper>
    );
  }
}

Navbar.contextType = ProductContext;

const NavWrapper = styled.nav`
  background: var(--mainBlue);

  .openpayments {
    color: var(--mainWhite) !important;
    font-size: 1.45rem;
    font-family: Open Sans, "sans-serif" !important;
    font-weight: 500;
    text-transform: capitalize;
    text-decoration: none;
    margin-right: 4rem;
  }

  .logo {
    margin-right: 1rem;
  }

  .toggle {
    padding: 0rem 0rem 0rem 1rem;
  }

  @media (max-width: 810px) {
    /* 767px */
    .openpayments {
      display: none;
    }
    .logo {
      margin-right: 0.5rem;
    }
  }

  @media (max-width: 450px) {
    .desktopOnly {
      display: none;
    }
    .toggle {
      padding: 0rem 0rem 0rem 0rem;
    }
  }

  @media (max-width: 350px) {
    .logo {
      display: none;
    }
  }

  .nav-link {
    color: var(--mainWhite) !important;
    font-size: 1.45rem;
    font-family: Open Sans, "sans-serif" !important;
    font-weight: 500;
    text-transform: capitalize;
  }

  .nav-link:hover {
    transition: color 0.5s ease;
    color: var(--secondaryYellow) !important;
  }
`;
