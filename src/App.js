import './App.css';
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Login from "./login/Login"
import Projects from "./projects/Projects"
import SingleProject from './singleproject/SingleProject';
import { BaseUrl, BaseIp } from './api/ApiClient'
import ActionCable from 'actioncable'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: localStorage.getItem('Auth') ? true : false,
      loginFailed: false,
      currentUser: localStorage.getItem('User') ? JSON.parse(localStorage.getItem('User')) : null
    }

    this.appCable = {}

    this.appCable = ActionCable.createConsumer(`ws://${BaseIp}:3000/api/v1/cable`)
  }

  handleLogin = (event) => {
    event.preventDefault()

    const username = event.target.email.value
    const password = event.target.password.value

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: {
          email: username,
          password: password
        }
      })
    }

    fetch(BaseUrl + "/sign_in/", requestOptions)
      .then(res =>
        res.json().then(data => ({
          status: res.status,
          authHeader: res.headers.get('Authorization'),
          data
        }))
      )
      .then(result => {
        if (result.status === 200) {
          if (result.data.is_success) {
            result.authHeader && localStorage.setItem('Auth', result.authHeader)
            localStorage.setItem('User', JSON.stringify(result.data.data.user))
            this.setState({
              isLoggedIn: true,
              currentUser: JSON.parse(localStorage.getItem('User'))
            })
          }
          else {
            this.loginDidFail(true)
          }
        }
      })
  }

  loginDidFail = (failed) => {
    this.setState({
      loginFailed: failed
    })
  }

  handleLogout = () => {
    this.setState({
      isLoggedIn: false
    })
    localStorage.removeItem('Auth')
    localStorage.removeItem('User')
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/">
              {this.state.isLoggedIn ?
                <Redirect push to={{ pathname: "/projects" }} /> :
                <Login
                  loginDidFail={this.loginDidFail}
                  handleLogin={this.handleLogin}
                  loginFailed={this.state.loginFailed}
                />}
            </Route>
            <Route exact push path="/projects">
              <Projects
                handleLogout={this.handleLogout}
                isLoggedIn={this.state.isLoggedIn}
                data-appCable={this.appCable}
                currentUser={this.state.currentUser}
              />
            </Route>
            <Route path="/login">
            {this.state.isLoggedIn ?
                <Redirect push to={{ pathname: "/projects" }} /> :
                <Login
                  loginDidFail={this.loginDidFail}
                  handleLogin={this.handleLogin}
                  loginFailed={this.state.loginFailed}
                />}
            </Route>
            <Route path="/projects/:id" render={(props) =>
              <SingleProject
                data-appCable={this.appCable}
                {...props}
                handleLogout={this.handleLogout}
                isLoggedIn={this.state.isLoggedIn}
                currentUser={this.state.currentUser}
              />}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}
export default App;