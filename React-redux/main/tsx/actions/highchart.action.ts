import { SET_HIGHCHART_DATA, CLEAR_CHART_REDUCER, FETCH_OVERVIEW_PERFORMANCE_SERIES, FETCH_SET_HIGHCHART_FAIL, FETCH_SET_HIGHCHART_DATA, REMOVE_HIGHCHART_SERIES, FETCH_HISTORICAL_RETURNS_FREQUENCY_SERIES } from "../constants/constant";
import { findReplaceLinkComponentData, getOverviewTableModifiedSeries } from "../../utills/common";
import { fetchWrapper } from "../../utills/api_wrapper";

export const setHighChart = (data, id) => {
    return dispatch => {
        dispatch({
            type: SET_HIGHCHART_DATA,
            payload: { data: data, id: id }
        })
    }
}

export const updateHighchartReducers = (id) => {
    return dispatch => {
        dispatch({
            type: CLEAR_CHART_REDUCER,
            payload: { data: [], id: id }
        })
    }
}

const fetchDataSuccess = (data, chartId, type?) => {
    return {
        type: FETCH_SET_HIGHCHART_DATA,
        payload: { data: data.plotData[0], id: chartId, type: type }
    }
}
const fetchDataFail = (error) => {
    return {
        type: FETCH_SET_HIGHCHART_FAIL,
        payload: error.message
    }
}

export const removeHighChartSeries = (seriesIndex, id) => {
    return {
        type: REMOVE_HIGHCHART_SERIES,
        payload: { seriesIndex: seriesIndex, id: id }
    }
}

export const fetchOverviewPerformanceData = (fundRunnerId, id) => {
    let url = FETCH_OVERVIEW_PERFORMANCE_SERIES + fundRunnerId;
    return (dispatch) => {
        return fetchWrapper(url, 'GET').then(response => response.json())
            .then(parseData => findReplaceLinkComponentData(parseData))
            .then(resultParseData => {
                dispatch(fetchDataSuccess(resultParseData, id));
            }).catch(error => dispatch(fetchDataFail(error)));
    }
}


export const fetchOverviewBenchmark = (fundRunnerId, id, type) => {
    let url = FETCH_HISTORICAL_RETURNS_FREQUENCY_SERIES + fundRunnerId + "?frequency=1";
    return (dispatch) => {
        return fetchWrapper(url, 'GET').then(response => response.json())
            .then(parseData => findReplaceLinkComponentData(parseData))
            .then(resultParseData => {
                dispatch(fetchDataSuccess(resultParseData, id, type));
            }).catch(error => dispatch(fetchDataFail(error)));
    }
}