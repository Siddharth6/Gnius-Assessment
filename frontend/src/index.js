import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import App from './App';
import * as serviceWorker from './serviceWorker';

moment().utcOffset("+05:30");

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
