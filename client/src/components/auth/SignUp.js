import React, { Component } from "react";
import Products from '../product/ProductsSubError'

class SignUp extends Component {

  render() {
    return (
      <div className="forms">
        <h2>Form with error</h2>
        <Products></Products>
      </div>
    );
  }
}

export default SignUp;
