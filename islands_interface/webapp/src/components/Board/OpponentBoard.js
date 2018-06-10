import React from 'react';
import PropTypes from 'prop-types';
import IslandsInterface from "./../../../lib/islands_interface"
import {boardRange, blankBoard} from "./../../../lib/utils";

import classNames from 'classnames';
import s from './Board.scss';

const className = classNames({
    [s.board]: true,
});

class OpponentBoard extends React.Component {
    constructor(props) {
        super(props);

        const opponent = {player1: props.player1, player2: props.player2};
        delete opponent[props.player.key];

        console.log(opponent);

        this.state = {
            player: {name: props.player.name, key: props.player.key},
            opponent: opponent,
            channel: props.channel,
            board: blankBoard,
            selected: null,
        }

        this.setSelected = this.setSelected.bind(this);
    }

    componentDidMount() {
        const {
            channel,
            player,
        } = this.state;

        channel.on("player_guessed_coordinate", response => {
            console.log(response)
            //this.processGuess(response);
        })
    }

    componentWillUnmount() {
        const {
            channel
        } = this.state;

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

    guessCoordinate() {
        const {
            selected
        } = this.state;
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
        } =  this.state;

        return boardRange.map((y) => {
            const cellClass = classNames({
                [s['cell']]: true,
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
            player,
        } = this.props;

        return (
            <div className={className}>
                <button
                    onClick={this.guessCoordinate}
                >
                    Guess coord
                </button>
                {this.renderBoard()}
            </div>
        );
    }
};

OpponentBoard.defaultProps = {
};

OpponentBoard.propTypes = {
};

export default OpponentBoard;

