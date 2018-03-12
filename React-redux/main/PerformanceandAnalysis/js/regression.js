$(document).ready(function(){
    var dateFormat = "yyyy-mm-dd",
    fromRM = $( "#fromRM" )
      .datepicker({
        defaultDate: "+1w",
        changeMonth: true
      })
      .on( "change", function() {
        toRM.datepicker( "option", "minDate", getDate( this ) );
        var parent = $(this).closest(".time-nav");
        $("> div", parent).removeClass("active");
        $(this).closest('.dateRange').addClass("active");
      }),
    toRM = $( "#toRM" ).datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 1
    })
    .on( "change", function() {
      fromRM.datepicker( "option", "maxDate", getDate( this ) );
      var parent = $(this).closest(".time-nav");
      $("> div", parent).removeClass("active");
      $(this).closest('.dateRange').addClass("active");
    });

});

var seriesLineData = [
    [-7, -6],
    [6.7, 7]
];
var regressionDataUpdated = [];
$("#regressionModelingWrap .time-nav").on("click", "a", function(e) {
    e.preventDefault();
    var yearCount = parseInt($(this).attr("data-year"));
    updateRegressionData(yearCount);
    regChart.series[0].setData(seriesLineData, true);
    regChart.series[1].setData(regressionDataUpdated, true);
    var parent = $(this).closest(".time-nav");
    $("> div", parent).removeClass("active");
    $(this).closest("div").addClass("active");
});
$("#regressionModelingWrap .time-nav").on("change", "input", function(e) {
    e.preventDefault();
    var min = new Date($("#fromRM").val()).getTime();
    var max = new Date($("#toRM").val()).getTime();
    var calcValue = Math.round((max - min) / 86400000) / 1000;
    updateRegressionData(calcValue);
    regChart.series[0].setData(seriesLineData, true);
    regChart.series[1].setData(regressionDataUpdated, true);
    var parent = $(this).closest(".time-nav");
    $("> div", parent).removeClass("active");
    $(this).closest("div").addClass("active");
});
var updateRegressionData = function (yearCount) {
    setRegressionData();
    seriesLineData = [
        [-7, -6],
        [6.7, 7]
    ];
    for(var i = 0; i < regressionData.length; i ++) {
        var value = regressionData[i];
        value[0] *= yearCount;
        value[1] *= yearCount;
        regressionDataUpdated.push(value);
    }
    for(var i = 0; i < seriesLineData.length; i ++) {
        var value = seriesLineData[i];
        value[0] *= yearCount;
        value[1] *= yearCount;
        seriesLineData[i] = value;
    }
};
updateRegressionData(3);

var regChart = Highcharts.chart('regressionModeling', {
    chart: {
        type: 'scatter',
        zoomType: 'xy',
        backgroundColor: "#FAFAFA",
        style: {
            fontFamily: 'pf_dintext_proregular',
            fontSize:'15px'
          },
        events: {
            click: function (evt) {
                var axisVal = new Array();
                $.each(regChart.series, function (i, name) {
                axisVal[0] = getYValue(regChart, i, evt.xAxis[0].value);
                $(".legend" + i, "#regressionModelingWrap").text(axisVal[0].toFixed(2));
                })
            },
        }
    },

    title: {
        text: ''
    },
    xAxis: {
        title: "",
        tickInterval: 5
        
    },
    yAxis: {
        title: "",
        tickInterval: 2.5,
        labels: {
            formatter: function () {
                return this.value;
            }
        }
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
    plotOptions: {
        series:{
            point: {
                events: {
                  click: function (evt) {
                    var axisVal = new Array();
                    $.each(regChart.series, function (i, name) {
                      axisVal[0] = getYValue(regChart, i, evt.xAxis[0].value);
                      $(".legend" + i, "#regressionModelingWrap").text(axisVal[0].toFixed(2));
                    })
                  },
                  mouseOut: function () {
                    $(".unit.cloneUnit .number", "#regressionModelingWrap").text("_ _ ");
                   },
                  mouseOver: function() {
                    var sname = this.series.index;
                    $(".legend" + sname, "#regressionModelingWrap").text(this.y.toFixed(2));
                    var series = this.series.chart.series,
                    x = this.x;
                    $(".legend" + sname, "#regressionModelingWrap").text(this.y.toFixed(2));
                    $.each(series, function (i, e) {
                        $.each(series[i].data,function(j,point){
                            if(point.x === x) {
                                $(".legend" + i, "#regressionModelingWrap").text(point.y.toFixed(2));
                            }
                        });						
                    });
                  }
                }
              }
        },
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
            name: 'R-SQUARED',
            color: '#BCBCBC',
            zIndex:10,
            data: seriesLineData,
        },
        {
            name: 'ADJUSTED R-SQUARED',
            color: 'rgba(15, 142, 199, .75)',

            data: regressionDataUpdated,
            marker: {
                symbol: 'circle',
                radius: 9
            }
        }
    ]
},function(regChart){
    generateLegend("regressionModelingWrap",regChart);
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

  