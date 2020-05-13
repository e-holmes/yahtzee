import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "../src/components/Navbar";
import Drawing from "./pages/Drawing";




class App extends Component {

  render() {
    return (
      <Router>
        <Navbar
          title="Yahtzee"
        ></Navbar>
        <Switch>
          <Route exact path="/" component={Drawing} />
          <Route exact path="/drawing" component={Drawing} />
        </Switch>
      </Router>
    );
  }
}

export default App;