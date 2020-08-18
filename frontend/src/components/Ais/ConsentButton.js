import React from "react";

export default function ConsentButton(props) {
  let disableConsentButton = props.disableConsentButton;
  let consentChallengeData = props.consentChallengeData;
  let consentButtonHandler = props.consentButtonHandler;
  let consentRedirectLink = props.consentRedirectLink;
  let selectedBank = props.selectedBank;
  console.log(selectedBank);

  if (disableConsentButton === false) {
    if (consentChallengeData.length > 0) {
      return (
        <div className="row d-flex justify-content-center align-items-center mt-4">
          <button onClick={(e) => consentButtonHandler(e)} type="button" className="btn-lg btn-dark rounded-pill">
            <i className="fa fa-user" aria-hidden="true"></i> Give Consent
          </button>
        </div>
      );
    } else if (consentRedirectLink.length > 0) {
      return (
        <div className="row d-flex justify-content-center align-items-center mt-4">
          <span>
            <a
              href={consentRedirectLink}
              onClick={(e) => consentButtonHandler(e)}
              type="button"
              className="btn-lg btn-dark rounded-pill"
            >
              <i className="fa fa-user" aria-hidden="true"></i> Give Consent
            </a>
            <span className="row pt-3 text-center d-flex justify-content-center align-items-center">
              {selectedBank.bicFi === "ESSESESS" || selectedBank.bicFi === "SWEDSESS"
                ? "Sandbox Identity Number: 9311219639"
                : ""}
              {selectedBank.bicFi === "OKOYFIHH" ? "OP Username: 88888881," : ""}
              {selectedBank.bicFi === "DABASESX" ? "User ID: 8195475386," : ""}
              <br />
              {selectedBank.bicFi === "OKOYFIHH" ? "Mobile key: 1122." : ""}
              {selectedBank.bicFi === "DABASESX" ? "Password: xUKSWPgHy2H2XBt8cv." : ""}
            </span>
          </span>
        </div>
      );
    } else {
      return "";
    }
  } else {
    return (
      <button type="button" className="btn-lg btn-success rounded-pill" disabled>
        Sending..
      </button>
    );
  }
}
