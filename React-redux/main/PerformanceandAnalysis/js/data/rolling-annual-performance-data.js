var alpha =
  /* MSFT historical OHLC data from the Google Finance API */
  [

    [201012, 27.91],
    [201101, 27.72],
    [201102, 26.58],
    [201103, 25.39],
    [201104, 25.92],
    [201105, 25.01],
    [201106, 26.0],
    [201107, 27.4],
    [201108, 26.6],
    [201109, 24.89],
    [201110, 26.63],
    [201111, 25.58],
    [201112, 25.96],
    [201201, 29.53],
    [201202, 31.74],
    [201203, 32.26],
    [201204, 32.02],
    [201205, 29.19],
    [201206, 30.59],
    [201207, 29.47],
    [201208, 30.82],
    [201209, 29.76],
    [201210, 28.54],
    [201211, 26.62],
    [201212, 26.71],
    [201301, 27.45],
    [201302, 27.8],
    [201303, 28.6],
    [201304, 33.1],
    [201305, 34.9],
    [201306, 34.54],
    [201307, 31.84],
    [201308, 33.4],
    [201309, 33.28],
    [201310, 35.4],
    [201311, 38.13],
    [201312, 37.41],
    [201401, 37.84],
    [201402, 38.31],
    [201403, 40.99],
    [201404, 40.4],
    [201405, 40.94],
    [201406, 43.16],
    [201407, 45.43],
    [201408, 46.36],
    [201409, 46.95],
    [201410, 47.81],
    [201411, 46.45],
    [201412, 40.4],
    [201501, 43.85],
    [201502, 40.66],
    [201503, 48.64],
    [201504, 46.86],
    [201505, 44.15],
    [201506, 46.7],
    [201507, 43.52],
    [201508, 44.26],
    [201509, 52.64],
    [201510, 54.35],
    [201511, 55.48],
    [201512, 55.09],
    [201601, 50.88],
    [201602, 55.23],
    [201603, 49.87],
    [201604, 53.0],
    [201605, 51.17],
    [201606, 56.68],
    [201607, 57.46],
    [201608, 57.6],
    [201609, 59.92],
    [201610, 60.26],
    [201611, 62.14],
    [201612, 64.65],
    [201701, 63.98],
    [201702, 65.86],
    [201703, 68.46],
    [201704, 69.84],
    [201705, 68.93],
    [201706, 72.7],
    [201707, 74.77],
    [201708, 74.49],
    [201709, 83.18],
    [201710, 84.17],
    [201711, 85.23],
	[201712, 85.23]
  ]; 
     

    var rollAnnualPerData  = [];
    rollAnnualPerData["ALPHA"] = formChartData(alpha);
    rollAnnualPerData["SANDP"] = formChartData(alpha, true);

    function formChartData(DATA, changeIt = false) {
        var newArray = [];
        for (var i = 0; i < DATA.length; i++) {
            var value = DATA[i];
            var tempVal = changeIt ? value[1] * Math.random() - 100 : value[1];
    
            newArray.push([
                Date.UTC(value[0].toString().substring(0,4), value[0].toString().substring(6,4)),
                tempVal
              ]);
        }
        return newArray;
    }

var benchmarkData = [
    {   
        "benchmarks":"MSCI World Gross (LCL)",
        "inceptionDate":"1998-04-01",
        "geographicFocus":"US, Europe, UK,Emerging Markets", 
        "performance":"10.74%",
        "volatility":"10.74%",
        "type": "favourites"
    },
    {   
        "benchmarks":"S&P 500 TR US",
        "inceptionDate":"1998-04-01",
        "geographicFocus":"US", 
        "performance":"12.17%",
        "volatility":"12.17%",
        "type":"holdings"
    },
    {   
        "benchmarks":"EH Multistrategy Hedge Fund",
        "inceptionDate":"1998-04-01",
        "geographicFocus":"US", 
        "performance":"9.88%",
        "volatility":"9.88%",
        "type":"holdings"
    },
    {   
        "benchmarks":"MSCI ACWI ex US Gross (LCL)",
        "inceptionDate":"1998-04-01",
        "geographicFocus":"US", 
        "performance":"5.17%",
        "volatility":"5.17%",
        "type": "holdings"
    },
    {   
        "benchmarks":"MSCI World Gross (LCL)",
        "inceptionDate":"1998-04-01",
        "geographicFocus":"US, Europe, UK,Emerging Markets", 
        "performance":"10.74%",
        "volatility":"10.74%",
        "type":"none"
    },
    {   
        "benchmarks":"S&P 100 TR US",
        "inceptionDate":"1998-04-01",
        "geographicFocus":"US", 
        "performance":"9.68%",
        "volatility":"9.68%",
        "type":"none"
    }
];