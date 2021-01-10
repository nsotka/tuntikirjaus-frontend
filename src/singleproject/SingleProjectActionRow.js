import React, { Component } from 'react'
import { Button, Col, Form } from 'react-bootstrap';

class SingleProjectActionRow extends Component {
    render() {
        return (
            <Col className="Action-row">
                <Form onChange={(e) => this.props.sortProjectData(e.target.value)}>
                    <Form.Row>
                        <Form.Label className="mr-2" column xs={2} md={1}>
                            Järjestä:
                                </Form.Label>
                        <Col xs={5} md={3} lg={2}>
                            <Form.Control as="select">
                                <option value="name">Nimen mukaan</option>
                                <option value="datedesc">Uusin ensin</option>
                                <option value="dateasc">Vanhin ensin</option>
                            </Form.Control>
                        </Col>
                        <Col>
                            <Button id="add" className="float-right" onClick={this.props.showDialog}>+ Lisää uusi</Button>
                        </Col>
                    </Form.Row>
                </Form>
            </Col>
        )
    }
}

export default SingleProjectActionRow
