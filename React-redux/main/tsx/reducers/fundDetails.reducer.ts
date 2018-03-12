import { FETCH_FUND_DETAIL_SUCCESS, FETCH_FUND_DETAIL_FAIL, FETCH_FUND_DETAIL_START } from '../constants/constant';

const initialState = {
    loading: true,
    error: false,
    FundDetails: null
}
export default function (state = initialState, action) {
    let FundDetails;
    switch (action.type) {
        case FETCH_FUND_DETAIL_SUCCESS:
            FundDetails = action.payload;
            return { error: false, loading: false, FundDetails };
        case FETCH_FUND_DETAIL_FAIL:
            FundDetails = action.payload;
            return { error: true, loading: false, FundDetails };
        case FETCH_FUND_DETAIL_START:
            FundDetails = null;
            return { error: false, loading: true, FundDetails };
        default:
            return state;
    }
}