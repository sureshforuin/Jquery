import * as React from 'react';

import User from "./User";

export default class RandomUser extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        this.getRandomUser();
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getRandomUser() {
        console.log('Getting random user...');
        return $.getJSON('https://randomuser.me/api/')
            .then(data => {
                this.setState({ user: data.results.pop() });
            });
    }

    render() {
        if (this.state.user) {
            return <User user={this.state.user} />
        }

        return null;
    }

}
