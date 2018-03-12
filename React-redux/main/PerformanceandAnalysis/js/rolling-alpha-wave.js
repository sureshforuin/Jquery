var rollingAlphaWaveUpdated = [];
var rollingSplineUpdated = [];
var rollingSpline1Updated = [];
$("#regressionTimeFrame .time-nav").on("click", "a", function(e) {
    e.preventDefault();
    var yearCount = parseInt($(this).attr("data-year"));
    updateRollingAlphaWaveData(yearCount);
    rollAlphaWaveChart.series[0].setData(rollingAlphaWaveUpdated, true);
    rollAlphaWaveChart.series[1].setData(rollingSplineUpdated, true);
    rollAlphaWaveChart.series[2].setData(rollingSpline1Updated, true);
    var parent = $(this).closest(".time-nav");
    $("> div", parent).removeClass("active");
    $(this).closest("div").addClass("active");
});

function getrandomData(yearCount) {
    var randomData = [];
    for (var i = 0; i < rollingAlphaWave.length; i++) {
      randomData.push([
        rollingAlphaWave[i][0],
        yearCount * Math.random() + 100
      ]);
    }
}

function formChartData(DATA, changeIt = false) {
    var newArray = [];
    for (var i = 0; i < DATA.length; i++) {
        var value = DATA[i];
        var tempVal = changeIt ? value[1] * Math.random() +200  : value[1];
        newArray.push([
            Date.UTC(value[0].toString().substring(0,4), value[0].toString().substring(6,4)),
            tempVal
          ]);
    }
    return newArray;
}



