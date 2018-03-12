$(document).ready(function(){
    var seriesData = [
      {
        name: "Up Capture",
        data: [0.5],
        color: "#0F8EC7"
      },
      {
        name: "Down Capture",
        data: [-.45],
        color: "#005C8F"
      },
      {
        name: "Up Up",
        data: [0.4],
        color: "#E3D7AB"
      },
      {
        name: "Down Down",
        data: [0.6],
        color: "#C9B160"
      }
    ];
    $("#upDownCapture .time-nav").on("click", "a", function(e) {
      e.preventDefault();
      var yearCount = parseInt($(this).attr("data-year"));
      calSeriesData(yearCount);
      for (var j = 0; j < upDownMonthlyChart.series.length; j++) {
        upDownMonthlyChart.series[j].setData(seriesData[j].data, true);
      }
      var parent = $(this).closest(".time-nav");
      $("> div", parent).removeClass("active");
      $(this)
        .closest("div")
        .addClass("active");
    });
    
    var calSeriesData = function(yearCount) {
      seriesData = [
        {
          name: "Up Capture",
          data: [0.5],
          color: "#0F8EC7"
        },
        {
          name: "Down Capture",
          data: [-.45],
          color: "#005C8F"
        },
        {
          name: "Up Up",
          data: [.4],
          color: "#E3D7AB"
        },
        {
          name: "Down Down",
          data: [0.6],
          color: "#C9B160"
        }
      ];
      for (var i = 0; i < seriesData.length; i++) {
        seriesData[i].data[0] = (seriesData[i].data[0] * yearCount).toFixed(2) / 1;
      }
    };
    
    calSeriesData(3);
    
    var upDownMonthlyChart = Highcharts.chart(
      "upDown-monthly",
      {
        chart: {
          type: "column",
          backgroundColor: "#FAFAFA",
          style: {
            fontFamily: 'pf_dintext_proregular',
            fontSize:'15px'
          },
          events: {
            click: function (evt) {
            var axisVal = new Array();
            $.each(upDownMonthlyChart.series, function (i, name) {
                axisVal[0] = getYValue(upDownMonthlyChart, i, evt.xAxis[0].value);
                $(".legend" + i, "#upDownCapture").text(axisVal[0]);
            })
            },
        },
        },
        title: {
          text: ""
        },
        xAxis: {
          categories: [""],
          enabled: false,
          title: ""
        },
        plotOptions: {
          series: {
            cursor: "pointer",
            point: {
              events: {
                mouseOver: function (evt) {
                  var sname = this.series.index;
                    $(".legend" + sname, "#upDownCapture").text(
                     this.y.toFixed(2)
                    );
                },
              }
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
        yAxis: {
          title: "",
          tickInterval: .5
        },
        series: seriesData
      },
      function(upDownMonthlyChart) {
        generateLegend("upDownCapture", upDownMonthlyChart);
      }
    );
    
    function getYValue(chartObj, seriesIndex, xValue) {
      var yValue = null;
      var points = chartObj.series[seriesIndex].points;
      for (var i = 0; i < points.length; i++) {
        if (points[i].x >= xValue) break;
        yValue = points[i].y;
      }
      return yValue;
    }


    $("#upDown-monthly").on("mouseover click",function(e){
      $.each(upDownMonthlyChart.series, function (i, name) {
        $(".legend" + i, "#upDownCapture").text(this.data[0].y.toFixed(2));
      })
  });

  
    
    
    
    
    function removeAllLegend(parent) {
      $(".addUnit .unit", parent).each(function() {
        if (!$(this).hasClass("d-none")) {
          $(this).remove();
        }
      });
    }
    
    function generateLegend(id, chart) {
      var parent = $("#" + id);
      removeAllLegend(parent);
      var cloneUnit = $(".addUnit .cloneUnit", parent);
      var activeUnit = $(".addUnit .unit:last", parent);
      var seriesLength = chart.series.length;
      for (var i = 0; i < seriesLength; i++) {
        var lastunit = activeUnit;
        cloneUnit.clone().insertAfter(lastunit);
        activeUnit = $(".addUnit .unit:last", parent);
        activeUnit.removeClass("d-none");
        var myseries = chart.series[i];
        activeUnit.attr("id", i);
        $("h4", activeUnit).text(myseries.name);
        $(".box", activeUnit).css("background-color", myseries.color);
        $(".number", activeUnit)
          .text("_ _")
          .addClass("legend" + i);
      }
    }
});
