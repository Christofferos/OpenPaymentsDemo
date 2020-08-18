class SessionContextAIS {
  /* NOTE: As of 2020-07-28 session are not utilized for AIS overview */
  constructor(session) {
    session.AIS = {};
    session.AIS.bankCards = [{}, {}, {}]; // Length 3

    session.AIS.bankCards[0].accNames = [];
    session.AIS.bankCards[0].balances = [];
    session.AIS.bankCards[0].bicFi = "";
    session.AIS.bankCards[0].bicFiLogoUrl = "";
    session.AIS.bankCards[0].currency = "";
    session.AIS.bankCards[0].incomeAvgs = [];
    session.AIS.bankCards[0].sampleSize = [];
    session.AIS.bankCards[0].userNames = [];
    session.AIS.bankCards[0].withdrawAvgs = [];

    session.AIS.bankCards[1].accNames = [];
    session.AIS.bankCards[1].balances = [];
    session.AIS.bankCards[1].bicFi = "";
    session.AIS.bankCards[1].bicFiLogoUrl = "";
    session.AIS.bankCards[1].currency = "";
    session.AIS.bankCards[1].incomeAvgs = [];
    session.AIS.bankCards[1].sampleSize = [];
    session.AIS.bankCards[1].userNames = [];
    session.AIS.bankCards[1].withdrawAvgs = [];

    session.AIS.bankCards[2].accNames = [];
    session.AIS.bankCards[2].balances = [];
    session.AIS.bankCards[2].bicFi = "";
    session.AIS.bankCards[2].bicFiLogoUrl = "";
    session.AIS.bankCards[2].currency = "";
    session.AIS.bankCards[2].incomeAvgs = [];
    session.AIS.bankCards[2].sampleSize = [];
    session.AIS.bankCards[2].userNames = [];
    session.AIS.bankCards[2].withdrawAvgs = [];
  }
}

module.exports = SessionContextAIS;
