import { MONTHLY_UPDATE_STORE, IDD_STORE, FETCH_APPROACH_2_API, FETCH_ODD_2_API, FETCH_OVERVIEW_PAGE_API, FETCH_IDD_2_API, URL_CONFIG, FETCH_PERFORMANCE_2_API, FETCH_LDD_2_API, FETCH_ANALYSIS_API, GRAPH_COLOR_SERIES, GRAPH_DATE_FORMAT_ON_HOVER, getChartApiPath, FUND_RUNNER_ID } from '../tsx/constants/constant';
import * as moment from 'moment';
import { fetchWrapper } from './api_wrapper';
import Fund from '../tsx/models/fund';

export default function common_util() {
    console.log("common js added");
}
let chartColor = GRAPH_COLOR_SERIES;

$(function () {
    $(".dropdown-menu li a").click(function (event) {
        let $el = $(event.target);
        $(".btn:first-child").text($el.text());
        $(".btn:first-child").val($el.text());
    });
});

export const fetchTimeFrameWiseData = (storeParagraphData, timeFramesArr, timeFrameArg) => {

    let data = [];
    let key = getKeyByValue(timeFramesArr, timeFrameArg);
    console.log("common : " + storeParagraphData.length);
    if (storeParagraphData.length != 0) {
        data = getValueFromTimeFrame(storeParagraphData, timeFramesArr, key);
    }
    return data;
}


const checkKeyExists = (Arr, key) => {
    if (Arr[key] != undefined) {
        return true;
    }
    return false;
}

const getKeyByValue = (Arr, value) => Arr.indexOf(value);

const getValueFromTimeFrame = (storeParagraphData, timeFramesArr, key) => {
    let data = storeParagraphData.filter(value => value.timeFrame == timeFramesArr[key])
    if (data.length == 0 || data == null) {
        return getValueFromTimeFrame(storeParagraphData, timeFramesArr, (key + 1))
    } else {
        return data;
    }
}

