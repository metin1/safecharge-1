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

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showButton: false,
      // sessionToken: "",
    };

    window.React = React;
    window.ReactDOM = ReactDOM;
  }

  async componentDidMount() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;

    if (isScriptLoaded && isScriptLoadSucceed) {
      this.setState({ showButton: true });
      // console.log(`OUTPUT: Products -> componentDidMount -> this.props`, this.props)
    }

    var data = JSON.stringify({
      merchantSiteId: '205758',
      merchantId: '5779192833181891488',
      clientRequestId: '20200805204212',
      timeStamp: '20200805204212',
      checksum:
        '281ab613c1a0c0166057f8c5d0edbb43bbe55d837eaec39631ac0b711a267f0e',

      // merchantSiteId: '205758',
      // merchantId: '5779192833181891488',
      // clientRequestId: '20200805185114',
      // timeStamp: '20200805185114',
      // checksum:
      //   '788c68665d041b5429deded1635a094fef6982417f574af32770c402c8b37d2a',
    });

    var config = {
      method: 'post',
      url: 'https://ppp-test.safecharge.com/ppp/api/getSessionToken.do',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
    // var axios = require('axios');
    // var data2 = JSON.stringify({"merchantSiteId":"205758","merchantId":"5779192833181891488","clientRequestId":"20200805185114","timeStamp":"20200805185114","checksum":"788c68665d041b5429deded1635a094fef6982417f574af32770c402c8b37d2a","amount":"120","currency":"EUR","billingAddress":{"email":"someone@somedomain.com","county":"GB"}});

    var data2 = JSON.stringify({
      merchantSiteId: '205758',
      merchantId: '5779192833181891488',
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

    const ress = await axios.post('/api/payment/open-payment')
    console.log(`OUTPUT: Products -> componentDidMount -> ress`, ress.data)

    axios(config2)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        console.log(response.data);
        sessionToken = response.data && response.data.sessionToken;
        clientUniqueId = response.data && response.data.clientUniqueId;
        userTokenId = response.data && response.data.userTokenId;
        axios(config)
          .then(function (response) {
            // console.log(JSON.stringify(response.data));
            console.log(response.data);
            // this.state.setState({sessionToken:response.data && response.data.sessionToken})
            // sessionToken = response.data && response.data.sessionToken
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });

    var data3 = JSON.stringify({
      merchantSiteId: '205758',
      merchantId: '5779192833181891488',
      sessionToken: 'f25c1f27-eb01-4543-a9cb-1c79259a56d4',
      clientRequestId: '20200805204213',
      currency: 'USD',
      amount: '150',
      userTokenId: 'asdasd',
      paymentOption: {
        card: {
          cardNumber: '5111426646345761',
          cardHolderName: 'FL-BRW1',
          expirationMonth: '12',
          expirationYear: '25',
          CVV: '217',
          threeD: {
            methodNotificationUrl: 'www.ThisIsAMethodNotificationURL.com',
            platformType: '01',
          },
        },
      },
    });

    var config3 = {
      method: 'post',
      url: 'https://ppp-test.safecharge.com/ppp/api/initPayment.do',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data3,
    };

    axios(config3)
      .then(function (response) {
        console.log(response.data);
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
        // console.log(window)
      }
    }
  }

  handleOnClick = () => {
    var data = JSON.stringify({
      sessionToken: 'f25c1f27-eb01-4543-a9cb-1c79259a56d4',
      merchantId: '5779192833181891488',
      merchantSiteId: '205758',
      clientRequestId: '20200805204213',
      timeStamp: '20200805204213',
      checksum:
        '6aa1bb820c954e9051119498d50a230694b80f3b8dfec42e1f5bc19201662140',
      currency: 'EUR',
      amount: '150',
      relatedTransactionId: '1110000000007284853',
      paymentOption: {
        card: {
          cardNumber: '5111426646345761',
          cardHolderName: 'CL-BRW1',
          expirationMonth: '12',
          expirationYear: '25',
          CVV: '217',
          threeD: {
            methodCompletionInd: 'U',
            version: '2.1.0',
            notificationURL:
              'http://wwww.Test-Notification-URL-After-The-Challange-Is-Complete-Which-Recieves-The-CRes-Message.com',
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

    var config = {
      method: 'post',
      url: 'https://ppp-test.safecharge.com/ppp/api/authorize3d.do',
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
      merchantId: '5779192833181891488', //as assigned by Nuvei
      merchantSiteId: '205758', // your Merchant Site ID provided by Nuvei
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

    // function main() {
    // call authenticate3d
    // sfc.authenticate3d(
    //   {
    //     sessionToken,
    //     // sessionToken: this.state.sessionToken,
    //     // userTokenId: 'someone@site.com', // optional
    //     userTokenId,
    //     clientUniqueId,
    //     currency: 'EUR',
    //     amount: '120',
    //     paymentOption: scard,
    //     // cardHolderName: document.getElementById('cardHolderName') && document.getElementById('cardHolderName').value,
    //     // billingAddress: {
    //     //   email: 'someone@somedomain.com',
    //     //   country: 'GB',
    //     // },
    //   },
    //   function (result) {
    //     console.log(result);
    //   }
    // )

    // }

    // scard.on('ready', function (evt) {
    //   console.log('on sfcCard ready', evt);
    // });

    const paymentOption = {
      card: {
        cardNumber: '5111426646345761',
        cardHolderName: 'CL-BRW1',
        expirationMonth: '12',
        expirationYear: '25',
        CVV: '217',
        threeD: {
          methodCompletionInd: 'U',
          version: '{{threeDVersion}}',
          notificationURL:
            'http://wwww.Test-Notification-URL-After-The-Challange-Is-Complete-Which-Recieves-The-CRes-Message.com',
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
    };
    // const paymentOption =
    // {
    //     card: {
    //         cardNumber: "4000020951595032",
    //         cardHolderName: "CL-BRW1",
    //         expirationMonth: "12",
    //         expirationYear: "25",
    //         CVV: "217",
    //         threeD: {
    //             methodNotificationUrl: "www.ThisIsAMethodNotificationURL.com",
    //             platformType: "01"
    //         }
    //     }
    // }
    return (
      <div>
        <section className='product-container'>
          <ProductItemNew
            key={aProduct._id}
            handleOnClick={(e) => {
              this.handleOnClickUn(e, aProduct._id, aProduct.stock);
            }}
            product={aProduct}
          />
        </section>
        {/*<form action="/charge" method="post" id="payment-form">*/}
        <form action={(e) => e.preventDefault()} id='payment-form'>
          <div className='form-row'>
            <label htmlFor='card-field-placeholder'>Credit or debit card</label>
            <br />
            <label htmlFor='cardHolderName'>Name</label>
            <input type='text' name='' id='cardHolderName' />
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
              // this.handleOnClick(),
              // console.log(
              //   window.cardNumber
              // ),
              // console.log(
              //   document.getElementsByClassName('inputField') &&
              //   document.getElementsByClassName('inputField')[0] &&
              //   document.getElementsByClassName('inputField')[0].value
              // ),

              //   sfc.getToken(cardNumber).then(function(result) {
              //     // Stop progress animation!
              //     if (result.status === 'SUCCESS') {
              //         // use result.paymentOption. to pass on to the /payment API method
              //     } else {
              //         // Otherwise, re-enable input. Handle error

              //     }
              // }),

              sfc.createPayment(
                {
                  sessionToken,
                  // sessionToken: this.state.sessionToken,
                  // userTokenId: '230811147',
                  userTokenId,
                  clientUniqueId, // optional
                  currency: 'EUR',
                  amount: '120',
                  cardHolderName: 'card_holder',
                  paymentOption,
                  // paymentOption:
                  // document.getElementsByClassName('inputField') &&
                  // document.getElementsByClassName('inputField')[0] &&
                  // document.getElementsByClassName('inputField')[0].value,
                  // paymentOption: {
                  //   card: {
                  //       cardNumber: "5111426646345761",
                  //       cardHolderName: 'card holder name',
                  //       expirationMonth: "12",
                  //       expirationYear: "25",
                  //       CVV: "217"
                  //   },
                  // },
                  billingAddress: {
                    email: 'someone@somedomain.com',
                    country: 'GB',
                  },
                },
                function (res) {
                  console.log(res);
                }
              ),
              //   sfc.authenticate3d({
              //     sessionToken: sessionToken, //received form opeOrder API

              //     merchantId:"5779192833181891488",
              //     merchantSiteId:"205758",
              //     // merchantId: '1475082432483184221', //as assigned by Nuvei
              //     // merchantSiteId: '184941', //as assigned by Nuvei
              //     userTokenId,
              //     clientUniqueId, // optional
              //     currency: "EUR",
              //     amount: "120",
              //     paymentOption,
              //     // paymentOption: {
              //     //     card: {
              //     //         cardNumber: "5111426646345761",
              //     //         cardHolderName: "name",
              //     //         expirationMonth: "12",
              //     //         expirationYear: "25",
              //     //         CVV: "217"
              //     //     },
              //     //     billingAddress: {
              //     //         email: "someone@somedomain.com",
              //     //         county: "GB"
              //     //     }

              //     // }
              // }, function(res) {
              //     console.log(`OUTPUT: Products -> render -> res`, res)
              //     console.log(res.paymentOption && res.paymentOption.threeD); // the structure containing the CVV and ECI
              //     if (res.cancelled === true) {
              //         innerText = 'cancelled';
              //     } else {
              //         innerText = res.transactionStatus + ' - Reference: ' + res.transactionId;
              //     }
              //     // example.classList.add('submitted');
              // }),
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
