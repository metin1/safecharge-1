import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import scriptLoader from 'react-async-script-loader';
import ProductItemNew from './ProductItemBuy';
import './Product.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import _ from 'lodash';
import sha256 from 'crypto-js/sha256';
// import { adapter } from 'axios-chrome-messaging-adapter2'

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
let methodNotificationUrl = 'http://localhost:3000//parttwo';
let clientRequestId = '20200805200408';
let timeStamp = '20200805200408';
// let methodUrl =''
// let methodPayload =''
// axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';
// const axiosInstance = axios.create({
//   adapter,
// })
class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showButton: false,
      fingerPrint: '',
      methodUrl: '',
      methodPayload: '',
    };

    window.React = React;
    window.ReactDOM = ReactDOM;
  }

  async componentDidMount() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;

    if (isScriptLoaded && isScriptLoadSucceed) {
      this.setState({ showButton: true });
    }
    this.getSession();
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

  openOrder = () => {
    var data2 = JSON.stringify({
      merchantSiteId,
      merchantId,
      clientRequestId,
      timeStamp,
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
        console.log('openOrder: ', response.data);
        sessionToken = response.data && response.data.sessionToken;
        clientUniqueId = response.data && response.data.clientUniqueId;
        // userTokenId = response.data && response.data.userTokenId;
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  getSession = async () => {
    var data = JSON.stringify({
      merchantSiteId,
      merchantId,
      clientRequestId,
      timeStamp,
      checksum:
        '384e81524a728f8b8ed8e9faab59fd9a0ade6edf5a751bc3ddd7e0882f8ec8cc',
    });
    console.log('getSessionToken request:', {
      merchantSiteId,
      merchantId,
      clientRequestId,
      timeStamp,
      checksum:
        '384e81524a728f8b8ed8e9faab59fd9a0ade6edf5a751bc3ddd7e0882f8ec8cc',
    })
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
        console.log('getSessionToken: ', response.data);
        sessionToken = response.data && response.data.sessionToken;
        clientUniqueId = response.data && response.data.clientUniqueId;
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
      clientRequestId,
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
            methodNotificationUrl,
            platformType: '01',
          },
        },
      },
    });

    console.log('initPayment Request: ', {
      merchantSiteId,
      merchantId,
      sessionToken,
      clientRequestId,
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
            methodNotificationUrl,
            platformType: '01',
          },
        },
      },
    })
    var config = {
      method: 'post',
      url: 'https://ppp-test.safecharge.com/ppp/api/initPayment.do',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
    let currentComponent = this;

    axios(config)
      .then(function (response) {
        console.log('initPayment: ', response.data);
        currentComponent.setState({
          methodUrl:
            response.data &&
            response.data.paymentOption &&
            response.data.paymentOption.card &&
            response.data.paymentOption.card.threeD &&
            response.data.paymentOption.card.threeD.methodUrl,
        });
        currentComponent.setState({
          methodPayload:
            response.data &&
            response.data.paymentOption &&
            response.data.paymentOption.card &&
            response.data.paymentOption.card.threeD &&
            response.data.paymentOption.card.threeD.methodPayload,
        });

        currentComponent.handleChangeFinger(
          response.data &&
            response.data.paymentOption &&
            response.data.paymentOption.card &&
            response.data.paymentOption.card.threeD &&
            response.data.paymentOption.card.threeD.methodUrl,
          response.data &&
            response.data.paymentOption &&
            response.data.paymentOption.card &&
            response.data.paymentOption.card.threeD &&
            response.data.paymentOption.card.threeD.methodPayload
        );
        currentComponent.payment(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  getJsonElement = function getJsonElement(json, entry) {
    var value = json;
    _.each(entry.split('.'), function (v) {
      if (value[v] !== undefined) {
        value = value[v];
      } else {
        value = undefined;
        return;
      }
    });
    return value;
  };

  payment = (response) => {
    //Payment

    var data = JSON.stringify({
      sessionToken,
      merchantId,
      merchantSiteId,
      clientRequestId,
      timeStamp,
      checksum:
        'ec46a8bedde9a414c87bfebfdb3e466a76b8e5c4809e0963e5be6b467655612c',
      currency: 'EUR',
      amount: '10',
      relatedTransactionId: response.data.transactionId,
      paymentOption: {
        card: {
          cardNumber,
          cardHolderName,
          expirationMonth,
          expirationYear,
          CVV,
          threeD: {
            methodCompletionInd: 'U',
            version: '2.1.0',
            notificationURL:
              'https://3dsecuresafecharge.000webhostapp.com/3Dv2/notificationUrl.php',
            merchantURL:
              'http://www.The-Merchant-Website-Fully-Quallified-URL.com',
            platformType: '02',
            v2AdditionalParams: {
              challengePreference: '01',
              deliveryEmail:
                'The_Email_Address_The_Merchandise_Was_Delivered@yoyoyo.com',
              deliveryTimeFrame: '03',
              giftCardAmount: '1',
              giftCardCount: '41',
              giftCardCurrency: 'USD',
              preOrderDate: '20220511',
              preOrderPurchaseInd: '02',
              reorderItemsInd: '01',
              shipIndicator: '06',
              rebillExpiry: '20200101',
              rebillFrequency: '13',
              challengeWindowSize: '05',
            },
            browserDetails: {
              acceptHeader: 'text/html,application/xhtml+xml',
              ip: '192.168.1.11',
              javaEnabled: 'TRUE',
              javaScriptEnabled: 'TRUE',
              language: 'EN',
              colorDepth: '48',
              screenHeight: '400',
              screenWidth: '600',
              timeZone: '0',
              userAgent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47',
            },
            account: {
              age: '05',
              lastChangeDate: '20190220',
              lastChangeInd: '04',
              registrationDate: '20190221',
              passwordChangeDate: '20190222',
              resetInd: '01',
              purchasesCount6M: '6',
              addCardAttempts24H: '24',
              transactionsCount24H: '23',
              transactionsCount1Y: '998',
              cardSavedDate: '20190223',
              cardSavedInd: '02',
              addressFirstUseDate: '20190224',
              addressFirstUseInd: '03',
              nameInd: '02',
              suspiciousActivityInd: '01',
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
      shippingAddress: {
        firstName: 'John',
        lastName: 'Smith',
        address: '340689 main St.',
        city: 'London',
        country: 'GB',
        email: 'john.smith@safecharge.com',
      },
      deviceDetails: { ipAddress: '93.146.254.172' },
    });
  
    console.log('Payment Request:  ', {
      sessionToken,
      merchantId,
      merchantSiteId,
      clientRequestId,
      timeStamp,
      checksum:
        'ec46a8bedde9a414c87bfebfdb3e466a76b8e5c4809e0963e5be6b467655612c',
      currency: 'EUR',
      amount: '10',
      relatedTransactionId: response.data.transactionId,
      paymentOption: {
        card: {
          cardNumber,
          cardHolderName,
          expirationMonth,
          expirationYear,
          CVV,
          threeD: {
            methodCompletionInd: 'U',
            version: '2.1.0',
            notificationURL:
              'https://3dsecuresafecharge.000webhostapp.com/3Dv2/notificationUrl.php',
            merchantURL:
              'http://www.The-Merchant-Website-Fully-Quallified-URL.com',
            platformType: '02',
            v2AdditionalParams: {
              challengePreference: '01',
              deliveryEmail:
                'The_Email_Address_The_Merchandise_Was_Delivered@yoyoyo.com',
              deliveryTimeFrame: '03',
              giftCardAmount: '1',
              giftCardCount: '41',
              giftCardCurrency: 'USD',
              preOrderDate: '20220511',
              preOrderPurchaseInd: '02',
              reorderItemsInd: '01',
              shipIndicator: '06',
              rebillExpiry: '20200101',
              rebillFrequency: '13',
              challengeWindowSize: '05',
            },
            browserDetails: {
              acceptHeader: 'text/html,application/xhtml+xml',
              ip: '192.168.1.11',
              javaEnabled: 'TRUE',
              javaScriptEnabled: 'TRUE',
              language: 'EN',
              colorDepth: '48',
              screenHeight: '400',
              screenWidth: '600',
              timeZone: '0',
              userAgent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47',
            },
            account: {
              age: '05',
              lastChangeDate: '20190220',
              lastChangeInd: '04',
              registrationDate: '20190221',
              passwordChangeDate: '20190222',
              resetInd: '01',
              purchasesCount6M: '6',
              addCardAttempts24H: '24',
              transactionsCount24H: '23',
              transactionsCount1Y: '998',
              cardSavedDate: '20190223',
              cardSavedInd: '02',
              addressFirstUseDate: '20190224',
              addressFirstUseInd: '03',
              nameInd: '02',
              suspiciousActivityInd: '01',
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
      shippingAddress: {
        firstName: 'John',
        lastName: 'Smith',
        address: '340689 main St.',
        city: 'London',
        country: 'GB',
        email: 'john.smith@safecharge.com',
      },
      deviceDetails: { ipAddress: '93.146.254.172' },
    })
    var config = {
      method: 'post',
      url: 'https://ppp-test.safecharge.com/ppp/api/payment.do',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
    // console.log(data);
    axios(config)
      .then(function (response) {
        console.log('Payment:  ', response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  getCalculatedChecksum = function getCalculatedChecksum(
    request,
    checkSumKeys
  ) {
    let currentComponent = this;

    // console.log(`OUTPUT: Products -> getCalculatedChecksum -> checkSumKeys`, checkSumKeys)
    // console.log(`OUTPUT: Products -> getCalculatedChecksum -> request`, request)
    var json = JSON.parse(request);
    var merchantKey =
      '5nnEeqGmYtfXfgLOPMAWd6NKIn6DYVdZqFcmti898CUrdvR5ITfrjfQSvgrjpXSe';
    var str = '';
    checkSumKeys.forEach(function (entry) {
      var element = currentComponent.getJsonElement(json, entry);
      if (element !== undefined) {
        var match = element.toString().match(/{{(.*)}}/);
        str += element.toString();
      }
    });
    str += merchantKey;

    var hash = sha256(str).toString();
    // console.log(`OUTPUT: Products -> getCalculatedChecksum -> hash`, hash)

    return hash;
  };

  handleChangeFinger = async (url, data) => {
    const formData = new FormData();
    formData.set('threeDSMethodData', data);

    // console.log(
    //   `OUTPUT: Products -> handleChangeFinger -> this.state.methodPayload`,
    //   url
    // );
    // console.log(
    //   `OUTPUT: Products -> handleChangeFinger -> this.state.methodUrl`,
    //   data
    // );
    // event.preventDefault()
    const config = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      },
    };
    let threeDSMethodData = data;
    const res = await axios.post('/api/finger', { url, threeDSMethodData });
    // const res = await axios.post('/api/finger', formData)
    console.log(`OUTPUT: Products -> handleChangeFinger -> res`, res);
    // await axios.post(url, formData, config).then(response => console.log('finger:', response.data)).catch(error => console.log('error finger: ', error))
    // axios.post(this.state.methodUrl, new FormData(event.target),).then(response => console.log('finger:', response.data)).catch(error => console.log('error finger: ', error))
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
    // console.log(`OUTPUT: Products -> render -> sfc`, sfc);

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

    // this.initialPayment()

    return (
      <div>
        <section className='product-container'>
          <ProductItemNew key={aProduct._id} product={aProduct} />
        </section>
        <form name='frm' method='POST' action={this.state.methodUrl}>
          <input
            type='hidden'
            name='threeDSMethodData'
            value={this.state.methodPayload}
          />
        </form>
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

              setTimeout(() => {
                this.initialPayment();
              }, 1000),
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
