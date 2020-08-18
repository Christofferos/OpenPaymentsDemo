import React from "react";
import "./BankDisplay.css";

export default function BankDisplay(props) {
  const bankId = props.id;
  let { bicFi, logoUrl } = props.item;

  let width = 150;
  if (bicFi === "OKOYFIHH") width = 110;
  width = width.toString();

  if (bicFi === "HANDSESS") logoUrl = "img/handelsbanken.png";
  if (bicFi === "SWEDSESS") logoUrl = "img/swedbank.png";
  if (bicFi === "DABASESX") logoUrl = "img/danskebank.png";

  return (
    <div className="mx-auto my-5 mb-5 col-lg-4 d-flex justify-content-center align-items-center text-center">
      <img
        src={logoUrl}
        width={width}
        className="hvr-grow rounded-pill shadow p-1 bg-white rounded"
        alt="bank"
        type="button"
        onClick={() => props.clickEvent(bankId)}
      ></img>
      {bicFi.localeCompare("OKOYFIHH") === 0 || bicFi.localeCompare("NDEAFIHH") === 0 ? (
        <div style={{ letterSpacing: "0" }}> (FIN)</div>
      ) : bicFi.localeCompare("DABASESX") === 0 ? (
        <div style={{ letterSpacing: "0" }}> (DNK)</div>
      ) : (
        <div style={{ letterSpacing: "0" }}> (SWE)</div>
      )}
    </div>
  );
}
