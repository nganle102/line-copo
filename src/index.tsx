import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Search from './components/Search';
import TruckForm from './components/TruckForm';
import TruckList from './components/TruckList';

import './styles/styles.scss';


ReactDOM.render(
    <Search/>,
    document.getElementById("my-search")
);

ReactDOM.render(
    <TruckForm/>,
    document.getElementById("my-struck-form")
);

ReactDOM.render(
    <TruckList pageSize={10} />,
    document.getElementById("my-struck-list")
);