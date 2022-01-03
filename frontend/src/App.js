import React from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import "animate.css";
import "./style/base.scss";
import "./style/App.scss";
import Register from "./views/Pages/Register";
import Login from './views/Pages/Login'
import Home from './views/Pages/Home'
import uploadPicture from "./views/upload/uploadPicture";
import createTask from "./views/Task/createTask";
import myTask  from "./views/Task/myTask";
import myacceptTask from "./views/Task/myacceptTask";
import acceptTask from "./views/Task/acceptTask";
import Label from './views/Label/label'



const App = () => (
  <Router>
    <Switch>
      {/* <Route path="/" exact render={() => <Redirect to="/login" />} /> */}
      <Route path="/" exact render={() => <Redirect to="/login" />} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/home" component={Home} />
      <Route path='/uploadPicture' component = {uploadPicture} />
      <Route path='/createTask' component = {createTask} />
      <Route path='/myTask' component = {myTask}/>
      <Route path = "/acceptTask" component = {acceptTask}/>
      <Route path = '/myacceptTask' component={myacceptTask}/>
      <Route path = "/label" component = {Label}/>
    </Switch>
  </Router>
);

export default App;
