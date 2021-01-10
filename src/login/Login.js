import React, { Component } from 'react'
import './Login.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: ''
        }
    }

    handleSubmit = (event) => {
        this.props.handleLogin(event)
    }

    handleCredentialChange = () => {
        this.props.loginDidFail(false)
    }

    render() {
        return (
            <Container>
                <Row className="Row-login">
                    <Form onSubmit={this.handleSubmit} className="my-auto mx-auto">

                        <Form.Row>
                            <Form.Group as={Col} controlId="email" className="Login-group">
                                <Form.Label>Sähköposti</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Syötä sähköpostiosoite"
                                    required
                                    onChange={this.handleCredentialChange}
                                />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} controlId="password" className="Login-group">
                                <Form.Label>Salasana</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Salasana"
                                    required
                                    onChange={this.handleCredentialChange}
                                />
                                <Form.Text className={`${!this.props.loginFailed && "Login-error"}`} style={{ color: "red" }}>{this.props.loginFailed && "Antamasi käyttäjätunnus tai salasana virheellinen"}</Form.Text>
                            </Form.Group>
                        </Form.Row>

                        <Button className="w-100" variant="primary" type="submit">
                            Kirjaudu
                    </Button>

                    </Form>
                </Row>
            </Container>
        )
    }
}

export default Login
