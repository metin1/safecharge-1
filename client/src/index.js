import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import jwtDecode from "jwt-decode";

import "./index.css";
import App from "./components/App";
import Home from "./components/layout/pages/home/Home";
import Part3_2 from "./components/auth/Part2-1";
import Part1_2 from "./components/auth/Part1-2";
import Part3_1 from "./components/auth/Part2-2";
import Part2_1 from "./components/auth/Part2initial";
import NotFound from "./components/layout/pages/notFound/NotFound";
import Part1_3 from "./components/auth/Part1-3";
import Part1_1 from "./components/auth/Part1-1";
import Products from "./components/product/Products1-1";
import Product from "./components/product/Product";
import Cart from "./components/shopping-cart/Cart";
import Checkout from "./components/shopping-cart/Checkout";
import Payment from "./components/shopping-cart/Payment";
import Customer from "./components/customer/Customer";
import Dashboard from "./components/dashboard/Dashboard";
import MyAccount from "./components/myAccount/MyAccount";
import CreateCustomer from "./components/customer/CreateCustomer";
import EditCustomer from "./components/customer/EditCustomer";
import AddAddress from "./components/customer/AddAddress";
import CreateCategory from "./components/category/CreateCategory";
import EditCategory from "./components/category/EditCategory";
import Categories from "./components/category/Categories";
import CreateProduct from "./components/product/CreateProduct";
import EditAndDeleteProducts from "./components/product/EditAndDeleteProducts";
import EditProduct from "./components/product/EditProduct";

import store from "./store";

import { AUTH_USER } from "./actions/types";
import { logout } from "./actions/authAction";

import * as serviceWorker from "./serviceWorker";



if (localStorage.token) {
  if (jwtDecode(localStorage.getItem("token")).exp < Date.now()) {
    store.dispatch(logout());
    //store.dispatch(clearCustomer());
    window.location.href = "/partone";
  }
  store.dispatch({
    type: AUTH_USER,
    payload: jwtDecode(localStorage.getItem("token"))
  });
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/part3-2" component={Part3_2} />
          <Route path="/part1-1" component={Part1_1} />
          <Route path="/part1-2" component={Part1_2} />
          <Route path="/part1-3" component={Part1_3} />
          <Route path="/part2-1" component={Part2_1} />
          <Route path="/part3-1" component={Part3_1} />
          <Route path="/my-account" component={MyAccount} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/customer/:id" component={Customer} />
          <Route path="/createcustomer" component={CreateCustomer} />
          <Route path="/editcustomer" component={EditCustomer} />
          <Route path="/addaddress" component={AddAddress} />
          <Route path="/product/:id" component={Product} />
          <Route path="/products/category/:category" component={Products} />
          <Route path="/cart" component={Cart} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/payment" component={Payment} />
          <Route path="/admin/add-category" component={CreateCategory} />
          <Route
            path="/admin/edit-category/categories"
            component={Categories}
          />
          <Route path="/admin/edit-category/:id" component={EditCategory} />
          <Route path="/admin/add-product" component={CreateProduct} />
          <Route path="/admin/edit-product/products" component={EditAndDeleteProducts} />
          <Route path="/admin/edit-product/:id" component={EditProduct} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </App>
    </BrowserRouter>
  </Provider>,
  document.querySelector("#root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
