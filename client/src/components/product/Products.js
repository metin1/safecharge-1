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
        // userTokenId = response.data && response.data.userTokenId;
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
  handleChange = (e) => {
    cardNumber = e.target.value;
    if (cardNumber.length === 16) {
    }
  };
  handleChangeExpMonth = (e) => {
    expirationMonth = e.target.value;
  };
  handleChangeExpYear = (e) => {
    expirationYear = e.target.value;
  };
  handleChangeCvs = (e) => {
    CVV = e.target.value;
  };

  getSession = async () => {
    var data = JSON.stringify({
      merchantSiteId,
      merchantId,
      clientRequestId: '20200805200408',
      timeStamp: '20200805200408',
      checksum:
        '384e81524a728f8b8ed8e9faab59fd9a0ade6edf5a751bc3ddd7e0882f8ec8cc',
    });

    var config = {
      method: 'post',
      url: 'https://ppp-test.safecharge.com/ppp/api/getSessionToken.do',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  initialPayment = async () => {
    var data = JSON.stringify({
      merchantSiteId,
      merchantId,
      sessionToken,
      clientRequestId: '20200805200408',
      currency: 'EUR',
      amount: '10',
      userTokenId,
      paymentOption: {
        card: {
          cardNumber,
          cardHolderName,
          expirationMonth,
          expirationYear,
          CVV,
          threeD: {
            methodNotificationUrl: 'www.ThisIsAMethodNotificationURL.com',
            platformType: '01',
          },
        },
      },
    });

    var config = {
      method: 'post',
      url: 'https://ppp-test.safecharge.com/ppp/api/initPayment.do',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  render() {
    const { showButton } = this.state;

    const aProduct = {
      _id: 'sdfdsfasdf',
      stock: '122',
      name: 'Mountain Bike',
      price: '120',
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

    // var scard = ScFields.create('card', { style: style });
    // console.log(`OUTPUT: Products -> render -> scard`, scard);
    // showButton &&
    //   scard.attach(document.getElementById('card-field-placeholder'));

    const paymentOption = {
      card: {
        cardNumber,
        cardHolderName,
        expirationMonth,
        expirationYear,
        CVV,
        // threeD: {
        //   methodCompletionInd: 'Y',
        //   version: '2',
        //   notificationURL:
        //     'http://wwww.Test-Notification-URL-After-The-Challange-Is-Complete-Which-Recieves-The-CRes-Message.com',
        //   merchantURL:
        //     'http://www.The-Merchant-Website-Fully-Quallified-URL.com',
        //   platformType: '02',
        //   v2AdditionalParams: {
        //     challengePreference: '01',
        //     deliveryEmail:
        //       'The_Email_Address_The_Merchandise_Was_Delivered@yoyoyo.com',
        //     deliveryTimeFrame: '03',
        //     giftCardAmount: '1',
        //     giftCardCount: '41',
        //     giftCardCurrency: 'USD',
        //     preOrderDate: '20220511',
        //     preOrderPurchaseInd: '02',
        //     reorderItemsInd: '01',
        //     shipIndicator: '06',
        //     rebillExpiry: '20200101',
        //     rebillFrequency: '13',
        //     challengeWindowSize: '05',
        //   },
        //   browserDetails: {
        //     acceptHeader: 'text/html,application/xhtml+xml',
        //     ip: '192.168.1.11',
        //     javaEnabled: 'TRUE',
        //     javaScriptEnabled: 'TRUE',
        //     language: 'EN',
        //     colorDepth: '48',
        //     screenHeight: '400',
        //     screenWidth: '600',
        //     timeZone: '0',
        //     userAgent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47',
        //   },
        //   account: {
        //     age: '05',
        //     lastChangeDate: '20190220',
        //     lastChangeInd: '04',
        //     registrationDate: '20190221',
        //     passwordChangeDate: '20190222',
        //     resetInd: '01',
        //     purchasesCount6M: '6',
        //     addCardAttempts24H: '24',
        //     transactionsCount24H: '23',
        //     transactionsCount1Y: '998',
        //     cardSavedDate: '20190223',
        //     cardSavedInd: '02',
        //     addressFirstUseDate: '20190224',
        //     addressFirstUseInd: '03',
        //     nameInd: '02',
        //     suspiciousActivityInd: '01',
        //   },
        // },
      },
    };

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
            <label htmlFor='cardHolderName'>Card No:</label>
            <input
              type='text'
              name=''
              id='cardNumber'
              value={cardNumber}
              onChange={(e) => this.handleChange(e)}
            />
            <label htmlFor='cardHolderName'>Exp Month:</label>
            <input
              type='text'
              name=''
              id='expirationMonth'
              value={expirationMonth}
              onChange={(e) => this.handleChangeExpMonth(e)}
            />
            <label htmlFor='cardHolderName'>Exp Year:</label>
            <input
              type='text'
              name=''
              id='expirationYear'
              value={expirationYear}
              onChange={(e) => this.handleChangeExpYear(e)}
            />
            <label htmlFor='cardHolderName'>CVS:</label>
            <input
              type='text'
              name=''
              id='CVV'
              value={CVV}
              onChange={(e) => this.handleChangeCvs(e)}
            />
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
              // await this.getSession(),
              // await this.initialPayment(),
              sfc.authenticate3d(
                {
                  sessionToken, //received form opeOrder API
                  // merchantId,
                  // merchantSiteId,
                  userTokenId,
                  clientUniqueId, // optional
                  currency: 'EUR',
                  amount: '10',
                  // paymentOption: scard,
                  // cardHolderName,
                  paymentOption: {
                    card: {
                    cardNumber,
                    cardHolderName,
                    expirationMonth,
                    expirationYear,
                    CVV
                  }},
                },
                function (res) {
                  console.log(`OUTPUT: Products -> render -> res`, res);
                  // console.log(res.paymentOption && res.paymentOption.threeD); // the structure containing the CVV and ECI
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
