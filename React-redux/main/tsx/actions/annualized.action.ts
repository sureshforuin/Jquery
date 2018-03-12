import { ANNUALIZED_TIMEFRAME_CHANGES, GET_ANNUALIZED_DATA, ADD_ANNUALIZED_DATA, FETCH_ANNUALIZED_STATS_SERIES, FETCH_ANNUALIZED_STATS_FAIL,FETCH_ANNUALIZED_STATS_FROM_LIMA, getChartApiPath } from "../constants/constant";
import { fetchWrapper } from "../../utills/api_wrapper";
import { findReplaceLinkComponentData } from "../../utills/common";

export const ADD_TO_CUSTOM = 'ADD_TO_CUSTOM';

export const CLEAR_SELECTED_TIMEFRAME = 'CLEAR_SELECTED_TIMEFRAME';

export const setAnnualizedTimeFrame = (selectedtimeFrame) => {
    return dispatch => {
        dispatch({
            type: ANNUALIZED_TIMEFRAME_CHANGES,
            payload: selectedtimeFrame
        })
    }
}

export const setAnnualizedData = (data) => {
    return dispatch => {
        dispatch({
            type: GET_ANNUALIZED_DATA,
            payload: data
        });
    }
}

export const addAnnualizedData = (data) => {
    return {
        type: ADD_ANNUALIZED_DATA,
        payload: data[0]
    }
}

export const fetchDataFail = (error) => {
    return {
        type: FETCH_ANNUALIZED_STATS_FAIL,
        payload: error
    }
}

export const fetchAddAnnualizedData = (fundRunnerId) => {

    let url = FETCH_ANNUALIZED_STATS_SERIES + fundRunnerId;
    return (dispatch) => {
        fetchWrapper(url, 'GET')
            .then(response => response.json())
            .then(parseData => findReplaceLinkComponentData(parseData))
            .then(resData => {
                dispatch(addAnnualizedData(resData.plotData))}
            )
            .catch(error => dispatch(fetchDataFail(error)))
    }
}

export const fetchAddAnnualizedDataFromLIMA = ({fundIds,benchmarkIds,fromDate,toDate}) => {
    let resultSeries: any;
    let url = `${FETCH_ANNUALIZED_STATS_FROM_LIMA}?fundIds=${fundIds.join(',')}&benchmarkIds=${benchmarkIds.join(',')}&fromDate=${fromDate}&toDate=${toDate}`;
    return (dispatch) => {
        fetchWrapper(url, 'GET')
            .then(response => response.json())
            .then(appendData => {
                let statSeries: any = []
                statSeries = appendData.stats;
                dispatch(addToCustom(statSeries));
                dispatch(clearSelectedTimeFrame());
            })
            // .then(resData => {
            // dispatch(addAnnualizedData(resData))
            // })
            .catch(error => dispatch(fetchDataFail(error)))
    }
}

function addToCustom(statSeries) {
    return ({
        type: ADD_TO_CUSTOM,
        payload: statSeries
     })
}

function clearSelectedTimeFrame(){
    return ({
        type: CLEAR_SELECTED_TIMEFRAME
        
     })
}
