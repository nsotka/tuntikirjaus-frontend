import React, { Component } from 'react'
import { Col } from 'react-bootstrap';
import HeaderTabText from './HeaderTabText'

class ProjectHeaderTab extends Component {

    handleClick = () => {
        this.props.handleClick(this.props.id)
    }

    render() {
        const classNames = [
            'Projects-header-tabs',
            'Header-tabs-on',
            'd-flex',
            'justify-content-center',
            `${this.props.isActive ? "Projects-header-tabs-on" : ""}`,
            `${!this.props.isActive && this.props.parent === "Projects" ? "Projects-header-tabs-off" : ""}`
        ]
        return (
            <Col
                xs={{ span: this.props.xsSpan, offset: this.props.xsOffset }}
                md={{ span: this.props.mdSpan, offset: this.props.mdOffset }}
                key={this.props.id}
                id={this.props.id}
                className=
                {classNames}
                onClick={this.props.parent === "Projects" ? this.handleClick : null}
            >
                <HeaderTabText headerText={this.props.headerText} />
            </Col>
        )
    }
}

export default ProjectHeaderTab
