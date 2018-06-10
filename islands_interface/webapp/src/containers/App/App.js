import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Board from './../../components/Board/Board';
import OpponentBoard from './../../components/Board/OpponentBoard';
import Auth from './../../components/Auth/Auth';
import * as actions from './actions';

import s from './App.scss';
import { SET_LOADING } from './actionTypes';

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            message: 'Set your islands',
            islands_set: false,
        };

        this.onSetPlayerIslands = this.onSetPlayerIslands.bind(this)
        this.onBoardStateChange = this.onBoardStateChange.bind(this)
        this.onSetIslands = this.onSetIslands.bind(this)

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

    onSetIslands() {
        const {
            actions: {
                setIslands
            }
        } = this.props;

        setIslands();
    }

    onSetPlayerIslands() {
        this.setState({
            islands_set: true,
        })
    }

    onBoardStateChange(message) {
        this.setState({
            message: message,
        })
    }

    render() {
        const {
            game_state,
            channel,
            player,
            player1,
            player2,
        } = this.props;

        const {
            islands_set,
            message
        } = this.state;

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
                            {game_state}, {player1.name} vs. {player2.name}
                        </div>
                        <div>
                            Player: {player.name} | {islands_set ? "Islands set" : "Islands not set"} | {message}
                        </div>
                        <Board
                            channel={channel}
                            player={player}
                            gameState={game_state}
                            islands_set={islands_set}
                            onSetIslands={this.onSetIslands}
                            onSetPlayerIslands={this.onSetPlayerIslands}
                            onStateChange={(message) => this.onBoardStateChange(message)}
                        />
                    </div>
                );
                break;
            case "islands_set":
                return (
                    <div>
                        <div>
                            {game_state}, {player1.name} vs. {player2.name}
                        </div>
                        <div>
                            Player: {player.name} | {islands_set ? "Islands set" : "Islands not set"} | {message}
                        </div>
                        <Board
                            channel={channel}
                            player={player}
                            game_state={game_state}
                            islands_set={islands_set}
                            onSetIslands={this.onSetIslands}
                            onSetPlayerIslands={this.onSetPlayerIslands}
                            onStateChange={(message) => this.onBoardStateChange(message)}
                        />
                        <OpponentBoard
                            channel={channel}
                            player1={player1}
                            player2={player2}
                            player={player}
                        />
                    </div>
                );
            default:
                return <div>Loading...</div>;
        }
    }
}

const mapStateToProps = ({
    app: {
        game_state,
        player1,
        player2,
        player,
        channel
    }
}) => ({
    game_state,
    player1,
    player2,
    player,
    channel
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({...actions}, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
