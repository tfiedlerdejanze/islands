import React from 'react';
import PropTypes from 'prop-types';
import IslandsInterface from "./../../../lib/islands_interface"
import {boardRange} from "./../../../lib/utils";

import classNames from 'classnames';
import s from './Board.scss';

const className = classNames({
    [s.board]: true,
    [s['board--space']]: true,
});

class OpponentBoard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            player: props.player,
            channel: props.channel,
            turn: "player1",
            hits: [],
            misses: [],
            selected: null,
        }

        this.unsetSelected = this.unsetSelected.bind(this)
        this.setSelected = this.setSelected.bind(this);
    }

    componentDidMount() {
        const {
            channel,
        } = this.state;

        channel.on("player_guessed_coordinate", response => {
            this.playerGuess(response);
        })
    }

    componentWillUnmount() {
        const {
            channel,
        } = this.state;

        channel.off("player_guessed_coordinate", response => {
            this.playerGuess(response);
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

    playerGuess(response) {
        const {
            player,
        } = this.state;

        const {
            onStateChange,
            player1,
            player2
        } = this.props;

        if (response.player === player.key) {
            const opponent = response.player === player1.key ? player2 : player1;
            if (response.result.win === "win") {
                this.hit(response.row, response.col)
                onStateChange("You won!");
            } else if (response.result.island !== "none") {
                this.hit(response.row, response.col)
                onStateChange("You forested your opponent's " + response.result.island + " island! - " + opponent.name + "'s turn.");
            } else if (response.result.hit === true) {
                this.hit(response.row, response.col)
                onStateChange("Hit! - " + opponent.name + "'s turn.");
            } else {
                this.miss(response.row, response.col)
                onStateChange("Miss - " + opponent.name + "'s turn.");
            }
            this.setState({
                turn: opponent.key
            })
        } else {
            this.setState({
                turn: player.key
            })
        }
    }

    setSelected(x, y) {
        if (this.state.turn !== this.state.player.key) return;
        this.setState({
            selected: { x, y }
        });
    }

    unsetSelected() {
        this.setState({
            selected: null
        });
    }

    guessCoordinate() {
        const {
            selected,
            channel,
            player,
            misses,
            hits
        } = this.state;

        const row = selected.x;
        const col = selected.y;

        const isMiss = misses.find((coord) => coord.row === row && coord.col === col);
        const isHit = hits.find((coord) => coord.row === row && coord.col === col);

        if (!isMiss && !isHit) {
            IslandsInterface.guessCoordinate(channel, player.key, selected.x, selected.y);
        }
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
            selected,
            misses,
            hits,
        } =  this.state;

        const player_turn = this.state.turn === this.state.player.key;

        return boardRange.map((col) => {
            const isSelected = selected && !isMiss && !isHit && row === selected.x && col === selected.y;
            const isMiss = misses.find((coord) => coord.row === row && coord.col === col);
            const isHit = hits.find((coord) => coord.row === row && coord.col === col);

            const cellClass = classNames({
                [s['cell--selected']]: isSelected,
                [s['cell--miss']]: isMiss,
                [s['cell--hit']]: isHit,
                [s['cell']]: true,
            });

            const onClick = islands_set && player_turn ? () => this.guessCoordinate(row, col) : null;
            const onMouseEnter = islands_set && player_turn ? () => this.setSelected(row, col) : null;

            return (
                <div key={col}
                    className={cellClass}
                    onClick={onClick}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={this.unsetSelected}
                >
                    <div className={s.inner} />
                </div>
            );
        })
    }

    render() {
        return (
            <div>
                <div className={className}>
                    {this.renderBoard()}
                </div>
            </div>
        );
    }
};

OpponentBoard.defaultProps = {
};

OpponentBoard.propTypes = {
};

export default OpponentBoard;

