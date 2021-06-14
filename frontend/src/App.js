import React from 'react';
import {BrowserRouter,Route} from "react-router-dom";
import './App.css';
import { Provider } from 'react-redux';
import store  from './store';

import Home from './components/basic/homepage/Home';
import Homepage from './components/basic/homepage/homepage';
import Dashboard from './components/dashboard/backbone';
import TraineeRegister from './components/trainee/register/traineeregister';
import MainPortal from './components/trainee/examPortal/portal';
import Code from './components/trainee/examPortal/coding/index';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <nav>
          <Route exact path="/" component={Home} />
          <Route exact path="/auth/login" component={Homepage} />
          <Route exact path="/home" component={Homepage} />
          <Route exact path="/user" component={Dashboard}/>
          <Route path="/user/:options" component={Dashboard}/>
          <Route exact path="/candidate/register" component={TraineeRegister}/>
          <Route exact path="/candidate/taketest" component={MainPortal}/>
          <Route exact path="/test/code" component={Code}/>
          
        </nav>
      </BrowserRouter>
    </Provider> 
  );
}

export default App;
