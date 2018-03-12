$(document).ready(function() {
  var chartCP;


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
  populateBenchmarkData('cum_benchmarkTable', benchmarkData);
  //Holding Benchmarks
  var holdingTable = benchmarkData.filter(function(benchmarkItem) {
    return benchmarkItem.type === 'holdings';
  });
  populateBenchmarkData('cum_holdingBenchmarks', holdingTable);
  //Favourite Benchmarks
  var favouriteTable = benchmarkData.filter(function(benchmarkItem) {
    return benchmarkItem.type === 'favourites';
  });
  populateBenchmarkData('cum_favouriteBenchmarks', favouriteTable);

  var dateFormat = "yyyy-mm-dd",
    fromDP = $("#fromCP")
      .datepicker({
        defaultDate: "+1w",
        changeMonth: true
      })
      .on("change", function() {
        toDP.datepicker("option", "minDate", getDate(this));
        var parent = $(this).closest(".time-nav");
        $("> div", parent).removeClass("active");
        $(this)
          .closest(".dateRange")
          .addClass("active");
      }),
    toDP = $("#toCP")
      .datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1
      })
      .on("change", function() {
        fromDP.datepicker("option", "maxDate", getDate(this));
        var parent = $(this).closest(".time-nav");
        $("> div", parent).removeClass("active");
        $(this)
          .closest(".dateRange")
          .addClass("active");
      });

  $("#cumulativePerformance .time-nav").on("change", "input", function(e) {
    var min = new Date($("#fromCP").val()).getTime();
    var max = new Date($("#toCP").val()).getTime();
    chartCP.xAxis[0].setExtremes(min, max);
    chartCP.showResetZoom();
    var parent = $(this).closest(".time-nav");
    $("> div", parent).removeClass("active");
    $(this)
      .closest("div")
      .addClass("active");
  });

  $("#cumulativePerformance .time-nav").on("click", "a", function(e) {
    e.preventDefault();
    if (!chartCP) return;
    var min = extremes.min;
    var yearCount = parseInt($(this).attr("data-year"));
    var clickedElement = $(this);
    setChartRange(chartCP, yearCount, clickedElement);
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

  function removeAllLegend(parent) {
    $(".addUnit .unit", parent).each(function() {
      if (!$(this).hasClass("d-none")) {
        $(this).remove();
      }
    });
  }

  $(".addUnit", "#cumulativePerformance").on(
    "click",
    ".close-icon",
    function() {
      var unitParent = $(this).closest(".unit");
      getChartID = unitParent.attr("data-series");
      chartCP.series[getChartID].remove();
      generateLegend("cumulativePerformance", chartCP);
    }
  );

  function generateLegend(id, chart) {
    var parent = $("#" + id);
    removeAllLegend(parent);
    var cloneUnit = $(".addUnit .cloneUnit", parent);
    var activeUnit = $(".addUnit .unit:last", parent);
    var seriesLength = chart.series.length;
    for (var i = 0; i < seriesLength; i++) {
      var myseries = chart.series[i];
      if (!myseries.baseSeries) {
        var lastunit = activeUnit;
        cloneUnit.clone().insertAfter(lastunit);
        activeUnit = $(".addUnit .unit:last", parent);
        activeUnit.removeClass("d-none");
        activeUnit.attr("data-series", i);
        $("h4", activeUnit).text(myseries.name);
        $(".box", activeUnit).css("background-color", myseries.color);
        $(".number", activeUnit)
          .text("_ _")
          .addClass("legend" + i);
      }
    }
  }

  $("#cumulativePerformance").on("click", ".content-area1 a", function(evt) {
    var parent = $("#cumulativePerformance");
    evt.preventDefault();
    seriesAdded = [];
    setLocalStorage();
    generateSandboxlist("cumulativePerformance");
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

  $("#cumulativePerformance").on(
    "click",
    ".sandbox-list .remove-icon",
    function() {
      var parent = $("#cumulativePerformance");
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
    localStorage.setItem("cumaddedSeries", JSON.stringify(seriesAdded));
  }

  function getLocalStorage() {
    var ArrayData = [];
    var storedData = localStorage.getItem("cumaddedSeries");
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
      activeUnit.attr("id", "cumSeries" + i);
      $(".seriesName", activeUnit).text(addedSeries[i]);
    }
  }

  function getseriesxValue(chartObj, seriesIndex, xValue) {
    var yValue = null;
    var points = chartObj.series[seriesIndex].points;
    for (var i = 0; i < points.length; i++) {
      if (points[i].x >= xValue) break;
      yValue = points[i].y;
    }
    return yValue;
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

  var seriesOptions = [],
    seriesCounter = 0,
    names = ["ALPHA", "SANDP"];

  /**
   * Create the chart when all data is loaded
   * @returns {undefined}
   */
  function createChart() {
    var $reporting = $("#reporting");

    chartCP = Highcharts.stockChart(
      "cumPerformance",
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
              $.each(chartCP.series, function(i, name) {
                axisVal = getYValue(chartCP, i, evt.xAxis[0].value);
                $(".legend" + i, "#cumulativePerformance").text(
                  axisVal.toFixed(2)
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
          height: 65,
          maskFill: "rgba(255, 255, 255, 0.6)",
          maskInside: false,
          handles: {
            width: 16,
            height: 24,
            borderColor: "#FFFFFF",
            backgroundColor: "#005C8F"
          },
          enabled: true,
          series: [
            {
              type: "line"
            }
          ]
        },
        plotOptions: {
          fillColor: "#FFFFFF",
          fillOpacity: 0.75
        },
        scrollbar: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        exporting: {
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
        plotOptions: {
          series: {
            compare: "percent",
            showInNavigator: true,
            className: "mySeries",
            cursor: "pointer",
            point: {
              events: {
                click: function (evt) {
                    var axisVal = new Array();
                    $.each(chartCP.series, function (i, name) {
                      axisVal[0] = getYValue(chartCP, i, evt.xAxis[0].value);
                      $(".legend" + i, "#cumulativePerformance").text(axisVal[0].toFixed(2));
                    })
                  },
                  mouseOut: function () {
                    $(".unit.cloneUnit .number", "#cumulativePerformance").text("_ _ ");
                   },
                  mouseOver: function() {
                    var sname = this.series.index;
                    $(".legend" + sname, "#cumulativePerformance").text(this.y.toFixed(2));
                    var sname = this.series.index;
                    $(".legend" + sname, "#cumulativePerformance").text(this.y.toFixed(2));
                    var series = this.series.chart.series,
                        x = this.x;
                    $(".legend" + sname, "#cumulativePerformance").text(this.y.toFixed(2));
                    $.each(series, function (i, e) {
                            $.each(series[i].data,function(j,point){
                                if(point.x === x) {
                                    $(".legend" + i, "#cumulativePerformance").text(point.y.toFixed(2));
                                }
                            });						
                    });
                  }
              }
            }
          }
        },

        tooltip: {
         enabled:false
        },

        series: [
          {
            name: chartNames[0],
            data: cumulativePerformance["ALPHA"],
            color: chartColor[0],
            fillOpacity: 0.1,
            lineWidth: 1
          }
        ]
      },
      function(thisCHart) {

        thisCHart.addSeries({
          name: chartNames[1],
          data: getrandomData(),
          color: chartColor[1],
          showInNavigator: true,
          fillOpacity: 0.1,
          lineWidth: 1,

        });

        generateLegend("cumulativePerformance", thisCHart);
      }
    );
  }

  var chartColor = new Array();
  chartColor[0] = "#0F8EC7";
  chartColor[1] = "#C9B160";

  function getrandomData() {
    var randomData = [];
    for (var i = 0; i < cumulativePerformance["SANDP"].length; i++) {
      randomData.push([
        cumulativePerformance["SANDP"][i][0],
        50 * Math.random() + 100
      ]);
    }

    return randomData;
  }

  $.each(names, function(i, name) {
    seriesOptions[i] = {
      name: chartNames[i],
      data: getrandomData(),
      color: chartColor[i],
      showInNavigator: true,
      fillOpacity: 0.1,
      lineWidth: 1
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

  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  var defaultcumSeriesCount = 2;

  $("#cumulativePerformance").on("click", ".applyButton", function() {
    var parent = $("#cumulativePerformance");
    var totalSeriesCount =
      $("tr.selected", parent).length + defaultcumSeriesCount;
    var renderedSeriesCount = $(".addUnit .unit", parent).length - 1;

    if (
      $("tr.selected", parent).length > 0 &&
      renderedSeriesCount < totalSeriesCount
    ) {
      $("tr.selected", parent).each(function() {
        var seriesName = $("th:first", $(this)).text();
        chartCP.addSeries({
          name: seriesName,
          data:getrandomData(),
          type: "area",
          color: getRandomColor(),
          showInNavigator: true,
          fillOpacity: 0.1,
          lineWidth: 1
        });
      });
      generateLegend("cumulativePerformance", chartCP);
    }
  });

  $("#cumulativePerformance").on("click", ".seeall", function() {
    var parent = $("#cumulativePerformance");
    $(".sandbox", parent).toggle();
  });

  var seriesAdded = [];

  $("#cumulativePerformance").on(
    "click",
    "table td span.addButton",
    function() {
      var parent = $("#cumulativePerformance .modal");
      $(this)
        .removeClass("addButton")
        .addClass("selected");
      var trParent = $(this).closest("tr");
      trParent.addClass("selected");
      // var seriesName = $("th:first",trParent).text();
      seriesAdded.push($("th:first", trParent).text());
      var cumSeries = "cumSeries" + (seriesAdded.length - 1);
      trParent.addClass(cumSeries);

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
      generateSandboxlist("cumulativePerformance");
    }
  );

  setChartRange(chartCP, 3);
});
