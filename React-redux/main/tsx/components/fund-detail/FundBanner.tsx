import * as React from 'react';

export default class FundBanner extends React.Component<any, any> {

    render() {
        return (
            <div className="jumbotron fund-banner theme-blue-bg-color">
                <div className="container">
                    <div className="col-lg-8 col-md-8 col-sm-12">
                        <h1 className="no-top-margin">Citadel Kensington Global Strategies Fund LTD.</h1>
                        <span className="fund-subtitle">
                            <strong>Growth / Multi-Strategy</strong>
                            <strong>Inception Date: 01/01/1998</strong>
                        </span>
                    </div>
                    <div className="col-lg-4 col-sm-12 col-md-4 hidden-sm hidden-xs">
                        <ul className="list-group fund-banner-options text-right no-bottom-margin">
                            <li className="list-group-item text-uppercase ">
                                <a className="banner-text-right opaque-50 text-uppercase" onClick={() => false}>
                                    Add <span className="glyphicon glyphicon-plus-sign glyphicon-enlarge" aria-hidden="true"></span>
                                </a>
                            </li>
                            <li className="list-group-item text-uppercase ">
                                <a className="banner-text-right opaque-50 text-uppercase" onClick={() => false}>
                                    Save as favorite <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                                </a>
                            </li>
                            <li className="list-group-item text-uppercase ">
                                <a className="banner-text-right opaque-50 text-uppercase" onClick={() => false}>
                                    Download documents <span className="glyphicon glyphicon-download-alt"
                                        aria-hidden="true"></span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-lg-4 col-sm-12 hidden-lg hidden-md">
                        <ul className="list-group fund-banner-options text-left no-bottom-margin">
                            <li className="list-group-item text-uppercase no-left-padding">
                                <a className="text-uppercase" onClick={() => false}>
                                    Add <span className="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>
                                </a>
                            </li>
                            <li className="list-group-item text-uppercase no-left-padding">
                                <a className="text-uppercase" onClick={() => false}>
                                    Save as favorite <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                                </a>
                            </li>
                            <li className="list-group-item text-uppercase no-left-padding">
                                <a className="text-uppercase" onClick={() => false}>
                                    Download documents <span className="glyphicon glyphicon-download-alt"
                                        aria-hidden="true"></span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

}