export const getCurrentComponentActionObj: any = (url?: any) => {
    if (!url) {
        let hashUrl = window.location.hash;
        // If there is hash fragment in the url (to scroll to an element on the page), then remove the fragment part here
        if (hashUrl.match(/(.+)#.*/)) {
            hashUrl = hashUrl.replace(/(.+)#.*/, '$1');
        }
        url = hashUrl.substring(1, hashUrl.length);
    }
    let uri: Array<String> = url.split("/");
    return { "fetch": getDataAPIFromURL(uri[3]) };
}

const getDataAPIFromURL = (url) => {
    switch (url) {
        case URL_CONFIG.FUND_DETAILS.MONTHLY_UPDATE:
            return FETCH_APPROACH_2_API;
        case URL_CONFIG.FUND_DETAILS.ODD:
            return FETCH_ODD_2_API;
        case URL_CONFIG.FUND_DETAILS.IDD:
            return FETCH_IDD_2_API;
        case URL_CONFIG.FUND_DETAILS.PERFORMANCE:
            return FETCH_PERFORMANCE_2_API;
        case URL_CONFIG.FUND_DETAILS.LDD:
            return FETCH_LDD_2_API;
        case URL_CONFIG.FUND_DETAILS.OVERVIEW:
            return FETCH_OVERVIEW_PAGE_API;
        case URL_CONFIG.FUND_DETAILS.ANALYSIS:
            return FETCH_ANALYSIS_API;
        default:
            return "";
    }

}
const findLatestTimeFrameDate = (timeFrames) => {
    return (timeFrames.length != 0) ? timeFrames[0] : '';
}


export const getYValue = (chartObj, seriesIndex, xValue) => {
    var yValue = null;
    var points = chartObj.series[seriesIndex].points;
    for (var i = 0; i < points.length; i++) {
        if (points[i].x >= xValue) break;
        yValue = points[i].y;
    }
    return yValue;
}

export const generateKey = value => getRandomInt() + "-" + value + "-" + getRandomInt();

const getRandomInt = () => {
    return Math.floor(Math.random() * (500 - 0 + 1)) + 0;
}

export const isObjEmpty = (obj) => {

    if (obj == undefined) return true;
    if (typeof obj.constructor() == "object") {
        return (obj == null || Object.keys(obj).length == 0);
    } else {
        return false;
    }
}

const setChartRange = (charObj, yearCount, clickedElement = undefined) => {
    let one_year = 31536000000;
    let extremes = charObj.xAxis[0].getExtremes();
    let max = extremes.max;
    let min = extremes.min;
    let unixRange = yearCount * one_year;
    min = max - unixRange;
    charObj.xAxis[0].setExtremes(min, max);
}

export const ratingsTableStyleGuide = (styleObj) => {
    if (!isObjEmpty(styleObj))
        if (typeof styleObj.constructor() === "string") {
            styleObj = styleObj.split("");
            for (let i = 0; i < styleObj.length; i++) {
                if (styleObj[i] == '{')
                    styleObj[i] = styleObj[i].replace(/[{]/, '{"');
                if (styleObj[i] == ',')
                    styleObj[i] = styleObj[i].replace(/[,]/, ',"');
                if (styleObj[i] == ':')
                    styleObj[i] = styleObj[i].replace(/[:]/, '":');
                if (styleObj[i] == "'")
                    styleObj[i] = styleObj[i].replace(/[']/, '"');
            }
            if (isObjEmpty(styleObj)) return {};
            styleObj = JSON.parse(styleObj.join(''));
            return { fontWeight: (styleObj["Bold"] == 'True' ? 'bold' : 100), paddingLeft: (styleObj["paddingleft"] || '').replace(';', '') } as React.CSSProperties
        }
    return {};


}

export const widthBasedBootstrapClass = (width?) => {
    if (!width) return 'col-lg-12 col-md-12 col-sm-12';
    switch (width) {
        case "100%":
            return 'col-lg-12';
        case "91.66%":
            return 'col-lg-11';
        case "83.33%":
            return 'col-lg-10';
        case "75%":
            return 'col-lg-9';
        case "66.66%":
            return 'col-lg-8';
        case "58.33%":
            return 'col-lg-7';
        case "50%":
            return 'col-lg-6';
        case "41.66%":
            return 'col-lg-5';
        case "33.33%":
            return 'col-lg-4';
        case "25%":
            return 'col-lg-3';
        case "16.66%":
            return 'col-lg-2';
        case "8.33%":
            return 'col-lg-1';
    }
}

export const getOverviewTableModifiedSeries = (allChartSeries: any, type?) => {
    let dataSet: any = [];
    for (let i = 0; i < allChartSeries.length; i++) {
        dataSet.push([]);
        dataSet[i].push(allChartSeries[i].title);
        for (let j = 0; j < allChartSeries[i].series.length; j++) {
            dataSet[i].push(allChartSeries[i].series[j][1]);
        }
    }
    return dataSet;
};


export const getHistoricalReturnsModifiedSeries = (allChartSeries: any) => {
    let tempArrBig: any = [], tempArr: any = [];
    let firstSeriesData = allChartSeries.map((filterValue) => {
        return (!filterValue.initialHideOnGraph) ? parseInt(filterValue['series'][0][3]) : 0;
    });
    let minYear = Math.max(...firstSeriesData);
    let lastSeriesData = allChartSeries.map((filterValue) => {
        return (!filterValue.initialHideOnGraph) ? parseInt(filterValue['series'][(filterValue['series'].length - 1)][3]) : 0;
    });
    let maxYear = Math.max(...lastSeriesData);

    let chartColor = GRAPH_COLOR_SERIES;
    let modifiedPlotData = (allChartSeries || []).map((val, mainIndex) => {
        let previousYear = 0;
        let avg = 1;
        let innerSeriesData: any = [];

        innerSeriesData = (val["series"] || []).map((value, index) => {
            /*single series manipulation */

            let seriesDate = value[0];// || 1464652800;
            let year = value[3] || 0;
            let month = value[2] || 0;
            let pointValue = value[1];
            // (1+r1)(1+r2)(1+r3)...(1+r12) - 1 : Historical return YTD caculation
            if (year <= maxYear)
                if (previousYear == year || previousYear == 0) {
                    avg *= (1 + pointValue);
                    previousYear = year;
                    tempArr[month] = pointValue;
                    if (maxYear == year && month == 12) {
                        avg *= (1 + pointValue);
                        tempArr[0] = (avg - 1).toFixed(2);
                        tempArrBig.push([previousYear, ...tempArr,,mainIndex]);
                    }
                } else {
                    /* this needs to be move inside historical returns chart computation */
                    /* year change condition to calculate avg and create a dataTable array for graph */
                    avg = 1;
                    avg *= (1 + pointValue);
                    tempArr[0] = (avg - 1).toFixed(2);
                    tempArrBig.push([previousYear, ...tempArr,mainIndex]);
                    previousYear = 0;
                    tempArr = [];
                    tempArr[month] = pointValue;
                }
            return [seriesDate.valueOf(), pointValue, month, year,mainIndex];
        });
        /* required sorting for all highchart series based on year and month */
        innerSeriesData.sort(function (a, b) { return a[3] - b[3] || a[2] - b[2] })

        /* prepare json for chart series  and table series */
        let modifiedSeriesData = {
            id: val.title, title: val.title, data: innerSeriesData, type: val.type || "line", lineWidth: val.lineWidth || 1,
            opacity: val.opacity || 1, tableSeries: tempArrBig, visible: !(val.initialHideOnGraph || false),
            initialHideOnGraph: val.initialHideOnGraph, threshold: val.threshold || 0, negativeColor: val.negativeColor || '#f3d1d6'
        }
        tempArrBig = [];
        return modifiedSeriesData;
    });
    // this.allModifiedChartSeries.push(modifiedPlotData);
    return modifiedPlotData;
}

export const highLightDataTableBands = (innerSeries) => {
    (innerSeries || []).map((v, i) => {
        v.forEach((value, index) => {
            let previousValue = v[index - 1] || [];
            let currentValue = value;
            let $selectedRow: any, $finalSelector;
            if (currentValue[1] == null || previousValue[1] == null) return;
            if (previousValue.length != 0) {
                let colorClass = (currentValue[1] > 0) ? 'table-positive' : 'table-negative';
                if (currentValue[3] != previousValue[3]) {
                    /* FIX REQUIRED: change the logic as contains does not provide exact rows required to be filter out */

                    $selectedRow = $("#historicalTable tr[data-year='" + currentValue[3] + "']");
                    $finalSelector = $("td:lt(" + (currentValue[2] + 2) + "):not(:first-child):not(:nth-child(2))", $selectedRow);
                    $finalSelector.addClass(colorClass);

                    for (let i = (previousValue[3] + 1); i <= (currentValue[3] - 1); i++) {
                        // $selectedRow = $("#historicalTable tr:contains(" + i + ") td:not(:first-child):not(:nth-child(2))").addClass(colorClass);;
                        $selectedRow = $("#historicalTable tr[data-year='" + i + "'] td:not(:first-child):not(:nth-child(2))").addClass(colorClass);;
                    }

                    $selectedRow = $("#historicalTable tr[data-year='" + previousValue[3] + "']");
                    $finalSelector = $("td:gt(" + previousValue[2] + ")", $selectedRow);
                    //plotband-positive-bg square-ticker-historic-graph-table
                    let classCode = (previousValue[1] > 0) ? 'plotband-positive-bg' : 'plotband-negative-bg'
                    $($finalSelector[0]).prepend("<div class='" + classCode + " square-ticker-historic-graph-table'>" + previousValue[4] + "</div>");
                    $finalSelector.addClass(colorClass);

                } else if (currentValue[3] == previousValue[3]) {

                    $selectedRow = $("#historicalTable tr[data-year='" + currentValue[3] + "']");
                    $finalSelector = $("td:lt(" + (currentValue[2] + 2) + "):gt(" + (previousValue[2]) + ")", $selectedRow);
                    let classCode = (previousValue[1] > 0) ? 'plotband-positive-bg' : 'plotband-negative-bg'
                    $($finalSelector[0]).prepend("<div class='" + classCode + " square-ticker-historic-graph-table'>" + previousValue[4] + "</div>");
                    // $($finalSelector[0]).css('color', 'red');
                    // $("td:lt(" + (currentValue[2] + 2) + "):gt(" + (previousValue[2]) + "):nth-child(1)", $selectedRow).attr("data-val", 1);
                    $finalSelector.addClass(colorClass);

                }
            }
        });
    })
}

export const removeHighLightDataTableBands = () => {
    $("#historicalTable").find(".table-positive ,.table-negative").removeClass("table-positive table-negative");
    $("#historicalTable").find(".square-ticker-historic-graph-table").remove();
}

/**
 * 
 * @param selector @deprecated Use react-router-hash-link instead
 */
export function scrollIntoView(selector: string) {
    if (selector && $(selector).length) {
        $('html, body').animate({
            scrollTop: $(selector).offset().top
        }, 1000);
    }
}

export function hashCode(str: string) {
    var hash = 0, i, chr, len;
    if (str.length === 0) return hash;

    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }

    return hash;
};

export const processAnnualizedTableData = (data, selectedTimeFrame) => {
    let sums = {};
    [...data].forEach(function (array) {
        array.forEach(function (pair) {
            if (Object.keys(sums).indexOf(pair[0]) !== -1) {
                sums[pair[0]].push(pair[1] || "")
            } else {
                sums[pair[0]] = new Array();
                sums[pair[0]].push(pair[0], pair[1] || "");
            }
        });
    });
    return sums;
}

export const highchartDataManipulation = (linkDataItem, funds?: Fund[]) => {
    const isOverviewPerfChart = (linkDataItem || []).some(series => series.entityType == "benchmark");
    let modified = (linkDataItem || []).filter(series => {
        return series.entityType == "benchmark"
    });

    let notModified = (linkDataItem || []).filter(series => {
        return series.entityType != "benchmark"
    });

    if (isOverviewPerfChart) {
        modified = modified.map((value) => {
            const start = (value.series.length - 1);
            let product = 1;
            let oneYrValue = 0;
            const oneYrAgo = moment(convertToMonthEnd(value.series[start][0])).add(-1, 'years').valueOf();
            if (convertToMonthEnd(value.series[0][0]) <= oneYrAgo) {
                for (let i = start; i >= 0 && oneYrAgo < convertToMonthEnd(value.series[i][0]); i--) {
                    product = (1 + parseFloat(value.series[i][1])) * product;
                }
                oneYrValue = product - 1;
            }
            let twoYrValue = 0;
            const twoYrAgo = moment(convertToMonthEnd(value.series[start][0])).add(-2, 'years').valueOf();
            product = 1;
            if (convertToMonthEnd(value.series[0][0]) <= twoYrAgo) {
                for (let i = start; i >= 0 && twoYrAgo < convertToMonthEnd(value.series[i][0]); i--) {
                    product = (1 + parseFloat(value.series[i][1])) * product;
                }
                twoYrValue = Math.pow(product, 12.0 / 24) - 1;
            }

            let threeYrValue = 0;
            const threeYrAgo = moment(convertToMonthEnd(value.series[start][0])).add(-3, 'years').valueOf();
            product = 1;
            if (convertToMonthEnd(value.series[0][0]) <= threeYrAgo) {
                for (let i = start; i >= 0 && threeYrAgo < convertToMonthEnd(value.series[i][0]); i--) {
                    product = (1 + parseFloat(value.series[i][1])) * product;
                }
                threeYrValue = Math.pow(product, 12.0 / 36) - 1;
            }

            let fiveYrValue = 0;
            const fiveYrAgo = moment(convertToMonthEnd(value.series[start][0])).add(-5, 'years').valueOf();
            product = 1;
            if (convertToMonthEnd(value.series[0][0]) <= fiveYrAgo) {
                for (let i = start; i >= 0 && fiveYrAgo < convertToMonthEnd(value.series[i][0]); i--) {
                    product = (1 + parseFloat(value.series[i][1])) * product;
                }
                fiveYrValue = Math.pow(product, 12.0 / 60) - 1;
            }

            const { inceptionDate } = funds[0];
            const inceptionDateValue = moment(new Date(inceptionDate)).valueOf();
            product = 1;
            let sinceInceptionValue = 0;
            if (convertToMonthEnd(value.series[0][0]) <= inceptionDateValue) {
                let j = 0;
                for (let i = start; inceptionDateValue < convertToMonthEnd(value.series[i][0]); i-- , j++) {
                    product = (1 + parseFloat(value.series[i][1])) * product;
                }
                sinceInceptionValue = Math.pow(product, 12.0 / j) - 1;
            }

            const innerSeriesModifiedData = [
                [NaN, (oneYrValue * 100).toFixed(6), NaN, NaN],
                [NaN, (twoYrValue * 100).toFixed(6), NaN, NaN],
                [NaN, (threeYrValue * 100).toFixed(6), NaN, NaN],
                [NaN, (fiveYrValue * 100).toFixed(6), NaN, NaN],
                [NaN, (sinceInceptionValue * 100).toFixed(6), NaN, NaN]
            ];

            return { title: value.title, series: innerSeriesModifiedData, type: value.type || "line", lineWidth: value.lineWidth || 1, opacity: value.opacity || 1, initialHideOnGraph: value.initialHideOnGraph || false, threshold: value.threshold || 0, negativeColor: value.negativeColor || null }


        });


    }
    // else {

    let modifiedPlotData = (notModified || []).map((val,outerIndex) => {
        let previousYear = 0;
        let avg = 1;
        /*single graph with multiple series iteration and manipulation */
        let innerSeriesData: any = [];
        let modifiedSeriesData: any = {};
        // if (!(val["isTimeframeBased"] || false)) {
        if (!val['initialHideOnGraph']) {
            innerSeriesData = (val["series"] || []).map((value, index) => {
                /*single series manipulation */
                let seriesDate = moment(convertToMonthEnd(value[0]));
                let year = parseInt(seriesDate.format('YYYY'));
                let month = parseInt(seriesDate.format('M'));
                let pointValue = parseFloat(value[1]);
                return [seriesDate.valueOf(), pointValue, month, year,outerIndex];
            });
            innerSeriesData.sort(function (a, b) { return a[3] - b[3] || a[2] - b[2] })
            modifiedSeriesData = { title: val.title, entityType: val.entityType, series: innerSeriesData, type: val.type || "line", lineWidth: val.lineWidth || 1, opacity: val.opacity || 1 }
        }
        else {
            let innerSeriesModifiedData: any = [];
            (val["series"] || []).map((value, index) => {
                /*single series manipulation to set null points on chart eg:historical return band series  */
                let previousValue = innerSeriesModifiedData[innerSeriesModifiedData.length - 1] || [];
                let seriesFromDate = moment(value[0], GRAPH_DATE_FORMAT_ON_HOVER);
                let fromYear = parseInt(seriesFromDate.format('YYYY'));
                let fromMonth = parseInt(seriesFromDate.format('M'));
                let seriesToDate = moment(value[1], GRAPH_DATE_FORMAT_ON_HOVER);
                let toYear = parseInt(seriesToDate.format('YYYY'));
                let toMonth = parseInt(seriesToDate.format('M'));
                let pointValue = parseFloat(value[2]);
                if (!isObjEmpty(previousValue)) {
                    innerSeriesModifiedData.push([parseInt(moment(previousValue[0]).add(1, 'months').format('x').valueOf()), null, previousValue[2], previousValue[3]]);
                    innerSeriesModifiedData.push([parseInt(seriesFromDate.subtract(1, 'months').format('x').valueOf()), null, fromMonth, fromYear]);
                }
                innerSeriesModifiedData.push([seriesFromDate.valueOf(), pointValue, fromMonth, fromYear]);
                innerSeriesModifiedData.push([seriesToDate.valueOf(), pointValue, toMonth, toYear]);

            });
            modifiedSeriesData = { title: val.title, series: innerSeriesModifiedData, type: val.type || "line", lineWidth: val.lineWidth || 1, opacity: val.opacity || 1, initialHideOnGraph: val.initialHideOnGraph || false, threshold: val.threshold || 0, negativeColor: val.negativeColor || null }
        }
        // } else {
        //     /* if chart series do not based on timeFrame then there will no need to process data */
        //     modifiedPlotData = (linkDataItem["plotData"] || []);
        // }
        /* required sorting for all highchart series based on year and month */

        return modifiedSeriesData;
    });
    if (modified.length) {
        return [...modifiedPlotData, ...modified];
    }

    return modifiedPlotData;

    // }

}

export const getVisibleHistoricSeries = (historicData) => {
    return historicData.filter((filterValue) => { return !filterValue.initialHideOnGraph }) || [];
}
export const getHiddenHistoricSeries = (historicData) => {
    return historicData.filter((filterValue) => { return filterValue.initialHideOnGraph }) || [];
}

export const findReplaceLinkComponentData = (parseData) => {
    let links = parseData.links || [];
    if (links.length > 0) {
        let allFetchData = links.map((val) => {
            let url = getChartApiPath({ entityType: val.entityType, entityId: val.fundRunnerId, source: val.source, fileName: val.link })
            return fetchWrapper(url).then(response => {
                let json = response.json();
                json["fundRunnerId"] = val.fundRunnerId;
                return json
            });
        });
        return Promise.all(allFetchData).then(values => { return { "plotData": [...values] } }).catch(error => error)
    }
    return Promise.resolve({});
}

// convert the date in 'MMM yyyy' format to month-end unix timestamp
// eg: input is 'Jun 1990', output will be unix timestmap value of '30-Jun-1990'
// note that input value is not mutated
export function convertToMonthEnd(mmmYyyyDateStr: string) {
    return moment(mmmYyyyDateStr, 'MMM YYYY')
        .add(1, 'months')
        .add(-1, 'days')
        .valueOf();
}

export const updateHistoricalReturnsNumber = () => {
    let dataLabelContainers = $('.highcharts-data-labels');
    for (let k = 0; k < dataLabelContainers.length; k++) {
        let dataLabelContainer = dataLabelContainers[k];
        let children = $(dataLabelContainer).children()
        for (let i = 0; i < children.length; i++) {
            console.log(`${i} - ${i % 2} - ${i % 2 == 0}`)
            if (i % 2 == 0) {
                $(children[i]).find('text').children().each((j, v) => {
                    $(v).text((i + 2) / 2);
                })
            } else {
                $(children[i]).hide()
            }
        }
    }
}

export const enableDataTableRDBands = () => {
    let runupTds = $("#runupFundTable_dataTable tbody").find("tr");
    runupTds.each((i, v) => {
        let query = $(v).find("td:first-child");
        let number = $(v).data("rownumber");
        query.prepend("<div class='plotband-positive-bg square-ticker-runup-drawdown-dataTable'>" + number + "</div>");
    });
    let drawdownIds = $("#drawdownFundTable_dataTable").find("tr");
    drawdownIds.each((i, v) => {
        let query = $(v).find("td:first-child");
        let number = $(v).data("rownumber");
        query.prepend("<div class='plotband-negative-bg square-ticker-runup-drawdown-dataTable'>" + number + "</div>");
    });
}

export const disableDataTableRDBands = () => {
    let runupTds = $("#runupFundTable_dataTable tbody").find("tr");
    runupTds.each((i, v) => {
        let query = $(v).find("td:first-child div");
        query.remove();
    });
    let drawdownIds = $("#drawdownFundTable_dataTable").find("tr");
    drawdownIds.each((i, v) => {
        let query = $(v).find("td:first-child div");
        query.remove();
    });
}