import React from "react";
// import { ProductConsumer } from "../../context";

export default function AccountButton(props) {
  const cartTotal = props.cartTotal;
  let checkedBoxes = props.checkedBoxes;
  let disableAccountButton = props.disableAccountButton;
  let accountButtonHandler = props.accountButtonHandler;
  let activatePayment = props.activatePayment;
  let selectedAccountIban = props.selectedAccountIban;
  let selectedAccountBban = props.selectedAccountBban;

  if (!checkedBoxes.includes(true)) {
    return (
      <button type="button" className="btn-lg btn-danger" disabled>
        Select Account
      </button>
    );
  } else if (disableAccountButton === false) {
    return (
      <button
        type="button"
        className="btn-lg btn-dark"
        onClick={(e) => {
          accountButtonHandler();
          activatePayment(cartTotal, selectedAccountIban, selectedAccountBban);
        }}
      >
        Continue
      </button>
    );
  } else {
    return (
      <button type="button" className="btn-lg btn-success" disabled>
        Sending..
      </button>
    );
  }
}
