import config from './../../config';

import {
    SET_APP_DATA,
} from './actionTypes';

const setLocale = (locale) => {
    return {
        type: SET_NEW_LOCALE,
        locale,
    };
};

const setAppData = (data) => {
    return {
        type: SET_APP_DATA,
        data,
    };
};

export const init = () => async (dispatch) => {
    await dispatch(fetchAppData());
}

export const fetchAppData = () => async (dispatch) => {
    const appData = Object.assign({}, {});

    dispatch(setAppData(appData));
};
