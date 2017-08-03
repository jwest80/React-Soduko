import './sets.js';

class suduko {

    constructor() {
        this.problem = new Array(81);
        this.current = new Array(81);
        this.answer = new Array(81)
        this.possibleValues = new Set([1,2,3,4,5,6,7,8,9]);
    };

    generate() {
        console.log('generate');
        this.problem = [7,null,null,3,null,2,null,null,null,null,null,null,1,7,null,4,3,2,null,2,null,null,6,null,null,5,null,null,null,null,7,5,6,null,null,null,null,null,5,4,null,1,null,2,null,4,1,null,9,2,null,null,6,null,5,null,null,null,4,null,null,1,3,null,4,7,6,1,3,null,9,null,null,null,null,null,8,null,null,null,null];
        this.current = this.problem.slice();
        this.finish = [7,5,4,3,9,2,1,8,6,9,6,8,1,7,5,4,3,2,3,2,1,8,6,4,9,5,7,8,9,2,7,5,6,3,4,1,6,7,5,4,3,1,8,2,9,4,1,3,9,2,8,7,6,5,5,8,9,2,4,7,6,1,3,2,4,7,6,1,3,5,9,8,1,3,6,5,8,9,2,7,4];
    };

    getCurrent() {
        return this.current;
    }

    solve() {
        let updated = false;
        //this.trySolveByCrossGroup(4,1);
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (this.current[this.getIndex(r,c)] == null) {
                    if(this.trySolveSquareElimination(r,c)) {
                         updated = true;
                    };   
                    if(this.trySolveByCrossGroup(r,c)) {
                        updated = true;
                    };                   
                }
            }
        }
        if (updated) {
            this.solve();
        } else {
            console.log('Finished');
            console.log(this.current);
        }
    };

    // Set possible values for test square to items not in its (group, row, col). Cycle through all other null
    // valued squares in group.  If any SINGLE possible value can be eliminated from all other null squares then
    // set test square to possible value
    trySolveByCrossGroup(r,c) {
        let sqrIndex = this.getIndex(r,c);
        let grpIndex = this.getGroupIndex(r, c);

        // Get all possible values not in Group, row, or Column.
        var indexSet = this.possibleValues.difference(new Set(this.getGroup(r,c)));
        indexSet = indexSet.difference(new Set(this.getRow(r)));
        indexSet = indexSet.difference(new Set(this.getCol(c)));

        //console.log("Test Square: " + r + ':' + c);
        //console.log("Possibel values = " + [...indexSet]);

        let rStart = Math.floor(grpIndex / 3) * 3;
        let cStart = (grpIndex % 3) * 3;
        let tempArr = [];
        for (let row = rStart; row < rStart + 3; row++) {
            for (let col = cStart; col < cStart + 3; col++) {
                let index = this.getIndex(row,col)
                let squareSet = new Set();
                
                // Only null value columns / rows can be a possible placement for indexSet, lets try to eliminate these options
                //console.log('Current Index: ' + this.current[index])
                if (this.current[index]  === null &&
                    this.getGroupIndex(row,col) === grpIndex &&
                    index !== sqrIndex) 
                {
                    //console.log("Null Square: " + row + ':' + col);
                    let squareSet = new Set(this.getRow(row))
                        .union(new Set(this.getCol(col)));

                    indexSet = indexSet.intersection(squareSet); // non intersecting values cannot be placed reliably, filter possibles
                }
            }
        }

        if (indexSet.size === 1) {
            console.log('Solved - ' + r + ':' + c + ' = ' + indexSet.getByIndex(0));
            this.current[this.getIndex(r,c)] = indexSet.getByIndex(0);
            return true;
        } else {
            return false;
        }
    }

    // Checks Row, Column, and Group for single square.  If all but 1 posible value 
    // is eliminated then the remaining value is inserted.
    trySolveSquareElimination(r,c) {
            var indexSet = new Set();
            let row = this.getRow(r);
            let col = this.getCol(c);
            let grp = this.getGroup(r,c);
            for (let x = 0; x < 9; x++ ) {
                indexSet.add(row[x]).add(col[x]).add(grp[x]);
            }
            let diff = this.possibleValues.difference(indexSet);
            if (diff.size === 1) {
                console.log('Solved - ' + r + ':' + c + ' = ' + diff.getByIndex(0));
                this.current[this.getIndex(r,c)] = diff.getByIndex(0);
                return true;
            } else {
                return false;
            }
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
    getGroupByN(n) {
        function isInGroup(element, index, array) { 
            let r = Math.floor(index / 9);
            let c = index % 9;
            let n2 = (Math.floor(r/3)*3) + Math.floor(c/3);
            return (n2 === n); 
        } 
        return this.current.filter(isInGroup);
    }
    getGroup(rows, cols) {
        var n = this.getGroupIndex(rows, cols);
        return this.getGroupByN(n);
    }
    getRow(r) {
        let offset = (r * 9);
        return this.current.slice(offset, offset+9);
    }
    getCol(c) {
        function isInColumn(element, index, array) { 
            return (index % 9 === c) ; 
        } 
        return this.current.filter(isInColumn);
    }

}

// Now we export our `Class` which will become an importable module.
export default suduko;

