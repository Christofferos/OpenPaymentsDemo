/*
  Author: Kristopher Werlinder
  Date: 2020-07-28
  Note: Bootstrap is used to handle styling. 
*/
import React, { Component } from "react";
import { ProductContext } from "../../context";
import styled from "styled-components";

import BankLogo from "./BankLogo";
import Title from "../Title";
import Spinner from "./Spinner";
import BankDetails from "./BankDetails";
import ConsentStatus from "./ConsentStatus";
import ConsentAuthorization from "./ConsentAuthorization";
import AccountList from "./AccountList";
import AccountButton from "./AccountButton";
import PaymentStatus from "./PaymentStatus";
import PaymentAuthorization from "./PaymentAuthorization";

/* # Payment: [Class-based React component] # */
class Payment extends Component {
  state = {
    // Boolean for Spinner animation
    pageIsLoaded: false,

    // Routes
    aspspBaseRoute: "/psd2/aspspinformation/v1/aspsps/",
    consentBaseRoute: "/psd2/consent/v1/consents/",
    consentInitAuthRoute: "consentId/authorisations/",
    accountBaseRoute: "/psd2/accountinformation/v1/accounts",
    paymentBaseRoute: "/psd2/paymentinitiation/v1/payment-service/payment-product/",
    paymentInitAuthRoute: "paymentId/authorisations/",

    // Banks
    banks: [],
    selectedBank: {},
    bicFi: "",
    bankAuthMethod: "",

    // Display
    displayBanks: true,
    displayBankDetails: false,
    displayConsentStatus: false,
    displayConsentAuth: false,
    displayAccountList: false,
    displayAccountButton: false,
    displayPaymentStatus: false,
    displayPaymentAuth: false,

    // Disable
    disableAccountButton: false,

    // Consent
    consentCode: "",
    consentStatus: "",
    consentScaStatus: "",
    consentAuthMethod: "",
    consentRedirectLink: "",
    consentChallengeData: "",
    psuMessage: "",

    // Account
    accounts: [],
    checkedBoxes: [],
    accountListRequested: false,
    selectedAccountIban: "",
    selectedAccountBban: "",

    // Payment
    paymentCode: "",
    paymentCodeSent: false,
    paymentStatus: "",
    paymentScaStatus: "",
    paymentAuthMethod: "",
    paymentRedirectLink: "",
    paymentChallengeData: "",

    // Cart
    cart: {},
    cartTotal: 0,

    // Finish Message
    finalStatus: "",
    progressBar: 0,
  };

