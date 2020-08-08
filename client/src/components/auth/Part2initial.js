import React, { Component } from "react";
import Products from '../product/Products2-1'

class SignUp extends Component {

  render() {
    return (
      <div className="forms">
        <h2>Part-2 SUCCESS</h2>
        <div>Form rendered successully. But card data can't be get</div>
        <Products></Products>
      </div>
    );
  }
}

export default SignUp;
