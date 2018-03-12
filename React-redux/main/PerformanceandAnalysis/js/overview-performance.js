Highcharts.chart("overview-performance", {
  
  chart: {
    type: "column",
    backgroundColor: null,
    style: {
      fontFamily: "pf_dintext_proregular",
      fontSize: "15px"
    }
  },
  title: {
    text: ""
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
  tooltip: {
    enabled: false
  },
  xAxis: {
    categories: ["", "","", "1 YR", "2 YRS", "3 YRS", "5 YRS", "SINCE INCEPTION"],
    crosshair: true
  },
  yAxis: {
    min: 0,
    tickInterval: 5,
    labels: {
        format: '{value} %'
    },
    title: {
      text: ""
    }
  },
  // tooltip: {
  //   headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
  //   pointFormat:
  //     '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
  //     '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
  //   footerFormat: "</table>",
  //   shared: true,
  //   useHTML: true
  // },
  plotOptions: {
    series: {
      pointPadding: 0
    },
    column: {
      pointPadding: 0,
      borderWidth: 0
    }
  },
  series: [
    {
      data: [0,0, 0, 14.9, 12.71, 11.01, 1.3, 2.8],
      color:"#2A7ABB"
    },
    {
      data: [0,0, 0, 17, 9.71, 9.1, 2.3, 3.8],
      color:"#A89246"
    },
    {
      data: [0,0, 0, 10.1, 8.71, 5.2, 12.3, 17.8],
      color:"#17477B"
    }
  ]
  
});
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



$("#overview-performance-wrap").on("click", ".content-area2 a", function(event) {
  var parent = $("#overview-performance-wrap");
  event.preventDefault();
  seriesAdded = [];
  setLocalStorage();
  generateSandboxlist("benchmark-table");
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

function setLocalStorage() {
  localStorage.setItem("overviewData", JSON.stringify(seriesAdded));
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
    activeUnit.attr("id", "overviewSeries" + i);
    $(".seriesName", activeUnit).text(addedSeries[i]);
  }
}
var seriesAdded = [];

$("#overview-performance-wrap").on(
  "click",
  "table td span.addButton",
  function() {
    var parent = $("#overview-performance-wrap .modal");
    $(this)
      .removeClass("addButton")
      .addClass("selected");
    var trParent = $(this).closest("tr");
    trParent.addClass("selected");
    // var seriesName = $("th:first",trParent).text();
    seriesAdded.push($("th:first", trParent).text());
    var overviewSeries = "overviewSeries" + (seriesAdded.length - 1);
    trParent.addClass(overviewSeries);

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
    generateSandboxlist("benchmark-table");
  }
);

function removeSandboxlist(parent) {
  $(".sandbox .sandbox-list", parent).each(function() {
    if (!$(this).hasClass("cloneUnit")) {
      $(this).remove();
    }
  });
}

function getLocalStorage(){
  var ArrayData = []; 
  var storedData = localStorage.getItem("overviewaddedData");
  if (storedData) {
      ArrayData = JSON.parse(storedData);
  } 
  return ArrayData;
}

function getLocalStorage() {
  var ArrayData = [];
  var storedData = localStorage.getItem("overviewaddedSeries");
  if (storedData) {
    ArrayData = JSON.parse(storedData);
  }
  return ArrayData;
}

$("#overview-performance-wrap").on("click", ".applyButton", function() {
  var parent = $("#overview-performance-wrap");
  if ($("tr.selected", ".overview_model").length > 0){
      var cloneUnit = $("table.benchmark-table tr.cloneUnit");
      $("tr.selected", ".overview_model").each(function() {
          var activeUnit = $("table.benchmark-table tr.addnewBenchmark",).prev();
          activeUnit.removeClass("d-none");
          var selectedName = $("th:first", $(this)).text();
          var oneYear = $("td:nth-child(2)", $(this)).text();
          var twoYear = $("td:nth-child(3)", $(this)).text();
          var threeYear = $("td:nth-child(4)", $(this)).text();
          var fiveYear = $("td:nth-child(5)", $(this)).text();
          var inception = $("td:nth-child(6)", $(this)).text()
          cloneUnit.clone().insertAfter(activeUnit);
          activeUnit = $("table.benchmark-table tr.addnewBenchmark",).prev();
          var firstTD = "<span><a href='#'><img class='table_close' src='images/close-button.svg'><img></a></span>"+selectedName;
          $("td:nth-child(1)",activeUnit).html(firstTD);
          $("td:nth-child(2)",activeUnit).text(oneYear);
          $("td:nth-child(3)",activeUnit).text(twoYear);
          $("td:nth-child(4)",activeUnit).text(threeYear);
          $("td:nth-child(5)",activeUnit).text(fiveYear);
          $("td:nth-child(6)",activeUnit).text(inception);

      });
  }
});


$("#overview-performance-wrap").on(
  "click",
  ".sandbox-list .remove-icon",
  function() {
    var parent = $("#overview-performance-wrap");
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

function populateBenchmarkData(id, data) {
  var tr;
  $('#' + id).append('<tbody>');
  for (var i = 0; i < data.length; i++) {
      tr = $('<tr/>');
      tr.append("<th scope='row'>" + data[i].benchmarks + "</th>")
      tr.append("<td class='text-center'>" + data[i].oneYr + "</td>");
      tr.append("<td>" + data[i].twoYrs + "</td>");
      tr.append("<td class='text-center'>" + data[i].threeYrs + "</td>");
      tr.append("<td class='text-center'>" + data[i].fiveYrs + "</td>");
      tr.append("<td class='text-center'>" + data[i].sinceInception + "</td>");
      tr.append("<td class='text-center'> <span class='addButton'> </td>");
      $('#' + id).append(tr);
  }
  $('#' + id).append('</tbody>');
}
populateBenchmarkData('overview_benchmarkTable', overviewData);
//Holding Benchmarks
var holdingTable = overviewData.filter(function(benchmarkItem) {
  return benchmarkItem.type === 'holdings';
});
populateBenchmarkData('overview_holdingBenchmarks', holdingTable);
//Favourite Benchmarks
var favouriteTable = overviewData.filter(function(benchmarkItem) {
  return benchmarkItem.type === 'favourites';
});
populateBenchmarkData('overview_favouriteBenchmarks', favouriteTable);



