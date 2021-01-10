import React, { Component } from 'react'
import { Modal, Form, Button } from 'react-bootstrap';
import BaseUrl from '../api/ApiClient'

class DeleteModal extends Component {

    handleSubmit = (event) => {
        event.preventDefault()

        const targetId = this.props.data.id

        if (this.props.parent === "Projects") {
            this.requestDeleteProject(targetId)
        }
        else if (this.props.parent === "SingleProject") {
            const projectId = this.props.data.project_id
            this.requestDeleteTask(projectId, targetId)
        }
    }

    requestDeleteProject = (projectId) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Authorization': localStorage.getItem('Auth'),
                'Content-Type': 'application/json'
            }
        }

        fetch(BaseUrl + `/projects/${projectId}`, requestOptions)
            .then(res => {
                if (res.status === 200) {
                    this.props.closeDelete()
                }
                else if (res.status === 401) {
                    this.props.handleLogout()
                }
            })
    }

    requestDeleteTask = (projectId, taskId) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Authorization': localStorage.getItem('Auth'),
                'Content-Type': 'application/json'
            }
        }

        fetch(BaseUrl + `/projects/${projectId}/tasks/${taskId}`, requestOptions)
            .then(res => {
                if (res.status === 200) {
                    this.props.closeDelete()
                }
                else if (res.status === 401) {
                    this.props.handleLogout()
                }
            })
    }

    render() {
        return (
            <Modal
                show={this.props.stateShow}
                size="sm"
                backdrop="static"
                onHide={this.props.closeDelete}
                animation={false}
                centered
            >
                <Form onSubmit={this.handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Vahvista poisto
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            this.props.data &&
                            this.props.parent === "Projects" &&
                            `Haluatko varmasti poistaa projektin: ${this.props.data.project_name}`
                        }
                        {
                            this.props.data &&
                            this.props.parent === "SingleProject" &&
                            `Haluatko varmasti poistaa työtehtävän: ${this.props.data.task_name}`
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type="submit" className="mt-2">
                            Poista
                        </Button>
                        <Button className="ml-3 mt-2" variant="secondary" onClick={this.props.closeDelete}>Peruuta</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}

export default DeleteModal
