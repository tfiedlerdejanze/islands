import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Board from './../../components/Board/Board';
import OpponentBoard from './../../components/Board/OpponentBoard';
import Auth from './../../components/Auth/Auth';
import * as actions from './actions';

import s from './App.scss';
import { SET_LOADING } from './actionTypes';
import Game from '../Game/Game';

class App extends React.Component {
    constructor() {
        super();

        this.createGameChannel = this.createGameChannel.bind(this);
        this.joinGameChannel = this.joinGameChannel.bind(this);
    }

    createGameChannel(name) {
        const {
            actions: {
                newGame
            }
        } = this.props;

        newGame(name);
    }

    joinGameChannel(channel_name, name) {
        const {
            actions: {
                joinGame
            }
        } = this.props;

        joinGame(channel_name, name);
    }

    render() {
        const {
            game_state,
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
            case "islands_set":
                return (
                    <Game />
                );
                break;
            default:
                return <div>Loading...</div>;
        }
    }
}

const mapStateToProps = ({
    app: {
        game_state,
    }
}) => ({
    game_state,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({...actions}, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
