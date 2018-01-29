var axios = require('axios');
var _ = require('lodash');

const _ONE_MINUTE = 60000;
let firstTradeTime = 0;


function buildCandle(trade, firstTradeTime) {
  console.log(trade, firstTradeTime);
}

function pickHighest() {

}

function pickLowest() {

}

axios.get('https://yobit.net/api/3/trades/btc_usd?limit=1999')
  .then((resp) => _.sortBy(resp.data['btc_usd'], 'timestamp'))
  .then((sorted) => {
    // console.log(sorted.length)
    sorted.forEach(trade => {
      buildCandle(trade, sorted[0].timestamp);  
    });
  })
  .catch((e) => {
    console.log(e)
  })
