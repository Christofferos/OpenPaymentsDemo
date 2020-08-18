import React from "react";

export default function ConsentStatus(props) {
  let consentAuthMethod = props.consentAuthMethod;
  let consentStatus = props.consentStatus;
  let consentScaStatus = props.consentScaStatus;

  let consentMethod = consentAuthMethod;
  if (consentAuthMethod === "mbid") {
    consentMethod = "Mobilt BankId";
  } else if (consentAuthMethod === "ndea-app") {
    consentMethod = "Nordea Code App";
  } else if (consentAuthMethod === "opauth") {
    consentMethod = "Mobile Key or Key Code";
  }

  return (
    <span>
      <span>
        Consent Auth Method:{" "}
        <span style={{ color: "green" }}>
          <span>{consentMethod}</span>
        </span>
      </span>
      <br />
      <span>
        Consent Status: <span style={{ color: "green" }}>{consentStatus}</span>
      </span>
      <br />
      {consentScaStatus === "" ? (
        ""
      ) : consentScaStatus !== "started" ? (
        <span>
          Consent SCA Status: <span style={{ color: "green" }}>{consentScaStatus}</span>
        </span>
      ) : consentScaStatus !== "finalised" ? (
        <span>
          Consent SCA Status: <span style={{ color: "green" }}>{consentScaStatus}</span>
        </span>
      ) : (
        ""
      )}
    </span>
  );
}
