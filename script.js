/* 
    @author: ajddev
    @name: BTCBRL.COM
    @description: Brasilian Real vs. Satoshi (Historical Performance)

    script.js
*/

// variables
let current_price = 0;

const monthInMilliseconds = 30 * 24 * 60 * 60 * 1000;
const priceArray = [];
const percentArray = [];
const priceSelectorArray = [];
const percentSelectorArray = [];

// elements
const dataTable = document.getElementById("dataTable");
const current = document.querySelector(".current");
const titleText = document.querySelector("title");

// build price and percentage data table
for (let i = 1; i < 11; i++) priceArray.push("yearPrice" + i);
for (let i = 1; i < 11; i++) percentArray.push("yearPercent" + i);
for (let i = 0; i < 10; i++) {
  dataTable.innerHTML += `<tr><td>${i + 1} ano atras </td><td><span id="${
    priceArray[i]
  }">????</span> sats</td><td><span id="${
    percentArray[i]
  }">????</span>%</td></tr>`;
}

for (let i = 0; i < 10; i++)
  priceSelectorArray.push(document.getElementById(priceArray[i]));
for (let i = 0; i < 10; i++)
  percentSelectorArray.push(document.getElementById(percentArray[i]));

// functions
// api call for latest price, update header and document title
function get_latest() {
  const request = new XMLHttpRequest();
  request.open(
    "GET",
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl"
  );
  request.send();
  request.addEventListener("load", function () {
    const data = JSON.parse(this.responseText);
    current_price = (100000000 / data.bitcoin.brl).toFixed(0);
    current.innerHTML = current_price;
    titleText.innerHTML = current_price + " sats";

    wait();
  });
}
// call api with historical dates, update table
function get_historical(date, index) {
  const d = dateFix(date);
  const request = new XMLHttpRequest();
  request.open(
    "GET",
    `https://api.coindesk.com/v1/bpi/historical/close.json?currency=BRL&start=${d}&end=${d}`
  );
  request.send();
  request.addEventListener("load", function () {
    const data = JSON.parse(this.responseText);
    const price = data.bpi[d];
    const percent = 100 - (current_price * 100) / (100000000 / price);
    priceSelectorArray[index - 1].innerHTML = formatDecimals(
      addCommas((100000000 / price).toFixed(0))
    );
    percentSelectorArray[index - 1].innerHTML = formatDecimals(
      String(pos_to_neg(percent.toFixed(3)))
    );
  });
}
// adds - to negative numbers and flips negative to positive
function pos_to_neg(num) {
  if (num <= 0) return "+" + Math.abs(num);
  return -Math.abs(num);
}
// retreive dates for api calls to fill table
function getDate(yearsAgo) {
  let currentTime = new Date(); // unix timestamp in milliseconds
  currentTime.setMonth(currentTime.getMonth() - 12 * yearsAgo);
  return (
    currentTime.getFullYear() +
    "-" +
    (currentTime.getMonth() + 1) +
    "-" +
    currentTime.getDate()
  );
}
// add commas to larger numbers (will be replaced with periods)
function addCommas(nStr) {
  nStr += "";
  let x = nStr.split(".");
  let x1 = x[0];
  let x2 = x.length > 1 ? "." + x[1] : "";
  let rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
}
// replace . with , and vice-versa
function formatDecimals(string) {
  var placeholder = string.replace(/,/g, "@");
  var new_string = placeholder.replace(".", ",");
  new_string = new_string.replace(/@/g, ".");
  return new_string;
}
async function wait() {
  const wait = await initialize();
}
function initialize() {
  return new Promise((resolve) => {
    setTimeout(() => {
      init();
    });
  });
}
function init() {
  for (let i = 1; i < 11; i++) {
    let index = getDate(i);
    get_historical(index, i);
  }
}
// fix dates to full length (e.g. '2012-1-7' becomes '2012-01-07')
const dateFix = function (string) {
  // add 0 to month if necessary
  if (string[7] !== "-") string = string.slice(0, 5) + "0" + string.slice(5);
  // add 0 to day if necessary
  if (string.length === 9) string = string.slice(0, 8) + "0" + string.slice(8);

  return string;
};
// retrieves fixed date from milliseconds
const getDateString = function (dateInMilliseconds) {
  const date = new Date(dateInMilliseconds);
  const dateString =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  return dateFix(dateString);
};
// builds array of dates monthly since start date
const buildMonthArray = function (startDate) {
  const monthArray = [];
  let start = new Date(startDate).getTime();

  // adjusted for EST
  start += 18000000;
  const current = new Date().getTime();

  while (start < current) {
    monthArray.push(getDateString(start));
    start = start + monthInMilliseconds;
  }
  return monthArray;
};

