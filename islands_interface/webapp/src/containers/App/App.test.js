import {appReducer} from './reducer';
import {
    SET_LOADING,
    SET_APP_DATA,
    SET_NEW_LOCALE
} from './actionTypes';

describe('<App />', () => {
    describe('reducers', () => {
        it('SET_LOADING', () => {
            const newLoadingValue = true;

            const action = {
                type: SET_LOADING,
                loading: newLoadingValue
            };

            // This is the state of this component, not the root state.
            const state = appReducer({}, action);
            expect(state.loading).toBe(newLoadingValue);
        });

        it('SET_APP_DATA', () => {
            const newDataValue = {
                one: 'one',
                two: 2
            };

            const action = {
                type: SET_APP_DATA,
                data: newDataValue
            };

            // This is the state of this component, not the root state.
            const state = appReducer({}, action);
            expect(state).toEqual(newDataValue);
        });

        it('should return the unchanged state if an unknown action type is given', () => {
            const exeptedState = {
                same: 'same',
                sameSame: true
            };

            const action = {
                type: 'UNKNOWN_ACTION_TYPE'
            };

            // This is the state of this component, not the root state.
            const state = appReducer(exeptedState, action);
            expect(state).toEqual(exeptedState);
        });
    });
});


