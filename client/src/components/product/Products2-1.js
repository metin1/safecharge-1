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
var scard = ''

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
    var data = JSON.stringify({
      merchantSiteId,
      merchantId,
      clientRequestId,
      timeStamp,
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
        console.log('getSessionToken: ', response.data);
        setSessionToken(response.data && response.data.sessionToken);
        setClientUniqueId(response.data && response.data.clientUniqueId);
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


  if (showButton && initailLoad) {
    scard = ScFields.create('card', {
      style: style
    });
    scard.attach(document.getElementById('card-field-placeholder'));
    console.log(`OUTPUT: showButton`, showButton)
    console.log(`OUTPUT: scard`, scard)
    setInitailLoad(false)
  }

  function authenticate3d() {
    console.log('scard: ', scard)
    console.log('ScFields: ', ScFields)
    setTimeout(() => {
      sfc.authenticate3d({
        "sessionToken": sessionToken,
        "userTokenId": userTokenId,
        "clientUniqueId": clientUniqueId, // optional
        "currency": "USD",
        "amount": "10",
        "cardHolderName": cardHolderName,
        "paymentOption": scard,
        "billingAddress": {
          "email": "someone@somedomain.com",
          "country": "GB"
        }
      }, function(result) {
        console.log('authenticate3d: ', result)
        
      })
    }, 500);
  }


  
  function createPayment() {
    console.log(scard)
    setTimeout(() => {
      sfc.createPayment({
        "sessionToken": sessionToken,
        "userTokenId": userTokenId,
        "clientUniqueId": clientUniqueId, // optional
        "currency": "USD",
        "amount": "10",
        "cardHolderName": cardHolderName,
        "paymentOption": scard,
        "billingAddress": {
          "email": "someone@somedomain.com",
          "country": "GB"
        }
      }, function(res) {
        console.log('createPayment:', res)
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
      <form action="/charge" method="post" id="payment-form">
        <table>
          <tbody>
            <tr>
              <td>Session Id</td>
              <td><input type="text" id="session" name="session" value={session} onChange={(e)=>setSession(e.target.value)} /> </td>
            </tr>
            <tr>
              <td>Cardholer Name</td>
              <td><input type="text" id="cardHolderName" name="cardHolderName" value={cardHolderName} onChange={(e)=>setCardHolderName(e.target.value)} /></td>
            </tr>
          </tbody>
        </table>
        <br/>
        <div className="form-row" style={{maxWidth: "380px"}}>
          <label htmlFor="card-field-placeholder2">
            Credit or debit card: Sample:4000027891380961
          </label>
          <div id="card-field-placeholder" className="some initial css-classes">

          </div>

          <div id="scard-errors" role="alert">
          </div>
        </div>
      </form>
      <button onClick={async ()=> [createPayment(), authenticate3d()]}>Submit Payment</button>
    </div>  
  )
}

export default scriptLoader(
  'https://cdn.safecharge.com/safecharge_resources/v1/websdk/safecharge.js'
)(Products1)

