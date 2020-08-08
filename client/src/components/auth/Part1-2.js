import React, { Component } from "react";
import Products from '../product/Products1-2'

class SignUp extends Component {

  render() {
    return (
      <div className="forms">
        <h2>Part-1 / Form Error with delay</h2>
        <div>User form rendering but couldn't get card value cause an error.</div>
        <Products></Products>
      </div>
    );
  }
}

export default SignUp;
