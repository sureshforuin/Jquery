import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchMetaData } from '../actions/MonthlyUpdateAction1';
import { selectTimeFrameAction } from '../actions/timeframe.action';
import Paragraph from './Paragraph';
import TimeFrame from './TimeFrame';

class MonthlyUpdate1 extends React.Component<any, any> {
    
    componentDidMount() {
        console.log(this.props);
        this.props.actions.fetchMetaData();
        this.props.actions.selectTimeFrameAction("10/31/2017");
    }

    renderParagraphComponent(key, data, timeFrame = "Last_Mth", store = "MonthlyUpdateReducer1") {
        return (
            <div key={key + "a"}>
                <div className="blank-space-54"></div>
                <Paragraph storeToRetrieve={store} dataToRetrieve={data} timeFrameArg={timeFrame} />
            </div>
        )

    }

    renderTimeFrameComponent(data, store = "MonthlyUpdateReducer1") {
        return <TimeFrame key="aaas" storeToRetrieve={store} dataToRetrieve={data} />
    }

    renderBlockHeader(key, title) {
        return (
            <div key={key + "b"}>
                <div className="blank-space-54"></div>
                <div className="col-lg-12">
                    <h1 className="bottom-border-gray no-margin main-title">{title}</h1>
                </div>
            </div>
        );
    }
    defineComponent() {

        let blockData = this.props.MonthlyUpdatePropData.MonthlyUpdateReducer1[1].blocks;
        let timeframe = this.props.MonthlyUpdatePropData.MonthlyUpdateReducer1[1].timeFrames || null;
        let selectedTimeFrame = this.props.selectedTimeFrame;
        let TimeFrameComponent = (timeframe != null) ? this.renderTimeFrameComponent("timeFrames") : null;

        let ComponentToRender = blockData.map((block, index) => {
            let childComponents = block.data;
            let blockContent = childComponents.map((child, innerIndex) => {
                if (child.component == "paragraph") {
                    return this.renderParagraphComponent(innerIndex, child.id, selectedTimeFrame);
                }
            });

            return [this.renderBlockHeader(index, block.title), ...blockContent]
        })
        return [TimeFrameComponent, ...ComponentToRender]
    }
    render() {

        if (this.props.MonthlyUpdatePropData.loading) {
            return (
                <div className="container">
                    <p>Loading...  </p>
                </div>
            );
        }
        if (this.props.MonthlyUpdatePropData.error) {
            return (
                <div className="container">
                    <p>Error Occured Please contact administrator </p>
                </div>
            );
        }
        return (
            <div className="monthly-updates-page-body">
                <div className="container">
                    {this.defineComponent()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {

    return {
        MonthlyUpdatePropData: state.MonthlyUpdateReducer1,
        selectedTimeFrame: state.changeTimeFrame
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({ fetchMetaData: fetchMetaData, selectTimeFrameAction: selectTimeFrameAction }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyUpdate1);
