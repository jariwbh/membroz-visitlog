import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { ProtectedRoute } from "./Components/ProtectedRoute"

import Login from './Pages/Login'
import Logout from './Pages/Logout'
import ForgotPassword from './Pages/ForgotPassword'

import Dashboard from './Pages/Dashboard'
import VisitLog from './Pages/VisitLog'
import Visitors from './Pages/Visitors'
import Hosts from './Pages/Hosts'

function App() {
  return (
    <React.Fragment>
      <Switch>
        <Route strict exact path="/login"
          render={props => (
            <Login {...props} component={Login} title="VisitLog - Login" />
          )}
        />

        <Route exact path="/forgotpassword" render={props => (
          <ForgotPassword {...props} component={ForgotPassword} title="Forgot Password" />
        )} />

        <ProtectedRoute path="/logout" component={Logout} />

        <ProtectedRoute exact path="/" title="VisitLog - Dashboard" component={Dashboard} />
        <ProtectedRoute path="/visitlog" title="VisitLog" component={VisitLog} />
        <ProtectedRoute path="/visitors" title="VisitLog - Visitors" component={Visitors} />
        <ProtectedRoute path="/hosts" title="VisitLog - Hosts" component={Hosts} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
