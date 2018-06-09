import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import s from './Board.scss';

const className = classNames({
    [s.board]: true,
});

const board = Array.from({length: 10}, (v, k) => k+1);

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

    renderRows() {
        return board.map((_, x) => {
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

        return board.map((_, y) => {
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
                {this.renderRows()}
            </div>
        );
    }
};

Board.defaultProps = {
};

Board.propTypes = {
};

export default Board;

