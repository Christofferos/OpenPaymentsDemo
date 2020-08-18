import React from "react";
import styled from "styled-components";
import CartItem from "./CartItem";

export default function CartList({ value }) {
  const { cart } = value;
  return (
    <div className="container-md mb-2 ">
      <FontLarge>
        {cart.map((item) => {
          return <CartItem key={item.id} item={item} value={value} />;
        })}
      </FontLarge>
    </div>
  );
}

export const FontLarge = styled.span`
  font-size: 120%;
`;
