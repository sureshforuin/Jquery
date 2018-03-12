import { SET_HISTORIC_DATA, FETCH_HISTORIC_SUCCESS, FETCH_HISTORIC_FAIL, CHART_ROOT, GRAPH_DATE_FORMAT_ON_HOVER, FETCH_HISTORICAL_RETURNS_FREQUENCY_SERIES, getChartApiPath, FETCH_ADD_HISTORIC_SUCCESS, REMOVE_HISTORIC_SERIES, HISTORIC_TIME_FRAME_CHANGES, HISTORIC_TOGGLE } from "../constants/constant";
import { fetchWrapper } from "../../utills/api_wrapper";
import * as moment from 'moment';
import { isObjEmpty, findReplaceLinkComponentData, convertToMonthEnd } from "../../utills/common";

export const setSeriesData = (data) => {
    data = modifiedSeries(data);
    return (dispatch) => {
        dispatch({
            type: SET_HISTORIC_DATA,
            payload: { data: data }
        })
    }
}

export const removeGraphSeriesFromStore = (seriesIndex, selectedFrequency, selectedTimeFrame) => {
    return dispatch => {
        dispatch({
            type: REMOVE_HISTORIC_SERIES,
            payload: { seriesIndex: seriesIndex, selectedChartFrequency: selectedFrequency, selectedTimeFrame: selectedTimeFrame }
        })
    }
}
export const fetchDataSuccess = (data, selectedChartFrequency?, selectedTimeFrame?) => {
    return {
        type: FETCH_HISTORIC_SUCCESS,
        payload: { data: data, selectedChartFrequency: selectedChartFrequency, selectedTimeFrame: selectedTimeFrame }
    }
}
export const fetchDataAddSuccess = (data, selectedChartFrequency?, selectedTimeFrame?) => {
    return {
        type: FETCH_ADD_HISTORIC_SUCCESS,
        payload: { data: data, selectedChartFrequency: selectedChartFrequency, selectedTimeFrame: selectedTimeFrame }
    }
}

export const fetchDataFail = (error) => {
    return {
        type: FETCH_HISTORIC_FAIL,
        payload: error
    }
}

export const fetchHistoricData = (type, fundRunnerIds, selectedChartFrequency?, selectedTimeFrame?) => {
    selectedChartFrequency = (selectedChartFrequency ? selectedChartFrequency : 1);
    let url = FETCH_HISTORICAL_RETURNS_FREQUENCY_SERIES + fundRunnerIds + "?frequency=" + selectedChartFrequency;
    return (dispatch) => {
        return fetchWrapper(url, 'GET')
            .then(response => response.json())
            .then(filterData => {
                if (selectedChartFrequency == 1) {
                    filterData.links = filterData.links.filter((linkObj) => {
                        return (linkObj.link != "fundRunup.json" && linkObj.link != "fundDrawdowns.json");
                    });
                }

                return filterData;
            })
            .then(parseData => findReplaceLinkComponentData(parseData))
            .then(resultParseData => {
                let modifiedPlotData = modifiedSeries((resultParseData.plotData || []));
                if (type == "add") {
                    dispatch(fetchDataAddSuccess(modifiedPlotData, selectedChartFrequency, selectedTimeFrame))
                } else if (type == "replace") {
                    dispatch(fetchDataSuccess(modifiedPlotData, selectedChartFrequency, selectedTimeFrame))
                }
            }).catch(error => dispatch(fetchDataFail(error)));
    }
}

export const setHistoricTimeFrame = (selectedFrequency, selectedTimeFrame, opts?) => {
    let selectedTimeFrameObj = { year: (selectedTimeFrame), other: { from: opts.from, to: opts.to } };
    return dispatch => {
        dispatch({
            type: HISTORIC_TIME_FRAME_CHANGES,
            payload: { selectedTimeFrame: selectedTimeFrameObj, selectedChartFrequency: selectedFrequency }
        })
    }
}

const modifiedSeries = (resultParseData) => {
    return (resultParseData.map((val, index) => {
        let previousYear = 0;
        let avg = 1;
        /*single graph with multiple series iteration and manipulation */
        let innerSeriesData: any = [];
        let modifiedSeriesData: any = {};
        // if (!(val["isTimeframeBased"] || false)) {
        if (!val['initialHideOnGraph']) {
            innerSeriesData = (val["series"] || []).map((value, innerIndex) => {
                /*single series manipulation */
                let seriesDate = moment(convertToMonthEnd(value[0]));
                let year = parseInt(seriesDate.format('YYYY'));
                let month = parseInt(seriesDate.format('M'));
                let pointValue = parseFloat(value[1]);
                return [seriesDate.valueOf(), pointValue, month, year,index];
            });
            innerSeriesData.sort(function (a, b) { return a[3] - b[3] || a[2] - b[2] })
            modifiedSeriesData = { title: val.title, series: innerSeriesData, type: "column", lineWidth: val.lineWidth || 1, opacity: val.opacity || 1, fundRunnerId: val.fundRunnerId, seriesColorId: index }
        }
        else {
            let innerSeriesModifiedData: any = [];
            let seriesCount = 1;
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
                    seriesCount++;
                    innerSeriesModifiedData.push([parseInt(moment(previousValue[0]).add(1, 'month').format('x').valueOf()), null, previousValue[2], previousValue[3]]);
                    innerSeriesModifiedData.push([parseInt(seriesFromDate.subtract(1, 'month').format('x').valueOf()), null, fromMonth, fromYear]);
                }
                innerSeriesModifiedData.push([seriesFromDate.valueOf(), pointValue, fromMonth, fromYear, seriesCount]);
                innerSeriesModifiedData.push([seriesToDate.valueOf(), pointValue, toMonth, toYear, seriesCount]);

            });
            modifiedSeriesData = { title: val.title, series: innerSeriesModifiedData, type: "area", lineWidth: val.lineWidth || 1, opacity: val.opacity || 1, initialHideOnGraph: val.initialHideOnGraph || false, threshold: val.threshold || 0, negativeColor: val.negativeColor || null, fundRunnerId: val.fundRunnerId }
        }
        return modifiedSeriesData;
    })
    )

}

export const toogleBandAction = (toggleStatus) => {
    return dispatch => {
        dispatch({
            type: HISTORIC_TOGGLE,
            payload: toggleStatus
        })
    }


}