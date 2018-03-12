import { SET_FUND_BENCHMARK_ID } from "../constants/constant";

export const selectedFundRunnerIds = (fundRunnerId, chartId) => {

    dispatch => {
        dispatch({
            action: SET_FUND_BENCHMARK_ID,
            payload: { fundId: fundRunnerId, chartId: chartId }
        })
    }

}