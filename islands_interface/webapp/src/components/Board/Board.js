import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import s from './Board.scss';

const className = classNames({
    [s.board]: true,
});

const boardRange = Array.from({length: 10}, (v, k) => k+1);

class Board extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: null
        }

        this.setSelected = this.setSelected.bind(this);
    }

    setSelected(x, y) {
        this.setState({
            selected: {x, y}
        });
    }

    renderBoard() {
        return boardRange.map((_, x) => {
            return (
                <div key={x} className={s.row}>
                    {this.renderCells(x)}
                </div>
            );
        })

    }

    renderCells(row) {
        const {
            selected
        } =  this.state;

        return boardRange.map((_, y) => {
            const cellClass = classNames({
                [s['cell']]: true,
                [s['cell--selected']]: selected && (row === selected.x) && (y === selected.y)
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

        } = this.props;

        return (
            <div className={className}>
                {this.renderBoard()}
            </div>
        );
    }
};

Board.defaultProps = {
};

Board.propTypes = {
};

export default Board;

