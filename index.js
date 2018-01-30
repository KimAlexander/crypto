const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
let index = 0;

function buildGraph(trades, firstTradeTime) {
  const periods = buildCandlesPeriod(trades, firstTradeTime);

  pickHighestAndLowest(periods);
}

function buildCandlesPeriod(trades, firstTradeTime) {
  let periods = [];

  trades.forEach(trade => {
    periods = periods.concat(buildCandleByTimePeriod(trade, firstTradeTime));
  });

  return _.filter(periods, 'price')
}

function buildCandleByTimePeriod(trade, firstTradeTime) {
  let firstDate = new moment(firstTradeTime * 1000);

  if (new moment(trade.timestamp * 1000) <=  firstDate.add(index ? index + 1 : 1, 'minute')) {
    return {
      index,
      price: trade.price,
      timestamp: trade.timestamp
    }; 
  } else {
    index++
  }
}

function pickHighestAndLowest(collection) {
  console.log(_.reduce(collection, iteratee, {
    price: collection[0].price,
    index: 0,
    hight: 0,
    low: 0
  }));

  function iteratee(initial, element) {
    if (initial.price < element.price) {
      return {
        index: element.index,
        price: element.price,
        hight: element.index,
        low: element.price
      }
    }
    else {
      return {
        index: element.index,
        price: initial.price,
        hight: initial.index,
        low: element.price
      }
    }
  }
}


axios.get('https://yobit.net/api/3/trades/btc_usd?limit=1500')
  .then((resp) => _.sortBy(resp.data['btc_usd'], 'timestamp'))
  .then((sorted) => {
    buildGraph(sorted, sorted[0].timestamp);
  })
  .catch((e) => {
    console.log(e)
  })
