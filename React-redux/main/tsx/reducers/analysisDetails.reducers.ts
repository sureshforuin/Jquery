import { FETCH_ANALYIS_START, FETCH_ANALYIS_SUCCESS, FETCH_ANALYIS_FAIL } from "../constants/constant";

const initialState = {
  loading: true,
  error: false,
  AnalysisDetails: null
}

export default function (state = initialState, action) {
  let AnalysisDetails;
  switch (action.type) {
      case FETCH_ANALYIS_SUCCESS:
          AnalysisDetails = action.payload;
          return { error: false, loading: false, AnalysisDetails };
      case FETCH_ANALYIS_FAIL:
          AnalysisDetails = action.payload;
          return { error: true, loading: false, AnalysisDetails };
      case FETCH_ANALYIS_SUCCESS:
          AnalysisDetails = null;
          return { error: false, loading: true, AnalysisDetails };
      default:
          return state;
  }
}