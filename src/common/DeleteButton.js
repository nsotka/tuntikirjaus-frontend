import React, { Component } from 'react'
import { MdDelete } from 'react-icons/md'
import { Button } from 'react-bootstrap'

class DeleteButton extends Component {
    render() {
        return (
            <Button
                variant="danger"
                id="delete"
                className={
                    `Edit-button ml-2
                            ${!this.props.isMouseInside ? "Edit-hide" : null}`}
                onClick={() => this.props.showDelete(this.props.data)}
            >
                <span><MdDelete /></span>
            </Button>
        )
    }
}

export default DeleteButton
