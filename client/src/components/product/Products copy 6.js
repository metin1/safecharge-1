import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import scriptLoader from 'react-async-script-loader';
import ProductItemNew from './ProductItemBuy';
import './Product.css';
import axios from 'axios';
import safecharge from 'safecharge';

let sessionToken = '';
let clientUniqueId = '';
let userTokenId = '';
let innerText = '';

let merchantSiteId= '205758'
let merchantId= '5779192833181891488'
let cardNumber = '4000027891380961'
let cardHolderName= 'FL-BRW1'
let expirationMonth =  '12'
let expirationYear =  '25'
let cardCvs = '217'
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

    var data = JSON.stringify({
      merchantSiteId,
      merchantId,
      clientRequestId: '20200805204212',
      timeStamp: '20200805204212',
      checksum:
        '281ab613c1a0c0166057f8c5d0edbb43bbe55d837eaec39631ac0b711a267f0e',
    });

    var config = {
      method: 'post',
      url: 'https://ppp-test.safecharge.com/ppp/api/getSessionToken.do',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };


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
        userTokenId = response.data && response.data.userTokenId;
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

  handleChange = (e) =>{
    cardNumber= e.target.value
    if (cardNumber.length===16) {

    }
  }
  handleChangeExpMonth = (e) =>{
    expirationMonth= e.target.value
  }
  handleChangeExpYear = (e) =>{
    expirationYear= e.target.value
  }
  handleChangeCvs = (e) =>{
    cardCvs= e.target.value
  }


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
        <form action={(e) => e.preventDefault()} id='payment-form'>
          <div className='form-row'>
            <label htmlFor='card-field-placeholder'>Credit or debit card</label>
            <br />
            <label htmlFor='cardHolderName' >Name</label>
            <input type='text' name='' id='cardHolderName' value={cardHolderName} />
            <br/>
            <label htmlFor='cardHolderName'>Card No:</label>
            <input type='text' name='' id='cardNumber' value={cardNumber}  onChange={(e)=>this.handleChange(e)} />
            <label htmlFor='cardHolderName'>Exp Month:</label>
            <input type='text' name='' id='expirationMonth' value={expirationMonth}  onChange={(e)=>this.handleChangeExpMonth(e)} />
            <label htmlFor='cardHolderName'>Exp Year:</label>
            <input type='text' name='' id='expirationYear' value={expirationYear}  onChange={(e)=>this.handleChangeExpYear(e)} />
            <label htmlFor='cardHolderName'>CVS:</label>
            <input type='text' name='' id='cardCvs' value={cardCvs}  onChange={(e)=>this.handleChangeCvs(e)} />
            <div
              id='card-field-placeholder'
              className='some initial css-classes'
            >
              {/*<!-- SFC Card widget will be inserted here. -->*/}
              <div>{}</div>
            </div>
            {/*<!-- Used to display form errors. -->*/}
            <div id='scard-errors' role='alert'></div>
          </div>
          <button
            onClick={(e) => [
              e.preventDefault(),
            
              sfc.authenticate3d({
                sessionToken, //received form opeOrder API
                merchantId,
                merchantSiteId,
                userTokenId,
                clientUniqueId, // optional
                currency: "EUR",
                amount: "150",
                paymentOption,
            }, function(res) {
                console.log(`OUTPUT: Products -> render -> res`, res)
                console.log(res.paymentOption && res.paymentOption.threeD); // the structure containing the CVV and ECI
                if (res.cancelled === true) {
                    innerText = 'cancelled';
                } else {
                    innerText = res.transactionStatus + ' - Reference: ' + res.transactionId;
                }
            }),
              // sfc.authenticate3d(
              //   {
              //     sessionToken,
              //     // sessionToken: this.state.sessionToken,
              //     // userTokenId: 'someone@site.com', // optional
              //     userTokenId,
              //     clientUniqueId,
              //     currency: 'EUR',
              //     amount: '120',
              //     paymentOption: {
              //       card: {
              //           cardNumber: "5111426646345761",
              //           cardHolderName: 'card holder name',
              //           expirationMonth: "12",
              //           expirationYear: "25",
              //           CVV: "217"
              //       },
              //     },
              //     cardHolderName: 'card holder name',
              //     billingAddress: {
              //       email: 'someone@somedomain.com',
              //       country: 'GB',
              //     },
              //   },
              //   function (result) {
              //     console.log(result);
              //   }
              // ),
              //   sfc.createPayment({
              //     "sessionToken": sessionToken, //received from openOrder API
              //     "merchantId": '1475082432483184221', //as assigned by Nuvei
              //     "merchantSiteId": '184941', //as assigned by Nuvei
              //     "userTokenId": "230811147",
              //     "clientUniqueId": "695701003", // optional
              //     "currency": "EUR",
              //     "amount": "500",
              //     "paymentOption": {
              //         "card": {
              //             "cardNumber": "5111426646345761",
              //             "cardHolderName": document.getElementById('example1-name').value,
              //             "expirationMonth": "12",
              //             "expirationYear": "25",
              //             "CVV": "217"
              //         },
              //         "billingAddress": {
              //             "email": "someone@somedomain.com",
              //             "county": "GB"
              //         }

              //     }
              //   }, function(res) {
              //       console.log(res)
              //       if (res.cancelled === true) {
              //           example.querySelector('.token').innerText = 'cancelled';
              //       } else {
              //           example.querySelector('.token').innerText = res.transactionStatus +
              //               ' - Reference: ' + res.transactionId;
              //       }
              //       example.classList.add('submitted');
              //   })
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
