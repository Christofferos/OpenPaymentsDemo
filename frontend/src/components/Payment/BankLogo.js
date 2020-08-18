import React from "react";
// import { ProductConsumer } from "../../context";
//import styled from "styled-components";

export default function BankLogo(props) {
  const bankId = props.id;
  let { bicFi, name, logoUrl } = props.item;

  let width = 180;
  if (bicFi === "HANDSESS") width = 180;
  else if (bicFi === "SWEDSESS") width = 180;
  else if (bicFi === "OKOYFIHH") width = 130;
  width = width.toString();

  if (bicFi === "HANDSESS") logoUrl = "img/handelsbanken.png";
  if (bicFi === "SWEDSESS") logoUrl = "img/swedbank.png";
  if (bicFi === "DABASESX") logoUrl = "img/danskebank.png";

  return (
    <div className="row my-5 mb-5 text-capitalize text-center">
      <div className="mx-auto col-lg-4">
        {" "}
        {/* d-flex justify-content-center align-items-center */}
        <img
          src={logoUrl}
          width={width}
          className="rounded-pill shadow p-1 bg-white rounded"
          alt="bank"
          type="button"
          onClick={() => props.clickEvent(bankId)} /* props.clickEvent */
        ></img>
        {bicFi.localeCompare("NDEASESS") === 0 || bicFi.localeCompare("NDEAFIHH") === 0 ? (
          <span>
            <br />
            {name}
          </span>
        ) : (
          <span></span>
        )}
        {bicFi.localeCompare("OKOYFIHH") === 0 ? (
          <span>
            <br />
            OP Financial Group
          </span>
        ) : (
          <span></span>
        )}
      </div>
    </div>
  );
}
