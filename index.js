var axios = require('axios');
var _ = require('lodash');
var moment = require('moment');

const _ONE_MINUTE = 60000;
let firstTradeTime = 0;


function buildGraph(trade, firstTradeTime) {
  return buildCandlesPereod(trade, firstTradeTime, _ONE_MINUTE)
}

function buildCandlesPereod(trade, firstTradeTime, pereod) {
  const candels = _.filter(buildCandelByTimePereod(trade, firstTradeTime, pereod), 'price');

  pickHighestAndLowest(candels);
  
  // console.log(candels);
         
}

var index = 0;
var candels = [];
var oneMinute = _ONE_MINUTE

function buildCandelByTimePereod(trade, firstTradeTime, pereod) {
  let firstDate = new moment(firstTradeTime * 1000);

  if (new moment(trade.timestamp * 1000) <=  firstDate.add(index || 1, 'minute')) {
    candels = candels.concat({
      index,
      price: trade.price
    })
  } else {
    index++
  }

  return candels;
}

function pickHighestAndLowest(collection) {
  _.reduce(collection, iteratee, collection[0]);

  function iteratee(result, collection) {
    if (result.index === collection.index) {
      console.log(result.index);
      if (result.price < collection.price) {
        return {
          index: collection.index,
          price: collection.price
        }
      }
    } else {
      console.log(result);
      return collection;
    }
    // console.log(result, collection)
    // return collection;
  }
}

function pickLowest() {

}

axios.get('https://yobit.net/api/3/trades/btc_usd?limit=200')
  .then((resp) => _.sortBy(resp.data['btc_usd'], 'timestamp'))
  .then((sorted) => {
    sorted.forEach(trade => {
      console.log(buildGraph(trade, sorted[0].timestamp));
    });
  })
  .catch((e) => {
    console.log(e)
  })
