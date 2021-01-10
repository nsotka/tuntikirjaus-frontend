import React, { Component } from 'react'
import { Col, Button, Modal, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import BaseUrl from '../api/ApiClient'

class TaskCreateModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            startDate: "",
            endDate: "",
            projectName: "",
            useTodayStart: false,
            useTodayEnd: false,
            singleTask: "",
            add: false,
            edit: false,
            taskName: ""
        }


    }

    static getDerivedStateFromProps(props, state) {

        if (props.action === "edit" && state.singleTask !== props.singleTask) {
            //if (props.action === "edit") {
            return {
                startDate: props.singleTask.start_time !== null ? new Date(props.singleTask.start_time) : null,
                endDate: props.singleTask.end_time !== null ? new Date(props.singleTask.end_time) : null,
                singleTask: props.singleTask,
                taskName: props.singleTask.task_name,
                add: false,
                edit: true
            }
        }
        else if (props.action === "add" && !state.add) {
            //else if (props.action === "add") {
            return {
                startDate: null,
                endDate: null,
                useTodayStart: false,
                useTodayEnd: false,
                singleTask: "",
                taskName: "",
                add: true,
                edit: false
            }
        }
        else {
            return null
        }
    }

    initStates = () => {
        this.setState({
            startDate: "",
            endDate: "",
            useTodayStart: false,
            useTodayEnd: false,
            add: false,
            edit: false,
            singleTask: "",
            taskName: "",
        })
    }

    closeModal = () => {
        this.initStates()

        this.props.closeDialog()
    }

    handleStartCheck = (event) => {
        this.setState({
            [event.target.id]: event.target.checked
        }, () => {
            this.state.useTodayStart ?
                this.setState({ startDate: new Date() }) :
                this.setState({ startDate: "" })
        }
        )
    }

    handleEndCheck = (event) => {
        this.setState({
            [event.target.id]: event.target.checked
        }, () => {
            this.state.useTodayEnd ?
                this.setState({ endDate: new Date() }) :
                this.setState({ endDate: "" })
        }
        )
    }

    handleTaskSubmit = (event) => {
        event.preventDefault()

        let projectId = this.props.projectId
        let taskName = this.state.taskName
        let taskStart = this.state.startDate
        let taskEnd = this.state.endDate
        let taskCategoryId = event.target.taskCategory.value

        if (taskName !== null) {
            if (this.props.action === "add") {
                this.requestNewTask(projectId, taskName, taskStart, taskEnd, taskCategoryId)
            }
            else if (this.props.action === "edit") {
                let taskId = this.props.singleTask.id
                this.requestUpdateTask(taskId, projectId, taskName, taskStart, taskEnd, taskCategoryId)
            }

        }

    }

    requestNewTask = (projectId, taskName, taskStart, taskEnd, taskCategoryId) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('Auth'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                task: {
                    task_name: taskName,
                    start_time: taskStart,
                    end_time: taskEnd,
                    project_id: projectId,
                    task_category_id: taskCategoryId
                }
            })
        }

        fetch(BaseUrl + `/projects/${projectId}/tasks`, requestOptions)
            .then(res => {
                if (res.status === 200) {
                    this.initStates()
                    this.closeModal()
                }
            })
    }

    requestUpdateTask = (taskId, projectId, taskName, taskStart, taskEnd, taskCategoryId) => {
        const requestOptions = {
            method: 'PATCH',
            headers: {
                'Authorization': localStorage.getItem('Auth'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                task: {
                    task_name: taskName,
                    start_time: taskStart,
                    end_time: taskEnd,
                    project_id: projectId,
                    task_category_id: taskCategoryId
                }
            })
        }

        fetch(BaseUrl + `/projects/${projectId}/tasks/${taskId}`, requestOptions)
            .then(res => {
                if (res.status === 200) {
                    this.initStates()
                    this.closeModal()
                }
                else if (res.status === 401) {

                }
            })
    }

    handleNameChange = (event) => {
        let text = event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1)
        this.setState({
            taskName: text
        })
    }

    render() {
        return (
            <Modal
                show={this.props.stateShow}
                size="md"
                backdrop="static"
                onHide={this.closeModal}
                animation={false}
                centered
            >
                <Form className="mt-3" onSubmit={this.handleTaskSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {this.props.action === "add" ? "Lisää uusi tehtävä" : null}
                            {this.props.action === "edit" ? "Muokkaa tehtävää" : null}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <sup>Tähdellä (*) merkatut ovat pakollisia kenttiä</sup>
                        <Form.Group controlId="taskName">
                            <Form.Label>Tehtävän nimi: *</Form.Label>
                            <Form.Control
                                value={this.state.taskName}
                                onChange={this.handleNameChange}
                                required
                                type="text"
                            />
                        </Form.Group>

                        <Form.Group controlId="taskCategory">
                            <Form.Label>Tehtävä kategoria: *</Form.Label>
                            <Form.Control
                                as="select"
                                required
                                defaultValue={
                                    this.props.singleTask ? this.props.singleTask.task_category_id : null
                                }
                            >
                                <option value="">Valitse...</option>
                                <option value={1}>Front-end</option>
                                <option value={2}>Back-end</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Row>
                            <Form.Group as={Col} controlId="taskStartTime">
                                <Form.Label>Tehtävän aloitus:</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    id="useTodayStart"
                                    checked={this.state.useTodayStart}
                                    label="Tämä hetki"
                                    onChange={this.handleStartCheck}
                                />
                                <div>
                                    <DatePicker
                                        disabled={this.state.useTodayStart}
                                        selected={this.state.startDate}
                                        dateFormat="d.M.yyyy"
                                        onChange={(date) => this.setState({ startDate: date })} />
                                </div>
                            </Form.Group>

                            <Form.Group as={Col} controlId="taskEndTime">
                                <Form.Label>Projektin lopetus:</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    id="useTodayEnd"
                                    checked={this.state.useTodayEnd}
                                    label="Tämä hetki"
                                    onChange={this.handleEndCheck}
                                />
                                <div>
                                    <DatePicker
                                        disabled={this.state.useTodayEnd}
                                        selected={this.state.endDate}
                                        dateFormat="d.M.yyyy"
                                        onChange={(date) => this.setState({ endDate: date })} />
                                </div>
                            </Form.Group>
                        </Form.Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type="submit" className="mt-2">
                            Tallenna
                        </Button>
                        <Button className="ml-3 mt-2" variant="secondary" onClick={this.closeModal}>Peruuta</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}

export default TaskCreateModal
