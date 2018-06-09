import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Board from './../../components/Board/Board';
import * as actions from './actions';

import s from './App.scss';

class App extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
    }

    render() {
        const {
        } = this.props;

        return (
            <div>
                <Board />
            </div>
        );
    }
}

const mapStateToProps = ({
}) => ({
});

const mapDispatchToProps = dispatch => ({
    //appActions: bindActionCreators({...actions}, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
