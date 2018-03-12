export default (state = null, action) => {

    switch (action.type){
        case "TIME_FRAME_CHANGE":
            let selectedTimeFrame = action.payload;
            return selectedTimeFrame;
        default:
            return state;
    }
}