  /* ### ComponentDidMount: [React lifecycle method. Executed at page load] ### */
  componentDidMount() {
    (async () => {
      const rawData = await fetch("/userSession");
      const jsonData = await rawData.json();
      const session = jsonData.session;
      await console.log(session);

      if ("UIState" in session) {
        switch (session.UIState) {
          case "SELECT_BANK":
            await this.setState({
              cart: session.cart,
              cartTotal: session.totalCost,
              progressBar: 15,
            });
            await this.getBankList();
            break;
          case "AUTHENTICATE_CONSENT":
            await this.setState({
              pageIsLoaded: true,
              displayBanks: false,
              displayBankDetails: true,
              displayConsentStatus: true,
              displayConsentAuth: true,

              selectedBank: session.bankSelected,
              bankAuthMethod: session.aspspAuthMethod,
              consentRedirectLink: session.redirect,
              consentChallengeData: session.challengeData,
              psuMessage: session.psuMessage,
              consentStatus: session.consentStatus,
              consentScaStatus: session.consentScaStatus,
              consentAuthMethod: session.authenticationMethodId,

              cart: session.cart,
              cartTotal: session.totalCost,
              progressBar: 35,
            });
            break;
          case "SELECT_ACCOUNT":
            await this.getAccountList();
            await this.setState({
              pageIsLoaded: true,
              displayBanks: false,
              displayBankDetails: true,
              displayConsentStatus: true,
              displayConsentAuth: false,
              displayAccountList: true,
              displayAccountButton: true,

              selectedBank: session.bankSelected,
              bankAuthMethod: session.aspspAuthMethod,
              psuMessage: session.psuMessage,
              consentStatus: session.consentStatus,
              consentScaStatus: session.consentScaStatus,
              consentAuthMethod: session.authenticationMethodId,

              cart: session.cart,
              cartTotal: session.totalCost,
              progressBar: 50,
            });
            let arr = [];
            await this.state.accounts.forEach(() => arr.push(false));
            await this.setState({
              checkedBoxes: arr,
            });
            break;
          case "AUTHENTICATE_PAYMENT":
            await this.setState({
              pageIsLoaded: true,
              displayBanks: false,
              displayBankDetails: true,
              displayConsentStatus: true,
              displayConsentAuth: false,
              displayAccountList: true,
              displayAccountButton: true,

              selectedBank: session.bankSelected,
              bankAuthMethod: session.aspspAuthMethod,
              consentStatus: session.consentStatus,
              consentScaStatus: session.consentScaStatus,
              consentAuthMethod: session.authenticationMethodId,
              accounts: session.accounts,

              cart: session.cart,
              cartTotal: session.totalCost,
              progressBar: 75,
            });
            let checkBoxArr = [];
            await this.state.accounts.forEach(() => checkBoxArr.push(false));
            await this.setState({
              checkedBoxes: checkBoxArr,
            });
            break;
          case "PAYMENT_DONE":
            await this.setState({
              pageIsLoaded: true,
              displayBanks: false,
              displayBankDetails: true,
              displayConsentStatus: true,
              displayAccountList: false,
              displayAccountButton: false,
              displayPaymentStatus: true,

              selectedBank: session.bankSelected,
              bankAuthMethod: session.aspspAuthMethod,

              consentStatus: session.consentStatus,
              consentScaStatus: session.consentScaStatus,
              consentAuthMethod: session.authenticationMethodId,

              accounts: session.accounts,

              paymentCodeSent: true,
              paymentStatus: session.paymentStatus,
              paymentScaStatus: session.paymentScaStatus,
              paymentAuthMethod: session.authenticationMethodId,
              selectedAccountIban: session.accountIban,

              cart: session.cart,
              cartTotal: session.totalCost,

              finalStatus: "Successfully",
              progressBar: 100,
            });
            break;
          default:
            break;
        }
      } else {
        // First time visiting page.
        this.getBankList();
      }
    })();
  }

  //
  /* ##### API calls below - [Rows 220-400] ##### */
  //

  /* ### GetBankList: [] ### */
  getBankList = async () => {
    const rawResponse = await fetch(this.state.aspspBaseRoute);
    const jsonData = await rawResponse.json();
    await console.log(jsonData.session);

    if (jsonData.success === false) {
      alert(`Failed to load bank logos. \nPress 'OK' to restart the payment process. \n\n[Error: ${jsonData.error}]`);
      await window.location.reload(false);
      // window.location.href = await "http://localhost:3000";
    }

    this.setState({
      banks: jsonData.data,
      pageIsLoaded: true,
      cart: jsonData.session.cart,
      cartTotal: jsonData.session.totalCost,
    });
  };

  /* ### GetBankDetails: [] ### */
  getBankDetails = async () => {
    const rawResponse = await fetch(this.state.aspspBaseRoute + `${this.state.bicFi}`);
    const jsonData = await rawResponse.json();
    console.log(jsonData.session);

    if (jsonData.success === false) {
      alert(`Failed to load bank details. \nPress 'OK' to restart the payment process. \n\n[Error: ${jsonData.error}]`);
      await fetch("/editSessionState/selectBank", { method: "POST" });
      await window.location.reload(false);
    }

    await this.setState({
      selectedBank: jsonData.data,
      bankAuthMethod: jsonData.data.supportedAuthorizationMethods[0].name, // Index 0 required.
    });
  };

