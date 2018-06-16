import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Board from './../../components/Board/Board';
import OpponentBoard from './../../components/Board/OpponentBoard';
import Lightbox from './../../components/Lightbox/Lightbox';
import * as actions from './../App/actions';

import g from './../../styles/Grid.scss';
import s from './Game.scss';
import IslandsInterface from '../../../lib/islands_interface';

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: 'Set your islands',
            isOpen: false,
            channel: props.channel,
            player1: props.player1,
            player: props.player,
            player1_set: false,
            player2_set: false,
            islands_set: false,
        };

        this.onSetPlayerIslands = this.onSetPlayerIslands.bind(this)
        this.onBoardStateChange = this.onBoardStateChange.bind(this)
        this.onSetIslands = this.onSetIslands.bind(this)
        this.onPlayerAdded= this.onPlayerAdded.bind(this)
    }

    componentDidMount() {
        const {
            channel,
            player,
        } = this.state;


        channel.on("player_added", response => {
            this.onPlayerAdded(response);
        })

        channel.on("player_set_islands", response => {
            const {
                player1_set,
                player2_set,
                player1,
                player,
            } = this.state;
            let message;

            if (player.key !== response.player) {
                message = `${response.player} set their islands.`
            } else {
                message = "Waiting for other player."
            }

            const players_set = (response.player === "player2" && player1_set) ||
                                (response.player === "player1" && player2_set)

            if (players_set) {
                message = player.key === "player1" ? "Your turn" : `${player1.name}'s turn`;
                this.onSetIslands(message);
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

    onPlayerAdded(response) {
        const {
            actions: {
                addPlayer
            }
        } = this.props;

        addPlayer(response, this.state.channel);
        IslandsInterface.showSubscribers(this.state.channel);
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
            isOpen: true,
        })

        setTimeout(() => {
            this.setState({
                isOpen: false,
            })
        }, 2000)
    }

    render() {
        const {
            game_state,
            channel,
            player,
            player1,
            player2,
        } = this.props;

        const opponent = [player1, player2].find((pl) => pl.key !== player.key);

        const {
            islands_set,
            isOpen,
            message
        } = this.state;

        const opponentName = opponent.name ? `${opponent.name}'s board` : 'Waiting for an opponent';

        return (
            <div>{/*
                <Lightbox
                    isOpen={isOpen}
                    //hasCloseButton
                    onRequestClose={() => console.log('request close')}
                >
                    {message}
                </Lightbox>
                <div>
                    <h4 className={s.player}>player: {player.name}</h4>
                </div>
 */}
                <div className={s.info}>
                    <div>
                        <h2 className={s.headline}>{player1.name} vs. {player2.name}</h2>
                    </div>
                    <div>
                        <p className={s.message}>{message}</p>
                    </div>
                </div>
                <div className={g.row}>
                    <div className={g.col}>
                        <Board
                            player={player}
                            player1={player1}
                            player2={player2}
                            channel={channel}
                            islands_set={islands_set}
                            onSetPlayerIslands={this.onSetPlayerIslands}
                            onStateChange={this.onBoardStateChange}
                        />
                        <h2 className={s.headline}>{player.name}</h2>
                    </div>
                    <div className={g.col}>
                        <OpponentBoard
                            player={player}
                            player1={player1}
                            player2={player2}
                            channel={channel}
                            islands_set={islands_set}
                            onStateChange={this.onBoardStateChange}
                        />
                        <h2 className={s.headline}>{opponentName}</h2>
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
