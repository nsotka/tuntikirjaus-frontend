import React, { Component } from 'react'
import { MdEdit } from 'react-icons/md'
import {Button} from 'react-bootstrap'

class EditButton extends Component {
    render() {
        return (
            <Button
                id="edit"
                className={
                    `Edit-button
                            ${!this.props.isMouseInside ? "Edit-hide" : null}`}
                onClick={(event) => this.props.showDialog(event, this.props.data)}
            >
                <span><MdEdit /></span>
            </Button>
        )
    }
}

export default EditButton
