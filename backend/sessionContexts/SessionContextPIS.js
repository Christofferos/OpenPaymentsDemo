class SessionContextPIS {
  constructor(session) {
    session.PIS = {};

    session.PIS.UIFlow = "";
    session.PIS.UIState = "";
    session.PIS.UserUID = "";

    session.PIS.accountBban = "";
    session.PIS.accountIban = "";
    session.PIS.accounts = {};

    session.PIS.aspspAuthMethod = "";
    session.PIS.authenticationMethodId = "";
    session.PIS.bankSelected = {};
    session.PIS.bicFi = "";
    session.PIS.bicFiLogoUrl = "";

    session.PIS.cart = {}; // Cart data
    session.PIS.totalCost = ""; // Cart data

    session.PIS.challengeData = ""; // Decoupled
    session.PIS.psuMessage = ""; // Decoupled

    session.PIS.consentAuthorisationId = "";
    session.PIS.consentCode = "";
    session.PIS.consentId = "";
    session.PIS.consentScaStatus = "";
    session.PIS.consentStatus = "";
    session.PIS.consentscaOAuthHref = "";

    session.PIS.paymentAuthCode = "";
    session.PIS.paymentAuthenticationMethodId = "";
    session.PIS.paymentAuthorisationId = "";
    session.PIS.paymentCurrency = "";
    session.PIS.paymentId = "";
    session.PIS.paymentScaStatus = "";
    session.PIS.paymentStatus = "";
    session.PIS.paymentscaOAuthHref = "";

    session.PIS.redirect = "";
    session.PIS.redirectAuth = "";
    session.PIS.redirectUri = "";
    session.PIS.tpp_redirect_uri = "";
  }
}

module.exports = SessionContextPIS;
