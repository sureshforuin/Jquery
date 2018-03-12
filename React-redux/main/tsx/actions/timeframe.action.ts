// import {FETCH_TABLE_MOCK_API, FETCH_MOCK_TABLE_SUCCESS} from  '../constants/constant';

function changeTimeFrameAction(timeFrameSelected) {
    return {
        type: "TIME_FRAME_CHANGE",
        payload: timeFrameSelected
    }
}

export const selectTimeFrameAction = (timeFrameSelected) => {
    return function (dispatch) {
        return dispatch(changeTimeFrameAction(timeFrameSelected));
    }
}