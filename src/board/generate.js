import React, { Component } from 'react';
import './generate.scss';

class Generate extends Component {
    constructor() {
        super();
        this.state = {
        };
    }


    // There are no one anser solutions with less than 17 values on intial grid.
    // https://www.technologyreview.com/s/426554/mathematicians-solve-minimum-sudoku-problem/
    // Ref: arxiv.org/abs/1201.0749
    render() {
        return (
            <div className='generate'>
                <button onClick={(e) => this.props.onClick(e, 55)}>  
                    Hard
                </button>  
                <button onClick={(e) => this.props.onClick(e, 45)}>
                    Normal
                </button>  
                <button onClick={(e) => this.props.onClick(e, 35)}>
                    Easy
                </button>            
            </div>

        );
    }
}

export default Generate;
