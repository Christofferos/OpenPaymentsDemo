/* 
Code-author: Kristopher Werlinder,
Date: 2020-07-27
*/

import React /* Component */ from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import Details from "./components/Details";
import Default from "./components/Default";
import Modal from "./components/Modal";
import Api from "./components/Api";
import Cart from "./components/Cart";
import Payment from "./components/Payment";
import Ais from "./components/Ais";

import styled, { ThemeProvider } from "styled-components";
import { useDarkMode } from "./components/useDarkMode";
import { GlobalStyles } from "./components/GlobalStyles";
import { lightTheme, darkTheme } from "./components/Themes";

const App = () => {
  const [theme, themeToggler, mountedComponent] = useDarkMode();
  const themeMode = theme === "light" ? darkTheme : lightTheme;

  if (!mountedComponent) return <div />;
  return (
    <ThemeProvider theme={themeMode}>
      <Body>
        <React.Fragment>
          <>
            <GlobalStyles />
            <Navbar theme={theme} toggleTheme={themeToggler}></Navbar>
            <Switch>
              <Route exact path="/" component={ProductList}></Route>
              <Route path="/api" component={Api}></Route>
              <Route path="/details" component={Details}></Route>
              <Route path="/cart" component={Cart}></Route>
              <Route path="/payment" component={Payment}></Route>
              <Route path="/ais" component={Ais}></Route>
              <Route component={Default}></Route>
            </Switch>
            <Modal></Modal>
          </>
        </React.Fragment>
      </Body>
    </ThemeProvider>
  );
};

const Body = styled.body`
  background: ${({ theme }) => theme.background} !important;
  color: ${({ theme }) => theme.color} !important;
`;

export default App;
