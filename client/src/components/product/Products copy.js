import React, { Component } from "react";
import ReactDOM from "react-dom";
import scriptLoader from "react-async-script-loader";
import ProductItemNew from "./ProductItemBuy";
import "./Product.css";

class Products extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showButton: false,
    };

    window.React = React;
    window.ReactDOM = ReactDOM;
  }
  componentDidMount() {
    const {
      isScriptLoaded,
      isScriptLoadSucceed
    } = this.props;
    
    if (isScriptLoaded && isScriptLoadSucceed) {
      this.setState({ showButton: true });
      // console.log(`OUTPUT: Products -> componentDidMount -> this.props`, this.props)
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      isScriptLoaded,
      isScriptLoadSucceed,
    } = nextProps;
    const isLoadedButWasntLoadedBefore =
      !this.state.showButton &&
      !this.props.isScriptLoaded &&
      isScriptLoaded;

    if (isLoadedButWasntLoadedBefore) {
      if (isScriptLoadSucceed) {
        this.setState({ showButton: true });
        // console.log(window)
      }
    }
  }
 
  render() {
    const {
      showButton,
    } = this.state;

    const aProduct = {
      _id: "sdfdsfasdf",
      stock:"122",
      name:"Mountain Bike", 
      price:"120", 
      image:"https://sc01.alicdn.com/kf/Hf7051724212546b499e1e29e7b2e30ebZ.jpg", 
      category:'mountain', 
      discount:0
    }
    
    const SafeCharge = window.SafeCharge
    // console.log(window)
    var sfc = SafeCharge({
      env: 'int', // the environment you’re running on, if omitted prod is default
      merchantId: '5779192833181891488', //as assigned by Nuvei
      merchantSiteId: '205708' // your Merchant Site ID provided by Nuvei
    });
    
    //Instantiate Nuvei Fields
    var ScFields = sfc.fields({
      fonts: [{
          cssUrl: 'https://fonts.googleapis.com/css?family=Source+Code+Pro'
        }, // include your custom fonts
      ],
      locale: 'en' // you can set your users preferred locale, if not provided we will try to autodetect
    });
    
    // Activate Nuvei Fields
    var style = {
      base: {
        fontFamily: 'Roboto, sans-serif',
        color: "#045d47",
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#ccb654'
        }
      },
      invalid: {
        color: '#e5312b',
        ':focus': {
          color: '#303238'
        }
      },
      empty: {
        color: '#BADA55',
        '::placeholder': {
          color: '#cc3ac2'
        }
      },
      valid: {
        color: '#2b8f22'
      }
    };
    
 
    var scard = ScFields.create('card', {style: style});
    console.log(`OUTPUT: Products -> render -> scard`, scard)
    showButton && scard.attach(document.getElementById('card-field-placeholder'));

   
    function main() {
      // call authenticate3d
      sfc.authenticate3d({
        "sessionToken": "<sessionToken from openOrder>",
        "userTokenId": "someone@site.com", // optional
        "clientUniqueId": "695701003",
        "currency": "USD",
        "amount": "120",
        "paymentOption": scard,
          "cardHolderName": document.getElementById('cardHolderName').value,
        "billingAddress": {
          "email": "someone@somedomain.com",
          "country": "GB"
        }
      }, function(result) {
        console.log(result)
      })
    
    }

    scard.on('ready', function (evt) {
      console.log('on sfcCard ready', evt);
      });

    return (
      <div>
        <section className="product-container"><ProductItemNew
        key={aProduct._id}
        handleOnClick={e => {
          this.handleOnClickUn(e, aProduct._id, aProduct.stock);
        }}
        product={aProduct}
        
      />
 
      </section>
       {/*<form action="/charge" method="post" id="payment-form">*/}
       <form action={e=>e.preventDefault()}  id="payment-form">
        <div className="form-row">
                <label htmlFor="card-field-placeholder">
                    Credit or debit card
                </label>
                <div id="card-field-placeholder" className="some initial css-classes">
                {/*<!-- SFC Card widget will be inserted here. -->*/}
                <div>{}</div>
                </div>
                {/*<!-- Used to display form errors. -->*/}
                <div id="scard-errors" role="alert"></div>
        </div>
        <button onClick={(e)=> [ e.preventDefault(), console.log(document.getElementById('cardnumber') && document.getElementById('cardnumber').value),
        sfc.createPayment({
          "sessionToken"   : "<sessiontoken>", //received from openOrder API
          "userTokenId"    : "230811147",
          "clientUniqueId" : "695701003", // optional
          "currency"       : "USD", 
          "amount"         : "500",
          "cardHolderName"  : "card_holder",
          "paymentOption"  : document.getElementById('cardnumber') && document.getElementById('cardnumber').value,
          "billingAddress": {
               "email": "someone@somedomain.com",
               "country":"GB"
          }
      }, function (res) {
          console.log(res)
      })]}>Submit Payment</button>
      </form>
      </div>
    );
  }
}

export default scriptLoader('https://cdn.safecharge.com/safecharge_resources/v1/websdk/safecharge.js')(Products);
