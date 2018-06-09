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

export const newGame = (name) => async (dispatch) => {
    let channel = IslandsInterface.newChannel(name, name);

    channel.on("player_added", response => {
        console.log(response);

        const appData = Object.assign({}, {
            game_state: "players_set",
            player1name: name,
            player2name: response.player_name,
            channel: channel
        });

        dispatch(setAppData(appData));
    })

    const startNewGame = () => {
        const appData = Object.assign({}, {
            game_state: "new_game",
            player1name: name,
            channel: channel
        });

        dispatch(setAppData(appData));
    };

    IslandsInterface.join(channel);
    IslandsInterface.newGame(channel, startNewGame, init);
}

export const joinGame = (channel_name, name) => async (dispatch) => {
    let channel = IslandsInterface.newChannel(channel_name, name);

    const updateAppData = () => {
        const appData = Object.assign({}, {
            game_state: "players_set",
            player1name: channel_name,
            player2name: name,
            channel: channel
        });

        dispatch(setAppData(appData));
    };

    IslandsInterface.join(channel);
    IslandsInterface.addPlayer(channel, name, updateAppData, init);
}

export const addPlayer = (channel, name) => async (dispatch) => {
    IslandsInterface.addPlayer(channel, name);

    const appData = Object.assign({}, {
        player2name: name,
        channel: channel
    });

    dispatch(setAppData(appData))
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