import React from 'react';
import PropTypes from 'prop-types';
import IslandsInterface from "./../../../lib/islands_interface"
import {boardRange, blankBoard, offsets} from "./../../../lib/utils";

import Filter from './../Filter/Filter';

import classNames from 'classnames';
import s from './Board.scss';

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
            player: props.player,
            channel: props.channel,
            selected_island: null,
            board: blankBoard,
            selected: null,
            misses: [],
            hits: [],
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

    hit(row, col) {
        const { hits } = this.state;

        this.setState({
            hits: [ ...hits, {row: row, col: col} ]
        })

    }

    miss(row, col) {
        const { misses } = this.state;

        this.setState({
            misses: [ ...misses, {row: row, col: col} ]
        })
    }

    opponentGuess(response) {
        const {
            player
        } = this.state;

        const {
            onStateChange,
            player1,
            player2
        } = this.props;

        if (response.player !== player.key) {
            const opponent = response.player === player1.key ? player2 : player1;
            if (response.result.win === "win") {
                this.hit(response.row, response.col)
                onStateChange("You won!");
            } else if (response.result.island !== "none") {
                this.hit(response.row, response.col)
                onStateChange("Forested opponent's " + response.result.island + " island! Your turn.");
            } else if (response.result.hit === true) {
                this.hit(response.row, response.col)
                onStateChange("Hit by " + opponent.name + ". Your turn.");
            } else {
                this.miss(response.row, response.col)
                onStateChange("Miss. Your turn.");
            }
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
            hits,
            misses,
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
            const isMiss = misses.find((coord) => coord.row === row && coord.col === col);
            const isHit = hits.find((coord) => coord.row === row && coord.col === col);

            const cellClass = classNames({
                [s['cell']]: true,
                [s['cell--hit']]: isHit,
                [s['cell--miss']]: isMiss,
                [s['cell--positioned']]: positionedCell,
                [s['cell--selected']]: !islands_set && maybePositionedCell,
                [s['cell--set']]: islands_set && positionedCell,
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
            islands_set
        } = this.props;

        const {
            board,
            islands,
            selected_island,
        } = this.state;

        const className = classNames({
            [s.board]: true,
            [s['board--space']]: islands_set,
        });

        return (
            <div>
                {!islands_set &&
                    <Filter
                        board={board}
                        islands={islands}
                        selected_island={selected_island}
                        onSetSelectedIsland={this.setSelectedIsland}
                        onSetIslands={this.setIslands}
                    />
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

