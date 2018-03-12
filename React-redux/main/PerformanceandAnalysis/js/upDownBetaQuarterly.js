var seriesLineData = [
    [-7, -6],
    [6.7, 7]
];
var udBetaQuarterlyUpdated = [];
$("#upDownBetaRegression .time-nav").on("click", "a", function(e) {
    e.preventDefault();
    var yearCount = parseInt($(this).attr("data-year"));
    updateUdBetaQuarterly(yearCount);
    upDownBetaQuarterlyChart.series[0].setData(seriesLineData, true);
    upDownBetaQuarterlyChart.series[1].setData(udBetaQuarterlyUpdated, true);
    var parent = $(this).closest(".time-nav");
    $("> div", parent).removeClass("active");
    $(this).closest("div").addClass("active");
});
var updateUdBetaQuarterly = function (yearCount) {
    udBetaQuarterlyUpdated = udBetaQuarterly;
    seriesLineData = [
        [-7, -6],
        [6.7, 7]
    ];
    for(var i = 0; i < udBetaQuarterly.length; i ++) {
        var value = udBetaQuarterly[i];
        value[0] *= yearCount;
        value[1] *= yearCount;
        udBetaQuarterlyUpdated[i] = value;
    }
    for(var i = 0; i < seriesLineData.length; i ++) {
        var value = seriesLineData[i];
        value[0] *= yearCount;
        value[1] *= yearCount;
        seriesLineData[i] = value;
    }
};
updateUdBetaQuarterly(15);

var upDownBetaQuarterlyChart = Highcharts.chart('updownBeta-Quarterly', {
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
    credits: {
        enabled: false
    },
    legend: {
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

            data: udBetaQuarterlyUpdated,
            marker: {
                symbol: 'circle',
                radius: 7
            }
        }
    ]
});