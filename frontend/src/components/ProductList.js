import React, { Component } from "react";
import Product from "./Product";
import Title from "./Title";
import { storeProducts } from "../data";
import { ProductConsumer } from "../context";

import Dropdown from "react-bootstrap/Dropdown";

export default class ProductList extends Component {
  state = {
    products: storeProducts,
    displayProductType: "Smartphone",
    title: "Popular Products",
  };

  componentDidMount() {
    (async () => {
      const fetchRaw = await fetch("/userSession");
      const jsonData = await fetchRaw.json();
      if ("productPage" in jsonData.session) {
        let title;
        if (jsonData.session.productPage === "gaming") title = "Gaming";
        else if (jsonData.session.productPage === "laptop") title = "Laptops";
        else title = "Popular Products";
        this.setState({
          displayProductType: jsonData.session.productPage === null ? "" : jsonData.session.productPage,
          title: title,
        });
      }
      console.log(this.state.displayProductType);
      if ("UIFlow" in jsonData.session) {
        if (jsonData.session.UIState === "PAYMENT_DONE") {
          await fetch("/editSessionState/selectBank", { method: "POST" });
        }
      }
    })();
  }

  render() {
    const categoryChangeHandler = async (productType) => {
      console.log(productType);
      let title;
      if (productType === "Smartphone") title = "Popular Products";
      else if (productType === "Gaming") title = "Gaming";
      else if (productType === "Laptop") title = "Laptops";
      await this.setState({
        displayProductType: productType,
        title: title,
      });
      (async () => {
        await fetch(`/setProductPage/${productType}`, { method: "POST" });
      })();
    };

    return (
      <React.Fragment>
        <div className="body py-5">
          <div className="container" style={{ marginBottom: "0.4rem" }}>
            <Dropdown className="text-center mb-3" style={{ textTransform: "none" }}>
              <Dropdown.Toggle variant="dark" id="dropdown-basic">
                All products
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => categoryChangeHandler("Smartphone")}>Popular Products</Dropdown.Item>
                <Dropdown.Item onClick={() => categoryChangeHandler("Laptop")}>Laptops</Dropdown.Item>
                <Dropdown.Item onClick={() => categoryChangeHandler("Gaming")}>Gaming</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Title name={this.state.title} title="" />

            <div className="row">
              <ProductConsumer>
                {(value) => {
                  // console.log(storeProducts);
                  let tempArr = [...value.products];
                  tempArr = value.products.filter(
                    (product) => product.productType.toLowerCase() === this.state.displayProductType.toLowerCase()
                  );
                  return tempArr.map((product) => {
                    return <Product key={product.id} product={product} />;
                  });
                }}
              </ProductConsumer>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
