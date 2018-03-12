import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { FUND_DETAIL_RESOURCE_GROUP_APIS } from "../../constants/constant";
import { fetchWrapper } from '../../../utills/api_wrapper';
import { FlyoutMenu } from './FlyoutMenu';
import { setInterval } from 'timers';

const DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

export default class FundDetailInPageNavigation extends React.Component<any, any> {

    flyoutMenu = null;

    constructor(props) {
        super(props);
        this.state = {
            hoverMenuItems: null,
            hoverMenuTitle: null,
            isLoading: true,
            menuItems: []
        }

        this.onLevelOneMenuItemMouseEnter = this.onLevelOneMenuItemMouseEnter.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);
        this.onMenuMouseLeave = this.onMenuMouseLeave.bind(this);
    }

    componentDidMount() {
        const promises = this.getAllResourceGroupData();
        Promise.all(promises)
            .then(allResourceGroupData => {
                const allBlocks = allResourceGroupData.map(rg => rg.blocks);
                this.setState({
                    isLoading: false,
                    menuItems: allBlocks
                });
            });
    }

    getAllResourceGroupData(): Promise<any>[] {
        return FUND_DETAIL_RESOURCE_GROUP_APIS.map(resourceGroup =>
            fetchWrapper(resourceGroup.api, 'GET')
                .then(response => response.json())
                .catch(error => {
                    console.error(`Error while fetching resource group ${resourceGroup.api}`);
                    console.error(error);
                    return {};
                })
        );
    }

    onLevelOneMenuItemMouseEnter(event) {
        const menuId = $(event.target).data('menuid');
        const menuIndex = FUND_DETAIL_RESOURCE_GROUP_APIS.findIndex(menuItem => menuItem.id === menuId);
        const hoverMenuTitle = FUND_DETAIL_RESOURCE_GROUP_APIS[menuIndex].title;
        const hoverMenuItems = this.state.menuItems[menuIndex] || null;
        this.setState({
            hoverMenuItems,
            hoverMenuTitle
        });
    }

    onMenuItemClick() {
        this.setState({
            hoverMenuItems: null,
        });
    }

    onMenuMouseLeave() {
        this.setState({
            hoverMenuItems: null,
        });

        if (this.flyoutMenu) {
            this.flyoutMenu.onMouseLeave();
        }
    }

    render() {
        if (this.state.isLoading) {
            return null;
        }

        const { hoverMenuItems, hoverMenuTitle } = this.state;

        return (
            <div className="fund-navigation">
                <div className="fund-navigation-inner container" onMouseLeave={this.onMenuMouseLeave}>
                    <ul className="nav nav-tabs text-center sub-menu level-one-menu">
                        {
                            FUND_DETAIL_RESOURCE_GROUP_APIS.map((api, index) => (
                                <li className="level-one-menu-item" key={api.id}>
                                    <NavLink
                                        activeClassName="active"
                                        data-menuid={api.id}
                                        exact
                                        onClick={this.onMenuItemClick}
                                        onMouseEnter={this.onLevelOneMenuItemMouseEnter}
                                        replace
                                        to={api.link}>
                                        {api.title}
                                    </NavLink>
                                </li>
                            ))
                        }
                    </ul>
                    <FlyoutMenu
                        description={DESCRIPTION}
                        isVisible={hoverMenuItems}
                        menuItems={hoverMenuItems}
                        onMenuItemClick={this.onMenuItemClick}
                        onRef={ref => this.flyoutMenu = ref}
                        title={hoverMenuTitle} />
                </div>
            </div >
        );
    }

}