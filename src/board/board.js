import React, { Component } from 'react';
import './board.scss';
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
        let grid = this.state.squares.slice();
        if (!this.suduko.verifyGrid(grid)) {
            alert("Cannot solve: current grid contains invalid duplicates.");
            return;
        }

        console.time("Solve");
        this.suduko.solve(grid);
        this.suduko.current = grid.slice();
        this.setState({squares: grid});    
        console.timeEnd("Solve");
    }

    checkGrid() {
        let grid = this.state.squares;
        const isValid = this.suduko.verifyGrid(grid);
        const isSolved = this.suduko.isSolved(grid);
        
        if (!isValid) {
            alert("Invalid: Duplicate numbers found in rows, columns, or groups.");
        } else if (isSolved) {
            alert("Solved! Congratulations!");
        } else {
            alert("Valid so far, but not yet complete.");
        }
    }

    getInvalidCells(grid) {
        const invalid = new Set();

        function markDuplicates(cells) {
            const seen = {};
            cells.forEach(cell => {
                if (cell.value !== null) {
                    const key = cell.value;
                    if (!seen[key]) seen[key] = [];
                    seen[key].push(cell.index);
                }
            });
            Object.values(seen).forEach(positions => {
                if (positions.length > 1) {
                    positions.forEach(i => invalid.add(i));
                }
            });
        }

        for (let r = 0; r < 9; r++) {
            const rowCells = [];
            for (let c = 0; c < 9; c++) {
                rowCells.push({ value: grid[this.getIndex(r, c)], index: this.getIndex(r, c) });
            }
            markDuplicates(rowCells);
        }

        for (let c = 0; c < 9; c++) {
            const colCells = [];
            for (let r = 0; r < 9; r++) {
                colCells.push({ value: grid[this.getIndex(r, c)], index: this.getIndex(r, c) });
            }
            markDuplicates(colCells);
        }

        for (let gr = 0; gr < 3; gr++) {
            for (let gc = 0; gc < 3; gc++) {
                const groupCells = [];
                for (let r = gr * 3; r < gr * 3 + 3; r++) {
                    for (let c = gc * 3; c < gc * 3 + 3; c++) {
                        groupCells.push({ value: grid[this.getIndex(r, c)], index: this.getIndex(r, c) });
                    }
                }
                markDuplicates(groupCells);
            }
        }

        return invalid;
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
    renderRow(r, invalidCells) {
        const cols = [];
        for (let c = 0; c < 9; c++) {
            const index = this.getIndex(r,c);
            cols.push(
                <Square
                    key={index}
                    value={this.state.squares[index]}
                    row={r}
                    col={c}
                    invalid={invalidCells.has(index)}
                    onClick={(e,r,c) => this.handleClick(e,r,c)}
                ></Square>
            );
        }
        return cols;
    }
    render() {
        const invalidCells = this.getInvalidCells(this.state.squares);
        const rows = [];
        for (let r = 0; r < 9; r++) {
            rows.push(<tr key={r}>{this.renderRow(r, invalidCells)}</tr>);
        }    

        return (
            <div>
                <Generate onClick={(e,maxRemove) => this.newGrid(maxRemove)}></Generate>
                <table><tbody>{rows}</tbody></table>
                <div className='check-solve'>
                    <button onClick={() => this.checkGrid()}>Check</button>
                    <button onClick={() => this.solveGrid()}>Solve</button>
                </div>
            </div>
        );
    }
}

export default Board;