  /* ### InitateConsentAIS: [(1) Create-, (2) Start- & (3) Update Consent] ### */
  initiateConsentAis = async () => {
    // (1). Create Consent
    const consentCreate = await fetch(this.state.consentBaseRoute, {
      method: "POST",
    });
    const jsonData1 = await consentCreate.json();

    if (jsonData1.success === false) {
      alert(`Failed to create consent. \nPress 'OK' to restart the payment process. \n\n[Error: ${jsonData1.error}]`);
      await fetch("/editSessionState/selectBank", { method: "POST" });
      await window.location.reload(false);
    }

    await this.setState({
      consentStatus: jsonData1.data.consentStatus,
    });
    if ("scaMethods" in jsonData1.data) {
      if (jsonData1.data.scaMethods.length > 0) {
        this.setState({
          consentAuthMethod: jsonData1.data.scaMethods[0].authenticationMethodId,
        });
      }
    }

    // (2). Start Consent
    const consentStart = await fetch(this.state.consentBaseRoute + this.state.consentInitAuthRoute, {
      method: "POST",
    });
    const jsonData2 = await consentStart.json();

    if (jsonData2.success === false) {
      alert(`Failed to start consent. \nPress 'OK' to restart the payment process. \n\n[Error: ${jsonData2.error}]`);
      await fetch("/editSessionState/selectBank", { method: "POST" });
      await window.location.reload(false);
    }

    this.setState({
      consentScaStatus: jsonData2.data.consentScaStatus,
    });

    // (3). Update PSU data
    const consentUpdate = await fetch(
      this.state.consentBaseRoute + this.state.consentInitAuthRoute + `consentAuthorisationId`,
      {
        method: "PUT",
      }
    );
    const jsonData3 = await consentUpdate.json();

    if (jsonData3.success === false) {
      alert(`Failed to update consent. \nPress 'OK' to restart the payment process. \n\n[Error: ${jsonData3.error}]`);
      await fetch("/editSessionState/selectBank", { method: "POST" });
      await window.location.reload(false);
    }

    await this.setState({
      progressBar: 35,
      consentStatus: jsonData3.consentStatus,
      consentScaStatus: jsonData3.scaStatus,
      psuMessage: jsonData3.psuMessage,
      consentChallengeData: jsonData3.challengeData === undefined ? "" : jsonData3.challengeData,
      consentRedirectLink: jsonData3.redirect === undefined ? "" : jsonData3.redirect,
    });

    await this.consentButtonHandler();

    // OAuth2 - Redirect user immediately after bank selection.
    if (this.state.bankAuthMethod === "OAuth2") {
      while (this.state.consentRedirectLink.length <= 0) {}
      window.location.href = await this.state.consentRedirectLink;
    }
    // Decoupled - Start polling for a duration of 30 sek.
    else if (this.state.bankAuthMethod === "Decoupled") {
      window.location.href = await "https://localhost:5000/externalCallback/qrDone";
    }
  };

  // AIS - (4) Get Account List
  getAccountList = async () => {
    const aisResponse = await fetch(this.state.accountBaseRoute); // "https://localhost:5000"
    const jsonData5 = await aisResponse.json();
    await console.log(jsonData5.session);

    if (jsonData5.success === false) {
      alert(`Failed to get accounts. \nPress 'OK' to restart the payment process. \n\n[Error: ${jsonData5.error}]`);
      await fetch("/editSessionState/selectBank", { method: "POST" });
      await window.location.reload(false);
    }

    // Add checkboxes for each account displayed.
    let arr = [];
    await jsonData5.data.accounts.forEach(() => arr.push(false));

    await this.setState({
      accounts: jsonData5.data.accounts,
      checkedBoxes: arr,
      displayConsentAuth: false,
      displayAccountList: true,
      displayAccountButton: true,
    });
  };