var updateRollingAlphaWaveData = function (yearCount) {
    setRollingAlphaWave();
    setRollingSpline1();
    setRollingSpline();
   
    rollingAlphaWaveUpdated = formChartData(rollingAlphaWave);
    rollingSplineUpdated = formChartData(rollingAlphaWave, true);
    rollingSpline1Updated = formChartData(rollingAlphaWave, true);

    // for(var i = 0; i < rollingAlphaWave.length; i ++) {
    //     var value = rollingAlphaWave[i];
    //     value[0] = rollingAlphaWave[i][0];
    //     value[1] *= yearCount * Math.random() + 100
    //     rollingAlphaWaveUpdated[i] = value;
    // }

    // for(var i = 0; i < rollingSpline.length; i ++) {
    //     var value = rollingSpline[i];
    //     value[0] = rollingSpline[i][0];
    //     value[1] *= yearCount * Math.random() + 100;
    //     rollingSplineUpdated[i] = value;
    // }
    // for(var i = 0; i < rollingSpline1.length; i ++) {
    //     var value = rollingSpline1[i];
    //     value[0] = rollingSpline1[i][0];
    //     value[1] *= yearCount * Math.random() + 110;
    //     rollingSpline1Updated[i] = value;
    // }
};
updateRollingAlphaWaveData(15);
// create the chart
var rollAlphaWaveChart = Highcharts.stockChart('rollingAlphaWave', {
    chart: {
        alignTicks: false,
        backgroundColor: null,
        style: {
            fontFamily: 'pf_dintext_proregular',
            fontSize:'15px'
          },
        events: {
            click: function (evt) {
              var axisVal = new Array();
              $.each(rollAlphaWaveChart.series, function (i, name) {
                axisVal[0] = getYValue(rollAlphaWaveChart, i, evt.xAxis[0].value);
                axisVal[0] = axisVal[0]/100000000;
                $(".legend" + i, "#rollingAlphaWaveSec").text(axisVal[0].toFixed(2));
              })
            },
          },
    },
    tooltip:{
        enabled: false
    },
    plotOptions: {
        series: {
            cursor: 'pointer',
            point: {
                events: {
                    click: function (evt) {
                      var axisVal = new Array();
                      $.each(rollAlphaWaveChart.series, function (i, name) {
                        axisVal[0] = getYValue(rollAlphaWaveChart, i, evt.xAxis[0].value);
                        axisVal[0] = axisVal[0]/100000000;
                        $(".legend" + i, "#rollingAlphaWaveSec").text(axisVal[0].toFixed(2));
                      })
                    },
                    mouseOut: function () {
                        $(".unit.cloneUnit .number", "#rollingAlphaWaveSec").text("_ _ ");
                       },
                    mouseOver: function() {
                      var sname = this.series.index;
                      var legTxt = this.y/100000000;
                      $(".legend" + sname, "#rollingAlphaWaveSec").text(legTxt.toFixed(2));
                    //   var series = this.series.chart.series,
                    //   x = this.x;
                    //   var tmp =  point.y/100000000
                    //   $(".legend" + sname, "#rollingAlphaWaveSec").text(tmp.toFixed(2));
                    //   $.each(series, function (i, e) {
                    //       $.each(series[i].data,function(j,point){
                    //           if(point.x === x) {
                    //             tmp =  point.y/100000000
                    //               $(".legend" + i, "#rollingAlphaWaveSec").text(tmp.toFixed(2));
                    //           }
                    //       });						
                    //   });

                    }
                  }
            }
        }
    },
    rangeSelector: {
        selected: 6,
        enabled: false
    },
    navigator: {
        enabled: false
    },
    scrollbar: {
        enabled: false
    },
    yAxis: {
        opposite: false,
        // labels: {
        //     formatter: function() {
        //         return (this.value / 100000000);
        //     }
        // }
    },
    xAxis: {
        type: 'datetime',
        labels: {
            formatter: function() {
                var d = new Date(this.value);
                return Highcharts.dateFormat("%Y", this.value); // just month
            }
        }
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    series: [{
        type: 'column',
        name: "ROLLING ALPHA",
        data: rollingAlphaWaveUpdated,
        fillColor: "#0F8EC7",
        dataGrouping: {
            units: [
                [
                    'week', // unit name
                    [1] // allowed multiples
                ],
                [
                    'month', [1, 2, 3, 4, 6]
                ]
            ]
        }
    },{
       
        name: "CONFIDENCE INTERVAL",
        data: rollingSplineUpdated,
            type: 'spline',
            color: '#C9B160',
            tooltip: {
                valueDecimals: 2
            }
    },{
        name: "ROLLING CORRELATION",
        data: rollingSpline1Updated,
            type: 'spline',
            color: '#005C8F',
            tooltip: {
                valueDecimals: 2
            }
    }]
},function(rollAlphaWaveChart){
    generateLegend("rollingAlphaWaveSec",rollAlphaWaveChart);
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
    
    
  function removeAllLegend(parent){
    $(".addUnit .unit",parent).each(function(){
      if(!$(this).hasClass('d-none')){
          $(this).remove();
      }
    });
  }
  
  function generateLegend(id,chart){
    var parent = $("#"+id);
    removeAllLegend(parent);
    var cloneUnit =  $(".addUnit .cloneUnit",parent);
    var activeUnit = $(".addUnit .unit:last",parent);
    var seriesLength = chart.series.length;
        for(var i = 0;i < seriesLength; i ++)
        {
            var lastunit =  activeUnit;
            cloneUnit.clone().insertAfter(lastunit);
            activeUnit = $(".addUnit .unit:last",parent);
            activeUnit.removeClass("d-none");
            var myseries = chart.series[i];
            activeUnit.attr("id",i);
            $("h4",activeUnit).text(myseries.name);
            $(".box",activeUnit).css("background-color",myseries.color);
            $(".number",activeUnit).text("_ _").addClass('legend'+i);
        }
  }

var dateFormat = "mm/dd/yy",
    fromRV = $("#fromRV")
    .datepicker({
        defaultDate: "+1w",
        changeMonth: true
    })
    .on("change", function() {
        toRV.datepicker("option", "minDate", getDate(this));
        var parent = $(this).closest(".time-nav");
        $("> div", parent).removeClass("active");
        $(this).closest('.dateRange').addClass("active");
    }),
    toRV = $("#toRV").datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1
    })
    .on("change", function() {
        fromRV.datepicker("option", "maxDate", getDate(this));
        var parent = $(this).closest(".time-nav");
        $("> div", parent).removeClass("active");
        $(this).closest('.dateRange').addClass("active");
    });



function getDate(element) {
    var date;
    try {
        date = $.datepicker.parseDate(dateFormat, element.value);
    } catch (error) {
        date = null;
    }

    return date;
}