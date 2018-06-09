import {renderApp} from '../';

export const renderer = () => next => action => {
    if (action.type === 'RENDER') {
        renderApp();
    }
    next(action);
};
