import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import scriptLoader from 'react-async-script-loader';
import ProductItemNew from './ProductItemBuy';
import './Product.css';
import axios from 'axios';
import Swal from 'sweetalert2';

let sessionToken = '';
let clientUniqueId = '';
let userTokenId = 'someone@site.com';
let innerText = '';

let merchantSiteId = '205758';
let merchantId = '5779192833181891488';
let cardNumber = '4000027891380961';
let cardHolderName = 'FL-BRW1';
let expirationMonth = '12';
let expirationYear = '25';
let CVV = '217';
class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showButton: false,
    };

    window.React = React;
    window.ReactDOM = ReactDOM;
  }

  async componentDidMount() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;

    if (isScriptLoaded && isScriptLoadSucceed) {
      this.setState({ showButton: true });
    }

    var data2 = JSON.stringify({
      merchantSiteId,
      merchantId,
      clientRequestId: '20200805200408',
      timeStamp: '20200805200408',
      checksum:
        'ec46a8bedde9a414c87bfebfdb3e466a76b8e5c4809e0963e5be6b467655612c',
      amount: '10',
      currency: 'EUR',
      billingAddress: { email: 'someone@somedomain.com', county: 'GB' },
    });

    var config2 = {
      method: 'post',
      url: 'https://ppp-test.safecharge.com/ppp/api/openOrder.do',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data2,
    };

    axios(config2)
      .then(function (response) {
        console.log(response.data);
        sessionToken = response.data && response.data.sessionToken;
        clientUniqueId = response.data && response.data.clientUniqueId;
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentWillReceiveProps(nextProps) {
    const { isScriptLoaded, isScriptLoadSucceed } = nextProps;
    const isLoadedButWasntLoadedBefore =
      !this.state.showButton && !this.props.isScriptLoaded && isScriptLoaded;
    if (isLoadedButWasntLoadedBefore) {
      if (isScriptLoadSucceed) {
        this.setState({ showButton: true });
      }
    }
  }

  handleChangeName = (e) => {
    console.log(e.target.value);
    cardHolderName = e.target.value;
    // if (cardNumber.length === 16) {
    // }
  };



  render() {
    const { showButton } = this.state;

    const aProduct = {
      _id: 'sdfdsfasdf',
      stock: '122',
      name: 'Mountain Bike',
      price: '10',
      image:
        'https://sc01.alicdn.com/kf/Hf7051724212546b499e1e29e7b2e30ebZ.jpg',
      category: 'mountain',
      discount: 0,
    };

    const SafeCharge = window.SafeCharge;

    var sfc = SafeCharge({
      env: 'int', // the environment you’re running on, if omitted prod is default
      merchantId, //as assigned by Nuvei
      merchantSiteId, // your Merchant Site ID provided by Nuvei
    });
    console.log(`OUTPUT: Products -> render -> sfc`, sfc);

    //Instantiate Nuvei Fields
    var ScFields = sfc.fields({
      fonts: [
        {
          cssUrl: 'https://fonts.googleapis.com/css?family=Source+Code+Pro',
        }, // include your custom fonts
      ],
      locale: 'en', // you can set your users preferred locale, if not provided we will try to autodetect
    });

    // Activate Nuvei Fields
    var style = {
      base: {
        fontFamily: 'Roboto, sans-serif',
        color: '#045d47',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#ccb654',
        },
      },
      invalid: {
        color: '#e5312b',
        ':focus': {
          color: '#303238',
        },
      },
      empty: {
        color: '#BADA55',
        '::placeholder': {
          color: '#cc3ac2',
        },
      },
      valid: {
        color: '#2b8f22',
      },
    };

    var scard = ScFields.create('card', { style: style });
    console.log(`OUTPUT: Products -> render -> scard`, scard);
    showButton &&
      scard.attach(document.getElementById('card-field-placeholder'));


    return (
      <div>
        <section className='product-container'>
          <ProductItemNew
            key={aProduct._id}
            product={aProduct}
          />
        </section>
        <form id='payment-form'>
          <div className='form-row'>
            <label htmlFor='card-field-placeholder'>Credit or debit card</label>
            <br />
            <label htmlFor='cardHolderName'>Name</label>
            <input
              type='text'
              name=''
              id='cardHolderName'
              value={cardHolderName}
              onChange={(e) => this.handleChangeName(e)}
            />
            <br />
            <div>4000027891380961</div>
            <div
              id='card-field-placeholder'
              className='some initial css-classes'
            >
              <div>{}</div>
            </div>
            <div id='scard-errors' role='alert'></div>
          </div>
          <button
            onClick={async (e) => [
              e.preventDefault(),

              console.log(`OUTPUT: Products -> render -> scard`, scard),
              sfc.authenticate3d(
                {
                  sessionToken, //received form opeOrder API
                  userTokenId,
                  clientUniqueId, // optional
                  currency: 'EUR',
                  amount: '10',
                  paymentOption: scard,
                  cardHolderName,
                  billingAddress: {
                    email: "someone@somedomain.com",
                    country: "GB"
                  }
                },
                function (res) {
                  console.log(`OUTPUT: Products -> render -> res`, res);
                  if (res.cancelled === true) {
                    innerText = 'cancelled';
                    Swal.fire(
                      'Cancelled',
                      'Your Payment Process canceled',
                      'error'
                    );
                    console.log(innerText);
                  } else if (res.status === 'ERROR') {
                    Swal.fire('Error', `Error reason: ${res.reason}`, 'error');
                  } else {
                    innerText =
                      res.result + ' - Reference: ' + res.transactionId;
                    
                  }
                  if (res.eci === '2' || res.eci === '5') {
                    var data = JSON.stringify({
                      sessionToken,
                      merchantId,
                      merchantSiteId,
                      clientRequestId: '20200805200408',
                      timeStamp: '20200805200408',
                      checksum:
                        'ec46a8bedde9a414c87bfebfdb3e466a76b8e5c4809e0963e5be6b467655612c',
                      relatedTransactionId: '1110000000007288171',
                      currency: 'EUR',
                      amount: '10',
                      userTokenId,
                      paymentOption: {
                        userPaymentOptionId: res && res.userPaymentOptionId,
                        card: {
                          threeD: {
                            externalMpi: {
                              eci: res && res.eci,
                              threeDProtocolVersion: "2",
                              cavv: res && res.cavv,
                              dsTransID: res && res.dsTransID,
                            },
                          },
                        },
                      },
                      billingAddress: {
                        firstName: 'John',
                        lastName: 'Smith',
                        address: '340689 main St.',
                        city: 'London',
                        country: 'GB',
                        email: 'john.smith@safecharge.com',
                      },
                      deviceDetails: { ipAddress: '93.146.254.172' },
                    });
                    console.log({
                      sessionToken,
                      merchantId,
                      merchantSiteId,
                      clientRequestId: '20200805200408',
                      timeStamp: '20200805200408',
                      checksum:
                        'ec46a8bedde9a414c87bfebfdb3e466a76b8e5c4809e0963e5be6b467655612c',
                      relatedTransactionId: '1110000000007288171',
                      currency: 'EUR',
                      amount: '10',
                      userTokenId,
                      paymentOption: {
                        userPaymentOptionId: res && res.userPaymentOptionId,
                        card: {
                          threeD: {
                            externalMpi: {
                              eci: res && res.eci,
                              threeDProtocolVersion: "2",
                              cavv: res && res.cavv,
                              dsTransID: res && res.dsTransID,
                            },
                          },
                        },
                      },
                      billingAddress: {
                        firstName: 'John',
                        lastName: 'Smith',
                        address: '340689 main St.',
                        city: 'London',
                        country: 'GB',
                        email: 'john.smith@safecharge.com',
                      },
                      deviceDetails: { ipAddress: '93.146.254.172' },
                    });
                    var config = {
                      method: 'post',
                      url: 'https://ppp-test.safecharge.com/ppp/api/payment.do',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      data: data,
                    };
                    axios(config)
                      .then(function (response) {
                        console.log(response.data);
                        if (response && response.data && response.data.transactionStatus === 'ERROR') {
                          Swal.fire('Error', `Error reason: ${response &&  response.data && response.data.gwErrorReason}`, 'error');
                        } 
                      })
                      .catch(function (error) {
                        console.log(error);
                        Swal.fire(
                          'Success!',
                          `Your transaction Id: ${error}`,
                          'success'
                        );
                      });
                  }
                }
              ),
            ]}
          >
            Submit Payment
          </button>
        </form>
        <div>{innerText}</div>
      </div>
    );
  }
}

export default scriptLoader(
  'https://cdn.safecharge.com/safecharge_resources/v1/websdk/safecharge.js'
)(Products);
