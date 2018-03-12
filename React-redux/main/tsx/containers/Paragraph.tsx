import * as React from 'react';
import {connect} from 'react-redux';

import {fetchTimeFrameWiseData} from '../../utills/common';

class Paragraph extends React.Component<any, any> {

    render() {
        let paragraphData = this.props.propsData[0] || null;
        if (paragraphData == null) {
            return (
                <div>
                    <p>No data Found</p>
                </div>
            );
        }
        return (
            <div className="col-lg-12">
                <h3 className="paragraph-title"> {paragraphData.title}</h3>
                <div className="blank-space-10"></div>

                <div className="col-lg-8 no-padding">
                    <h5 className="sub-title"> {paragraphData.subTitle} </h5>
                    <div className="paragraph-description" dangerouslySetInnerHTML={{ __html: paragraphData.description }}></div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
   console.log(state);
   console.log(props);
    let storeToRetrieve = props.storeToRetrieve;
    let dataToRetrieve = props.dataToRetrieve;
    let timeFrameArg = props.timeFrameArg;
    let TimeFrameArr = state[storeToRetrieve][storeToRetrieve][1]["timeFrames"] || null
    let storeParagraphData = state[storeToRetrieve][storeToRetrieve][0][dataToRetrieve] || [];
    console.log("storeParagraphData");
    console.log(storeParagraphData);
    console.log(props.dataToRetrieve);
    let data = fetchTimeFrameWiseData(storeParagraphData, TimeFrameArr, timeFrameArg)
    return {
        propsData: data
    }
}

export default connect(mapStateToProps)(Paragraph);
