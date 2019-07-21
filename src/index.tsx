import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { IActionType } from './components/IActionType';

import Search from 'components/Search';
import TruckForm from 'components/TruckForm';
import TruckList from 'components/TruckList';

import './styles/styles.scss';

const store = createStore(function (state, action: IActionType) {
    const _state = state == null ? {
        message: '',
        type: ''
    } : state;
    console.log(action);

    switch (action.type) {
        case 'SEARCH_LOAD':
            return Object.assign({}, _state, {

            });
        case 'DELETE_TRUCK':
            return Object.assign({}, _state, {
                message: action.message,
                messageType: action.type
            });

        default:
            return _state;
    }
});

if (document.getElementById('my-struck-form')) {
    ReactDOM.render(
        <TruckForm/>,
        document.getElementById("my-struck-form")
    );
}

if (document.getElementById('my-struck-list')) {
    ReactDOM.render(
        <Provider store={store}>
        <TruckList pageSize={10} />
    </Provider>,
        document.getElementById("my-struck-list")
    );
}