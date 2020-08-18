import React from "react";
import Checkbox from "./Checkbox";
import styled from "styled-components";

export default function AccountList(props) {
  let accounts = props.accounts;
  let accountKeyId = props.accountKeyId;
  let checkedBoxes = props.checkedBoxes;
  let onChange = props.onChange;
  let displayAccountButton = props.displayAccountButton;
  let selectedAccountIban = props.selectedAccountIban;

  let cardBorder = "";
  return (
    <span>
      <span style={{ fontSize: "26px" }}>Select Bank Account: </span>
      <br />
      {accounts.map((acc) => {
        selectedAccountIban === acc.iban && !displayAccountButton
          ? (cardBorder = "card mb-3 mt-3 mx-5 border border-success")
          : (cardBorder = "card mb-3 mt-3 mx-5");
        return (
          <Div key={accountKeyId++} className={cardBorder}>
            <Checkbox
              type="radio"
              id={accountKeyId - 1}
              checkedBoxes={checkedBoxes}
              onChange={onChange}
              displayAccountButton={displayAccountButton}
              accountKeyId={accountKeyId}
              ownerName={acc.ownerName}
              status={acc.status}
              usage={acc.usage}
              bban={acc.bban}
              iban={acc.iban}
            ></Checkbox>
          </Div>
        );
      })}
    </span>
  );
}

const Div = styled.div`
  background: ${({ theme }) => theme.aisBackgroundSecondary};
  color: ${({ theme }) => theme.text};
`;
