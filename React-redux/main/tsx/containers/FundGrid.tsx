import * as React from 'react';
import { connect } from 'react-redux';
import * as toastr from 'toastr';

import { fetchWrapper } from '../../utills/api_wrapper';
import { FETCH_FUND_INDEX, URL_CONFIG } from '../constants/constant';
import { addFund, clearFunds } from '../reducers/funds.reducer';
import Fund from '../models/fund';
import { getFunds } from '../selectors/funds.selector';
import { NavLink } from 'react-router-dom';
import { addFundToFavorites, removeFundFromFavorites } from '../reducers/favoriteFunds.reducer';
import { getFavoriteFunds, isFavoriteFund } from '../selectors/favoriteFunds.selector';

class FundGrid extends React.Component<FundGridProps, {}> {

    constructor(props) {
        super(props);
    }

    generateTableRows(funds: Fund[]) {
        const { addFundToFavorites, isFavoriteFund } = this.props;
        return funds.map((fund, index) => {
            return (
                <tr key={`fundGridRow-${fund.fundId}`}>
                    <td>
                        <i aria-hidden={true}
                            className={`favorite-fund-select-button fa fa-star${isFavoriteFund(fund) ? ' favorite-fund' : '-o'}`}
                            onClick={() => { this.toggleFavoriteFund(fund) }}></i>
                        {
                            fund.fundRunnerId === 1522293025 ? // Citadel Kensington Global Strategies Fund LTD
                                (
                                    <NavLink
                                        exact
                                        style={{ paddingLeft: '5px' }}
                                        to={`/funds/${fund.fundRunnerId}/${URL_CONFIG.FUND_DETAILS.OVERVIEW}`}>
                                        {fund.fundName}
                                    </NavLink>
                                ) :
                                (
                                    <a href='#' onClick={() => { toastr.info('Work in progress...', fund.fundName) }} style={{ paddingLeft: '5px' }}>
                                        {fund.fundName}
                                    </a>
                                )
                        }
                    </td>
                    <td>{fund.style}</td>
                    <td>{fund.fundAUM}</td>
                    <td>{fund.inceptionDate}</td>
                    <td>{fund.geographicFocus}</td>
                    <td>{fund.performance}</td>
                    <td>{fund.volatility}</td>
                    <td><i className="fa fa-plus-circle"></i></td>
                </tr>
            )
        });
    }

    render() {
        const { favoriteFunds, funds } = this.props;

        return (
            // (<ul>
            //     {this.props.funds.map(fund => <li key={fund.fundId}>{JSON.stringify(fund)}</li>)}
            // </ul>);
            <div id="fundIndexTableWrap" className="container fundIndexTableWrap">
                <div className="blank-space-50"></div>
                <ul className="nav nav-tabs">
                    <li className="active"><a data-toggle="tab" href="#allFunds">All Funds({funds.length}) </a></li>
                    <li><a data-toggle="tab" href="#holding">Holdings</a></li>
                    <li><a data-toggle="tab" href="#favourites">Favorites</a></li>
                </ul>
                <div className="tab-content">
                    <div id="allFunds" className="tab-pane fade in active">
                        <table id="fundIndexTable" className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Fund</th>
                                    <th>STRATEGY</th>
                                    <th>FUND AUM</th>
                                    <th>INCEPTION DATE</th>
                                    <th>GEOGRAPHIC FOCUS</th>
                                    <th>PERFORMANCE since Inception</th>
                                    <th>VOLITILITY since Inception</th>
                                    <th>Add</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.generateTableRows(funds)}
                            </tbody>
                        </table>
                    </div>
                    <div id="holding" className="tab-pane fade">
                        <table id="" className="table table-bordered ">
                            <thead>
                                <tr>
                                    <th>Fund</th>
                                    <th>STRATEGY</th>
                                    <th>FUND AUM</th>
                                    <th>INCEPTION DATE</th>
                                    <th>GEOGRAPHIC FOCUS</th>
                                    <th>PERFORMANCE since Inception</th>
                                    <th>VOLITILITY since Inception</th>
                                    <th>Add</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {this.generateTableContent()} */}
                            </tbody>
                        </table>
                    </div>
                    <div id="favourites" className="tab-pane fade">
                        <table id="" className="table table-bordered ">
                            <thead>
                                <tr>
                                    <th>Fund</th>
                                    <th>STRATEGY</th>
                                    <th>FUND AUM</th>
                                    <th>INCEPTION DATE</th>
                                    <th>GEOGRAPHIC FOCUS</th>
                                    <th>PERFORMANCE since Inception</th>
                                    <th>VOLITILITY since Inception</th>
                                    <th>Add</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.generateTableRows(favoriteFunds)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    toggleFavoriteFund(fund: Fund) {
        const { addFundToFavorites, isFavoriteFund, removeFundFromFavorites } = this.props;
        if (isFavoriteFund(fund)) {
            removeFundFromFavorites(fund);
        } else {
            addFundToFavorites(fund);
        }
    }

}

interface FundGridProps {
    addFundToFavorites: (fund: Fund) => any;
    favoriteFunds: Fund[];
    funds: Fund[];
    isFavoriteFund: (fund: Fund) => boolean;
    removeFundFromFavorites: (fund: Fund) => void;
}

function mapStateToProps(state) {
    return {
        isFavoriteFund: (fund: Fund) => isFavoriteFund(state, fund),
        favoriteFunds: getFavoriteFunds(state),
        funds: getFunds(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        addFundToFavorites: (fund: Fund) => dispatch(addFundToFavorites(fund)),
        removeFundFromFavorites: (fund: Fund) => dispatch(removeFundFromFavorites(fund))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FundGrid);