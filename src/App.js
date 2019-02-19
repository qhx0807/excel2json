import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './App.css'
import Excel2json from './components/e2j'
import Json2excel from './components/j2e'

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Excel2json} />
          <Route path='/j2e' component={Json2excel} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App
