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
            selected: null,
        }

        this.setIslands = this.setIslands.bind(this);
        this.setSelected = this.setSelected.bind(this);
        this.unsetSelected = this.unsetSelected.bind(this);
        this.positionIsland = this.positionIsland.bind(this);
        this.positionIslandSuccess = this.positionIslandSuccess.bind(this);
        this.setSelectedIsland = this.setSelectedIsland.bind(this);
    }

    componentDidMount() {
        const {
            channel,
            player,
        } = this.state;

        channel.on("player_guessed_coordinate", response => {
            this.opponentGuess(response);
        })
    }

    componentWillUnmount() {

        const {
            channel,
            player,
        } = this.state;

        channel.off("player_guessed_coordinate", response => {
            this.opponentGuess(response);
        })
    }

    opponentGuess(response) {
        const {
            player
        } = this.state;

        if (response.player !== player.key) {
            console.log(response);
        }
    }


    unsetSelected() {
        this.setState({
            selected: null
        });
    }

    setSelected(x, y) {
        if (this.state.islands_set) return;
        this.setState({
            selected: {x, y}
        });
    }

    positionIsland(x, y) {
        const {
            selected_island,
            channel,
            player
        } = this.state;

        if (selected_island) {
            const onSuccess = () => this.positionIslandSuccess(x, y, selected_island);
            const onError = () => console.log('error');

            IslandsInterface.positionIsland(channel, player.key, selected_island, x, y, onSuccess, onError);
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

        const onSuccess = (response) => {
            this.setState({
                board: response.board,
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
            board,
            selected,
            islands_set,
            selected_island,
        } =  this.state;

        const maybe_island_coordinates = selected && selected_island && addOffsets({row: selected.x, col: selected.y}, selected_island)
        const pos_coordinates = Object.keys(board).reduce((acc, island) => {
            return acc.concat(board[island].coordinates)
        }, []);


        return boardRange.map((col) => {
            const maybePositionedCell = maybe_island_coordinates && maybe_island_coordinates.find((coord) => coord.row === row && coord.col === col);
            const positionedCell = pos_coordinates.find((coord) => coord.row === row && coord.col === col);

            const cellClass = classNames({
                [s['cell']]: true,
                [s['cell--positioned']]: positionedCell,
                [s['cell--selected']]: !islands_set && maybePositionedCell,
                [s['cell--set']]: positionedCell && islands_set,
            });

            return (
                <div key={col}
                    className={cellClass}
                    onMouseEnter={() => this.setSelected(row, col)}
                    onMouseLeave={this.unsetSelected}
                    onClick={() => this.positionIsland(row, col)}
                >
                    <div className={s.inner} />
                </div>
            );
        })
    }

    render() {
        const {
            island_set
        } = this.props;

        const {
            board,
            islands,
            selected_island,
        } = this.state;

        const positioned_island_count = Object.keys(board).filter(island => board[island].coordinates.length > 0).length;

        const className = classNames({
            [s.board]: true,
        });

        return (
            <div>
                <div className={s.filter}>
                    {!island_set &&
                        <div>
                            <ul className={s['filter--list']}>
                                {islands.map((island) => {
                                    const filterItemClass = classNames({
                                        [s['filter__item']]: true,
                                        [s['filter__item--selected']]: selected_island === island && !island_set,
                                    });

                                    return (
                                        <li onClick={() => this.setSelectedIsland(island)}
                                            className={filterItemClass}
                                            key={island}
                                        >
                                            {island}
                                        </li>
                                    );
                                })}
                            </ul>

                            <button disabled={positioned_island_count !== islands.length}
                                onClick={this.setIslands}
                            >
                                Set Islands
                            </button>
                        </div>
                    }
                </div>
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

