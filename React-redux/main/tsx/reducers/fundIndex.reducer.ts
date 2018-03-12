import { FETCH_FUNDINDEX_FAIL, FETCH_FUNDINDEX_SUCCESS } from "../constants/constant";

let initial_state = {
    loading: true,
    fundIndexData: [],
    error: false
}

export default function (state = initial_state, action) {

    switch (action.type) {
        case FETCH_FUNDINDEX_SUCCESS:
            return { loading: false, fundIndexData: action.payload, error: false };
        case FETCH_FUNDINDEX_FAIL:
            return { error: true, loading: false, message: action.payload.message };
        default:
            return state;
    }

}