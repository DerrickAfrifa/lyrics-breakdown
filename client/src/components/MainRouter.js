import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import Information from './Information';
import Leaderboards from './Leaderboards';
import Stage from './Stage';
import Login from './Login';
import Logout from './Logout';
import UserRegister from './UserRegister';
import UserDashboard from './UserDashboard';

/**
Component: MainRouter
This is the main router, with this we ensure we maintain everything within
a single environment. Add as many routes as necessary.
*/

const MainRouter = () => (

  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route exact path='/information' component={Information}/>
      <Route exact path='/leaderboards' component={Leaderboards}/>
      <Route path='/game/:gameId/:gameTitle' component={Stage}/>
      <Route path='/login' component={Login}/>
      <Route path='/logout' component={Logout}/>
      <Route path='/register' component={UserRegister}/>
      <Route path='/dashboard' component={UserDashboard}/>
    </Switch>
  </main>

);

export default MainRouter;
