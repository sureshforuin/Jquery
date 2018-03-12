import { fetchWrapper } from "../../utills/api_wrapper";
import { FETCH_FUNDINDEX_SUCCESS, FETCH_FUNDINDEX_FAIL, FETCH_FUND_INDEX } from "../constants/constant";

export const fetchFundIndex = () => {
    
    return dispatch => fetchWrapper(FETCH_FUND_INDEX, 'GET')
        .then((response) => response.json())
        .then(parseData => dispatch(fundIndexSuccess(parseData)))
        .catch(error => dispatch(fundIndexFail(error)))
}

const fundIndexSuccess = (data) => {
    return {
        type: FETCH_FUNDINDEX_SUCCESS,
        payload: data
    }
}

const fundIndexFail = (error) => {
    return {
        type: FETCH_FUNDINDEX_FAIL,
        payload: error
    }
}