import React, { Component } from "react";
import Products from '../product/Products1-3'

class SignUp extends Component {

  render() {
    return (
      <div className="forms">
        <h2>Form with error without delay</h2>
        <Products></Products>
      </div>
    );
  }
}

export default SignUp;
