import React, { Component } from 'react';
import './board.css';
import Square from './square';
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
        this.suduko.generate();
        let grid = this.suduko.getCurrent();
        this.setState({squares: this.suduko.getCurrent()});
        
        // TODO: Fix this to be promise or event
        let comp = this;
        setTimeout(function(){ 
            console.time("Solve");
            comp.suduko.solve(grid);
            console.timeEnd("Solve");
            comp.setState({squares: comp.suduko.getCurrent()});
        }, 1000);
    }

    componentWillUnmount() {
        // UnMount
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

        return (<div><table><tbody>{rows}</tbody></table><span></span>{JSON.stringify(this.state.squares)}</div>);
    }
}

export default Board;
