import React from 'react';
import PropTypes from 'prop-types';
import IslandsInterface from "./../../../lib/islands_interface"
import {boardRange} from "./../../../lib/utils";

import classNames from 'classnames';
import s from './Board.scss';

const className = classNames({
    [s.board]: true,
});

class OpponentBoard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            player: {name: props.player.name, key: props.player.key},
            channel: props.channel,
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
            player,
        } = this.state;

        channel.on("player_guessed_coordinate", response => {
            this.playerGuess(response);
        })
    }

    componentWillUnmount() {

        const {
            channel,
            player,
        } = this.state;

        channel.off("player_guessed_coordinate", response => {
            this.playerGuess(response);
        })
    }

    playerGuess(response) {
        const {
            player,
            misses,
            hits,
        } = this.state;

        const {
            onStateChange,
            player1,
            player2
        } = this.props;


        if (response.player === player.key) {
            const opponent = response.player === player1.key ? player2 : player1;
            console.log('your opponent:', opponent.key);

            if (response.result.win === "win") {
                onStateChange("You won!");
                this.setState({
                    hits: [
                        ...hits,
                        {row: response.row, col: response.col}
                    ]
                })
            } else if (response.result.island !== "none") {
                //board = hit(board, response.row, response.col);
                onStateChange("You forested your opponent's " + response.result.island + " island! - " + opponent.name + "'s turn.");
                this.setState({
                    hits: [
                        ...hits,
                        {row: response.row, col: response.col}
                    ]
                })
            } else if (response.result.hit === true) {
                onStateChange("Hit! - " + opponent.name + "'s turn.");
                this.setState({
                    hits: [
                        ...hits,
                        {row: response.row, col: response.col}
                    ]
                })
            } else {
                onStateChange("Miss - " + opponent.name + "'s turn.");
                this.setState({
                    misses: [
                        ...misses,
                        {row: response.row, col: response.col}
                    ]
                })
                //this.setState({message: "Oops, you missed."});
                //board = miss(board, response.row, response.col);
            }
        }
    }

    setSelected(x, y) {
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
            selected,
            misses,
            hits,
        } =  this.state;

        return boardRange.map((col) => {
            const isSelected = !isMiss && !isHit && selected && row === selected.x && col === selected.y;
            const isMiss = misses.find((coord) => coord.row === row && coord.col === col);
            const isHit = hits.find((coord) => coord.row === row && coord.col === col);

            const cellClass = classNames({
                [s['cell--selected']]: isSelected,
                [s['cell--miss']]: isMiss,
                [s['cell--hit']]: isHit,
                [s['cell']]: true,
            });

            const onClick = () => this.guessCoordinate(row, col);
            const onMouseEnter = () => this.setSelected(row, col);

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
        const {
            player,
        } = this.props;

        return (
            <div>
                <div className={s.filter} />
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

