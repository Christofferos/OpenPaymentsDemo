import React, { Component } from "react";
import Title from "../Title";
import BankDisplay from "./BankDisplay";
import ConsentButton from "./ConsentButton";
import AccountList from "./AccountList";
import styled from "styled-components";

class Ais extends Component {
  state = {
    // Routes
    aspspBaseRoute: "/psd2/aspspinformation/v1/aspsps/",
    consentBaseRoute: "/psd2/consent/v1/consents/",
    consentInitAuthRoute: "consentId/authorisations/",
    accountBaseRoute: "/psd2/accountinformation/v1/accounts",
    transactionBaseRoute: "/psd2/accountinformation/v1/accounts/accountId/transactions",

    // Banks
    banks: [],
    selectedBank: {},
    bankAuthMethod: "",
    bicfi: "",
    bankCards: {},

    // Display
    displayAddAcc: true,
    displayBanks: false,
    displayAccounts: false,
    displayExampleImg: false,

    // Loading icon
    loading: false,

    // Disable
    disableConsentButton: false,

    // Consent
    consentRedirectLink: "",
    consentChallengeData: "",

    // Accounts
    accounts: [],
    accountsTransactions: [[]],
  };

  componentDidMount() {
    /* (async () => {
      const rawData = await fetch("/userSession");
      const jsonData = await rawData.json();
      const session = jsonData.session;
      await console.log(session);

      if ("AisOverviewState" in session) {
        // Recover prior context.
        const fetchCards = await fetch("/getBankCards");
        const jsonCards = await fetchCards.json();

        switch (session.UIState) {
          case "ONE_BANK_DISPLAYED":
            await this.setState({
              bankCards: jsonCards.bankCards,
              displayAccounts: true,
            });
            break;
          case "TWO_BANKS_DISPLAYED":
            await this.setState({
              bankCards: jsonCards.bankCards,
              displayAccounts: true,
            });
            break;
          case "THREE_BANKS_DISPLAYED":
            await this.setState({
              displayAddAcc: false,
              bankCards: jsonCards.bankCards,
              displayAccounts: true,
            });
            break;
          default:
            break;
        }
      } else {
        // First time visiting AisOverview page.
        await this.setState({
          displayExampleImg: true,
        });
        this.getBankList();
      }
    })(); */

    // >> COVERED
    this.getBankList();
    const urlParams = new URLSearchParams(window.location.search);

    // Outside redirect flow :
    if (!urlParams.has("state")) {
      (async () => {
        const fetchCards = await fetch("/getBankCards");
        const jsonCards = await fetchCards.json();
        await console.log("Bank cards:");
        console.log(jsonCards);

        const rawData = await fetch("/userSession");
        const jsonData = await rawData.json();
        const session = jsonData.session;
        await console.log("User session:");
        await console.log(session);

        if ((await jsonCards.bankCards[0].bicFi) !== "-") {
          await this.setState({
            bankCards: await jsonCards.bankCards,
            displayAccounts: true,
          });
          if ((await jsonCards.bankCards[2].bicFi) !== "-") {
            await this.setState({
              displayAddAcc: false,
            });
          }
        } else {
          await this.setState({
            displayExampleImg: true,
          });
        }
      })();
    }
    // << COVERED

    // Inside redirect flow:
    else if (urlParams.get("state") === "consentDone") {
      (async () => {
        await this.setState({ displayBanks: false, bicfi: urlParams.get("bicfi") });
        const fetchCards = await fetch("/getBankCards");
        const jsonCards = await fetchCards.json();
        if ((await jsonCards.bankCards[2].bicFi) === "-") {
          await this.getAccountList();
        } else {
          await this.setState({ bankCards: await jsonCards.bankCards, displayAddAcc: false, displayAccounts: true });
        }
      })();
    }
  }

  getBankList = async () => {
    const raw = await fetch(this.state.aspspBaseRoute);
    const json = await raw.json();
    this.setState({
      banks: json.data,
    });
  };

  addAccountHandler = async () => {
    await this.setState({
      displayExampleImg: false,
      displayAddAcc: false,
      displayBanks: true,
    });
    // Tell backend that a new bank card is being handled.
    await fetch("/aisInstanceDone", { method: "POST" });
  };

