import * as React from 'react';
import { connect } from 'react-redux';

import { fetchTimeFrameWiseData, widthBasedBootstrapClass } from '../../../utills/common';

class Paragraph extends React.Component<any, any> {

    render() {
        let paragraphData = this.props.propsData ? this.props.propsData[0] || null : null;
        let bootStrapClass = widthBasedBootstrapClass(this.props.width);
        let parentComponent = this.props.parentComponent ? this.props.parentComponent : "";

        if (paragraphData == null) {
            return (
                <div data-component-id={this.props.dataToRetrieve}>
                    {/* <p>No data Found</p> */}
                </div>
            );
        }
        if (paragraphData.description.length == 0) { return false; }
        return (
            <div className={bootStrapClass + " no-padding"} data-component-id={this.props.dataToRetrieve}>
                <div className="blank-space-54"></div>
                <h3 id={this.props.id} className="paragraph-title no-margin"> {paragraphData.title}</h3>
                <div className={parentComponent == "column" ? "hidden-lg hidden-md" : "blank-space-25"}></div>
                <div className="no-padding">
                    <h5 className="sub-title"> {paragraphData.subTitle} </h5>
                    <div className="paragraph-description" dangerouslySetInnerHTML={{ __html: paragraphData.description }}></div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    let dataToRender = props.data;
    return {
        propsData: dataToRender
    }
}

export default connect(mapStateToProps)(Paragraph);
