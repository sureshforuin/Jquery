$(document).ready(function() {
    var twoTableBarChart5;
    var categories = [
        "Global",
        "US",
        "US Volume",
        "Europe",
        "Emerging Markets Domestic",
        "Emerging Markets External"
    ];
    var categoriesData = [0.65, -0.5, 0.6, 0.52, 0.41, -0.3];
    var space = "              ";
    var categoryX = [];
    
    var categoryXData = function (yearCount) {
        categoryX = [];
        var calcYearCount = yearCount / 10;
        if (yearCount) {
            categoriesData = [0.65, -0.5, 0.6, 0.52, 0.41, -0.3];
            for (var i = 0; i < categoriesData.length; i++) {
                categoriesData[i] = ((categoriesData[i] * calcYearCount).toFixed(2))/1;
            }
        }
        $(categoriesData).each(function(i, key) {
            var xaxisText =
                "<div class='xtext'><span class='cat'>" +
                categories[i] +
                "</span><span class='number'>" +
                categoriesData[i] +
                "</span></div>";
            categoryX.push(xaxisText);
        });
    };
    categoryXData(3);
    
    $("#tab-4 .time-nav").on("change", "input", function(e) {
        e.preventDefault();
        var min = new Date($("#fromCF").val()).getTime();
        var max = new Date($("#toCF").val()).getTime();
        categoriesData = [0.65, -0.5, 0.6, 0.52, 0.41, -0.3];
        var calcValue = Math.round((max - min) / 86400000) / 1000;
        for (var i = 0; i < categoriesData.length; i++) {
            categoriesData[i] = (categoriesData[i] * calcValue).toFixed(2) / 1;
        }
        categoryXData();
        twoTableBarChart5.xAxis[0].categories = categoryX;
        twoTableBarChart5.xAxis[1].categories = categoryX;
        twoTableBarChart5.series[0].setData(categoriesData, true);
    });

    $("#tab-4 .time-nav").on("click", "a", function(e) {
        e.preventDefault();
        var yearCount = parseInt($(this).attr("data-year"));
        categoryXData(yearCount);
        twoTableBarChart5.xAxis[0].categories = categoryX;
        twoTableBarChart5.xAxis[1].categories = categoryX;
        twoTableBarChart5.series[0].setData(categoriesData, true);
    });

    twoTableBarChart5 = Highcharts.chart("twoTableBar5", {
        chart: {
            type: "bar",
            plotBackgroundColor: "#FAFAFA",
            style: {
                fontFamily: 'pf_dintext_proregular',
                fontSize:'15px'
              },
        },
        title: {
            text: ""
        },
        subtitle: {
            text: ""
        },
        legend: {
            enabled: false
        },
        xAxis: [{
                categories: categoryX,
                gridLineWidth: 1,
                labels: {
                    style: {
                        width: "250px",
                        "min-width": "250px",
                        "font-size": "12px"
                    },
                    useHTML: true
                }
            },
            {
                // mirror axis on right side
                categories: categoryX
            }
        ],
        yAxis: {
            gridLineWidth: 1,
            max: 1,
            min: -1,
            tickInterval: 1,
            labels: {
                enabled: true
            },
            title: {
                text: ""
            },

            title: {
                text: null
            },
            // labels: {
            //     formatter: function() {
            //         return Math.abs(this.value);
            //     }
            // }
        },

        plotOptions: {},
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },

        tooltip:{
            enabled: false
        },

        series: [{
            name: "Fund",
            data: categoriesData,
            color: "#0F8EC7"
        }]
    });
});