  initiateConsent = async (id) => {
    await this.setState({
      bicfi: this.state.banks[id].bicFi,
      displayBanks: false,
      selectedBank: {
        bicFi: this.state.banks[id].bicFi,
        logoUrl: this.state.banks[id].logoUrl,
        name: this.state.banks[id].name,
      },
    });

    // Bank details API call
    const rawResponse = await fetch(this.state.aspspBaseRoute + `${this.state.bicfi}`);
    const jsonData = await rawResponse.json();

    await this.setState({
      bankAuthMethod: jsonData.data.supportedAuthorizationMethods[0].name,
    });

    // (1). Create Consent
    await fetch(this.state.consentBaseRoute, {
      method: "POST",
    });
    // (2). Start Consent
    await fetch(this.state.consentBaseRoute + this.state.consentInitAuthRoute, {
      method: "POST",
    });
    // (3). Update PSU data
    const consentUpdate = await fetch(
      this.state.consentBaseRoute + this.state.consentInitAuthRoute + `consentAuthorisationId`, // Modify for Account Overview in server ...
      { method: "PUT", headers: { accountOverview: true } }
    );
    const jsonData3 = await consentUpdate.json();
    console.log(jsonData3);

    await this.setState({
      consentRedirectLink: jsonData3.redirect === undefined ? "" : jsonData3.redirect,
      consentChallengeData: jsonData3.challengeData === undefined ? "" : jsonData3.challengeData,
    });
    await this.setState({ displayConsentButton: true });
  };

  /* ### ConsentButtonHandler: [] ### */
  consentButtonHandler = async () => {
    await this.setState({
      disableConsentButton: true,
    });
    await this.getAccountList();
    await this.setState({
      displayConsentButton: false,
      displayAddAcc: true,
      //displayAccounts: true,
      disableConsentButton: false,
    });
  };

  // AIS - (5) Get Account List
  getAccountList = async () => {
    const aisResponse = await fetch(this.state.accountBaseRoute); // "https://localhost:5000"
    const jsonData5 = await aisResponse.json();

    await this.setState({
      accounts: jsonData5.data.accounts,
    });

    await this.state.accounts.map(async (el, id) => {
      if (this.state.bicfi !== "OKOYFIHH" && this.state.bicfi !== "SWEDSESS") {
        //
        let fetchTran = await fetch(this.state.transactionBaseRoute + "/" + el.resourceId);
        let jsonTran = await fetchTran.json();
        //
        console.log("HERE");
        console.log(jsonTran.bankCards);

        await this.setState({
          bankCards: await jsonTran.bankCards,
          displayAccounts: true,
        });
      }
      //
      else if (id !== 1 && (this.state.bicfi === "OKOYFIHH" || this.state.bicfi === "SWEDSESS")) {
        //
        await fetch(this.state.transactionBaseRoute + "/" + el.resourceId);
        //
      }
    });

    (async () => {
      await fetch("/editSessionState/selectBank", { method: "POST" });
    })();

    // Get bank content from server.
    /* let fetchCards;
    let jsonCards;
    fetchCards = await fetch("/getBankCards");
    jsonCards = await fetchCards.json();

    await console.log("Bank Card:");
    await console.log(jsonCards.bankCards); */
  };

