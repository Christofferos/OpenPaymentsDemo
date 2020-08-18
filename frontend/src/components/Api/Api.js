import React, { Component } from "react";
import "./Api.css";
import styled from "styled-components";
import AOS from "aos";
import "aos/dist/aos.css";

export default class Api extends Component {
  constructor(props) {
    super(props);
    this.handleMouseHover = this.handleMouseHover.bind(this);
    this.state = {
      isHovering1: false,
      isHovering2: false,
      isHovering3: false,
      id: 0,
    };
  }

  componentDidMount() {
    AOS.init({});
    console.log("AOS initialized.");
  }

  handleMouseHover(e) {
    (async () => {
      await this.setState({ id: e.currentTarget.id });
      await this.setState(this.toggleHoverState);
    })();
  }

  toggleHoverState(state) {
    if (state.id === "1") {
      console.log("HIT");
      return {
        isHovering1: !state.isHovering1,
      };
    }
    if (state.id === "2") {
      return {
        isHovering2: !state.isHovering2,
      };
    }
    if (state.id === "3") {
      return {
        isHovering3: !state.isHovering3,
      };
    }
  }

  render() {
    return (
      <div>
        <div className="section-1 pt-5">
          <div className="col-10 mx-auto my-2 text-center text-title">
            <h1 className="text-capitalize font-weight-bold">
              <strong>Open Payments API</strong>
            </h1>

            <span className="desktop">
              <h3 className="pt-0">
                <span className="pt-0" style={{ fontSize: "12px" }}>
                  <span data-aos="zoom-in-right" data-aos-delay="250">
                    <strong>Access:</strong> account data from banks across Europe.
                  </span>
                  {/* Get account, transaction & balance data from numerous bank accounts.*/}
                  <br />
                  <span data-aos="zoom-in-right" data-aos-delay="1000">
                    <strong>Allow:</strong> secure account-to-account payments.
                  </span>
                  <br />
                  <span data-aos="zoom-in-right" data-aos-delay="1750">
                    <strong>Establish:</strong> a cost efficient payment option.
                  </span>
                </span>
              </h3>

              {/*
              <h3 className="pt-2">
                <a
                  data-aos="fade"
                  data-aos-delay="2500"
                  className="btn btn-light "
                  style={{ border: "1px solid var(--mainBlue)", fontSize: "22px" }}
                  type="button"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://docs.openpayments.io/docs/introduction.html"
                >
                  GET STARTED
                </a>
              </h3>
              */}
            </span>

            <span className="mobile">
              <h3 className="pt-3">
                {" "}
                {/* pt-5 */}
                <A
                  data-aos="fade"
                  data-aos-delay="2500"
                  className="btn btn-light callToAction"
                  style={{ border: "1px solid var(--mainBlue)", fontSize: "22px" }}
                  type="button"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://docs.openpayments.io/docs/introduction.html"
                >
                  GET STARTED
                </A>
              </h3>
            </span>
          </div>
        </div>

        <div className="section-2">
          <div className="col-10 mx-auto my-2 text-center text-title">
            <span className="text-capitalize font-weight-bold">
              <LinkTag>
                <a
                  onMouseEnter={(e) => this.handleMouseHover(e)}
                  onMouseLeave={this.handleMouseHover}
                  className="link"
                  id="1"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://docs.openpayments.io/en/openpayments-NextGenPSD2-1.3.3.html#tag/ASPSP-Information-Service-(ASPSPIS)"
                >
                  <strong>ASPSP</strong> <i className="fas fa-university"></i>
                </a>
              </LinkTag>
              {this.state.isHovering1 ? (
                <span>
                  <h4 style={{ fontSize: "1.75rem" }} className="pt-4" data-aos="zoom-in-up">
                    Request ASPSP Info token
                  </h4>
                  <h4 style={{ fontSize: "1.75rem" }} className="pt-3" data-aos="zoom-in-up" data-aos-delay="50">
                    Get ASPSP List
                  </h4>
                  <h4 style={{ fontSize: "1.75rem" }} className="pt-3" data-aos="zoom-in-up" data-aos-delay="100">
                    Get ASPSP Details
                  </h4>
                </span>
              ) : (
                <span>
                  <h3 className="pt-5">GET ALL BANKS</h3>
                  <h3 className="pt-3">GET BANK DETAILS</h3>
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="section-3">
          <div className="col-10 mx-auto my-2 text-center text-title">
            <span className="text-capitalize font-weight-bold">
              <LinkTag>
                <a
                  onMouseEnter={this.handleMouseHover}
                  onMouseLeave={this.handleMouseHover}
                  className="link2"
                  id="2"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://openpayments.io/account-information/"
                >
                  <strong>AIS</strong> <i className="far fa-user"></i>
                </a>
              </LinkTag>
              {this.state.isHovering2 ? (
                <span>
                  <h4 style={{ fontSize: "1.75rem" }} className="pt-4" data-aos="zoom-in-up">
                    Request AIS Info token
                  </h4>
                  <h4 style={{ fontSize: "1.75rem" }} className="pt-3" data-aos="zoom-in-up" data-aos-delay="50">
                    Create, start, update & auth consent
                  </h4>
                  <h4 style={{ fontSize: "1.75rem" }} className="pt-3" data-aos="zoom-in-up" data-aos-delay="100">
                    Get Account & Transaction List
                  </h4>
                </span>
              ) : (
                <span>
                  <h3 className="pt-5" data-aos="fade-right">
                    ASK FOR CONSENT
                  </h3>
                  <h3 className="pt-3" data-aos="fade-left">
                    GET BANK ACCOUNT DATA
                  </h3>
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="section-4">
          <div className="col-10 mx-auto my-2 text-center text-title">
            <span className="text-capitalize font-weight-bold">
              <LinkTag>
                <a
                  onMouseEnter={this.handleMouseHover}
                  onMouseLeave={this.handleMouseHover}
                  className="link"
                  id="3"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://openpayments.io/payment-inititation/"
                >
                  <strong>PIS</strong> <i className="far fa-handshake"></i>
                </a>
              </LinkTag>
              {this.state.isHovering3 ? (
                <span>
                  <h4 style={{ fontSize: "1.75rem" }} className="pt-4" data-aos="zoom-in-up" data-aos-delay="50">
                    Request PIS Init token
                  </h4>
                  <h4 style={{ fontSize: "1.75rem" }} className="pt-3" data-aos="zoom-in-up" data-aos-delay="100">
                    Create, start, update & auth payment
                  </h4>
                </span>
              ) : (
                <span>
                  <h3 className="pt-5" data-aos="fade-right">
                    INITIATE A PAYMENT
                  </h3>
                  <h3 className="pt-3" data-aos="fade-left">
                    AUTHENTICATE THE PAYMENT
                  </h3>
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

const A = styled.a`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.color};
  &:hover {
    background: #e2e6ea;
  }
`;

const LinkTag = styled.div`
  .link {
    color: var(--mainWhite) !important;
    font-size: 2.5rem;
    font-weight: 500;
    text-decoration: none;
    text-transform: capitalize;
  }

  .link:hover {
    transition: color 0.25s ease;
    color: var(--secondaryYellow) !important;
  }

  .link2 {
    color: black;
    font-size: 2.5rem;
    font-weight: 500;
    text-decoration: none;
    text-transform: capitalize;
  }

  .link2:hover {
    transition: color 0.5s ease;
    color: var(--mainWhite) !important;
  }
`;
