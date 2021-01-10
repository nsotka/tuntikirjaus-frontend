import React, { Component } from 'react'
import '../common/Styles.css';
import { Container, CardDeck, Col, Row } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import ProjectCard from './ProjectCard'
import HeaderTab from '../common/HeaderTab'
import MainHeader from '../common/MainHeader';
import BaseUrl from '../api/ApiClient'
import ProjectCreateModal from './ProjectCreateModal';
import DeleteModal from '../common/DeleteModal'
import ProjectActionRow from './ProjectActionRow';
import LogoutButton from '../common/LogoutButton'


class Projects extends Component {

    constructor(props) {
        super(props)
        this.state = {
            activeId: 1,
            projectsData: [],
            showDialog: false
        }
        this.appCable = this.props['data-appCable']
    }

    componentDidMount() {

        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('Auth'),
                'Content-Type': 'application/json'
            }
        }

        fetch(BaseUrl + "/projects/", requestOptions)
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
                            projectsData: result.data
                        }, () => this.sortProjects("name"))
                    }
                    else if (result.status === 401) {
                        this.props.handleLogout()
                    }

                }
            )
        this.createSubscription()
    }

    componentWillUnmount() {
        this.removeSubscription()
    }

    removeSubscription = () => {
        let channelToUnsubcribe = null
        this.appCable.subscriptions.subscriptions.forEach((sub, key) => {
            const channelIdentifier = JSON.parse(sub.identifier)
            if (channelIdentifier.channel === "ProjectsChannel") {
                channelToUnsubcribe = key
            }
        })

        if (channelToUnsubcribe !== null) {
            this.appCable.subscriptions.subscriptions[channelToUnsubcribe].unsubscribe()
        }
    }

    createSubscription = () => {
        this.appCable.subscriptions.create(
            { channel: 'ProjectsChannel' },
            { received: receivedData => this.handleReceivedData(receivedData) }
        )
    }

    handleReceivedData = receivedData => {

        switch (receivedData.action) {
            case "create":
                this.addProject(receivedData.project)
                break
            case "edit":
                this.editProject(receivedData.project)
                break
            case "delete":
                this.deleteProject(receivedData.project)
                break
            default:
                console.log("Virhe projektidatan päivityksessä!")
        }
    }

    addProject = (project) => {
        this.setState({
            projectsData: [...this.state.projectsData, project]
        }, () => this.sortProjects("name"))
    }

    editProject = (project) => {
        let newList = [...this.state.projectsData]

        newList.forEach(proj => {
            if (proj.id === project.id) {
                proj.project_name = project.project_name
                proj.start_time = project.start_time
                proj.end_time = project.end_time
            }
        })

        this.setState({
            projectsData: newList
        }, () => this.sortProjects("name"))

    }

    deleteProject = (project) => {
        
        const newList = this.state.projectsData.filter(proj => proj.id !== project.id)

        this.setState({
            projectsData: newList
        }, () => this.sortProjects("name"))
    }

    handleHeaderClick = (value) => {
        if (value) {
            this.setState({
                activeId: value
            })
        }
    }

    showDialog = (event, projectData) => {
        this.setState({
            action: event.target.id,
            singleProject: projectData,
            showDialog: true
        })
    }

    closeDialog = () => {
        this.setState({
            singleProject: "",
            showDialog: false
        })
    }

    showDelete = (event, projectData) => {
        this.setState({
            singleProject: projectData,
            showDelete: true
        })
    }

    closeDelete = () => {
        this.setState({
            singleProject: "",
            showDelete: false
        })
    }

    sortProjects = type => {
        const types = {
            name: 'project_name',
            dateasc: 'start_time',
            datedesc: 'start_time'
        };

        const sortProperty = types[type];
        let newProjectsList = [...this.state.projectsData]
        if (type !== "datedesc") {
            newProjectsList = newProjectsList.sort((a, b) => a[sortProperty] > b[sortProperty] ? 1 : -1)
        }
        else {
            newProjectsList = newProjectsList.sort((a, b) => a[sortProperty] < b[sortProperty] ? 1 : -1)
        }

        this.setState({
            projectsData: newProjectsList
        })
    }
    

    render() {

        if (!this.props.isLoggedIn) {
            return <Redirect push to={{ pathname: "/login" }} />
        }

        let allProjectList = []
        let curProjectList = []
        let oldProjectList = []
        let cards = []

        if (this.state.projectsData.length > 0) {
            this.state.projectsData.forEach(project => {
                allProjectList.push(
                    <ProjectCard
                        key={project.id}
                        id={project.id}
                        projectData={project}
                        showDialog={this.showDialog}
                        currentUser={this.props.currentUser}
                        showDelete={this.showDelete}
                    />
                )

                if (project.end_time === null) {
                    curProjectList.push(
                        <ProjectCard
                            key={project.id}
                            id={project.id}
                            projectData={project}
                            showDialog={this.showDialog}
                            currentUser={this.props.currentUser}
                            showDelete={this.showDelete}
                        />
                    )
                }
                else {
                    oldProjectList.push(
                        <ProjectCard
                            key={project.id}
                            id={project.id}
                            projectData={project}
                            showDialog={this.showDialog}
                            currentUser={this.props.currentUser}
                            showDelete={this.showDelete}
                        />
                    )
                }
            })
        }

        if (this.state.activeId === 1) {
            cards = allProjectList
        }
        else if (this.state.activeId === 2) {
            cards = curProjectList
        }
        else {
            cards = oldProjectList
        }

        return (
            <Container>
                <ProjectCreateModal
                    closeDialog={this.closeDialog}
                    stateShow={this.state.showDialog}
                    action={this.state.action}
                    singleProject={this.state.singleProject}
                    handleLogout={this.props.handleLogout}
                />
                <DeleteModal
                    closeDelete={this.closeDelete}
                    stateShow={this.state.showDelete}
                    data={this.state.singleProject}
                    parent={this.constructor.name}
                    handleLogout={this.props.handleLogout}
                />
                <Row className="pt-3">
                    <Col className="d-flex align-items-center">
                        <MainHeader headerText="Projektit" />
                    </Col>
                    <Col className="d-flex justify-content-end align-items-center">
                        <LogoutButton handleLogout={this.props.handleLogout} />
                    </Col>
                </Row>
                <Row className="pt-3">
                    <ProjectActionRow sortProjects={this.sortProjects} showDialog={this.showDialog} />
                </Row>
                <Row className="pt-3">
                    <HeaderTab
                        id={1}
                        headerText="Kaikki"
                        parent={this.constructor.name}
                        xsSpan="3" mdSpan="2"
                        xsOffset="0" mdOffset="0"
                        isActive={this.state.activeId === 1}
                        handleClick={this.handleHeaderClick}
                    />
                    <HeaderTab
                        id={2}
                        headerText="Nykyiset"
                        parent={this.constructor.name}
                        xsSpan="3" mdSpan="2"
                        xsOffset="3" mdOffset="5"
                        isActive={this.state.activeId === 2}
                        handleClick={this.handleHeaderClick}
                    />
                    <HeaderTab
                        id={3} headerText="Menneet"
                        parent={this.constructor.name}
                        xsSpan="3" mdSpan="2"
                        xsOffset="0" mdOffset="1"
                        isActive={this.state.activeId === 3}
                        handleClick={this.handleHeaderClick}
                    />
                </Row>
                <Row>
                    <Col className="Projects-body">
                        <CardDeck>
                            {cards}
                        </CardDeck>
                    </Col>
                </Row>

            </Container>
        )
    }
}

export default Projects