  render() {
    let addAccButton;
    if (this.state.displayAddAcc) {
      addAccButton = (
        <button
          className="rounded-pill btn-dark btn-lg mb-5"
          onClick={this.addAccountHandler}
          style={{ letterSpacing: "0.3rem", textTransform: "uppercase" /* marginBottom: "7.6rem" */ }}
        >
          <i className="fas fa-plus-circle pt-1"></i> Add Account
        </button>
      );
    } else {
      addAccButton = "";
    }

    let displayOverview;
    if (this.state.displayExampleImg && this.state.displayAddAcc) {
      displayOverview = (
        <div className="my-2">
          <span>For Instance:</span>
          <div>
            <AccountOverviewInstance
              style={{
                width: "260px" /* 250px*/,
                height: "370px" /* 540px */,
                textAlign: "center",
                alignItems: "center",
                margin: "auto",
                borderRadius: "1%",
                letterSpacing: "0.1rem",
                fontFamily: "Open Sans sans-serif",
                fontSize: "1.15rem",
              }}
            >
              <img src={"img/accountOverviewBank.png"} className="rounded-pill my-4" alt="SEB" />
              <AccountInstance
                style={{
                  width: "235px",
                  margin: "auto",
                }}
              >
                <strong>Privatkonto</strong>
                <div>Private</div>
                <div>
                  Balance: <span style={{ color: "green" }}>2800 SEK</span>
                </div>
                <br />
                <div>
                  <strong>Recent History:</strong>
                  <br />
                  Income Avg: <span style={{ color: "green" }}>448 SEK</span>
                  <br />
                  Withdraw Avg: <span style={{ color: "red" }}>-446 SEK</span>
                  <br />
                  Transactions occured: 528
                </div>
              </AccountInstance>
            </AccountOverviewInstance>
          </div>
        </div>
      );
    }

    let bankRow;
    if (this.state.displayBanks) {
      bankRow = (
        <div className="row">
          {this.state.banks.map((bank, i) => (
            <BankDisplay key={i} id={i} item={bank} clickEvent={(id) => this.initiateConsent(id)} />
          ))}
        </div>
      );
    } else {
      bankRow = "";
    }

    // ConsentButton: ["Give Consent" button]
    let consentButton = null;
    if (this.state.displayConsentButton) {
      consentButton = (
        <ConsentButton
          disableConsentButton={this.state.disableConsentButton}
          consentChallengeData={this.state.consentChallengeData}
          consentButtonHandler={this.consentButtonHandler}
          consentRedirectLink={this.state.consentRedirectLink}
          selectedBank={this.state.selectedBank}
        />
      );
    }

    let account0;
    let account1;
    let account2;
    if (this.state.displayAccounts) {
      let bankCards = this.state.bankCards;
      let logoUrl;

      /* Bank Content #0 */
      if (typeof bankCards !== "undefined") {
        console.log(bankCards);
        logoUrl = bankCards[0].bicFiLogoUrl;
        if (bankCards[0].bicFi === "HANDSESS") logoUrl = "img/handelsbanken.png";
        else if (bankCards[0].bicFi === "SWEDSESS") logoUrl = "img/swedbank.png";
        else if (bankCards[0].bicFi === "DABASESX") logoUrl = "img/danskebank.png";

        if (typeof bankCards[0].bicFi !== "undefined")
          account0 = (
            <Div className="column jumbotron mt-4">
              <Img src={logoUrl} width={150} className="rounded-pill shadow p-1 bg-white rounded" alt="bank"></Img>
              <AccountList bankCard={bankCards[0]}></AccountList>
            </Div>
          );

        /* Bank Content #1 */
        logoUrl = bankCards[1].bicFiLogoUrl;
        if (bankCards[1].bicFi === "HANDSESS") logoUrl = "img/handelsbanken.png";
        else if (bankCards[1].bicFi === "SWEDSESS") logoUrl = "img/swedbank.png";
        else if (bankCards[1].bicFi === "DABASESX") logoUrl = "img/danskebank.png";

        if (typeof bankCards[1].bicFi !== "undefined")
          account1 = (
            <Div className="column jumbotron mt-4">
              <Img src={logoUrl} width={150} className="rounded-pill shadow p-1 bg-white rounded" alt="bank"></Img>
              <AccountList bankCard={bankCards[1]}></AccountList>
            </Div>
          );

        /* Bank Content #2 */
        logoUrl = bankCards[2].bicFiLogoUrl;
        if (bankCards[2].bicFi === "HANDSESS") logoUrl = "img/handelsbanken.png";
        else if (bankCards[2].bicFi === "SWEDSESS") logoUrl = "img/swedbank.png";
        else if (bankCards[2].bicFi === "DABASESX") logoUrl = "img/danskebank.png";

        if (typeof bankCards[2].bicFi !== "undefined")
          account2 = (
            <Div className="column jumbotron mt-4">
              <Img src={logoUrl} width={150} className="rounded-pill shadow p-1 bg-white rounded" alt="bank"></Img>
              <AccountList bankCard={bankCards[2]}></AccountList>
            </Div>
          );
      }
    }

    return (
      <div className="container mt-5">
        <Title name="Account" title="Overview" />

        <div className="col-10 mx-auto text-center text-title">
          <div>
            {displayOverview}
            {addAccButton}

            {bankRow}
            {consentButton}
          </div>

          {account0}
          {account1}
          {account2}

          <div style={{ height: "1px" }}></div>
        </div>
      </div>
    );
  }
}

const Div = styled.div`
  background: ${({ theme }) => theme.aisBackgroundMain};
`;

const Img = styled.img`
  color: ${({ theme }) => theme.blackText};
`;

const AccountOverviewInstance = styled.div`
  background: ${({ theme }) => theme.aisBackgroundMain};
  text-transform: none;
`;

const AccountInstance = styled.div`
  background: ${({ theme }) => theme.aisBackgroundSecondary};
  textcolor: ${({ theme }) => theme.text};
`;

export default Ais;