  /* ### ActivatePayment: [(1) Create-, (2) Start- & (3) Update Payment] ### */
  activatePayment = async (cartTotal, iban, bban) => {
    await fetch(this.state.accountBaseRoute + "/updateIban/" + iban, {
      method: "PUT",
    });
    await fetch(this.state.accountBaseRoute + "/updateBban/" + bban, {
      method: "PUT",
    });

    // (1). Create Payment Initiation
    const paymentCreate = await fetch(this.state.paymentBaseRoute + cartTotal, {
      method: "POST",
    });
    const jsonData1 = await paymentCreate.json();

    if (jsonData1.success === false) {
      alert(`Failed to create payment.\nPress 'OK' to restart the payment process.\n\n[Error: ${jsonData1.error}]`);
      await fetch("/editSessionState/selectBank", { method: "POST" });
      await window.location.reload(false);
    }

    await this.setState({
      paymentStatus: jsonData1.paymentStatus,
    });

    // (2). Start Payment Initiation Authorisation Process
    const paymentStart = await fetch(this.state.paymentBaseRoute + "paymentId/authorisations", {
      method: "POST",
    });
    const jsonData2 = await paymentStart.json();

    if (jsonData2.success === false) {
      alert(`Failed to start payment.\nPress 'OK' to restart the payment process.\n\n[Error: ${jsonData2.error}]`);
      await fetch("/editSessionState/selectBank", { method: "POST" });
      await window.location.reload(false);
    }

    await this.setState({
      paymentScaStatus: jsonData2.paymentScaStatus,
      paymentAuthMethod: jsonData2.paymentAuthMethod,
    });

    // (3). Update PSU Data
    const paymentUpdate = await fetch(
      this.state.paymentBaseRoute + this.state.paymentInitAuthRoute + `paymentAuthorisationId`,
      {
        method: "PUT",
      }
    );
    const jsonData3 = await paymentUpdate.json();
    console.log(jsonData3.session);

    if (jsonData3.success === false) {
      alert(`Failed to update payment.\nPress 'OK' to restart the payment process.\n\n[Error: ${jsonData3.error}]`);
      await fetch("/editSessionState/selectBank", { method: "POST" });
      await window.location.reload(false);
    }

    await this.setState({
      paymentStatus: jsonData3.paymentStatus,
      paymentScaStatus: jsonData3.paymentScaStatus,
      paymentRedirectLink: jsonData3.redirect === undefined ? "" : jsonData3.redirect,
      paymentChallengeData: jsonData3.challengeData === undefined ? "" : jsonData3.challengeData,
    });

    // OAuth2 - Redirect user immediately after account selection.
    await this.paymentButtonHandler();
    if (this.state.bankAuthMethod === "OAuth2") {
      while (this.state.paymentRedirectLink.length <= 0) {}
      window.location.href = await this.state.paymentRedirectLink;
    }
    // Decoupled - Start polling for a duration of 30 sek.
    else if (this.state.bankAuthMethod === "Decoupled") {
      window.location.href = await "https://localhost:5000/externalCallback/qrDone";
    }
  };

  //
  /* ##### API calls above ##### */
  //

  //
  /* ##### State Handlers below - [Used from within child components to reach Payment states] ##### */
  //

  /* ### BankSelectHandler: [Set bicFi & get details for that bank] ### */
  bankSelectHandler = async (id) => {
    if (id !== undefined) {
      // Required: await. setState is async.
      await this.setState({
        displayBanks: false,
        displayBankDetails: true,
        bicFi: this.state.banks[id].bicFi,
        selectedBank: this.state.banks[id],
      });
    }
    await this.getBankDetails();
    await this.initiateConsentAis();
  };

  /* ### ConsentButtonHandler: [] ### */
  consentButtonHandler = () => {
    this.setState({
      displayConsentStatus: true,
      displayConsentAuth: true,
    });
  };

  /* ### AccountButtonHandler: [] ### */
  accountButtonHandler = (event) => {
    this.setState({
      displayAccountButton: false,
      disableAccountButton: true,
      progressBar: 70,
    });
  };

  /* ### PaymentButtonHandler: [] ### */
  paymentButtonHandler = () => {
    this.setState({
      progressBar: 85,
      displayAccountList: false,
      displayPaymentStatus: true,
      displayPaymentAuth: true,
    });
  };

  /* ### HandleCheckboxChange: [] ### */
  handleCheckboxChange = async (event, id) => {
    let arr = [...this.state.checkedBoxes];
    if (arr.every((e, i) => (i !== id ? e === false : true))) {
      arr[id] = event.target.checked;
      await this.setState({
        checkedBoxes: arr,
        selectedAccountIban: this.state.accounts[id].iban,
        selectedAccountBban: this.state.accounts[id].bban,
      });
    }
  };

