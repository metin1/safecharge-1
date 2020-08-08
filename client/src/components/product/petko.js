function Petka() {
  let petka = {};
  Date.prototype.timestamp = function () {
      var yy = this.getFullYear();
      var mm = ("0" + (this.getMonth() + 1)).toString().slice(-2); // getMonth() is zero-based
      var dd = ("0" + this.getDate()).toString().slice(-2);
      var hh = ("0" + this.getHours()).toString().slice(-2);
      var MM = ("0" + this.getMinutes()).toString().slice(-2);
      var ss = ("0" + this.getSeconds()).toString().slice(-2);
      return yy + mm + dd + hh + MM + ss;
  };
  petka.getTimeStamp = function getTimeStamp() {
      return new Date().timestamp();
  };
  petka.getClientUniqueId = function getClientUniqueId(request) {
      var json = JSON.parse(request.data);
      return json.clientRequestId !== undefined && json.clientRequestId !== "{{clientRequestId}}" ? json.clientRequestId : new Date().timestamp();
  };
  petka.getCalculatedChecksum = function getCalculatedChecksum(request, checkSumKeys) {
      var json = JSON.parse(request.data);
      var merchantKey = postman.getEnvironmentVariable('merchantKey');
      var str = "";
      checkSumKeys.forEach(function (entry) {
          var element = petka.getJsonElement(json, entry);
          if (element !== undefined) {
              var match = element.toString().match(/{{(.*)}}/);
              str += (match !== null ? postman.getEnvironmentVariable(match[1]) : element.toString());
          }
      });
      str += merchantKey;
      // Use the CryptoJS
      var hash; // this variable is for debuging purposes
      if (postman.getEnvironmentVariable('useSha256') === "true") {
          hash = CryptoJS.SHA256(str).toString();
      } else {
          hash = CryptoJS.MD5(str).toString();
      }
      return hash;
  };
  petka.getJsonElement = function getJsonElement(json, entry) {
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
  // https://github.com/postmanlabs/postman-app-support/issues/882
  petka.tests = function tests() {
      var helpers = {};
      helpers.responseCode = function (tests, responseCode) {
          tests["Returned  response code is \"" + responseCode + "\""] = responseCode === 200;
          return tests;
      };
      helpers.status = function (tests, json) {
          tests["Returned status is \"" + json.status + "\""] = json.status == "SUCCESS";
          return tests;
      };
      helpers.version = function (tests, json) {
          tests["Returned version is \"" + json.version + "\""] = json.version === "1.0";
          return tests;
      };
      helpers.sessionToken = function (tests, json) {
          tests["Returned sessionToken is \"" + json.sessionToken + "\""] = json.sessionToken !== undefined;
          return tests;
      };
      helpers.schema = function (tests, json, schema) {
          result = tv4.validate(json, schemas[schema]);
          tests["Returned schema validation is \"" + tv4.error + "\""] =
              result;
          return tests;
      };
      return helpers;
  }();
  var schemas = {
      "getSessionToken": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "getSessionToken",
          "description": "getSessionToken json schema",
          "type": "object",
          "additionalProperties": false,
          "properties": {
              "sessionToken": {
                  "type": "string"
              },
              "internalRequestId": {
                  "type": "integer"
              },
              "status": {
                  "type": "string"
              },
              "errCode": {
                  "type": "integer"
              },
              "reason": {
                  "type": "string"
              },
              "merchantId": {
                  "type": "string"
              },
              "merchantSiteId": {
                  "type": "string"
              },
              "version": {
                  "type": "string"
              },
              "clientRequestId": {
                  "type": "string"
              },
          },
          "required": ["sessionToken", "internalRequestId", "status", "errCode", "reason", "merchantId", "merchantSiteId", "version", "clientRequestId"]
      },
      "cardTokenization": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "cardTokenization",
          "description": "cardTokenization json schema",
          "type": "object",
          "additionalProperties": false,
          "properties": {
              "sessionToken": {
                  "type": "string"
              },
              "internalRequestId": {
                  "type": "integer"
              },
              "status": {
                  "type": "string"
              },
              "errCode": {
                  "type": "integer"
              },
              "reason": {
                  "type": "string"
              },
              "version": {
                  "type": "string"
              },
              "ccTempToken": {
                  "type": "string"
              },
          },
          "required": ["sessionToken", "internalRequestId", "status", "errCode", "reason", "version", "ccTempToken"]
      },
      "paymentCC": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "paymentCC",
          "description": "paymentCC json schema",
          "type": "object",
          "additionalProperties": false,
          "properties": {
              "sessionToken": {
                  "type": "string"
              },
              "orderId": {
                  "type": "string"
              },
              "merchantId": {
                  "type": "string"
              },
              "merchantSiteId": {
                  "type": "string"
              },
              "userTokenId": {
                  "type": "string"
              },
              "clientUniqueId": {
                  "type": "string"
              },
              "clientRequestId": {
                  "type": "string"
              },
              "internalRequestId": {
                  "type": "integer"
              },
              "status": {
                  "type": "string"
              },
              "transactionStatus": {
                  "type": "string"
              },
              "errCode": {
                  "type": "integer"
              },
              "reason": {
                  "type": "string"
              },
              "gwErrorCode": {
                  "type": "integer"
              },
              "gwErrorReason": {
                  "type": "string"
              },
              "gwExtendedErrorCode": {
                  "type": "integer"
              },
              "version": {
                  "type": "string"
              },
              "userPaymentOptionId": {
                  "type": "string"
              },
              "externalTransactionId": {
                  "type": "string"
              },
              "transactionId": {
                  "type": "string"
              },
              "authCode": {
                  "type": "string"
              },
              "externalToken": {
                  "additionalProperties": false,
                  "type": "object",
                  "properties": {
                      "externalToken_blockedCard": {
                          "type": "string"
                      },
                      "externalToken_cardAcquirerId": {
                          "type": "string"
                      },
                      "externalToken_cardAcquirerName": {
                          "type": "string"
                      },
                      "externalToken_cardBin": {
                          "type": "string"
                      },
                      "externalToken_cardBrandId": {
                          "type": "string"
                      },
                      "externalToken_cardBrandName": {
                          "type": "string"
                      },
                      "externalToken_cardExpiration": {
                          "type": "string"
                      },
                      "externalToken_cardLength": {
                          "type": "string"
                      },
                      "externalToken_cardMask": {
                          "type": "string"
                      },
                      "externalToken_cardName": {
                          "type": "string"
                      },
                      "externalToken_cardTypeId": {
                          "type": "string"
                      },
                      "externalToken_cardTypeName": {
                          "type": "string"
                      },
                      "externalToken_clubName": {
                          "type": "string"
                      },
                      "externalToken_creditCompanyId": {
                          "type": "string"
                      },
                      "externalToken_creditCompanyName": {
                          "type": "string"
                      },
                      "externalToken_extendedCardType": {
                          "type": "string"
                      },
                      "externalToken_Indication": {
                          "type": "string"
                      },
                      "externalToken_tokenValue": {
                          "type": "string"
                      },
                      "externalToken_tokenProvider": {
                          "type": "string"
                      }
                  },
                  "required": ["externalToken_blockedCard", "externalToken_cardAcquirerId", "externalToken_cardAcquirerName", "externalToken_cardBin", "externalToken_cardBrandId", "externalToken_cardBrandName", "externalToken_cardExpiration", "externalToken_cardLength", "externalToken_cardMask", "externalToken_cardName", "externalToken_cardTypeId", "externalToken_cardTypeName", "externalToken_clubName", "externalToken_creditCompanyId", "externalToken_creditCompanyName", "externalToken_extendedCardType", "externalToken_Indication", "externalToken_tokenValue", "externalToken_tokenProvider"]
              },
              "partialApprovalDetails": {
                  "additionalProperties": false,
                  "type": "object",
                  "properties": {
                      "isPartialApproval": {
                          "type": "string"
                      },
                      "amountInfo": {
                          "additionalProperties": false,
                          "type": "object",
                          "properties": {
                              "requestedAmount": {
                                  "type": "string"
                              },
                              "requestedCurrency": {
                                  "type": "string"
                              },
                              "processedAmount": {
                                  "type": "string"
                              },
                              "processedCurrency": {
                                  "type": "string"
                              }
                          },
                          "required": ["requestedAmount", "requestedCurrency", "processedAmount", "processedCurrency"]
                      }
                  },
                  "required": ["isPartialApproval", "amountInfo"]
              }
          },
          "required": ["orderId", "transactionStatus", "gwErrorCode", "gwExtendedErrorCode", "userPaymentOptionId", "transactionId", "authCode", "sessionToken", "clientUniqueId", "internalRequestId", "status", "errCode", "reason", "merchantId", "merchantSiteId", "version", "clientRequestId"]
      },
      "settleTransaction": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "settleTransaction",
          "description": "settleTransaction json schema",
          "type": "object",
          "additionalProperties": false,
          "properties": {
              "merchantId": {
                  "type": "string"
              },
              "merchantSiteId": {
                  "type": "string"
              },
              "internalRequestId": {
                  "type": "integer"
              },
              "clientUniqueId": {
                  "type": "string"
              },
              "clientRequestId": {
                  "type": "string"
              },
              "transactionId": {
                  "type": "string"
              },
              "externalTransactionId": {
                  "type": "string"
              },
              "status": {
                  "type": "string"
              },
              "transactionStatus": {
                  "type": "string"
              },
              "authCode": {
                  "type": "string"
              },
              "errCode": {
                  "type": "integer"
              },
              "reason": {
                  "type": "string"
              },
              "paymentMethodErrorCode": {
                  "type": "integer"
              },
              "paymentMethodErrorReason": {
                  "type": "string"
              },
              "gwErrorCode": {
                  "type": "integer"
              },
              "gwErrorReason": {
                  "type": "string"
              },
              "gwExtendedErrorCode": {
                  "type": "integer"
              },
              "version": {
                  "type": "string"
              },
          },
          "required": ["transactionId", "gwErrorCode", "gwExtendedErrorCode", "transactionStatus", "authCode", "clientUniqueId", "internalRequestId", "status", "errCode", "reason", "merchantId", "merchantSiteId", "version", "clientRequestId"]
      },
      "refundTransaction": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "refundTransaction",
          "description": "refundTransaction json schema",
          "type": "object",
          "additionalProperties": false,
          "properties": {
              "merchantId": {
                  "type": "string"
              },
              "merchantSiteId": {
                  "type": "string"
              },
              "internalRequestId": {
                  "type": "integer"
              },
              "clientUniqueId": {
                  "type": "string"
              },
              "clientRequestId": {
                  "type": "string"
              },
              "transactionId": {
                  "type": "string"
              },
              "externalTransactionId": {
                  "type": "string"
              },
              "status": {
                  "type": "string"
              },
              "transactionStatus": {
                  "type": "string"
              },
              "authCode": {
                  "type": "string"
              },
              "errCode": {
                  "type": "integer"
              },
              "reason": {
                  "type": "string"
              },
              "paymentMethodErrorCode": {
                  "type": "integer"
              },
              "paymentMethodErrorReason": {
                  "type": "string"
              },
              "gwErrorCode": {
                  "type": "integer"
              },
              "gwErrorReason": {
                  "type": "string"
              },
              "gwExtendedErrorCode": {
                  "type": "integer"
              },
              "version": {
                  "type": "string"
              },
          },
          "required": ["transactionId", "gwErrorCode", "gwExtendedErrorCode", "transactionStatus", "authCode", "clientUniqueId", "internalRequestId", "status", "errCode", "reason", "merchantId", "merchantSiteId", "version", "clientRequestId"]
      },
      "voidTransaction": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "voidTransaction",
          "description": "voidTransaction json schema",
          "type": "object",
          "additionalProperties": false,
          "properties": {
              "merchantId": {
                  "type": "string"
              },
              "merchantSiteId": {
                  "type": "string"
              },
              "internalRequestId": {
                  "type": "integer"
              },
              "clientUniqueId": {
                  "type": "string"
              },
              "clientRequestId": {
                  "type": "string"
              },
              "transactionId": {
                  "type": "string"
              },
              "externalTransactionId": {
                  "type": "string"
              },
              "status": {
                  "type": "string"
              },
              "transactionStatus": {
                  "type": "string"
              },
              "authCode": {
                  "type": "string"
              },
              "errCode": {
                  "type": "integer"
              },
              "reason": {
                  "type": "string"
              },
              "paymentMethodErrorCode": {
                  "type": "integer"
              },
              "paymentMethodErrorReason": {
                  "type": "string"
              },
              "gwErrorCode": {
                  "type": "integer"
              },
              "gwErrorReason": {
                  "type": "string"
              },
              "gwExtendedErrorCode": {
                  "type": "integer"
              },
              "version": {
                  "type": "string"
              },
          },
          "required": ["transactionId", "gwErrorCode", "gwExtendedErrorCode", "transactionStatus", "authCode", "clientUniqueId", "internalRequestId", "status", "errCode", "reason", "merchantId", "merchantSiteId", "version", "clientRequestId"]
      },
      "getSubscriptions": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "getSubscriptions",
          "description": "getSubscriptions json schema",
          "type": "object",
          "additionalProperties": false,
          "properties": {
              "subscriptions": {
                  "type": "array",
                  "items": {
                      "additionalProperties": false,
                      "type": "object",
                      "properties": {
                          "subscriptionId": {
                              "type": "string"
                          },
                          "productId": {
                              "type": "string"
                          },
                          "productName": {
                              "type": "string"
                          },
                          "recurringAmount": {
                              "type": "string"
                          },
                          "initialAmount": {
                              "type": "string"
                          },
                          "currency": {
                              "type": "string"
                          },
                          "userTokenId": {
                              "type": "string"
                          },
                          "userPaymentOptionId": {
                              "type": "string"
                          },
                          "cardType": {
                              "type": "string"
                          },
                          "cardNumber": {
                              "type": "string"
                          },
                          "cardHolderName": {
                              "type": "string"
                          }
                      },
                      "required": ["subscriptionId",
                          "productId",
                          "productName",
                          "recurringAmount",
                          "initialAmount",
                          "currency",
                          "userTokenId",
                          "userPaymentOptionId",
                          "cardType",
                          "cardNumber",
                          "cardHolderName"
                      ]
                  }
              },
              "internalRequestId": {
                  "type": "integer"
              },
              "status": {
                  "type": "string"
              },
              "errCode": {
                  "type": "integer"
              },
              "reason": {
                  "type": "string"
              },
              "merchantId": {
                  "type": "string"
              },
              "merchantSiteId": {
                  "type": "string"
              },
              "version": {
                  "type": "string"
              },
              "clientRequestId": {
                  "type": "string"
              },
          },
          "required": ["subscriptions",
              "internalRequestId",
              "status",
              "errCode",
              "reason",
              "merchantId",
              "merchantSiteId",
              "version",
              "clientRequestId"
          ]
      },
      "getSubscriptionsList": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "getSubscriptionsList",
          "description": "getSubscriptionsList json schema",
          "id": "http://example.com/example.json",
          "properties": {
              "clientRequestId": {
                  "id": "/properties/clientRequestId",
                  "type": "string"
              },
              "errCode": {
                  "id": "/properties/errCode",
                  "type": "integer"
              },
              "internalRequestId": {
                  "id": "/properties/internalRequestId",
                  "type": "integer"
              },
              "merchantId": {
                  "id": "/properties/merchantId",
                  "type": "string"
              },
              "merchantSiteId": {
                  "id": "/properties/merchantSiteId",
                  "type": "string"
              },
              "reason": {
                  "id": "/properties/reason",
                  "type": "string"
              },
              "status": {
                  "id": "/properties/status",
                  "type": "string"
              },
              "subscriptionsList": {
                  "additionalItems": false,
                  "id": "/properties/subscriptionsList",
                  "items": {
                      "id": "/properties/subscriptionsList/items",
                      "properties": {
                          "subscriptionCreateDate": {
                              "id": "/properties/subscriptionsList/items/properties/subscriptionCreateDate",
                              "type": "string"
                          },
                          "subscriptionId": {
                              "id": "/properties/subscriptionsList/items/properties/subscriptionId",
                              "type": "integer"
                          },
                          "subscriptionPlanId": {
                              "id": "/properties/subscriptionsList/items/properties/subscriptionPlanId",
                              "type": "integer"
                          },
                          "subscriptionStatus": {
                              "id": "/properties/subscriptionsList/items/properties/subscriptionStatus",
                              "type": "string"
                          },
                          "userPaymentOption": {
                              "id": "/properties/subscriptionsList/items/properties/userPaymentOption",
                              "properties": {
                                  "billingAddress": {
                                      "id": "/properties/subscriptionsList/items/properties/userPaymentOption/properties/billingAddress",
                                      "properties": {},
                                      "type": "object"
                                  },
                                  "expiryDate": {
                                      "id": "/properties/subscriptionsList/items/properties/userPaymentOption/properties/expiryDate",
                                      "type": "string"
                                  },
                                  "paymentMethodName": {
                                      "id": "/properties/subscriptionsList/items/properties/userPaymentOption/properties/paymentMethodName",
                                      "type": "string"
                                  },
                                  "upoData": {
                                      "id": "/properties/subscriptionsList/items/properties/userPaymentOption/properties/upoData",
                                      "properties": {
                                          "bin": {
                                              "id": "/properties/subscriptionsList/items/properties/userPaymentOption/properties/upoData/properties/bin",
                                              "type": "string"
                                          },
                                          "brand": {
                                              "id": "/properties/subscriptionsList/items/properties/userPaymentOption/properties/upoData/properties/brand",
                                              "type": "string"
                                          },
                                          "cardType": {
                                              "id": "/properties/subscriptionsList/items/properties/userPaymentOption/properties/upoData/properties/cardType",
                                              "type": "string"
                                          },
                                          "ccCardNumber": {
                                              "id": "/properties/subscriptionsList/items/properties/userPaymentOption/properties/upoData/properties/ccCardNumber",
                                              "type": "string"
                                          },
                                          "ccExpMonth": {
                                              "id": "/properties/subscriptionsList/items/properties/userPaymentOption/properties/upoData/properties/ccExpMonth",
                                              "type": "string"
                                          },
                                          "ccExpYear": {
                                              "id": "/properties/subscriptionsList/items/properties/userPaymentOption/properties/upoData/properties/ccExpYear",
                                              "type": "string"
                                          },
                                          "ccNameOnCard": {
                                              "id": "/properties/subscriptionsList/items/properties/userPaymentOption/properties/upoData/properties/ccNameOnCard",
                                              "type": "string"
                                          },
                                          "uniqueCC": {
                                              "id": "/properties/subscriptionsList/items/properties/userPaymentOption/properties/upoData/properties/uniqueCC",
                                              "type": "string"
                                          }
                                      },
                                      "required": [
                                          "bin",
                                          "ccExpMonth",
                                          "brand",
                                          "uniqueCC",
                                          "cardType",
                                          "ccCardNumber",
                                          "ccExpYear",
                                          "ccNameOnCard"
                                      ],
                                      "type": "object"
                                  },
                                  "upoName": {
                                      "id": "/properties/subscriptionsList/items/properties/userPaymentOption/properties/upoName",
                                      "type": "string"
                                  },
                                  "upoStatus": {
                                      "id": "/properties/subscriptionsList/items/properties/userPaymentOption/properties/upoStatus",
                                      "type": "string"
                                  },
                                  "userPaymentOptionId": {
                                      "id": "/properties/subscriptionsList/items/properties/userPaymentOption/properties/userPaymentOptionId",
                                      "type": "integer"
                                  }
                              },
                              "required": [
                                  "upoStatus",
                                  "upoData",
                                  "userPaymentOptionId",
                                  "expiryDate",
                                  "upoName",
                                  "billingAddress",
                                  "paymentMethodName"
                              ],
                              "type": "object"
                          },
                          "userTokenId": {
                              "id": "/properties/subscriptionsList/items/properties/userTokenId",
                              "type": "string"
                          }
                      },
                      "required": [
                          "subscriptionCreateDate",
                          "userTokenId",
                          "subscriptionStatus",
                          "userPaymentOption",
                          "subscriptionId",
                          "subscriptionPlanId"
                      ],
                      "type": "object"
                  },
                  "type": "array",
                  "uniqueItems": true
              },
              "totalCount": {
                  "id": "/properties/totalCount",
                  "type": "integer"
              },
              "version": {
                  "id": "/properties/version",
                  "type": "string"
              }
          },
          "required": [
              "status",
              "clientRequestId",
              "internalRequestId",
              "errCode",
              "subscriptionsList",
              "totalCount",
              "reason",
              "version",
              "merchantSiteId",
              "merchantId"
          ],
          "type": "object"
      },
      "getSubscriptionPlans": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "getSubscriptionPlans",
          "description": "getSubscriptionPlans json schema",
          "type": "object",
          "additionalProperties": false,
          "properties": {
              "clientRequestId": {
                  "type": "string"
              },
              "errCode": {
                  "type": "integer"
              },
              "internalRequestId": {
                  "type": "integer"
              },
              "merchantId": {
                  "type": "string"
              },
              "merchantSiteId": {
                  "type": "string"
              },
              "reason": {
                  "type": "string"
              },
              "status": {
                  "type": "string"
              },
              "subscriptionPlans": {
                  "additionalItems": false,
                  "items": {
                      "properties": {
                          "subscriptionPlanId": {
                              "type": "integer"
                          },
                          "productName": {
                              "type": "string"
                          },
                          "currency": {
                              "type": "string"
                          },
                          "initialAmount": {
                              "type": "string"
                          },
                          "rebillAmount": {
                              "type": "string"
                          },
                          "startUnit": {
                              "type": "string"
                          },
                          "startUnitValue": {
                              "type": "string"
                          },
                          "recurrungUnit": {
                              "type": "string"
                          },
                          "recurringUnitValue": {
                              "type": "string"
                          },
                          "endUnit": {
                              "type": "string"
                          },
                          "endUnitValue": {
                              "type": "string"
                          }
                      },
                      "required": [
                          "subscriptionPlanId",
                          "productName",
                          "currency",
                          "initialAmount",
                          "rebillAmount",
                          "startUnit",
                          "startUnitValue",
                          "recurrungUnit",
                          "recurringUnitValue",
                          "endUnit",
                          "endUnitValue"
                      ],
                      "type": "object"
                  },
                  "type": "array",
                  "uniqueItems": true
              },
              "version": {
                  "type": "string"
              }
          },
          "required": [
              "status",
              "clientRequestId",
              "internalRequestId",
              "errCode",
              "subscriptionPlans",
              "reason",
              "version",
              "merchantId"
          ],
      },
      "cancelSubscription": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "cancelSubscription",
          "description": "cancelSubscription json schema",
          "type": "object",
          "additionalProperties": false,
          "properties": {
              "internalRequestId": {
                  "type": "integer"
              },
              "status": {
                  "type": "string"
              },
              "errCode": {
                  "type": "integer"
              },
              "reason": {
                  "type": "string"
              },
              "merchantId": {
                  "type": "string"
              },
              "merchantSiteId": {
                  "type": "string"
              },
              "version": {
                  "type": "string"
              },
              "clientRequestId": {
                  "type": "string"
              },
          },
          "required": ["internalRequestId",
              "status",
              "errCode",
              "reason",
              "merchantId",
              "merchantSiteId",
              "version",
              "clientRequestId"
          ]
      }
  };
  //return this;
  return petka;
}; Petka();