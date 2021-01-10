import React, { Component } from 'react'

class MainHeader extends Component {
    render() {
        return (
            <h1 className="my-auto HeaderText text-truncate">{this.props.headerText}</h1>
        )
    }
}

export default MainHeader
