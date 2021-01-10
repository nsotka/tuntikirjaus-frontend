import React, { Component } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import DeleteButton from '../common/DeleteButton'
import EditButton from '../common/EditButton'

class ProjectCard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isMouseInside: false
        }
    }

    checkDoneTask = (tasks) => {
        let tasksDone = []
        if (tasks) {
            tasks.forEach(task => {
                if (task.end_time) {
                    tasksDone.push(task)
                }
            })
        }
        return tasksDone.length
    }

    mouseEnter = () => {
        this.setState({
            isMouseInside: true
        })
    }

    mouseOver = () => {
        if (!this.state.isMouseInside) {
            this.setState({
                isMouseInside: true
            })
        }
    }

    mouseLeave = () => {
        this.setState({
            isMouseInside: false
        })
    }

    adminAction = () => {
        return [
            <EditButton
                key={1}
                showDialog={this.props.showDialog}
                isMouseInside={this.state.isMouseInside}
                data={this.props.projectData}
            />,
            <DeleteButton
                key={2}
                showDelete={this.props.showDelete}
                isMouseInside={this.state.isMouseInside}
                data={this.props.projectData}
            />
        ]
    }


    render() {

        let createdAt = new Date(this.props.projectData.start_time)
        let createdDate = createdAt.toLocaleDateString('fi-FI')
        let createdTime = createdAt.toLocaleTimeString('fi-FI')

        return (
            <Card
                className={`Item-card mb-4 mx-auto ${this.state.isMouseInside && "Project-card"}`}
                onMouseEnter={this.mouseEnter}
                onMouseLeave={this.mouseLeave}
                onMouseOver={this.mouseOver}
            >
                <Row>
                    <Col className="d-flex justify-content-end">
                        {this.props.currentUser.isAdmin && this.adminAction()}
                    </Col>
                </Row>
                <Link className="No-link" to={`/projects/${this.props.id}`}>
                    <Card.Body className="Project-card-body d-flex">
                        <div className="align-self-center">
                            <Card.Title className="text-truncate">{this.props.projectData.project_name}</Card.Title>
                            <Card.Text>
                                Tehtäviä valmiina {this.checkDoneTask(this.props.projectData.tasks)}/
                            {
                                    this.props.projectData.tasks ? this.props.projectData.tasks.length : "0"
                                }
                            </Card.Text>
                        </div>
                    </Card.Body>
                    <Card.Footer>
                        <small className="text-muted">Luotu: {createdDate} {createdTime}</small>
                    </Card.Footer>
                </Link>
            </Card>
        )
    }
}

export default ProjectCard
