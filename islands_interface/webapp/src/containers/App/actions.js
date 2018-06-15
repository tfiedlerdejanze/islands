import config from './../../config';

import IslandsInterface from "./../../../lib/islands_interface"

import {
    SET_APP_DATA,
} from './actionTypes';

const setAppData = (data) => {
    return {
        type: SET_APP_DATA,
        data,
    };
};

export const setIslands = (channel) => (dispatch) => {
    dispatch(setAppData({game_state: "islands_set", channel: channel}))
}

export const addPlayer = (response, channel) => (dispatch) => {
    const appData = Object.assign({}, {
        game_state: "players_set",
        player2: {name: response.player, key: "player2"},
        channel: channel
    });

    dispatch(setAppData(appData));
}

export const newGame = (name) => (dispatch) => {
    let channel = IslandsInterface.newChannel(name, name);

    const startNewGame = () => {
        const appData = Object.assign({}, {
            player: {name, key: "player1"},
            game_state: "new_game",
            player1: {name, key: "player1"},
            player2: {name: null, key: "player2"},
            channel: channel
        });

        dispatch(setAppData(appData));
    };

    IslandsInterface.join(channel);
    IslandsInterface.newGame(channel, startNewGame, init);
}

export const joinGame = (channel_name, name) => (dispatch) => {
    let channel = IslandsInterface.newChannel(channel_name, name);

    const updateAppData = () => {
        const appData = Object.assign({}, {
            game_state: "players_set",
            player: {name, key: "player2"},
            player1: {name: channel_name, key: "player1"},
            player2: {name, key: "player2"},
            channel: channel
        });

        dispatch(setAppData(appData));
    };

    IslandsInterface.join(channel);
    IslandsInterface.addPlayer(channel, name, updateAppData, init);
}


export const init = () => async (dispatch) => {
    await dispatch(fetchAppData());
}

export const fetchAppData = () => async (dispatch) => {
    const initialAppData = {
        game_state: "initialized",
        channel: null
    };

    const appData = Object.assign({}, initialAppData);

    dispatch(setAppData(appData));
};