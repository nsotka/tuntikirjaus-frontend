import React, { Component } from 'react'
import { Col, Button, Modal, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import BaseUrl from '../api/ApiClient'

export class ProjectCreateModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            startDate: "",
            endDate: null,
            projectName: "",
            useTodayStart: false,
            useTodayEnd: false,
            singleProject: "",
            add: false,
            edit: false
        }


    }

    static getDerivedStateFromProps(props, state) {

        if (props.action === "edit" && state.singleProject !== props.singleProject) {
            //if (props.action === "edit") {
            return {
                startDate: new Date(props.singleProject.start_time),
                endDate: props.singleProject.end_time !== null ? new Date(props.singleProject.end_time) : null,
                singleProject: props.singleProject,
                projectName: props.singleProject.project_name,
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
                singleProject: "",
                projectName: "",
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
            singleProject: "",
            projectName: ""
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

    handleProjectSubmit = (event) => {
        event.preventDefault()

        let projectName = this.state.projectName
        let projectStart = this.state.startDate
        let projectEnd = this.state.endDate

        if (projectName !== null && projectStart !== null) {
            if (this.props.action === "add") {
                this.requestNewProject(projectName, projectStart, projectEnd)
            }
            else if (this.props.action === "edit") {
                let projectId = this.props.singleProject.id
                this.requestUpdateProject(projectId, projectName, projectStart, projectEnd)
            }

        }

    }

    requestNewProject = (projectName, projectStart, projectEnd) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('Auth'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                project: {
                    project_name: projectName,
                    start_time: projectStart,
                    end_time: projectEnd
                }
            })
        }

        fetch(BaseUrl + "/projects", requestOptions)
            .then(res => {
                if (res.status === 200) {
                    this.initStates()
                    this.closeModal()
                }
            })
    }

    requestUpdateProject = (projectId, projectName, projectStart, projectEnd) => {
        const requestOptions = {
            method: 'PATCH',
            headers: {
                'Authorization': localStorage.getItem('Auth'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                project: {
                    project_name: projectName,
                    start_time: projectStart,
                    end_time: projectEnd
                }
            })
        }

        fetch(BaseUrl + `/projects/${projectId}`, requestOptions)
            .then(res => {
                if (res.status === 200) {
                    this.initStates()
                    this.closeModal()
                }
                else if (res.status === 401) {
                    this.props.handleLogout()
                }
            })
    }

    handleNameChange = (event) => {
        let text = event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1)
        this.setState({
            projectName: text
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
                <Form className="mt-3" onSubmit={this.handleProjectSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {this.props.action === "add" ? "Lisää uusi projekti" : null}
                            {this.props.action === "edit" ? "Muokkaa projektia" : null}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <sup>Tähdellä (*) merkatut ovat pakollisia kenttiä</sup>

                        <Form.Group controlId="projectName">
                            <Form.Label>Projektin nimi: *</Form.Label>
                            <Form.Control
                                value={this.state.projectName}
                                onChange={this.handleNameChange}
                                required
                                type="text"
                            />
                            <Form.Text className="text-muted">
                                Pakollinen tieto
                            </Form.Text>
                        </Form.Group>

                        <Form.Row>
                            <Form.Group as={Col} controlId="projectStartTime">
                                <Form.Label>Projektin aloitus: *</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    id="useTodayStart"
                                    checked={this.state.useTodayStart}
                                    label="Tämä hetki"
                                    onChange={this.handleStartCheck}
                                />
                                <div>
                                    <DatePicker
                                        required
                                        disabled={this.state.useTodayStart}
                                        selected={this.state.startDate}
                                        dateFormat="d.M.yyyy"
                                        onChange={(date) => this.setState({ startDate: date })} />
                                </div>
                            </Form.Group>

                            <Form.Group as={Col} controlId="projectEndTime">
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

export default ProjectCreateModal
