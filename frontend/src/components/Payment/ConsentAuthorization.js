import React from "react";
let QRCode = require("qrcode.react");

export default function ConsentAuthorization(props) {
  let consentChallengeData = props.consentChallengeData;
  let consentRedirectLink = props.consentRedirectLink;
  let psuMessage = props.psuMessage;

  const isMobileDevice = () => {
    return typeof window.orientation !== "undefined" || navigator.userAgent.indexOf("IEMobile") !== -1;
  };

  if (consentRedirectLink === "" || consentRedirectLink === undefined) {
    if (consentChallengeData.length > 0) {
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

      return (
        <span>
          {promt}
          <br />
          {isMobileDevice() ? (
            (window.location.href = `bankid:///?autostarttoken=${consentChallengeData}&redirect=https://localhost:3000/payment`) // https://localhost:5000/externalCallback/qrDone
          ) : (
            <span>Scan the QR code below:</span>
          )}
          <br />
          <QRCode
            value={`bankid:///?autostarttoken=${consentChallengeData}&redirect=`} //https://localhost:5000/externalCallback/qrDone
            size={150}
            level={"L"}
            includeMargin={false}
          />
          {/* Initialize status check in backend  */}

          {/*<img src="img/QRcode.png" className="img-fluid" alt="QRcode"></img>*/}
          {/* 
          const downloadQR = () => {
            const canvas = document.getElementById("123456");
            const pngUrl = canvas
              .toDataURL("image/png")
              .replace("image/png", "image/octet-stream");
            let downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "123456.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          };
          */}
          <br />
          <br />
        </span>
      );
    }
  } else {
    return "";
  }
}
