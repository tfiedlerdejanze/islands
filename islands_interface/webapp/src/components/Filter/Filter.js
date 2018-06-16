
import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import s from './Filter.scss';

class Filter extends React.Component {

    render() {
        const {
            board,
            islands,
            selected_island,
            onSetSelectedIsland,
            onSetIslands,
        } = this.props;

        const positioned_island_count = Object.keys(board).filter(island => board[island].coordinates.length > 0).length;

        return (
            <div className={s.filter}>
                <ul className={s['filter--list']}>
                    {islands.map((island) => {
                        const filterItemClass = classNames({
                            [s['filter__item']]: true,
                            [s['filter__item--selected']]: selected_island === island,
                        });

                        return (
                            <li onClick={() => onSetSelectedIsland(island)}
                                className={filterItemClass}
                                key={island}
                            >
                                {island}
                            </li>
                        );
                    })}
                </ul>

                {positioned_island_count === islands.length &&
                    <button className={s.submit}
                        onClick={onSetIslands}
                    >
                        Set Islands
                    </button>
                }
            </div>
        );
    }
}

export default Filter;