import 'phoenix_html';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './setup/configureStore';
import {init} from './containers/App/actions';
import App from './containers/App/App';

const store = configureStore();
store.dispatch(init());

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

