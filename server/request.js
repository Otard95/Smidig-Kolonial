/*jshint esversion: 6 */
/*jshint node: true */

const request = require('request');
const conf    = require('../configs/tokens.json');

function getProduct(url) {
  let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': conf.kolonial.user_agent,
    'X-Client-Token': conf.kolonial.token
  };

  let options = {
    url,
    headers
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    } else {
      console.log(error);
    }
  }

  request(options, callback);
}

let urlI = `https://kolonial.no/api/v1/products/9329/`;

getProduct(urlI);
