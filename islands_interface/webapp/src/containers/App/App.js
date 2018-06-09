import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Board from './../../components/Board/Board';
import Auth from './../../components/Auth/Auth';
import * as actions from './actions';

import s from './App.scss';
import { SET_LOADING } from './actionTypes';

class App extends React.Component {
    constructor() {
        super();

        this.createGameChannel = this.createGameChannel.bind(this);
        this.joinGameChannel = this.joinGameChannel.bind(this);
    }

    async createGameChannel(name) {
        const {
            actions: {
                newGame
            }
        } = this.props;

        await newGame(name);
    }

    async joinGameChannel(channel_name, name) {
        const {
            actions: {
                joinGame
            }
        } = this.props;

        await joinGame(channel_name, name);
    }

    render() {
        const {
            game_state
        } = this.props;

        switch (game_state) {
            case "initialized":
                return <Auth
                    onCreateSubmit={(name) => this.createGameChannel(name)}
                    onJoinSubmit={(channel, name) => this.joinGameChannel(channel, name)}
                />;
                break;
            case "new_game":
            case "players_set":
                return <Board />;
                break;
            default:
                return <div>Loading...</div>;
        }
    }
}

const mapStateToProps = ({
    app: {
        game_state,
        channel
    }
}) => ({
    game_state,
    channel
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({...actions}, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
