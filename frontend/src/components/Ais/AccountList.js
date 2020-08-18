import React from "react";
import styled from "styled-components";

export default function AccountList(props) {
  let bankCard = props.bankCard;

  return (
    <span>
      {bankCard.accNames.map((accName, i) => {
        return (
          <Div
            key={i}
            className="card mb-3 mt-3 mx-0"
            style={{ textTransform: "none", fontFamily: "Georgia", letterSpacing: "0.1rem" }}
          >
            <strong>{bankCard.accNames[i]}</strong>
            <span className="pb-2">{bankCard.userNames[i]}</span>

            <span>
              Balance: {bankCard.balances[i]} {bankCard.currency === "" ? "SEK" : bankCard.currency}
            </span>

            <span className="pt-2">
              <strong>Recent History:</strong>
              <div>
                Income Avg:{" "}
                <span style={{ color: "green" }}>
                  {typeof bankCard.incomeAvgs[i] !== "undefined" ? (
                    <span>
                      {" "}
                      {bankCard.incomeAvgs[i]} {bankCard.currency === "" ? "SEK" : bankCard.currency}
                    </span>
                  ) : (
                    <strong>-</strong>
                  )}
                </span>
              </div>
              <div>
                Withdraw Avg:{" "}
                <span style={{ color: "red" }}>
                  {typeof bankCard.withdrawAvgs[i] !== "undefined" ? (
                    <span>
                      {" "}
                      {bankCard.withdrawAvgs[i]} {bankCard.currency === "" ? "SEK" : bankCard.currency}
                    </span>
                  ) : (
                    <strong>-</strong>
                  )}
                </span>
              </div>
              <div>
                Transactions occured:{" "}
                {typeof bankCard.sampleSize[i] !== "undefined" ? (
                  <span> {bankCard.sampleSize[i]}</span>
                ) : (
                  <strong>-</strong>
                )}
              </div>
            </span>
          </Div>
        );
      })}
    </span>
  );
}

const Div = styled.div`
  background: ${({ theme }) => theme.aisBackgroundSecondary};
`;
