import React, { Component } from 'react';
import './App.scss';

import Board from './board/board'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Sudoku</h2>
        </div>
        <p className="App-intro">
          Generate Sudoku board with different difficulty level. Click on the button to generate a new board.
        </p>
        <Board></Board>
      </div>
    );
  }
}

export default App;
