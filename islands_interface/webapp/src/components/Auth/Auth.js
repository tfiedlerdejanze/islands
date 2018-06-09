import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import s from './Auth.scss';

const className = classNames({
    [s.Auth]: true,
});


class Auth extends React.Component {
    constructor(props) {
        super(props);

        this.state ={
            createGameName: '',
            joinGameName: '',
            joinPlayerName: '',
        }

        this.handleJoinChange = this.handleJoinChange.bind(this);
        this.handlePlayerJoinChange = this.handlePlayerJoinChange.bind(this);
        this.handleCreateChange = this.handleCreateChange.bind(this);
        this.handleJoinSubmit = this.handleJoinSubmit.bind(this);
        this.handleCreateSubmit = this.handleCreateSubmit.bind(this);
    }

    handleCreateChange(event) {
        this.setState({
            createGameName: event.target.value
        });
    }

    handleJoinChange(event) {
        this.setState({
            joinGameName: event.target.value
        });
    }

    handlePlayerJoinChange(event) {
        this.setState({
            joinPlayerName: event.target.value
        });
    }

    handleCreateSubmit(event) {
        const {
            onCreateSubmit
        } = this.props;

        const {
            createGameName
        } = this.state;

        event.preventDefault();

        onCreateSubmit(createGameName);
    }

    handleJoinSubmit(event) {
        const {
            onJoinSubmit
        } = this.props;

        const {
            joinGameName,
            joinPlayerName
        } = this.state;

        event.preventDefault();

        console.log('join game', joinGameName)
        console.log('player', joinPlayerName)
        onJoinSubmit(joinGameName, joinPlayerName);
    }

    render() {
        const {
            createGameName,
            joinGameName,
            joinPlayerName
        } = this.state;

        return (
            <div className={className}>
                <form onSubmit={this.handleCreateSubmit}>
                    <h2>New Game</h2>
                    <div>
                        <input name="game" placeholder="game" value={createGameName} onChange={this.handleCreateChange} />
                    </div>
                    <div>
                        <input type="submit" />
                    </div>
                </form>
                <form onSubmit={this.handleJoinSubmit}>
                    <h2>Join Game</h2>
                    <div>
                        <input name="game" placeholder="game" value={joinGameName} onChange={this.handleJoinChange} />
                    </div>
                    <div>
                        <input name="player" placeholder="name" value={joinPlayerName} onChange={this.handlePlayerJoinChange} />
                    </div>
                    <div>
                        <input type="submit" />
                    </div>
                </form>
            </div>
        );
    }
};

Auth.defaultProps = {
};

Auth.propTypes = {
};

export default Auth;

