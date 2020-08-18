import React from "react";

export default function BankDetails(props) {
  let selectedBank = props.selectedBank;
  let bankAuthMethod = props.bankAuthMethod;

  if (selectedBank.bicFi === "HANDSESS") selectedBank.logoUrl = "img/handelsbanken.png";
  if (selectedBank.bicFi === "SWEDSESS") selectedBank.logoUrl = "img/swedbank.png";
  if (selectedBank.bicFi === "DABASESX") selectedBank.logoUrl = "img/danskebank.png";

  return (
    <div className="row mt-2 mb-4 text-capitalize text-center">
      <div className="mx-auto col-lg-4">
        <img
          src={selectedBank.logoUrl}
          width={150}
          className="rounded-pill shadow p-1 bg-white rounded"
          alt="bank"
        ></img>
        <br />
        <br />
        <span>{selectedBank.name}</span>
        <br />
        <span>
          Authorization: <span style={{ color: "green" }}>{bankAuthMethod}</span>
        </span>
      </div>
    </div>
  );
}
