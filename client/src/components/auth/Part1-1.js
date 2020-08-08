import React, { Component } from 'react';
import './auth.css';
import Products from '../product/Products1-1';

class Login extends Component {
  render() {
    return (
      <div  className="forms">
        <h2>Part-1 Complete / My Card Form / With CVV2 error</h2>
        <div>
          <Products></Products>
        </div>
      </div>
    );
  }
}

export default Login;