  //
  /* ##### State Handlers above ##### */
  //

  //
  /* ##### Render below: [Rows 580-850] [Renders one root React element into the DOM]. ##### */
  //

  render() {
    // Define state variables.
    const {
      pageIsLoaded,

      // Banks
      banks,
      selectedBank,
      bankAuthMethod,

      // Display
      displayBanks,
      displayBankDetails,
      displayConsentStatus,
      displayConsentAuth,
      displayAccountList,
      displayAccountButton,
      displayPaymentStatus,
      displayPaymentAuth,

      // Disable
      disableAccountButton,

      // Consent
      consentStatus,
      consentAuthMethod,
      consentScaStatus,
      consentRedirectLink,
      consentChallengeData,
      psuMessage,

      // Account
      accounts,
      checkedBoxes,
      accountListRequested,
      selectedAccountIban,
      selectedAccountBban,

      // Payment
      paymentStatus,
      paymentScaStatus,
      paymentRedirectLink,
      paymentChallengeData,
      paymentAuthMethod,
      paymentCodeSent,

      // Cart
      //cart,
      cartTotal,

      // Finish Message
      finalStatus,
    } = this.state;

    let accountKeyId = 0;
    let bankId = 0;

    // Title & BankLogos: [Start page for localhost:3000/payment]
    let bankLogos = null;
    if (displayBanks) {
      bankLogos = (
        <div>
          <Title name="Select" title="Bank" />
          {banks.map((bank) => (
            <BankLogo key={bankId} id={bankId++} item={bank} clickEvent={(id) => this.bankSelectHandler(id)} />
          ))}
        </div>
      );
    }

    // BankDetails: [Content that is displayed when the user has selected a bank].
    let bankSpecificContent = null;
    if (displayBankDetails) {
      bankSpecificContent = <BankDetails selectedBank={selectedBank} bankAuthMethod={bankAuthMethod} />;
    }

    // ProgressBar: [Displayed after bank selection].
    let progressBar = null;
    if (displayBankDetails && finalStatus.length === 0) {
      progressBar = (
        <ProgressBarOuter className="progress mb-4" style={{ width: "150px" /* 200px */, margin: "auto" }}>
          <div className="progress-bar bg-success" role="progressbar" style={{ width: `${this.state.progressBar}%` }}>
            {this.state.progressBar}%
          </div>
        </ProgressBarOuter>
      );
    }

    // ConsentStatus: [Displayed after bank selection].
    let consentStatusContent = null;
    if (displayConsentStatus) {
      consentStatusContent = (
        <ConsentStatus
          consentAuthMethod={consentAuthMethod}
          consentStatus={consentStatus}
          consentScaStatus={consentScaStatus}
        />
      );
    }

    // ConsentAuthorization: [Only for Decoupled]
    let consentAuthorization = null;
    if (displayConsentAuth && bankAuthMethod !== "OAuth2") {
      consentAuthorization = (
        <ConsentAuthorization
          consentRedirectLink={consentRedirectLink}
          consentChallengeData={consentChallengeData}
          psuMessage={psuMessage}
        />
      );
      if (!accountListRequested && (consentScaStatus === "finalised" || consentScaStatus === "exempted")) {
        (async () => {
          await this.setState({
            accountListRequested: true,
          });
          await this.getAccountList();
        })();
      }
    }

    // AccountList: [Get account list]
    let bankAccounts = null;
    if (displayAccountList) {
      bankAccounts = (
        <AccountList
          accounts={accounts}
          accountKeyId={accountKeyId}
          checkedBoxes={checkedBoxes}
          onChange={this.handleCheckboxChange}
          displayAccountButton={displayAccountButton}
          selectedAccountIban={selectedAccountIban}
        />
      );
    }

    // AccountButton: [after the accounts list is displayed].
    let accountButton = null;
    if (displayAccountButton) {
      console.log(cartTotal);
      accountButton = (
        <AccountButton
          cartTotal={cartTotal}
          checkedBoxes={checkedBoxes}
          disableAccountButton={disableAccountButton}
          accountButtonHandler={(e) => this.accountButtonHandler()}
          activatePayment={(cartTotal, selectedAccountIban, selectedAccountBban) =>
            this.activatePayment(cartTotal, selectedAccountIban, selectedAccountBban)
          }
          selectedAccountIban={selectedAccountIban}
          selectedAccountBban={selectedAccountBban}
        />
      );
    }

    // PaymentStatus:  [payment and Sca status - after the user has pressed the "Initaite Payment" button].
    let paymentStatusContent = null;
    if (displayPaymentStatus) {
      paymentStatusContent = (
        <PaymentStatus
          paymentAuthMethod={paymentAuthMethod}
          paymentStatus={paymentStatus}
          paymentScaStatus={paymentScaStatus}
        />
      );
    }

    // PaymentAuthorization: [Only for Decoupled].
    let paymentAuthorizationMethod = null;
    if (displayPaymentAuth && bankAuthMethod !== "OAuth2") {
      paymentAuthorizationMethod = (
        <PaymentAuthorization
          paymentRedirectLink={paymentRedirectLink}
          paymentChallengeData={paymentChallengeData}
          psuMessage={psuMessage}
          finalStatus={finalStatus}
        />
      );
      if (!paymentCodeSent && (paymentScaStatus === "finalised" || paymentScaStatus === "exempted")) {
        (async () => {
          await this.setState({
            paymentCodeSent: true,
            displayPaymentAuth: false,
            finalStatus: "Successfully",
          });
        })();
      }
    }

    // Finalized status content
    let finalStatusContent = null;
    if (finalStatus.length !== 0) {
      finalStatusContent = (
        <span>
          {this.state.cart == null ? (
            ""
          ) : this.state.cart.length !== 0 ? (
            <span>
              <div className="my-4">
                <div style={{ fontSize: "20px", paddingBottom: "0.5rem" }}>Products bought: </div>
                {this.state.cart.length > 0
                  ? this.state.cart.map((item, i) => {
                      return (
                        <span key={i} className="card" style={{ margin: "0 4rem", color: "black" }}>
                          <br />
                          {item.title /*.substring(0, item.title.indexOf("-") - 1)*/} ({item.count})
                        </span>
                      );
                    })
                  : ""}
              </div>
              <div className="my-4">
                <div style={{ fontSize: "20px", paddingBottom: "0.25rem" }}>Transfered amount:</div>
                <span style={{ color: "green" }}>{this.state.cartTotal} SEK</span>
              </div>
            </span>
          ) : (
            ""
          )}
          <div className="my-4">
            <div style={{ fontSize: "20px", paddingBottom: "0.25rem" }}>Payment Completed:</div>
            <span style={{ color: "green" }}> {finalStatus}</span>
          </div>
          <button
            onClick={async () => {
              /* await this.setState({
                displayBankDetails: false,
              }); */
              await this.getBankList();
              await fetch(`/cart/deleteAllItems`, { method: "DELETE" });
              // Does not make sense to send user to bank selection when cart is empty. Send back to products page.
              window.location.href = await "http://localhost:3000/"; // http://localhost:3000/payment
            }}
            className="my-4 btn btn-dark btn-lg"
          >
            Make Another Payment
          </button>
        </span>
      );
    }

    // Return JSX to the client.
    if (pageIsLoaded === false) {
      return <Spinner />;
    } else {
      return (
        <div className="body py-5 container">
          <Title name="Payment" title="Process" />
          {displayBanks ? bankLogos : ""}
          {displayBankDetails ? bankSpecificContent : ""}

          <div className="row mt-0 mb-4 text-capitalize text-center">
            <div className="mx-auto col-lg-4">
              {progressBar}
              {consentStatusContent}
              <br />
              {consentAuthorization}
              <br />
              {bankAccounts}
              {accountButton}

              {paymentStatusContent}
              {paymentAuthorizationMethod}
              <br />
              {finalStatusContent}
              <br />
            </div>
          </div>
        </div>
      );
    }
  }
  //
  /* ##### Render Function above ##### */
  //
}

const ProgressBarOuter = styled.div`
  border: 1px solid ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.background} !important;
`;

Payment.contextType = ProductContext;
export default Payment;
