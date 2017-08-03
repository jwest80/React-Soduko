import React, { Component } from 'react';
import './App.css';

import Board from './board/board'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>TENNESSEE</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Board></Board>
      </div>
    );
  }
}

export default App;
