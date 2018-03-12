import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selectTimeFrameAction } from '../actions/timeframe.action';
class TimeFrame extends React.Component<any, any> {

    timeFrameChangeHandler(timeFrame = "last_Mnt") {
        this.props.actions.selectTimeFrameAction(timeFrame);
    }

    // componentDidMount(){
    //     this.timeFrameChangeHandler();
    // }
    componentDidCatch(error, info) {
        console.log("%d%s", "color:yellow;background-color:green", error);
    }
    renderTimeFrame() {

        return this.props.timeFrames.map((timeFrame, index) => {
            return (
                <li
                    key={index}
                    onClick={() => this.timeFrameChangeHandler(timeFrame)}
                >
                    <a>
                        {timeFrame}
                    </a>
                </li>
            );
        });
    }

    render() {

        if (this.props.timeFrames == undefined) {
            return <p>NO FRAME AVAILABLE </p>;
        }
        if (this.props.selectedTimeFrame == null) {
            return <p>NO TimeFrame Selected</p>
        }
        return (
            <div>
                <div className="blank-space-50"></div>
                <div className="dropdown col-md-3 col-xs-12 no-padding">
                    <button className="btn btn-default dropdown-toggle text-left col-md-12 col-xs-12"
                        type="button" id="menu1" data-toggle="dropdown">{this.props.selectedTimeFrame}
                        <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu">
                        {this.renderTimeFrame()}
                    </ul>
                </div>
            </div>
        );
    }

}

const mapStateToProps = (state, props) => {

    let storeToRetrieve = props.storeToRetrieve;
    let dataToRetrieve = props.dataToRetrieve;
    return {
        timeFrames: state[storeToRetrieve][storeToRetrieve][1][dataToRetrieve],
        selectedTimeFrame: state.changeTimeFrame
    }
}

const mapDispatchToProp = (dispatch) => {
    return {
        actions: bindActionCreators({ selectTimeFrameAction: selectTimeFrameAction }, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProp)(TimeFrame);
