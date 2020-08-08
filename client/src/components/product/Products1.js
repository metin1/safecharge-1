import React, { useEffect, useState } from "react";
import scriptLoader from "react-async-script-loader";
import "./Product.css";
import axios from 'axios';
import Swal from 'sweetalert2';

// Scenario	Amount	Cardholder Name	Card Number
// Frictionless	150	FL-BRW1	4000020951595032
// Challenge	151	CL-BRW2	2221008123677736
// Fallback	152	John Smith	4012001036275556
// non-3D	10	Jane Smith	4000027891380961

const Products1 = (props) => {

  const [showButton, setShowButton] = useState(false)
  const [sessionToken, setSessionToken] = useState('')
  const [clientUniqueId, setClientUniqueId] = useState('123456')
  const [userTokenId, setUserTokenId] = useState('someone@site.com')
  const [innerText, setİnnerText] = useState('')
  const [merchantSiteId, setMerchantSiteId] = useState('205758')
  const [merchantId, setMerchantId] = useState('5779192833181891488')
  // const [cardNumber, setCardNumber] = useState('4000027891380961')
  const [cardHolderName, setCardHolderName] = useState('FL-BRW1')
//  const [cardHolderName, setCardHolderName] = useState('CL-BRW1')
  const [expirationMonth, setExpirationMonth] = useState('12')
  const [expirationYear, setExpirationYear] = useState('25')
  const [CVV, setCVV] = useState('217')
  const [methodNotificationUrl, setMethodNotificationUrl] = useState('http://localhost:3000//parttwo')
  const [clientRequestId, setClientRequestId] = useState('20200805200408')
  const [timeStamp, setTimeStamp] = useState('20200805200408')
  const [initailLoad, setInitailLoad] = useState(true)
  

  useEffect(() => {
    const { isScriptLoaded, isScriptLoadSucceed } = props;
    console.log(`OUTPUT: props`, props)

    if (isScriptLoaded && isScriptLoadSucceed) {
      setShowButton(true)

    }
  }, [props.isScriptLoaded,props.isScriptLoadSucceed])


  useEffect(() => {
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

    console.log('openOrder request: ', {
      merchantSiteId,
      merchantId,
      clientRequestId,
      timeStamp,
      checksum:
        'ec46a8bedde9a414c87bfebfdb3e466a76b8e5c4809e0963e5be6b467655612c',
      amount: '10',
      currency: 'EUR',
      billingAddress: { email: 'someone@somedomain.com', county: 'GB' },
    })
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
        console.log('openOrder', response.data);
        // console.log('openOrder', JSON.stringify(response.data));
        setSessionToken(response.data && response.data.sessionToken);
        setClientUniqueId( response.data && response.data.clientUniqueId);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [])

  const SafeCharge = window.SafeCharge;

  var sfc = SafeCharge({
    env: 'int', 
    merchantId: '5779192833181891488', 
    merchantSiteId: '205758' 
  });

  var ScFields = sfc.fields({
    fonts: [{
        cssUrl: 'https://fonts.googleapis.com/css?family=Source+Code+Pro'
      }, 
    ],
    locale: 'en' 
  });

  var ScFieldStyles = {
      base: {
          color: '#32325D',
          fontWeight: 500,
          fontFamily: 'Roboto, Consolas, Menlo, monospace',
          fontSize: '16px',
          fontSmoothing: 'antialiased',

          '::placeholder': {
              color: '#CFD7DF',
          },
          ':-webkit-autofill': {
              color: '#e39f48',
          },
      },
      invalid: {
          color: '#E25950',

          '::placeholder': {
              color: '#FFCCA5',
          },
      },
  };

  var ScFieldClasses = {
    focus: 'focused',
    empty: 'empty',
    invalid: 'invalid',
    complete: 'complete',  
  };

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

  // var scard = ''
  var cardNumber = ''
  var cardExpiry = ''
  var cardCvc = ''

  if (showButton && initailLoad) {
    // scard = ScFields.create('card', {
    //   style: style
    // });
    cardNumber = ScFields.create('ccNumber', {
      style: ScFieldStyles,
      classes: ScFieldClasses,
    });
    cardNumber.attach('#card-number');
  
    cardExpiry = ScFields.create('ccExpiration', {
        style: ScFieldStyles,
        classes: ScFieldClasses,
    });
    cardExpiry.attach('#card-expiry');
  
    cardCvc = ScFields.create('ccCvc', {
        style: ScFieldStyles,
        classes: ScFieldClasses,
    });
    cardCvc.attach('#card-cvc');

    // scard.attach(document.getElementById('card-field-placeholder'));
    console.log(`OUTPUT: showButton`, showButton)
    console.log(`OUTPUT: scard`, cardNumber)
    setInitailLoad(false)
  }


  function createPayment() {
    console.log(cardNumber)
    setTimeout(() => {
      sfc.createPayment({
        "sessionToken": sessionToken,
        "userTokenId": userTokenId,
        "clientUniqueId": clientUniqueId, // optional
        "currency": "USD",
        "amount": "10",
        "cardHolderName": cardHolderName,
        "paymentOption": cardNumber,
        "billingAddress": {
          "email": "someone@somedomain.com",
          "country": "GB"
        }
      }, function(res) {
        console.log('createPayment:', res)
      })
    }, 500);
  }

  function authenticate3d() {
    console.log(cardNumber)
    console.log(`OUTPUT: functionauthenticate3d -> sfc`, sfc)
    
    setTimeout(() => {
      sfc.authenticate3d({
        "sessionToken": sessionToken,
        "userTokenId": userTokenId,
        "clientUniqueId": clientUniqueId, // optional
        "currency": "USD",
        "amount": "10",
        "cardHolderName": cardHolderName,
        "paymentOption": cardNumber,
        "billingAddress": {
          "email": "someone@somedomain.com",
          "country": "GB"
        }
      }, function(result) {
        console.log('authenticate3d: ', result)
        sfc.getToken(cardNumber).then(function(result) {
          console.log(`OUTPUT: result`, result)
          // Stop progress animation!
          if (result.status === 'SUCCESS') {
              console.log(`OUTPUT: SUCCESS`)
              // use result.paymentOption. to pass on to the /payment API method
          } else {
              // Otherwise, re-enable input. Handle error
      
          }
        });
      })
    }, 500);
    
  }


  

  const [methodUrl, setMethodUrl] = useState('')
  const [methodPayload, setMethodPayload] = useState('')
  const [session, setSession] = useState('')
  return (
    <div>
    <form name='frm' method='POST' action={methodUrl}>
      <input
        type='hidden'
        name='threeDSMethodData'
        value={methodPayload}
      />
    </form>
    <div>methodUrl: {methodUrl}</div>
    <div>methodPayload: {methodPayload}</div>
      <label htmlFor="card-field-placeholder2">
        Credit or debit card: {cardNumber} Sample:4000027891380961
      </label>
      <form action="/charge" method="post" id="payment-form">
        <div className="row">
          <div className="field">
            <div id="card-number" className="input"></div>
            <label htmlFor="card-number" data-tid="scwsdk.form.card_number_label">
              Card number
            </label>
            <div className="underline"></div>
          </div>
        </div>
        <div className="row">
          <div className="field col6">
            <div id="card-expiry" className="input empty"></div>
            <label htmlFor="card-expiry" data-tid="scwsdk.form.card_expiry_label">
              Expiration
            </label>
            <div className="underline "></div>
          </div>
          <div className="field col6">
            <div id="card-cvc" className="input empty"></div>
            <label for="card-cvc" data-tid="scwsdk.form.card_cvc_label">
              CVC
            </label>
            <div className="underline "></div>
          </div>
        </div>
      </form>
      <button onClick={()=>authenticate3d()}>Submit Payment</button>
    </div>  
  )
}

export default scriptLoader(
  'https://cdn.safecharge.com/safecharge_resources/v1/websdk/safecharge.js'
)(Products1)

