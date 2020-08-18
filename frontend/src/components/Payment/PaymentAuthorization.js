import React from "react";
let QRCode = require("qrcode.react");

export default function PaymentAuthorization(props) {
  let paymentRedirectLink = props.paymentRedirectLink;
  let paymentChallengeData = props.paymentChallengeData;
  let psuMessage = props.psuMessage;
  let finalStatus = props.finalStatus;

  const isMobileDevice = () => {
    return typeof window.orientation !== "undefined" || navigator.userAgent.indexOf("IEMobile") !== -1;
  };

  if (paymentRedirectLink === "" || paymentRedirectLink === undefined) {
    if (paymentChallengeData.length > 0) {
      // Decouple
      let promt;
      if (psuMessage.length > 0)
        promt = (
          <span>
            <br />
            {psuMessage}
            <br />
          </span>
        );

      let content;
      content = (
        <span>
          <br />
          {promt}
          <br />
          {isMobileDevice() ? (
            (window.location.href = `bankid:///?autostarttoken=${paymentChallengeData}&redirect=http://localhost:3000/payment`) // https://localhost:5000/externalCallback/qrDone
          ) : (
            <span>Scan the QR code below:</span>
          )}
          <br />
          <QRCode
            value={`bankid:///?autostarttoken=${paymentChallengeData}&redirect=`} // //https://localhost:5000/externalCallback/qrDone
            size={150}
            level={"L"}
            includeMargin={false}
          />
          <br />
          <br />
        </span>
      );

      if (finalStatus !== "") {
        content = <span></span>;
      }
      return <span>{content}</span>;
    }
  } else {
    return "";
  }
}
