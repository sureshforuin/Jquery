import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selectTimeFrameAction } from '../../actions/timeframe.action';
import { fetchFundDetailsData } from '../../actions/fundDetails.action';

class TimeFrame extends React.Component<any, any> {

    timeFrameChangeHandler(timeFrame = "") {
        this.props.actions.fetchFundDetailsData(this.props.currentStore.currentStore,timeFrame);
    }

    renderTimeFrame() {
        return (this.props.timeframes || []).map((timeFrame, index) => {
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
        if (this.props.timeframes == undefined) {
            return <p>NO FRAME AVAILABLE </p>;
        }
        if (this.props.selectedTimeFrame == null) {
            return <p>NO TimeFrame Selected</p>
        }
        if (this.props.calendarControl == null) {
            return (
                <div className="col-lg-12 no-padding">
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
            )
        } else {
            return (
                <div className="col-lg-12 no-padding">
                    <div className="blank-space-50"></div>
                    <div className="dropdown col-md-3 col-xs-12 timeframe-component no-padding">
                        <input type="text" className="datepicker" value={this.props.selectedTimeFrame} />
                    </div>
                    {/* <div className="blank-space-54"></div> */}
                </div>
            );
        }
    }

}

const mapStateToProps = (state, props) => {
    return {
        timeframes: props.timeframes,
        selectedTimeFrame: state.changeTimeFrame,
        calendarControl: props.calendarControl,
        currentStore: state.CurrentStore
    }
}

const mapDispatchToProp = (dispatch) => {
    return {
        actions: bindActionCreators({ selectTimeFrameAction: selectTimeFrameAction, fetchFundDetailsData: fetchFundDetailsData }, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProp)(TimeFrame);

