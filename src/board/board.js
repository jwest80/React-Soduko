import React, { Component } from 'react';
import './board.css';
import Square from './square';
import Generate from './generate';
import suduko from '../utility/suduko';

class Board extends Component {

    constructor() {
        super();
        this.state = {
            squares: Array(81).fill(null)
        };
        this.suduko = new suduko();
    }

    componentDidMount() {
        //this.newGrid();
        //this.solveGrid();
    }

    componentWillUnmount() {
        // UnMount
    }

    newGrid(maxRemove) {
        this.suduko.generate(maxRemove);
        let grid =  this.suduko.getCurrent();
        this.setState({squares: this.suduko.getCurrent()});    
    }

    solveGrid() {
        console.time("Solve");
        let grid =  this.suduko.getCurrent();
        this.suduko.solve(grid);
        this.setState({squares: this.suduko.getCurrent()});    
        console.timeEnd("Solve");
    }

    // Helper
    getIndex(rows, cols) {
        return (rows * 9) + cols;
    }


    // User Events
    incSquare(value) {
        if (value) {
            return value === 9 ? null : ++value;
        } else {
            return 1;
        }
    }
    decSquare(value) {
        if (value) {
            return value === 1 ? null : --value;
        } else {
            return 9;
        }
    }
    handleClick(event, row, col) {
        console.log(row + ":" + col);
        const items = this.state.squares.slice();
        let index = this.getIndex(row, col);
        if (event.buttons === 1) {
            items[index] = this.incSquare(items[index]);
        } else if (event.buttons === 2) {
            items[index] = this.decSquare(items[index]);
        }
        this.setState({squares: items});
    }

    // RENDER
    renderRow(r) {
        var cols = [];
        for (var c = 0; c < 9; c++) {
            var index = this.getIndex(r,c);
            cols.push(<Square key={index} value={this.state.squares[index]} row={r} col={c} onClick={(e,r,c) => this.handleClick(e,r,c)}></Square>);
        }
        return cols;
    }
    render() {
        var rows = [];
        for (var r = 0; r < 9; r++) {
            rows.push(<tr key={r}>{this.renderRow(r)}</tr>);
        }    

        return (
            <div>
                <Generate onClick={(e,maxRemove) => this.newGrid(maxRemove)}></Generate>
                <table><tbody>{rows}</tbody></table>
            </div>
        );
    }
}

export default Board;
