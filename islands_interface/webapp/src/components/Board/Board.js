import React from 'react';
import PropTypes from 'prop-types';
import IslandsInterface from "./../../../lib/islands_interface"
import {boardRange, blankBoard} from "./../../../lib/utils";

import classNames from 'classnames';
import s from './Board.scss';

const offsets = {
    atoll: [[0, 0], [0, 1], [1, 1], [2, 0], [2, 1]],
    s_shape: [[0, 1], [0, 2], [1, 0], [1, 1]],
    l_shape: [[0, 0], [1, 0], [2, 0], [2, 1]],
    square: [[0, 0], [0, 1], [1, 0], [1, 1]],
    dot: [[0, 0]]
}

const addOffsets = (coordinate, island) => {
    return offsets[island].map((offset) => {
        const row_offset = offset[0];
        const col_offset = offset[1];

        return {row: coordinate.row + row_offset, col: coordinate.col + col_offset}
    })
};

class Board extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            islands: ["atoll", "dot", "l_shape", "s_shape", "square"],
            player: {name: props.player.name, key: props.player.key},
            channel: props.channel,
            selected_island: null,
            board: blankBoard,
            player1_set: false,
            player2_set: false,
            islands_set: false,
            board: {
                l_shape: {coordinates: []},
                s_shape: {coordinates: []},
                square: {coordinates: []},
                attol: {coordinates: []},
                dot: {coordinates: []},
            },
            selected: null,
        }

        this.setIslands = this.setIslands.bind(this);
        this.setSelected = this.setSelected.bind(this);
        this.positionIsland = this.positionIsland.bind(this);
        this.positionIslandSuccess = this.positionIslandSuccess.bind(this);
        this.setSelectedIsland = this.setSelectedIsland.bind(this);
    }

    componentDidMount() {
        const {
            channel,
            player,
        } = this.state;

        channel.on("player_set_islands", response => {
            const players_set = (response.player === "player2" && this.state.player1_set) || (response.player === "player1" && this.state.player2_set)
            let message = (player.key !== response.player)
                          ? `${response.player} set their islands`
                          : "Waiting for other player";

            if (players_set) {
                message = "Start game"
                this.props.onStateChange(message);
                this.props.onSetIslands(message);
                return;
            }

            this.props.onStateChange(message);
            this.setState({
                [`${response.player}_set`]: true,
            });
        })

        channel.on("player_guessed_coordinate", response => {
            console.log(response)
            //this.processGuess(response);
        })
    }

    componentWillUnmount() {
        const {
            channel
        } = this.state;

        channel.off("player_set_islands", response => {
            console.log(response)
        })

        channel.off("player_guessed_coordinate", response => {
            console.log(response)
            //this.processGuess(response);
        });
    }

    setSelected(x, y) {
        this.setState({
            selected: {x, y}
        });
    }

    positionIsland() {
        const {
            selected_island,
            selected,
            channel,
            player
        } = this.state;

        if (selected_island) {
            const onSuccess = () => this.positionIslandSuccess(selected.x, selected.y, selected_island);
            const onError = () => console.log('error');

            IslandsInterface.positionIsland(channel, player.key, selected_island, selected.x, selected.y, onSuccess, onError);
        }
    }

    positionIslandSuccess(row, col, island) {
        const {
            board,
        } = this.state;

        this.setState({
            board: {
                ...board,
                [island]: {
                    coordinates: addOffsets({row: row, col: col}, island)
                }
            }
        });
    }

    setIslands() {
        const {
            channel,
            player
        } = this.state;

        const onSuccess = (board) => {
            this.setState({
                board: board,
                islands_set: true,
            })

            this.props.onSetPlayerIslands();
        };

        const onError = () =>  this.setState({islands_set: false});
        IslandsInterface.setIslands(channel, player.key, onSuccess, onError);

      }

    setSelectedIsland(island) {
        this.setState({
            selected_island: island
        });
    }

    renderBoard() {
        return boardRange.map((x) => {
            return (
                <div key={x} className={s.row}>
                    {this.renderCells(x)}
                </div>
            );
        })

    }

    renderCells(row) {
        const {
            islands_set
        } = this.props;

        const {
            board,
            selected,
        } =  this.state;

        const pos_coordinates = Object.keys(board).reduce((acc, island) => {
            return acc.concat(board[island].coordinates)
        }, []);

        return boardRange.map((y) => {
            const positionedCell = pos_coordinates.find((coord) => coord.row === row && coord.col === y);

            const cellClass = classNames({
                [s['cell']]: true,
                [s['cell--positioned']]: positionedCell,
                [s['cell--set']]: positionedCell && islands_set,
                [s['cell--selected']]: selected && (row === selected.x) && (y === selected.y),
            });

            return (
                <div key={y} className={cellClass} onClick={() => this.setSelected(row, y)}>
                    <div className={s.inner} />
                </div>
            );
        })
    }

    render() {
        const {
            game_state,
            island_set
        } = this.props;

        const {
            board,
            islands,
            selected,
            selected_island,
        } = this.state;

        const positioned_island_count = Object.keys(board).filter(island => board[island].coordinates.length > 0).length;

        const className = classNames({
            [s.board]: game_state !== "islands_set",
            [s['board--small']]: game_state === "islands_set"
        });

        return (
            <div>
                {game_state !== "islands_set" &&
                    <div>
                        <ul className={s.filter}>
                            {islands.map((island) => {
                                const filetItemClass = classNames({
                                    [s['filter__item']]: true,
                                    [s['filter__item--selected']]: selected_island === island && !island_set,
                                });

                                return (
                                    <li onClick={() => this.setSelectedIsland(island)}
                                        className={filetItemClass}
                                        key={island}
                                    >
                                        {island}
                                    </li>
                                );
                            })}
                        </ul>

                        <button disabled={!selected_island || !selected_island && selected}
                            onClick={this.positionIsland}
                        >
                            Position islands
                        </button>
                        <button disabled={positioned_island_count !== islands.length}
                            onClick={this.setIslands}
                        >
                            Set Islands
                        </button>
                    </div>
                }
                <div className={className}>
                    {this.renderBoard()}
                </div>
            </div>
        );
    }
};

Board.defaultProps = {
};

Board.propTypes = {
};

export default Board;

