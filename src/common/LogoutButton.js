import React, { Component } from 'react'
import { Button } from 'react-bootstrap';

class LogoutButton extends Component {

    logout = () => {
        this.props.handleLogout()
    }

    render() {
        return (
            <Button onClick={this.logout} className="Button-signout" >Kirjaudu ulos</Button>
        )
    }
}

export default LogoutButton
