import React from "react";

export default function PaymentStatus(props) {
  let paymentAuthMethod = props.paymentAuthMethod;
  let paymentStatus = props.paymentStatus;
  let paymentScaStatus = props.paymentScaStatus;

  let paymentMethod = paymentAuthMethod;
  if (paymentAuthMethod === "mbid") {
    paymentMethod = "Mobilt BankId";
  } else if (paymentAuthMethod === "ndea-app") {
    paymentMethod = "Nordea Code App";
  } else if (paymentAuthMethod === "opauth") {
    paymentMethod = "Mobile Key or Key Code";
  }

  return (
    <span>
      <span>
        Payment Auth Method: <span style={{ color: "green" }}>{paymentMethod}</span>
      </span>
      <br />
      <span>
        Payment Status: <span style={{ color: "green" }}>{paymentStatus}</span>
      </span>
      <br />
      {paymentScaStatus === "" ? (
        ""
      ) : paymentScaStatus !== "started" ? (
        <span>
          Payment SCA Status: <span style={{ color: "green" }}>{paymentScaStatus}</span>
        </span>
      ) : paymentScaStatus !== "finalised" ? (
        <span>
          Payment SCA Status: <span style={{ color: "green" }}>{paymentScaStatus}</span>
        </span>
      ) : (
        ""
      )}
    </span>
  );
}
