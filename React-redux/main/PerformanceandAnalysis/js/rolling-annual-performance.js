$(document).ready(function() {
  var rapChart;
  var bandPlotted = false;

  function populateBenchmarkData(id, data) {
    var tr;
    $('#' + id).append('<tbody>');
    for (var i = 0; i < data.length; i++) {
        tr = $('<tr/>');
        tr.append("<th scope='row'>" + data[i].benchmarks + "</th>")
        tr.append("<td class='text-center'>" + data[i].inceptionDate + "</td>");
        tr.append("<td>" + data[i].geographicFocus + "</td>");
        tr.append("<td class='text-center'>" + data[i].performance + "</td>");
        tr.append("<td class='text-center'>" + data[i].volatility + "</td>");
        tr.append("<td class='text-center'> <span class='addButton'> </td>");
        $('#' + id).append(tr);
    }
    $('#' + id).append('</tbody>');
  }
  populateBenchmarkData('benchmarkTable', benchmarkData);
  //Holding Benchmarks
  var holdingTable = benchmarkData.filter(function(benchmarkItem) {
    return benchmarkItem.type === 'holdings';
  });
  populateBenchmarkData('holdingBenchmarks', holdingTable);
  //Favourite Benchmarks
  var favouriteTable = benchmarkData.filter(function(benchmarkItem) {
    return benchmarkItem.type === 'favourites';
  });
  populateBenchmarkData('favouriteBenchmarks', favouriteTable);

  var dateFormat = "yyyy-mm-dd",
    from = $("#fromRAP")
      .datepicker({
        defaultDate: "+1w",
        changeMonth: true
      })
      .on("change", function() {
        to.datepicker("option", "minDate", getDate(this));
        var parent = $(this).closest(".time-nav");
        $("> div", parent).removeClass("active");
        $(this)
          .closest(".dateRange")
          .addClass("active");
      }),
    to = $("#toRAP")
      .datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1
      })
      .on("change", function() {
        from.datepicker("option", "maxDate", getDate(this));
        var parent = $(this).closest(".time-nav");
        $("> div", parent).removeClass("active");
        $(this)
          .closest(".dateRange")
          .addClass("active");
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

  function removePlotBand() {
    bandPlotted = false;
    rapChart.xAxis[0].removePlotBand("plotband1");
    rapChart.xAxis[0].removePlotBand("plotband2");
  }

  $("#rollingAnnualizedPerformance .time-nav").on("change", "input", function(
    e
  ) {
    var min = new Date($("#fromRAP").val()).getTime();
    var max = new Date($("#toRAP").val()).getTime();
    rapChart.xAxis[0].setExtremes(min, max);
    rapChart.showResetZoom();
    var parent = $(this).closest(".time-nav");
    $("> div", parent).removeClass("active");
    $(this)
      .closest("div")
      .addClass("active");
  });

  $("#rollingAnnualizedPerformance .time-nav").on("click", "a", function(e) {
    e.preventDefault();
    if (!rapChart) return;
    var min = extremes.min;
    var yearCount = parseInt($(this).attr("data-year"));
    var clickedElement = $(this);
    setChartRange(rapChart, yearCount, clickedElement);
  });

  function plotBand() {
    // removePlotBand();
    var fromDate = "09-01-2013";
    var toDate = "22-01-2015";

    var startDate = fromDate.split("-");
    var endDate = toDate.split("-");

    plotStart = Date.UTC(startDate[2], startDate[1], startDate[0]);
    plotStop = Date.UTC(endDate[2], endDate[1], endDate[0]);

    if (!bandPlotted) {
      bandPlotted = true;
      rapChart.xAxis[0].addPlotBand({
        color: "#FFFFFF",
        from: Date.UTC(2010, 01, 01),
        to: Date.UTC(2013, 12, 31),
        id: "plotband1",
        className: "overlay",
        zIndex: 10,
        borderColor: "#EFEFEF",
        borderWidth: 1
      });
      rapChart.xAxis[0].addPlotBand({
        color: "#FFFFFF",
        from: Date.UTC(2015, 12, 31),
        to: Date.UTC(2018, 12, 31),
        id: "plotband2",
        className: "overlay",
        zIndex: 10,
        borderColor: "#EFEFEF",
        borderWidth: 1
      });
    }
    $("#rollingAnnualizedPerformance .time-nav a[data-year=10]").trigger(
      "click"
    );
  }

  $("#rollingAnnualizedPerformance .addUnit").on(
    "click",
    ".close-icon",
    function() {
      var unitParent = $(this).closest(".unit");
      getChartID = unitParent.attr("id");
      rapChart.series[getChartID].remove();
      generateLegend("rollingAnnualizedPerformance", rapChart);
    }
  );

  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

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

  $("#rollingAnnualizedPerformance").on("click", ".seeall", function() {
    var parent = $("#rollingAnnualizedPerformance");
    $(".sandbox", parent).toggle();
  });

  var defaultSeriesCount = 2;

  $("#rollingAnnualizedPerformance").on("click", ".applyButton", function() {
    var parent = $("#rollingAnnualizedPerformance");
    var totalSeriesCount = $("tr.selected", parent).length + defaultSeriesCount;
    var renderedSeriesCount = $(".addUnit .unit", parent).length - 1;

    if (
      $("tr.selected", parent).length > 0 &&
      renderedSeriesCount < totalSeriesCount
    ) {
      $("tr.selected", parent).each(function() {
        var seriesName = $("th:first", $(this)).text();
        rapChart.addSeries({
          name: seriesName,
          data: formChartData(alpha, true),
          type: "area",
          color: getRandomColor(),
          fillOpacity: 0.1,
          lineWidth: 1
        });
      });
      generateLegend("rollingAnnualizedPerformance", rapChart);
    }
  });

  var seriesAdded = [];

  $("#rollingAnnualizedPerformance").on(
    "click",
    "table td span.addButton",
    function() {
      var parent = $("#rollingAnnualizedPerformance .modal");
      $(this)
        .removeClass("addButton")
        .addClass("selected");
      var trParent = $(this).closest("tr");
      trParent.addClass("selected");
      seriesAdded.push($("th:first", trParent).text());
      var rapSeries = "rapSeries" + (seriesAdded.length - 1);
      trParent.addClass(rapSeries);
      if ($("tr.selected", parent).length > 0) {
        var addedText = $("tr.selected", parent).length + " Added";
        $("h3", parent).hide();
        $("h3.rowSelected", parent)
          .text(addedText)
          .show();
        $(".applyButton", parent).show();
        $(".seeall", parent).show();
      }
      setLocalStorage();
      generateSandboxlist("rollingAnnualizedPerformance");
    }
  );

  $("#rollingAnnualizedPerformance").on("click", ".content-area1 a", function(
    evt
  ) {
    var parent = $("#rollingAnnualizedPerformance");
    evt.preventDefault();
    seriesAdded = [];
    setLocalStorage();
    generateSandboxlist("rollingAnnualizedPerformance");
    $(".modal h3", parent).show();
    $(".modal h3.rowSelected", parent).hide();
    $(".applyButton", parent).hide();
    $(".seeall", parent).hide();
    $(".modal tr.selected .selected")
      .removeClass("selected")
      .addClass("addButton");
    $(".modal tr.selected .selected").removeClass();
    $(".sandbox", parent).hide();
  });

  $("#rollingAnnualizedPerformance").on(
    "click",
    ".sandbox-list .remove-icon",
    function() {
      var parent = $("#rollingAnnualizedPerformance");
      var parentList = $(this).closest(".sandbox-list");
      var storedArray = getLocalStorage();
      var idx = storedArray.indexOf($(".seriesName", parentList).text());
      var getID = parentList.attr("id");
      $(".popuptable tr." + getID + " .selected", parent)
        .removeClass("selected")
        .addClass("addButton");
      $(".popuptable tr." + getID, parent).removeClass("selected");
      parentList.remove();

      // var sid = getID.split("rapSeries");
      // var sid = parseInt(sid[1]);

      if (idx != -1) {
        storedArray.splice(idx, 1); // The second parameter is the number of elements to remove.
      }
      var addedText = storedArray.length + " Added";
      if (storedArray.length != 0) {
        $("h3.rowSelected", parent).text(addedText);
      } else {
        $(".modal h3", parent).show();
        $(".modal h3.rowSelected", parent).hide();
        $(".applyButton", parent).hide();
        $(".seeall", parent).hide();
        $(".sandbox", parent).hide();
      }
      seriesAdded = storedArray;
      setLocalStorage();
      generateSandboxlist();
    }
  );

  function setLocalStorage() {
    localStorage.setItem("rapaddedSeries", JSON.stringify(seriesAdded));
  }

  function getLocalStorage() {
    var ArrayData = [];
    var storedData = localStorage.getItem("rapaddedSeries");
    if (storedData) {
      ArrayData = JSON.parse(storedData);
    }
    return ArrayData;
  }

  function removeSandboxlist(parent) {
    $(".sandbox .sandbox-list", parent).each(function() {
      if (!$(this).hasClass("cloneUnit")) {
        $(this).remove();
      }
    });
  }

  function generateSandboxlist(id) {
    var parent = $("#" + id);
    removeSandboxlist(parent);
    var cloneUnit = $(".sandbox .cloneUnit", parent);
    var activeUnit = $(".sandbox .sandbox-list:last", parent);
    var addedSeries = getLocalStorage();
    for (var i = 0; i < addedSeries.length; i++) {
      var lastunit = activeUnit;
      cloneUnit.clone().insertAfter(lastunit);
      activeUnit = $(".sandbox .sandbox-list:last", parent);
      activeUnit.removeClass("cloneUnit");
      activeUnit.attr("id", "rapSeries" + i);
      $(".seriesName", activeUnit).text(addedSeries[i]);
    }
  }

  function getYValue(chartObj, seriesIndex, xValue) {
    var yValue = null;
    var points = chartObj.series[seriesIndex].points;
    for (var i = 0; i < points.length; i++) {
      if (points[i].x >= xValue) break;
      yValue = points[i].y;
    }
    return yValue;
  }

  // $('#rollAnnualiPerformance').mousemove(function(e){
  //     var xaxis = rapChart.xAxis[0];
  //     var yaxis = rapChart.yAxis[0];
  //     xaxis.removePlotLine('plot-line-x');
  //     yaxis.removePlotLine('plot-line-y');
  //     var x = xaxis.toValue(e.offsetX, false);
  //     var y = yaxis.toValue(e.offsetY, false);
  //     xaxis.addPlotLine({
  //         value: x,
  //         color: 'red',
  //         width: 2,
  //         id: 'plot-line-x'
  //     });
  //     yaxis.addPlotLine({
  //         value: y,
  //         color: 'red',
  //         width: 2,
  //         id: 'plot-line-y'
  //     });
  // });

  var seriesOptions = [],
    seriesCounter = 0,
    names = ["ALPHA", "SANDP"];
  chartNames = ["ALPHA PORTFOLIO MODEL", "S&P 500 TR USD"];

  /**
   * Create the chart when all data is loaded
   * @returns {undefined}
   */
  function createChart() {
    rapChart = Highcharts.stockChart(
      "rollAnnualiPerformance",
      {
        chart: {
          type: "area",
          backgroundColor: null,
          style: {
            fontFamily: "pf_dintext_proregular",
            fontSize: "15px"
          },
          events: {
            click: function(evt) {
              var axisVal = new Array();
              $.each(rapChart.series, function(i, name) {
                axisVal[0] = getYValue(rapChart, i, evt.xAxis[0].value);
                $(".legend" + i, "#rollingAnnualizedPerformance").text(
                  axisVal[0].toFixed(2)
                );
              });
            },
            mouseOver: function(evt) {
              var axisVal = new Array();
              $.each(rapChart.series, function(i, name) {
                axisVal[0] = getYValue(rapChart, i, evt.xAxis[0].value);
                $(".legend" + i, "#rollingAnnualizedPerformance").text(
                  axisVal[0].toFixed(2)
                );
              });
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
        xAxis: {
          type: "datetime",
          labels: {
            y: 40,
            formatter: function() {
              var d = new Date(this.value);
              return Highcharts.dateFormat("%b %Y ", this.value); // just month
            }
          }
        },
        yAxis: {
          opposite: false,
          labels: {
            formatter: function() {
              return (this.value > 0 ? " + " : "") + this.value + "%";
            }
          },
          plotLines: [
            {
              value: 0,
              width: 2,
              color: "silver"
            }
          ]
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        tooltip: {
          enabled: false
        },
        plotOptions: {
          series: {
            compare: "percent",
            showInNavigator: true,
            className: "mySeries",
            cursor: "pointer",
            point: {
              events: {
                click: function(evt) {
                  var axisVal = new Array();
                  $.each(rapChart.series, function(i, name) {
                    axisVal[0] = getYValue(rapChart, i, evt.xAxis[0].value);
                    $(".legend" + i, "#rollingAnnualizedPerformance").text(
                      axisVal[0].toFixed(2)
                    );
                  });
                },
                mouseOut: function () {
                  $(".unit.cloneUnit .number", "#rollingAnnualizedPerformance").text("_ _ ");
                 },
                mouseOver: function() {
                  var sname = this.series.index;
                  $(".legend" + sname, "#rollingAnnualizedPerformance").text(
                    this.y.toFixed(2)
                  );
                  var sname = this.series.index;
                  $(".legend" + sname, "#rollingAnnualizedPerformance").text(
                    this.y.toFixed(2)
                  );
                  var sname = this.series.index;
                  $(".legend" + sname, "#rollingAnnualizedPerformance").text(
                    this.y.toFixed(2)
                  );
                  var series = this.series.chart.series,
                    x = this.x;
                  $(".legend" + sname, "#rollingAnnualizedPerformance").text(
                    this.y.toFixed(2)
                  );
                  $.each(series, function(i, e) {
                    $.each(series[i].data, function(j, point) {
                      if (point.x === x) {
                        $(".legend" + i, "#rollingAnnualizedPerformance").text(
                          point.y.toFixed(2)
                        );
                      }
                    });
                  });
                }
              }
            }
          }
        },
        series: seriesOptions
      },
      function(rapChart) {
        generateLegend("rollingAnnualizedPerformance", rapChart);
        setTimeout(plotBand, 500);
      }
    );
  }

  var chartColor = new Array();
  chartColor[0] = "#0F8EC7";
  chartColor[1] = "#C9B160";

  $.each(names, function(i, name) {
    seriesOptions[i] = {
      name: chartNames[i],
      data: rollAnnualPerData[name],
      color: chartColor[i],
      fillOpacity: 0.1,
      lineWidth: 1,
      className: "baseBench"
    };
    seriesCounter += 1;
    if (seriesCounter === names.length) {
      createChart();
    }
  });

  function setChartRange(charObj, yearCount, clickedElement = undefined) {
    var one_year = 31536000000;
    var extremes = charObj.xAxis[0].getExtremes();
    var max = extremes.max;
    var min = extremes.min;
    var unixRange = yearCount * one_year;
    var min = max - unixRange;
    charObj.xAxis[0].setExtremes(min, max);
    if (clickedElement) {
      var parent = clickedElement.closest(".time-nav");
      $("> div", parent).removeClass("active");
      clickedElement.closest("div").addClass("active");
    }
  }

  setChartRange(rapChart, 3);
});
