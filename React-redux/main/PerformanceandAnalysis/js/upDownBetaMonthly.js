var seriesLineData = [
    [-7, -6],
    [6.7, 7]
];
var udBetaMonthlyUpdated = [];
$("#upDownBetaRegression .time-nav").on("click", "a", function(e) {
    e.preventDefault();
    var yearCount = parseInt($(this).attr("data-year"));
    updateUdBetaMonthly(yearCount);
    upDownBetaMonthlyChart.series[0].setData(seriesLineData, true);
    upDownBetaMonthlyChart.series[1].setData(udBetaMonthlyUpdated, true);
    var parent = $(this).closest(".time-nav");
    $("> div", parent).removeClass("active");
    $(this).closest("div").addClass("active");
});
var updateUdBetaMonthly = function (yearCount) {
    udBetaMonthlyUpdated = udBetaMonthly;
    seriesLineData = [
        [-7, -6],
        [6.7, 7]
    ];
    for(var i = 0; i < udBetaMonthly.length; i ++) {
        var value = udBetaMonthly[i];
        value[0] *= yearCount;
        value[1] *= yearCount;
        udBetaMonthlyUpdated[i] = value;
    }
    for(var i = 0; i < seriesLineData.length; i ++) {
        var value = seriesLineData[i];
        value[0] *= yearCount;
        value[1] *= yearCount;
        seriesLineData[i] = value;
    }
};
updateUdBetaMonthly(15);

var upDownBetaMonthlyChart = Highcharts.chart('updownBeta-Monthly', {
    chart: {
        type: 'scatter',
        zoomType: 'xy',
        backgroundColor: "#FAFAFA",
        style: {
            fontFamily: 'pf_dintext_proregular',
            fontSize:'15px'
          },
        
    },
    xAxis: {
        // categories: [''],
        // enabled: false,
        // title: "dsds"
    },
    title: {
        text: ''
    },
    yAxis: {
        title: ""
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    tooltip:{
        enabled: false
    },
    plotOptions: {
        scatter: {
            color: 'red',
            marker: {
                radius: 15,
                states: {
                    hover: {
                        enabled: true,
                        lineColor: 'rgb(100,100,100)'
                    }
                }
            },
            states: {
                hover: {
                    marker: {
                        enabled: false
                    }
                }
            },
            // tooltip: {
            //     headerFormat: '<b>{series.name}</b><br>',
            //     pointFormat: '{point.x} cm, {point.y} kg'
            // }
        }
    },
    series: [{
            type: 'line',
            name: 'Regression Line',
            color: '#BCBCBC',
            data: seriesLineData,
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    lineWidth: 0
                }
            },
            enableMouseTracking: false
        },
        {
            name: '',
            color: 'rgba(15, 142, 199, .75)',

            data: udBetaMonthlyUpdated,
            marker: {
                symbol: 'circle',
                radius: 7
            }
        }
    ]
});