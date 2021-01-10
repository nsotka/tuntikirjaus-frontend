import React, { Component } from 'react'
import { Container, Col, Row } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import MainHeader from '../common/MainHeader'
import HeaderTab from '../common/HeaderTab'
import BaseUrl from '../api/ApiClient'
import TaskCard from './TaskCard'
import SingleProjectActionRow from './SingleProjectActionRow'
import TaskCreateModal from './TaskCreateModal'
import AddTimeModal from './AddTimeModal'
import DeleteModal from '../common/DeleteModal'
import LogoutButton from '../common/LogoutButton';

class SingleProject extends Component {

    constructor(props) {
        super(props)

        this.state = {
            projectData: "",
            action: "",
            singleTask: "",
            showDialog: false,
            showAddTime: false,
            showDelete: false,
            userWorkTime: ""
        }
        this.appCable = this.props['data-appCable']
    }

    logout = () => {
        this.props.handleLogout()
    }

    componentDidMount() {

        this.getProjectData()
        this.createSubscription()
    }

    componentWillUnmount() {
        this.removeSubscription()
    }

    removeSubscription = () => {
        let channelToUnsubcribe = null
        this.appCable.subscriptions.subscriptions.forEach((sub, key) => {
            const channelIdentifier = JSON.parse(sub.identifier)
            if (channelIdentifier.channel === "TasksChannel") {
                channelToUnsubcribe = key
            }
        })

        if (channelToUnsubcribe !== null) {
            this.appCable.subscriptions.subscriptions[channelToUnsubcribe].unsubscribe()
        }
    }

    createSubscription = () => {
        this.appCable.subscriptions.create(
            { channel: 'TasksChannel' },
            {
                received: data => {
                    this.handleReceivedData(data)
                }
            }
        )
    }