// Latest Price and Table Data
get_latest();

//'2010-07-18' earliest for bitcoin/real
// most data is hardcoded for faster loading but can be verified by changing this date
const arr = buildMonthArray("2022-01-16");
const today = getDateString(new Date().getTime());

// BTC/BRL HISTORICAL CHART
// builds chart after recieving all data
(async () => {
  const data = [
    { x: "2010-07-18", y: 656598818 },
    { x: "2010-08-17", y: 816326531 },
    { x: "2010-09-16", y: 938967136 },
    { x: "2010-10-16", y: 597371565 },
    { x: "2010-11-15", y: 216543958 },
    { x: "2010-12-15", y: 247402276 },
    { x: "2011-01-14", y: 148411992 },
    { x: "2011-02-13", y: 57071111 },
    { x: "2011-03-15", y: 68785252 },
    { x: "2011-04-14", y: 63023886 },
    { x: "2011-05-14", y: 8541752 },
    { x: "2011-06-13", y: 3166020 },
    { x: "2011-07-13", y: 4555643 },
    { x: "2011-08-12", y: 6547331 },
    { x: "2011-09-11", y: 10186204 },
    { x: "2011-10-11", y: 14422314 },
    { x: "2011-11-10", y: 19988806 },
    { x: "2011-12-10", y: 18128093 },
    { x: "2012-01-09", y: 8578610 },
    { x: "2012-02-08", y: 10380659 },
    { x: "2012-03-09", y: 11581178 },
    { x: "2012-04-08", y: 11416437 },
    { x: "2012-05-08", y: 10248737 },
    { x: "2012-06-07", y: 8804910 },
    { x: "2012-07-07", y: 7297033 },
    { x: "2012-08-06", y: 4540378 },
    { x: "2012-09-05", y: 4455355 },
    { x: "2012-10-05", y: 3892883 },
    { x: "2012-11-04", y: 4554398 },
    { x: "2012-12-04", y: 3530051 },
    { x: "2013-01-03", y: 3645471 },
    { x: "2013-02-02", y: 2563176 },
    { x: "2013-03-04", y: 1400411 },
    { x: "2013-04-03", y: 366284 },
    { x: "2013-05-03", y: 507380 },
    { x: "2013-06-02", y: 382026 },
    { x: "2013-07-02", y: 512844 },
    { x: "2013-08-01", y: 455428 },
    { x: "2013-08-31", y: 324328 },
    { x: "2013-09-30", y: 365321 },
    { x: "2013-10-30", y: 235181 },
    { x: "2013-11-29", y: 38248 },
    { x: "2013-12-29", y: 57404 },
    { x: "2014-01-28", y: 49537 },
    { x: "2014-02-27", y: 74571 },
    { x: "2014-03-29", y: 89674 },
    { x: "2014-04-28", y: 102641 },
    { x: "2014-05-28", y: 77964 },
    { x: "2014-06-27", y: 75716 },
    { x: "2014-07-27", y: 75962 },
    { x: "2014-08-26", y: 85953 },
    { x: "2014-09-25", y: 100982 },
    { x: "2014-10-25", y: 116735 },
    { x: "2014-11-24", y: 105106 },
    { x: "2014-12-24", y: 115415 },
    { x: "2015-01-23", y: 166270 },
    { x: "2015-02-22", y: 148024 },
    { x: "2015-03-24", y: 129267 },
    { x: "2015-04-23", y: 142303 },
    { x: "2015-05-23", y: 135572 },
    { x: "2015-06-22", y: 131243 },
    { x: "2015-07-22", y: 112844 },
    { x: "2015-08-21", y: 123290 },
    { x: "2015-09-20", y: 109819 },
    { x: "2015-10-20", y: 94723 },
    { x: "2015-11-19", y: 81602 },
    { x: "2015-12-19", y: 54534 },
    { x: "2016-01-18", y: 63986 },
    { x: "2016-02-17", y: 60272 },
    { x: "2016-03-18", y: 67312 },
    { x: "2016-04-17", y: 66149 },
    { x: "2016-05-17", y: 62894 },
    { x: "2016-06-16", y: 37539 },
    { x: "2016-07-16", y: 46006 },
    { x: "2016-08-15", y: 55303 },
    { x: "2016-09-14", y: 49383 },
    { x: "2016-10-14", y: 48899 },
    { x: "2016-11-13", y: 41942 },
    { x: "2016-12-13", y: 38596 },
    { x: "2017-01-12", y: 39079 },
    { x: "2017-02-11", y: 31785 },
    { x: "2017-03-13", y: 25511 },
    { x: "2017-04-12", y: 26291 },
    { x: "2017-05-12", y: 19100 },
    { x: "2017-06-11", y: 10215 },
    { x: "2017-07-11", y: 13175 },
    { x: "2017-08-10", y: 9141 },
    { x: "2017-09-09", y: 7548 },
    { x: "2017-10-09", y: 6571 },
    { x: "2017-11-08", y: 4119 },
    { x: "2017-12-08", y: 1892 },
    { x: "2018-01-07", y: 1914 },
    { x: "2018-02-06", y: 4014 },
    { x: "2018-03-08", y: 3291 },
    { x: "2018-04-07", y: 4303 },
    { x: "2018-05-07", y: 3006 },
    { x: "2018-06-06", y: 3394 },
    { x: "2018-07-06", y: 3921 },
    { x: "2018-08-05", y: 3840 },
    { x: "2018-09-04", y: 3267 },
    { x: "2018-10-04", y: 3936 },
    { x: "2018-11-03", y: 4264 },
    { x: "2018-12-03", y: 6750 },
    { x: "2019-01-02", y: 6677 },
    { x: "2019-02-01", y: 7878 },
    { x: "2019-03-03", y: 6934 },
    { x: "2019-04-02", y: 5286 },
    { x: "2019-05-02", y: 4581 },
    { x: "2019-06-01", y: 2979 },
    { x: "2019-07-01", y: 2456 },
    { x: "2019-07-31", y: 2599 },
    { x: "2019-08-30", y: 2516 },
    { x: "2019-09-29", y: 2982 },
    { x: "2019-10-29", y: 2650 },
    { x: "2019-11-28", y: 3207 },
    { x: "2019-12-28", y: 3379 },
    { x: "2020-01-27", y: 2670 },
    { x: "2020-02-26", y: 2556 },
    { x: "2020-03-27", y: 2927 },
    { x: "2020-04-26", y: 2352 },
    { x: "2020-05-26", y: 2071 },
    { x: "2020-06-25", y: 2016 },
    { x: "2020-07-25", y: 1991 },
    { x: "2020-08-24", y: 1515 },
    { x: "2020-09-23", y: 1839 },
    { x: "2020-10-23", y: 1375 },
    { x: "2020-11-22", y: 1009 },
    { x: "2020-12-22", y: 814 },
    { x: "2021-01-21", y: 606 },
    { x: "2021-02-20", y: 332 },
    { x: "2021-03-22", y: 336 },
    { x: "2021-04-21", y: 334 },
    { x: "2021-05-21", y: 499 },
    { x: "2021-06-20", y: 551 },
    { x: "2021-07-20", y: 643 },
    { x: "2021-08-19", y: 395 },
    { x: "2021-09-18", y: 391 },
    { x: "2021-10-18", y: 292 },
    { x: "2021-11-17", y: 300 },
    { x: "2021-12-17", y: 380 },
  ];

  for (let i = 0; i < arr.length; i++) {
    let res = await fetch(
      `https://api.coindesk.com/v1/bpi/historical/close.json?currency=BRL&start=${arr[i]}&end=${arr[i]}`
    );
    let result1 = await res.json();
    data.push({ x: arr[i], y: (100000000 / result1.bpi[arr[i]]).toFixed(0) });
  }
  data.push({ x: today, y: current_price });

  let labelFormatter = function (value) {
    let val = Math.abs(value);
    if (val >= 1000000 && val < 1000000000) {
      val = (val / 1000000).toFixed(1) + " M";
    }
    if (val >= 1000000000) {
      val = (val / 1000000000).toFixed(1) + " B";
    }
    return val + " sats";
  };

  let options = {
    chart: {
      width: "100%",
      height: "400",
      type: "area",
      zoom: {
        enabled: true,
      },
      toolbar: {
        show: true,
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
    },

    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },

    series: [
      {
        name: "BRL/SAT",
        data: data,
      },
    ],

    markers: {
      size: 0,
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: [
      {
        min: 1,
        max: 200000000,
        tickAmount: 4,
        logarithmic: true,
        seriesName: "reais",
        labels: {
          formatter: labelFormatter,
        },
      },
    ],
    fill: {
      type: "image",
      image: {
        src: ["real.jpg"],
        width: "100", // optional
        height: "370", //optional
      },
    },
    title: {
      text: "BRL/BTC Performance Histórica",
      align: "center",
      offsetX: 35,
      style: {
        color: "#000",
        fontWeight: "bold",
      },
    },
    colors: ["#000"],
    stroke: {
      curve: "straight",
      width: 0,
    },
  };

  let chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
  document.getElementById("message").classList.add("hidden");
})();
