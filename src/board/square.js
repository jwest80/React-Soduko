import React, { Component } from 'react';

class Square extends Component {
    constructor() {
        super();
        this.state = {
        };
    }
    render() {
        return (
            <td className="square" onMouseDown={(e) => this.props.onClick(e,this.props.row,this.props.col )} onContextMenu={(e) => e.preventDefault()} >
                {this.props.value}
            </td>
        );
    }
}

export default Square;