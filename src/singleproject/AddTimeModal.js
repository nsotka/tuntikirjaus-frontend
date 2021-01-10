import React, { Component } from 'react'
import { Col, Button, Modal, Form } from 'react-bootstrap';
import BaseUrl from '../api/ApiClient'

class AddTimeModal extends Component {

    closeModal = () => {
        this.props.closeAddTime()
    }

    handleSubmit = (event) => {
        event.preventDefault()

        const userId = this.props.currentUser.id
        const oldWorkTime = parseInt(this.props.userWorkTime)
        const taskId = this.props.data.id
        const hours = parseInt(event.target.taskHour.value)
        const minutes = parseInt(event.target.taskMinute.value)
        const newWorkTime = parseInt((!oldWorkTime ? 0 : oldWorkTime) + (hours * 60 + minutes))

        if (!oldWorkTime) {
            this.requestNewWorkTime(userId, taskId, newWorkTime)
        }
        else {
            this.requestUpdateWorkTime(userId, taskId, newWorkTime)
        }
    }

    requestNewWorkTime = (userId, taskId, newWorkTime) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('Auth'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_task: {
                    user_id: userId,
                    task_id: taskId,
                    working_time: newWorkTime
                }
            })
        }

        fetch(BaseUrl + `/users/${userId}/tasks/${taskId}/user_tasks`, requestOptions)
            .then(res => {
                if (res.status === 200) {
                    this.closeModal()
                }
            })
    }

    requestUpdateWorkTime = (userId, taskId, newWorkTime) => {
        const requestOptions = {
            method: 'PATCH',
            headers: {
                'Authorization': localStorage.getItem('Auth'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_task: {
                    working_time: newWorkTime
                }
            })
        }

        fetch(BaseUrl + `/users/${userId}/tasks/${taskId}/user_tasks/0`, requestOptions)
            .then(res => {
                if (res.status === 200) {
                    this.closeModal()
                }
            })
    }

    render() {
        return (
            <Modal
                show={this.props.stateShow}
                size="md"
                backdrop="static"
                onHide={this.props.closeAddTime}
                animation={false}
                centered
            >
                <Form onSubmit={this.handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Lisää työtunteja
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p style={{whiteSpace:"pre-wrap"}}>
                            {
                                this.props.data && `Lisää työtunteja tehtävään:\n${this.props.data.task_name}`
                            }
                        </p>
                        <Form.Row>
                            <Form.Group as={Col} controlId="taskHour">
                                <Form.Label>Tunnit:</Form.Label>
                                <Form.Control
                                    type="number"
                                    required
                                    min={0}
                                    placeholder="Esim 2"
                                />
                                <Form.Text muted>
                                    Tasalukuina
                                </Form.Text>
                            </Form.Group>
                            <Form.Group as={Col} controlId="taskMinute">
                                <Form.Label>Minuutit:</Form.Label>
                                <Form.Control
                                    type="number"
                                    required
                                    min={0}
                                    max={50}
                                    step={10}
                                    placeholder="Esim 30"
                                />
                                <Form.Text muted>
                                    Kymmenen minuutin tarkkuudella
                                </Form.Text>
                            </Form.Group>
                        </Form.Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type="submit" className="mt-2">
                            Tallenna
                        </Button>
                        <Button className="ml-3 mt-2" variant="secondary" onClick={this.props.closeAddTime}>Peruuta</Button>
                    </Modal.Footer>
                </Form>
            </Modal >
        )
    }
}

export default AddTimeModal