    getProjectData = () => {

        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('Auth'),
                'Content-Type': 'application/json'
            }
        }

        fetch(BaseUrl + `/projects/${this.props.match.params.id}`, requestOptions)
            .then(res =>
                res.json().then(data => ({
                    status: res.status,
                    data
                }))
            )
            .then(
                (result) => {
                    if (result.status === 200) {
                        this.setState({
                            projectData: result.data
                        })
                    }
                    else if (result.status === 401) {
                        this.logout()
                    }

                }
            )
    }

    handleReceivedData = (receivedData) => {

        if ('task' in receivedData) {

            switch (receivedData.action) {
                case "create":
                    this.addTask(receivedData.task)
                    break
                case "edit":
                    this.editTask(receivedData.task)
                    break
                case "delete":
                    this.deleteTask(receivedData.task)
                    break
                default:
                    console.log("Virhe tehtävädatan päivityksessä!")
            }
        }
        else if ('user_task' in receivedData) {
            switch (receivedData.action) {
                case "create":
                    this.addUserTask(receivedData.user_task)
                    break
                case "edit":
                    this.editUserTask(receivedData.user_task[0])
                    break
                // case "delete":
                //     this.deleteUserTask(receivedData.user_task)
                //     break
                default:
                    console.log("Virhe työaikadatan päivityksessä!")
            }
        }
    }

    addTask = (receivedTask) => {
        const newTask = { ...receivedTask, user_tasks: [] }
        const newProjectData = this.state.projectData
        newProjectData.tasks.push(newTask)

        this.setState({
            projectData: newProjectData
        })
    }

    editTask = (receivedTask) => {
        const newProjectData = this.state.projectData

        newProjectData.tasks.forEach(task => {
            if (task.id === receivedTask.id) {
                task.task_name = receivedTask.task_name
                task.start_time = receivedTask.start_time
                task.end_time = receivedTask.end_time
                task.task_category_id = receivedTask.task_category_id
            }
        })

        this.setState({
            projectData: newProjectData
        })
    }

    deleteTask = (receivedTask) => {
        const newProjectData = this.state.projectData
        const newTasks = newProjectData.tasks.filter(task => task.id !== receivedTask.id)

        newProjectData.tasks = newTasks

        this.setState({
            projectData: newProjectData
        })
    }

    addUserTask = (receivedUserTask) => {

        const newProjectData = this.state.projectData

        const taskId = receivedUserTask.task_id

        let foundTaskKey = null

        newProjectData.tasks.forEach((task, key) => {
            if (task.id === taskId) {
                foundTaskKey = key
            }
        })

        newProjectData.tasks[foundTaskKey].user_tasks.push(receivedUserTask)

        this.setState({
            projectData: newProjectData
        })
    }

    editUserTask = (receivedUserTask) => {
        const newProjectData = this.state.projectData

        const taskId = receivedUserTask.task_id
        const userTaskId = receivedUserTask.id

        newProjectData.tasks.forEach((task, key) => {
            if (task.id === taskId) {

                task.user_tasks.forEach(uTask => {
                    if (uTask.id === userTaskId) {
                        uTask.working_time = receivedUserTask.working_time
                    }
                })

            }
        })

        this.setState({
            projectData: newProjectData
        })
    }

    // deleteTask = (receivedUserTask) => {
    //     console.log(receivedUserTask)
    // }

    sortProjectData = type => {
        const types = {
            name: 'task_name',
            dateasc: 'start_time',
            datedesc: 'start_time'
        };

        const sortProperty = types[type];
        let newProjectData = this.state.projectData
        let tasks = newProjectData.tasks
        if (type !== "datedesc") {
            tasks = tasks.sort((a, b) => a[sortProperty] > b[sortProperty] ? 1 : -1)
        }
        else {
            tasks = tasks.sort((a, b) => a[sortProperty] < b[sortProperty] ? 1 : -1)
        }

        newProjectData.tasks = tasks

        this.setState({
            projectData: newProjectData
        })
    }

    showDialog = (event, taskData) => {
        this.setState({
            action: event.target.id,
            singleTask: taskData,
            showDialog: true
        })
    }

    closeDialog = () => {
        this.setState({
            showDialog: false
        })
    }

    showAddTime = (taskData, userWorkTime) => {
        this.setState({
            singleTask: taskData,
            userWorkTime: userWorkTime,
            showAddTime: true
        })
    }

    closeAddTime = () => {
        this.setState({
            showAddTime: false
        })
    }

    showDelete = (taskData) => {
        this.setState({
            singleTask: taskData,
            showDelete: true
        })
    }

    closeDelete = () => {
        this.setState({
            showDelete: false
        })
    }


    render() {

        if (!this.props.isLoggedIn) {
            return <Redirect push to={{ pathname: "/login" }} />
        }

        let allTasks = this.state.projectData.tasks
        let plannedTasks = []
        let progressingTasks = []
        let finishedTasks = []


        if (allTasks !== undefined) {
            allTasks.forEach(task => {

                if (task.start_time === null) {
                    plannedTasks.push(
                        <TaskCard
                            key={task.id}
                            id={task.id}
                            currentUser={this.props.currentUser}
                            taskState="planned"
                            taskData={task}
                            showDialog={this.showDialog}
                            showAddTime={this.showAddTime}
                            showDelete={this.showDelete}
                        />
                    )
                }
                else if (task.start_time !== null && task.end_time === null) {
                    progressingTasks.push(
                        <TaskCard
                            key={task.id}
                            id={task.id}
                            currentUser={this.props.currentUser}
                            taskState="progress"
                            taskData={task}
                            showDialog={this.showDialog}
                            showAddTime={this.showAddTime}
                            showDelete={this.showDelete}
                        />
                    )
                }
                else {
                    finishedTasks.push(
                        <TaskCard
                            key={task.id}
                            id={task.id}
                            currentUser={this.props.currentUser}
                            taskState="finished"
                            taskData={task}
                            showDialog={this.showDialog}
                            showAddTime={this.showAddTime}
                            showDelete={this.showDelete}
                        />
                    )
                }
            })
        }

        return (
            <Container>
                <AddTimeModal
                    closeAddTime={this.closeAddTime}
                    stateShow={this.state.showAddTime}
                    data={this.state.singleTask && this.state.singleTask}
                    userWorkTime={this.state.userWorkTime}
                    currentUser={this.props.currentUser}
                />
                <TaskCreateModal
                    closeDialog={this.closeDialog}
                    stateShow={this.state.showDialog}
                    action={this.state.action}
                    singleTask={this.state.singleTask}
                    projectId={this.state.projectData.id}
                />
                <DeleteModal
                    closeDelete={this.closeDelete}
                    stateShow={this.state.showDelete}
                    data={this.state.singleTask}
                    parent={this.constructor.name}
                />
                <Row className="pt-3">
                    <Col xs={6} sm={8} className="d-flex align-items-center">
                        <MainHeader headerText={this.state.projectData.project_name} />
                    </Col>
                    <Col xs={6} sm={4} className="d-flex justify-content-end align-items-center">
                        <LogoutButton handleLogout={this.props.handleLogout} />
                    </Col>
                </Row>
                <Row className="pt-3">
                    <SingleProjectActionRow sortProjectData={this.sortProjectData} showDialog={this.showDialog} />
                </Row>
                <Row className="pt-3">
                    <Col
                        className="p-0 pr-lg-2"
                        md={{ span: 12, offset: 0 }}
                        lg={{ span: 4, offset: 0 }}
                    >
                        <HeaderTab
                            id={1} headerText="Suunnitellut"
                            parent={this.constructor.name}
                            xsSpan="0" mdSpan="0"
                            xsOffset="0" mdOffset="0"
                            isActive={this.state.activeId === 1}
                            handleClick={this.handleHeaderClick}
                            col="col-12"
                        />
                        <Col className="Tasks-body col-12">
                            {plannedTasks}
                        </Col>

                    </Col>
                    <Col
                        className="p-0 pl-lg-1 pr-lg-1"
                        md={{ span: 12, offset: 0 }}
                        lg={{ span: 4, offset: 0 }}
                    >
                        <HeaderTab
                            id={2} headerText="Työn alla"
                            parent={this.constructor.name}
                            xsSpan="0" mdSpan="0"
                            xsOffset="0" mdOffset="0"
                            isActive={this.state.activeId === 2}
                            handleClick={this.handleHeaderClick}
                            col="col-12"
                        />
                        <Col className="Tasks-body col-12">
                            {progressingTasks}
                        </Col>

                    </Col>
                    <Col
                        className="p-0 pl-lg-2"
                        md={{ span: 12, offset: 0 }}
                        lg={{ span: 4, offset: 0 }}
                    >

                        <HeaderTab
                            id={3}
                            headerText="Valmiit"
                            parent={this.constructor.name}
                            xsSpan="0" mdSpan="0"
                            xsOffset="0" mdOffset="0"
                            isActive={this.state.activeId === 3}
                            handleClick={this.handleHeaderClick}
                            col="col-12"
                        />
                        <Col
                            className="Tasks-body col-12">
                            {finishedTasks}
                        </Col>

                    </Col>
                </Row>
            </Container>
        )
    }
}

export default SingleProject
