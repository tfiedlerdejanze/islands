import {
    SET_LOADING,
    SET_APP_DATA,
} from './actionTypes';

export const appReducer = (state = {loading: false}, action) => {
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
