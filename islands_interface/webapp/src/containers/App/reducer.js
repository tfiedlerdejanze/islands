import {
    SET_LOADING,
    SET_PARTNER,
    SET_APP_DATA,
    SET_NEW_LOCALE,
} from './actionTypes';

export const appReducer = (state = {loading: false, partner: null}, action) => {
    switch (action.type) {
        case SET_LOADING:
            return {
                ...state,
                loading: action.loading
            };
        case SET_APP_DATA:
            return {
                ...state,
                ...action.data
            };
        default:
            return state;
    }
};
