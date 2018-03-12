const addSeries = (actionId) => {

}

export const removeSeries = (actionId, seriesID) => {
    let modifiedSeries = [];
    return {
        type: "remove_lineChart_series",
        payload: {
            "id": actionId,
            "data": modifiedSeries
        }
    }
}