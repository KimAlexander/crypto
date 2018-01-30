const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');

let index = 1;

function buildGraph(trades, firstTradeTime) {
  const periods = buildCandlesPeriod(trades, firstTradeTime);

  // pickHighestAndLowest(periods);
}

function buildCandlesPeriod(trades, firstTradeTime) {
  tradesByPeriods = {
    1: []
  }

  trades.forEach(trade => {
    const byTime = buildCandleByTimePeriod(trade, firstTradeTime);

    if (tradesByPeriods[byTime.index]) {
      tradesByPeriods[byTime.index] = tradesByPeriods[byTime.index].concat(byTime.price);
    } else {
      tradesByPeriods[byTime.index] = [];
      tradesByPeriods[byTime.index] = tradesByPeriods[byTime.index].concat(byTime.price);
    }
  });

  let filtered = {}

   _.forEach(tradesByPeriods, (p, i) => {
    filtered[i] = [];
    filtered[i] = filtered[i].concat(_.min(p));
    filtered[i] = filtered[i].concat(_.max(p));
  })

  console.log(filtered)
  return filtered;
}

// function compileTradePeriods (periods, byTimeCompiled, minute) {
//   if (periods[byTimeCompiled.minutes]) {
//     periods[byTimeCompiled.minutes] = periods[byTimeCompiled.minutes].concat(byTimeCompiled.price);
//   }
// }

function buildCandleByTimePeriod(trade, firstTradeTime) {
  let firstDate = new moment(firstTradeTime * 1000);

  if (new moment(trade.timestamp * 1000) <=  firstDate.add(index, 'minute')) {
    return {
      index,
      price: trade.price,
      timestamp: trade.timestamp
    };
  } else {
    return buildCandleByTimePeriod(trade, trade.timestamp, index++)
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
