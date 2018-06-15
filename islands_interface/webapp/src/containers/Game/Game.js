import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Board from './../../components/Board/Board';
import OpponentBoard from './../../components/Board/OpponentBoard';
import * as actions from './../App/actions';

import s from './Game.scss';

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: 'Set your islands',
            channel: props.channel,
            player: props.player,
            player1_set: false,
            player2_set: false,
            islands_set: false,
        };

        this.onSetPlayerIslands = this.onSetPlayerIslands.bind(this)
        this.onBoardStateChange = this.onBoardStateChange.bind(this)
        this.onSetIslands = this.onSetIslands.bind(this)
        this.onAddPlayer= this.onAddPlayer.bind(this)
    }

    componentDidMount() {
        const {
            channel,
            player,
        } = this.state;


        channel.on("player_added", response => {
            this.onAddPlayer(response);
        })

        channel.on("player_set_islands", response => {
            const players_set = (response.player === "player2" && this.state.player1_set) || (response.player === "player1" && this.state.player2_set)
            let message = (player.key !== response.player)
                          ? `${response.player} set their islands`
                          : "Waiting for other player";

            if (players_set) {
                message = "Start game"
                this.onBoardStateChange(message);
                this.onSetIslands(message);
                return;
            }

            this.onBoardStateChange(message);
            this.setState({
                [`${response.player}_set`]: true,
            });
        })
    }

    componentWillUnmount() {
        const {
            channel
        } = this.state;

        channel.off("player_added", response => {
            console.log(response)
        })

        channel.off("player_set_islands", response => {
            console.log(response)
        })
    }

    onAddPlayer(response) {
        const {
            actions: {
                addPlayer
            }
        } = this.props;

        addPlayer(response, this.state.channel);
    }

    onSetIslands() {
        const {
            actions: {
                setIslands
            }
        } = this.props;

        setIslands(this.state.channel);
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

        return (
            <div>
                <div className={s.info}>
                    <div>
                        {game_state}, {player1.name} vs. {player2.name}
                    </div>
                    <div>
                        Player: {player.name} | {islands_set ? "Islands set" : "Islands not set"} | {message}
                    </div>
                </div>
                <div className={s.row}>
                    <div className={s.col}>
                        <Board
                            player={player}
                            channel={channel}
                            islands_set={islands_set}
                            onSetPlayerIslands={this.onSetPlayerIslands}
                            onStateChange={this.onBoardStateChange}
                        />
                    </div>
                    <div className={s.col}>
                        <OpponentBoard
                            player={player}
                            player1={player1}
                            player2={player2}
                            channel={channel}
                            onStateChange={this.onBoardStateChange}
                        />
                    </div>
                </div>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(Game);
