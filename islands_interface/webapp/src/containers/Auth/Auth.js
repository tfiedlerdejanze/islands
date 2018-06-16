import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import * as actions from './../App/actions';

import classNames from 'classnames';
import g from './../../styles/Grid.scss';
import s from './Auth.scss';

const className = classNames({
    [s.Auth]: true,
    [g.row]: true,
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

        this.createGameChannel = this.createGameChannel.bind(this);
        this.joinGameChannel = this.joinGameChannel.bind(this);
    }

    createGameChannel(name) {
        const {
            actions: {
                newGame
            }
        } = this.props;

        newGame(name);
    }

    joinGameChannel(channel_name, name) {
        const {
            actions: {
                joinGame
            }
        } = this.props;

        joinGame(channel_name, name);
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

        this.createGameChannel(createGameName);
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

        this.joinGameChannel(joinGameName, joinPlayerName);
    }

    render() {
        const {
            createGameName,
            joinGameName,
            joinPlayerName
        } = this.state;

        return (
            <div className={className}>
                <div className={g.col}>
                    <form onSubmit={this.handleCreateSubmit}>
                        <h2 className={s.headline}>New Game</h2>
                        <div>
                            <input className={s.input} name="game" placeholder="game" value={createGameName} onChange={this.handleCreateChange} />
                        </div>
                        <div>
                            <input className={s.submit} type="submit" />
                        </div>
                    </form>
                </div>
                <div className={g.col}>
                    <form onSubmit={this.handleJoinSubmit}>
                        <h2 className={s.headline}>Join Game</h2>
                        <div>
                            <input className={s.input} name="game" placeholder="game" value={joinGameName} onChange={this.handleJoinChange} />
                        </div>
                        <div>
                            <input className={s.input} name="player" placeholder="name" value={joinPlayerName} onChange={this.handlePlayerJoinChange} />
                        </div>
                        <div>
                            <input className={s.submit} type="submit" />
                        </div>
                    </form>
                </div>
            </div>
        );
    }
};

Auth.defaultProps = {
};

Auth.propTypes = {
};

const mapStateToProps = ({
}) => ({
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({...actions}, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
