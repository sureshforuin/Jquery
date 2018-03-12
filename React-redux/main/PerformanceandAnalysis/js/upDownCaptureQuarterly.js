var seriesData = [{
    name: 'Up Capture',
    data: [0.3],
    color: "#0F8EC7"

}, {
    name: 'Down Capture',
    data: [-.5],
    color: "#005C8F"
},
{
    name: 'Up Up',
    data: [.3],
    color: "#E3D7AB"
},
{
    name: 'Down Down',
    data: [.9],
    color: "#C9B160"
}
];
$("#upDownCapture .time-nav").on("click", "a", function(e) {
    e.preventDefault();
    var yearCount = parseInt($(this).attr("data-year"));
    calSeriesData(yearCount);
    for (var j = 0; j < upDownQuarterlyChart.series.length; j++) {
        upDownQuarterlyChart.series[j].setData(seriesData[j].data, true);
    }
    var parent = $(this).closest(".time-nav");
    $("> div", parent).removeClass("active");
    $(this).closest("div").addClass("active");
});

var calSeriesData = function (yearCount) {
    seriesData = [{
            name: 'Up Capture',
            data: [0.3],
            color: "#0F8EC7"

        }, {
            name: 'Down Capture',
            data: [-.5],
            color: "#005C8F"
        },
        {
            name: 'Up Up',
            data: [.3],
            color: "#E3D7AB"
        },
        {
            name: 'Down Down',
            data: [.5],
            color: "#C9B160"
        }
    ];
    for (var i = 0; i < seriesData.length; i++) {
        seriesData[i].data[0] = ((seriesData[i].data[0] * yearCount).toFixed(2))/1;
    }
}

calSeriesData(3);

var upDownQuarterlyChart = Highcharts.chart('upDown-quarterly', {
    chart: {
        type: 'column',
        backgroundColor: "#FAFAFA",
        style: {
            fontFamily: 'pf_dintext_proregular',
            fontSize:'15px'
          },
        events: {
            click: function (evt) {
            var axisVal = new Array();
            $.each(upDownQuarterlyChart.series, function (i, name) {
                axisVal[0] = getYValue(upDownQuarterlyChart, i, evt.xAxis[0].value);
                $(".legend" + i, "#upDownCapture").text(axisVal[0]);
            })
            },
        },
    },
    title: {
        text: ''
    },
    xAxis: {
        categories: [''],
        enabled: false,
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
    tooltip:{
        enabled: false
    },
    yAxis: {
        title: "",
        tickInterval: 0.5

    },
    series: seriesData
});

$("#upDown-quarterly").on("mouseover click",function(e){
    $.each(upDownQuarterlyChart.series, function (i, name) {
      $(".legend" + i, "#upDownCapture").text(this.data[0].y.toFixed(2));
    })
});


function getYValue(chartObj, seriesIndex, xValue) {
    var yValue = null;
    var points = chartObj.series[seriesIndex].points;
    for (var i = 0; i < points.length; i++) {
      if (points[i].x >= xValue) break;
      yValue = points[i].y;
    }
    return yValue;
  }