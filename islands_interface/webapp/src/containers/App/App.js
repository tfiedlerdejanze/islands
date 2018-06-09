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
            active_player,
            game_state,
            player1name,
            player2name,
            channel
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
                return (
                    <div>
                        <div>
                            {game_state}, {player1name} vs. {player2name}
                        </div>
                        <Board channel={channel} player={active_player} />
                    </div>
                );
                break;
            default:
                return <div>Loading...</div>;
        }
    }
}

const mapStateToProps = ({
    app: {
        active_player,
        game_state,
        player1name,
        player2name,
        channel
    }
}) => ({
    active_player,
    game_state,
    player1name,
    player2name,
    channel
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({...actions}, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
