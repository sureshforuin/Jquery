var seriesData = [{
    name: 'Up Capture',
    data: [.6],
    color: "#0F8EC7"

}, {
    name: 'Down Capture',
    data: [-.6],
    color: "#005C8F"
},
{
    name: 'Up Up',
    data: [.3],
    color: "#E3D7AB"
},
{
    name: 'Down Down',
    data: [.4],
    color: "#C9B160"
}
];
$("#upDownCapture .time-nav").on("click", "a", function(e) {
    e.preventDefault();
    var yearCount = parseInt($(this).attr("data-year"));
    calSeriesData(yearCount);
    for (var j = 0; j < upDownSemiChart.series.length; j++) {
        upDownSemiChart.series[j].setData(seriesData[j].data, true);
    }
    var parent = $(this).closest(".time-nav");
    $("> div", parent).removeClass("active");
    $(this).closest("div").addClass("active");
});

var calSeriesData = function (yearCount) {
    seriesData = [{
            name: 'Up Capture',
            data: [.6],
            color: "#0F8EC7"

        }, {
            name: 'Down Capture',
            data: [-.6],
            color: "#005C8F"
        },
        {
            name: 'Up Up',
            data: [.3],
            color: "#E3D7AB"
        },
        {
            name: 'Down Down',
            data: [.4],
            color: "#C9B160"
        }
    ];
    for (var i = 0; i < seriesData.length; i++) {
        seriesData[i].data[0] = ((seriesData[i].data[0] * yearCount).toFixed(2))/1;
    }
}

calSeriesData(3);

var upDownSemiChart = Highcharts.chart('upDown-semi', {
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
            $.each(upDownSemiChart.series, function (i, name) {
                axisVal[0] = getYValue(upDownSemiChart, i, evt.xAxis[0].value);
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
        title: "",
        
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
    plotOptions:{
        
    },
    yAxis: {
        title: "",
        tickInterval: .5

    },
    series: seriesData
});

$("#upDown-semi").on("mouseover click",function(e){
    $.each(upDownSemiChart.series, function (i, name) {
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