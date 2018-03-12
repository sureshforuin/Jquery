import { getChartApiPath, SET_CUMULATIVE_DATA, FETCH_CUMULATIVE_SUCCESS, FETCH_CUMULATIVE_FAIL, GRAPH_DATE_FORMAT_ON_HOVER, FETCH_CUMULATIVE_SERIES, REMOVE_SERIES_FROM_CUMULATIVE_CHART } from "../constants/constant";
import { fetchWrapper } from "../../utills/api_wrapper";
import * as moment from 'moment';
import { isObjEmpty, findReplaceLinkComponentData, convertToMonthEnd } from "../../utills/common";

export const setCumulativeSeriesData = (data) => {
    data = modifiedSeries(data);
    return (dispatch) => {
        dispatch({
            type: SET_CUMULATIVE_DATA,
            payload: data
        })
    }
}


export const fetchDataSuccess = (data) => {
    return {
        type: FETCH_CUMULATIVE_SUCCESS,
        payload: (data ? data[0] : {})
    }
}


export const fetchDataFail = (error) => {
    return {
        type: FETCH_CUMULATIVE_FAIL,
        payload: error
    }
}

export const removeGraphSeriesFromCumulativeStore = storeSeries => dispatch => dispatch({
    type:REMOVE_SERIES_FROM_CUMULATIVE_CHART,
    payload:storeSeries
})


export const fetchCumulativeData = (fundRunnerIds, selectedChartFrequency?) => {
    let url = FETCH_CUMULATIVE_SERIES + fundRunnerIds;
    return (dispatch) => {
        return fetchWrapper(url, 'GET').then(response => response.json())
            .then(parseData => findReplaceLinkComponentData(parseData))
            .then(resultParseData => {
                let modifiedPlotData = modifiedSeries((resultParseData.plotData || []));
                dispatch(fetchDataSuccess(modifiedPlotData))
            }).catch(error => dispatch(fetchDataFail(error)));
    }
}

const modifiedSeries = (resultParseData) => {
    return (resultParseData.map((val, index) => {
        let previousYear = 0;
        let avg = 1;
        /*single graph with multiple series iteration and manipulation */
        let innerSeriesData: any = [];
        let modifiedSeriesData: any = {};
        innerSeriesData = (val["series"] || []).map((value, index) => {

            /*single series manipulation */
            let seriesDate = moment(convertToMonthEnd(value[0]));
            let year = parseInt(seriesDate.format('YYYY'));
            let month = parseInt(seriesDate.format('M'));
            let pointValue = parseFloat(value[1]);
            return [seriesDate.valueOf(), pointValue, month, year];
        });
        innerSeriesData.sort(function (a, b) { return a[3] - b[3] || a[2] - b[2] })
        modifiedSeriesData = { title: val.title, series: innerSeriesData, type: val.type || "line", lineWidth: val.lineWidth || 1, opacity: val.opacity || 1, fundRunnerId: val.fundRunnerId }
        /* required sorting for all highchart series based on year and month */
        return modifiedSeriesData;
    })
    )

}