import React, { Component } from 'react'

export default class When extends Component {
    render() {
        const condition = this.props.condition;
        return (
            <>
                { condition === true &&
                    this.props.children
                }
            </>
        );
    }
}
