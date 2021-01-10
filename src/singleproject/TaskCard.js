import React, { Component } from 'react'
import { Card, Col } from 'react-bootstrap'
import DeleteButton from '../common/DeleteButton'
import EditButton from '../common/EditButton'

class TaskCard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isMouseInside: false
        }
    }

    taskHours(userTasks, userId = null) {
        let minutes = 0

        if (userId !== null) {
            minutes = this.getUserWorkingTime(userTasks, userId)

            const minutesToHours = minutes / 60

            return `${minutesToHours - minutesToHours % 1}h ${Math.round(minutesToHours % 1 * 60)}min`
        }
        else {
            userTasks.forEach(task => {
                minutes += parseFloat(task.working_time)
            });

            const minutesToHours = minutes / 60

            return `${minutesToHours - minutesToHours % 1}h ${Math.round(minutesToHours % 1 * 60)}min`
        }

    }

    getUserWorkingTime = (userTasks, id) => {
        let minutes = ""

        userTasks.forEach(task => {
            if (task.user_id === id) {
                minutes += parseFloat(task.working_time)
            }
        });
        return minutes
    }

    customBackground(taskState) {
        if (taskState === "planned") {
            return "gray"
        }
        else if (taskState === "progress") {
            return "yellow"
        }
        else {
            return "green"
        }
    }

    mouseEnter = () => {
        this.setState({
            isMouseInside: true
        })
    }

    mouseLeave = () => {
        this.setState({
            isMouseInside: false
        })
    }

    addWorkingTime = (event) => {

        const userTasks = this.props.taskData.user_tasks
        const userId = this.props.currentUser.id
        const minutes = this.getUserWorkingTime(userTasks, userId)

        const ignoredElements = ["edit", "delete", "buttonRow"]

        if (!ignoredElements.includes(event.target.id)) {
            this.props.showAddTime(this.props.taskData, minutes)
        }
    }

    adminAction = () => {
        return [
            <EditButton
                key={1}
                showDialog={this.props.showDialog}
                isMouseInside={this.state.isMouseInside}
                data={this.props.taskData}
            />,
            <DeleteButton
                key={2}
                showDelete={this.props.showDelete}
                isMouseInside={this.state.isMouseInside}
                data={this.props.taskData}
            />
        ]
    }

    render() {
        return (
            <Card className="mb-4 mx-auto Item-card"
                style={{ backgroundColor: this.customBackground(this.props.taskState) }}
                onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}
                onClick={this.addWorkingTime}
            >
                <Col id="buttonRow" className="Card-bg d-flex justify-content-end pr-0">
                    {this.props.currentUser.isAdmin && this.adminAction()}
                </Col>
                <Card.Body className="Card-bg Task-card-body">
                    <Card.Title className="text-truncate">{this.props.taskData.task_name}</Card.Title>
                    <Card.Text>
                        Kokonaistyöaika: {this.taskHours(this.props.taskData.user_tasks)}
                    </Card.Text>
                    <Card.Text>
                        Oma työaika: {this.taskHours(this.props.taskData.user_tasks, this.props.currentUser.id)}
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }
}

export default TaskCard
