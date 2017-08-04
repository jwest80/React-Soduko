import './sets.js';

class suduko {

    constructor() {
        this.problem = new Array(81);
        this.current = new Array(81);
        this.solutions = [];
        this.numberOfSolutions = 0;
        this.requiresBrutForce = false;
        this.possibleValues = new Set([1,2,3,4,5,6,7,8,9]);
    };

    generate() {
        this.problem = new Array(81).fill(null);
        //this.problem = [7,null,null,3,null,2,null,null,null,null,null,null,1,7,null,4,3,2,null,2,null,null,6,null,null,5,null,null,null,null,7,5,6,null,null,null,null,null,5,4,null,1,null,2,null,4,1,null,9,2,null,null,6,null,5,null,null,null,4,null,null,1,3,null,4,7,6,1,3,null,9,null,null,null,null,null,8,null,null,null,null];
        this.current = this.problem.slice();
    };

    getCurrent() {
        return this.current;
    }

    // Solve Soduko Grid
    solve(grid) {
        let updated = false;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (grid[this.getIndex(r,c)] == null) {
                    if(this.trySolveSquareElimination(grid,r,c)) {
                         updated = true;
                    };   
                    if(this.trySolveByCrossGroup(grid,r,c)) {
                        updated = true;
                    };                   
                }
            }
        }
        if (updated) {
            this.solve(grid);
        } else {
            if (!this.isSolved(grid)) {
                this.solutions = this.solveByBruteForce(grid,[]);
            } else {
                this.solutions.push(grid);
            }
            this.numberOfSolutions = this.solutions.length;
            this.current = this.solutions[0];
            console.log(this.solutions);
            return true
        }
    };

    // Set possible values for test square to items not in its (group, row, col). Cycle through all other null
    // valued squares in group.  If any SINGLE possible value can be eliminated from all other null squares then
    // set test square to possible value
    trySolveByCrossGroup(grid,r,c) {
        let sqrIndex = this.getIndex(r,c);
        let grpIndex = this.getGroupIndex(r, c);

        // Get all possible values not in Group, row, or Column.
        var indexSet = this.possibleValues.difference(new Set(this.getGroup(grid,r,c)));
        indexSet = indexSet.difference(new Set(this.getRow(grid,r)));
        indexSet = indexSet.difference(new Set(this.getCol(grid,c)));

        let rStart = Math.floor(grpIndex / 3) * 3;
        let cStart = (grpIndex % 3) * 3;

        for (let row = rStart; row < rStart + 3; row++) {
            for (let col = cStart; col < cStart + 3; col++) {
                let index = this.getIndex(row,col)
                
                // Only null value columns / rows can be a possible placement for indexSet, lets try to eliminate these options
                if (grid[index]  === null &&
                    this.getGroupIndex(row,col) === grpIndex &&
                    index !== sqrIndex) 
                {
                    //console.log("Null Square: " + row + ':' + col);
                    let squareSet = new Set(this.getRow(grid,row))
                        .union(new Set(this.getCol(grid,col)));

                    indexSet = indexSet.intersection(squareSet); // non intersecting values cannot be placed reliably, filter possibles
                }
            }
        }

        if (indexSet.size === 1) {
            //console.log('Solved - ' + r + ':' + c + ' = ' + indexSet.getByIndex(0));
            grid[this.getIndex(r,c)] = indexSet.getByIndex(0);
            return true;
        } else {
            return false;
        }
    }

    // Checks Row, Column, and Group for single square.  If all but 1 posible value 
    // is eliminated then the remaining value is inserted.
    trySolveSquareElimination(grid,r,c) {
            var indexSet = new Set();
            let row = this.getRow(grid,r);
            let col = this.getCol(grid,c);
            let grp = this.getGroup(grid,r,c);
            for (let x = 0; x < 9; x++ ) {
                indexSet.add(row[x]).add(col[x]).add(grp[x]);
            }
            let diff = this.possibleValues.difference(indexSet);
            if (diff.size === 1) {
                grid[this.getIndex(r,c)] = diff.getByIndex(0);
                return true;
            } else {
                return false;
            }
    }

    // Solve by guessing recursively
    solveByBruteForce (grid, solutions, maxSolutions) {
        let me = this;

        maxSolutions = maxSolutions || 5;
        if (solutions.length <= maxSolutions) {
            if (this.isSolved(grid)) {
                solutions.push(grid);
            } else {
                let next_square_index = grid.indexOf(null);
                let r = Math.floor(next_square_index / 9);
                let c = next_square_index % 9;
                let possibleValues = this.getPossibleValues(grid, r, c);

                possibleValues.forEach((val) => {
                    let copy = grid.slice();
                    copy[next_square_index] = val;
                    me.solveByBruteForce(copy, solutions);
                });
            }            
        }

        return solutions;
    }

    // Check if Grid is solved
    isSolved(grid) {
        return (grid.length === grid.filter((x) => { return x !== null}).length);
    }

    // Verify no bad answers
    verifyGrid(grid) {
        for (let x = 0; x < 9; x++) {
            if (
                this.hasDuplicates(this.getGroupByN(grid, x).filter((x) => {return x !== null})) ||
                this.hasDuplicates(this.getRow(grid, x).filter((x) => {return x !== null})) || 
                this.hasDuplicates(this.getCol(grid, x).filter((x) => {return x !== null}))
            ) return false;
        }
        return true;
    }

    // Get Possible Values
    getPossibleValues(grid,r,c) {
            let row = new Set(this.getRow(grid,r));
            let col = new Set(this.getCol(grid,c));
            let grp = new Set(this.getGroup(grid,r,c));
            let union = row.union(col.union(grp));
            return this.possibleValues.difference(union);
    }


    // Helper Functions
    getIndex(r, c) {
        return (r * 9) + c;
    }
    getGroupIndex(r, c) {
        r = Math.floor(r/3);
        c = Math.floor(c/3);
        return (r * 3) + c;
    }
    getGroupByN(grid, n) {
        function isInGroup(element, index, array) { 
            let r = Math.floor(index / 9);
            let c = index % 9;
            let n2 = (Math.floor(r/3)*3) + Math.floor(c/3);
            return (n2 === n); 
        } 
        return grid.filter(isInGroup);
    }
    getGroup(grid, rows, cols) {
        var n = this.getGroupIndex(rows, cols);
        return this.getGroupByN(grid, n);
    }
    getRow(grid, r) {
        let offset = (r * 9);
        return grid.slice(offset, offset+9);
    }
    getCol(grid, c) {
        function isInColumn(element, index, array) { 
            return (index % 9 === c) ; 
        } 
        return grid.filter(isInColumn);
    }
    hasDuplicates(arr) {
        if (arr.length !== (new Set(arr).size)) {
            return true;
        }
        return false;
    }
    printGrid(grid) {
        var gridString = "";
        for (var r = 0; r < 9; r++) {
            for (var c = 0; c < 9; c++) {
                let value = grid[this.getIndex(r,c)];
                if (!value) value = ' ';
                gridString += value + ' ';
            }
            gridString += "\n";
        }
        console.log(gridString);
    }
}

// Now we export our `Class` which will become an importable module.
export default suduko;

