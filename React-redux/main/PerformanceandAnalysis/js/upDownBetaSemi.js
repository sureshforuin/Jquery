var seriesLineData = [
    [-7, -6],
    [6.7, 7]
];
var udBetaSemiUpdated = [];
$("#upDownBetaRegression .time-nav").on("click", "a", function(e) {
    e.preventDefault();
    var yearCount = parseInt($(this).attr("data-year"));
    updateUdBetaSemi(yearCount);
    upDownBetaSemiChart.series[0].setData(seriesLineData, true);
    upDownBetaSemiChart.series[1].setData(udBetaSemiUpdated, true);
    var parent = $(this).closest(".time-nav");
    $("> div", parent).removeClass("active");
    $(this).closest("div").addClass("active");
});
var updateUdBetaSemi = function (yearCount) {
    udBetaSemiUpdated = udBetaSemi;
    seriesLineData = [
        [-7, -6],
        [6.7, 7]
    ];
    for(var i = 0; i < udBetaSemi.length; i ++) {
        var value = udBetaSemi[i];
        value[0] *= yearCount;
        value[1] *= yearCount;
        udBetaSemiUpdated[i] = value;
    }
    for(var i = 0; i < seriesLineData.length; i ++) {
        var value = seriesLineData[i];
        value[0] *= yearCount;
        value[1] *= yearCount;
        seriesLineData[i] = value;
    }
};
updateUdBetaSemi(15);

var upDownBetaSemiChart = Highcharts.chart('updownBeta-Semi', {
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
    exporting: {
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

            data: udBetaSemiUpdated,
            marker: {
                symbol: 'circle',
                radius: 7
            }
        }
    ]
});