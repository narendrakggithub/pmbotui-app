import React, { Component } from 'react';
import { createProject, checkProjectNameAvailability, checkSubLobNameAvailability, checkManagerEmailAvailability, checkCustomerNameAvailability } from '../../util/APIUtils';
import './createproject.css';
import { Link } from 'react-router-dom';
import {   
    ANYNAME_MIN_LENGTH, ANYNAME_MAX_LENGTH,
    MANAGEREMAIL_MAX_LENGTH, 
    APP_NAME
} from '../../constants';

import { Form, Input, Button, notification, DatePicker } from 'antd';
const FormItem = Form.Item;

class CreateProject extends Component {
    constructor(props) {
        super(props);
        this.state = {       
            projectName: {
                value: ''
            },
            startDate: {
                value: ''
            },
            endDate: {
                value: ''
            },
            managerEmail: {
                value: ''
            },
            subLobName: {
                value: ''
            },
            customerName: {
                value: ''
            }
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateProjectNameAvailability = this.validateProjectNameAvailability.bind(this);
        this.validateManagerEmailAvailability = this.validateManagerEmailAvailability.bind(this);
        this.validateSubLobNameAvailability = this.validateSubLobNameAvailability.bind(this);
        this.validateCustomerNameAvailability = this.validateCustomerNameAvailability.bind(this);
        
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    handleInputChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;        
        const inputValue = target.value;

        this.setState({
            [inputName] : {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
    
        const createProjectRequest = {
            projectName: this.state.projectName.value,
            startDate: this.state.startDate.value,
            endDate: this.state.endDate.value,
            managerEmail: this.state.managerEmail.value,
            subLobName: this.state.subLobName.value,
            customerName: this.state.customerName.value
        };
        createProject(createProjectRequest)
        .then(response => {
            notification.success({
                message: APP_NAME,
                description: "Thank you! You've successfully created Project!",
            });          
            this.props.history.push("/");
        }).catch(error => {
            notification.error({
                message: APP_NAME,
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
    }

    isFormInvalid() {
        return !(
            this.state.projectName.validateStatus === 'success' &&
            this.state.startDate.validateStatus === 'success' &&
            this.state.endDate.validateStatus === 'success' &&
            this.state.managerEmail.validateStatus === 'success' &&
            this.state.subLobName.validateStatus === 'success' &&
            this.state.customerName.validateStatus === 'success'
        );
    }

    render() {
        return (
            <div className="createProject-container">
                <h1 className="page-title">Create Project</h1>
                <div className="createProject-content">
                    <Form onSubmit={this.handleSubmit} className="createProject-form">
                        <FormItem label="Project name"
                            hasFeedback
                            validateStatus={this.state.projectName.validateStatus}
                            help={this.state.projectName.errorMsg}>
                            <Input 
                                size="large"
                                name="projectName" 
                                autoComplete="off"
                                placeholder="A unique project name"
                                value={this.state.projectName.value} 
                                onBlur={this.validateProjectNameAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validateProjectName)} />    
                        </FormItem>

                        <FormItem label="Start Date"
                            hasFeedback
                            validateStatus={this.state.startDate.validateStatus}
                            help={this.state.startDate.errorMsg}>
                            <Input 
                                size="large"
                                name="startDate" 
                                type="date"
                                autoComplete="off"
                                placeholder="Start Date"
                                value={this.state.startDate.value} 
                                onBlur={this.validateStartDate}
                                onChange={(event) => this.handleInputChange(event, this.validateStartDate)} />    
                        </FormItem>
                        <FormItem label="End Date"
                            hasFeedback
                            validateStatus={this.state.endDate.validateStatus}
                            help={this.state.endDate.errorMsg}>
                            <Input 
                                size="large"
                                name="endDate" 
                                type="date"
                                autoComplete="off"
                                placeholder="End Date"
                                value={this.state.endDate.value} 
                                onBlur={this.validateEndDate}
                                onChange={(event) => this.handleInputChange(event, this.validateEndDate)} />    
                        </FormItem>
                        <FormItem 
                            label="Manager Email"
                            hasFeedback
                            validateStatus={this.state.managerEmail.validateStatus}
                            help={this.state.managerEmail.errorMsg}>
                            <Input 
                                size="large"
                                name="managerEmail"
                                type="email" 
                                autoComplete="off"
                                placeholder="Manager email"
                                value={this.state.managerEmail.value} 
                                onBlur={this.validateManagerEmailAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validateManagerEmail)} />    
                        </FormItem>
                        <FormItem label="Sub Lob Name"
                            hasFeedback
                            validateStatus={this.state.subLobName.validateStatus}
                            help={this.state.subLobName.errorMsg}>
                            <Input 
                                size="large"
                                name="subLobName" 
                                autoComplete="off"
                                placeholder="Sub LOB name"
                                value={this.state.subLobName.value} 
                                onBlur={this.validateSubLobNameAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validateSubLobName)} />    
                        </FormItem>
                        <FormItem label="Customer name"
                            hasFeedback
                            validateStatus={this.state.customerName.validateStatus}
                            help={this.state.customerName.errorMsg}>
                            <Input 
                                size="large"
                                name="customerName" 
                                autoComplete="off"
                                placeholder="Customer name"
                                value={this.state.customerName.value} 
                                onBlur={this.validateCustomerNameAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validateCustomerName)} />    
                        </FormItem>
                       
                        <FormItem>
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                className="createProject-form-button"
                                disabled={this.isFormInvalid()}>Create Project</Button>
                            
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }

    // Validation Functions

    validateProjectName = (projectName) => {
        if(!projectName) {
            return {
                validateStatus: 'error',
                errorMsg: 'Project name may not be empty'                
            }
        }

        if(projectName.length > ANYNAME_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Project name is too long (Maximum ${ANYNAME_MAX_LENGTH} characters allowed)`
            }
        }

        return {
            validateStatus: null,
            errorMsg: null
        }
    }

    validateStartDate = (startDate) => {
        if(!startDate) {
            return {
                validateStatus: 'error',
                errorMsg: 'Start date may not be empty'                
            }
        }
        return {
            validateStatus: null,
            errorMsg: null
        }
    }

    validateEndDate = (endDate) => {
        if(!endDate) {
            return {
                validateStatus: 'error',
                errorMsg: 'End date may not be empty'                
            }
        }
        return {
            validateStatus: null,
            errorMsg: null
        }
    }

    validateManagerEmail = (managerEmail) => {
        if(!managerEmail) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email may not be empty'                
            }
        }

        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
        if(!EMAIL_REGEX.test(managerEmail)) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email not valid'
            }
        }

        if(managerEmail.length > MANAGEREMAIL_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Email is too long (Maximum ${MANAGEREMAIL_MAX_LENGTH} characters allowed)`
            }
        }

        return {
            validateStatus: null,
            errorMsg: null
        }
    }

    validateSubLobName = (subLobName) => {
        if(subLobName.length < ANYNAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Sub LOB name is too short (Minimum ${ANYNAME_MIN_LENGTH} characters needed.)`
            }
        } else if (subLobName.length > ANYNAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Sub LOB name is too long (Maximum ${ANYNAME_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: null,
                errorMsg: null
            }
        }
    }

    validateCustomerName = (customerName) => {
        if(customerName.length < ANYNAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Customer name is too short (Minimum ${ANYNAME_MIN_LENGTH} characters needed.)`
            }
        } else if (customerName.length > ANYNAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Customer name is too long (Maximum ${ANYNAME_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: null,
                errorMsg: null
            }
        }
    }

    validateProjectNameAvailability() {
        // First check for client side errors in projectname
        const projectNameValue = this.state.projectName.value;
        const projectNameValidation = this.validateProjectName(projectNameValue);

        if(projectNameValidation.validateStatus === 'error') {
            this.setState({
                projectName: {
                    value: projectNameValue,
                    ...projectNameValidation
                }
            });
            return;
        }

        this.setState({
            projectName: {
                value: projectNameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkProjectNameAvailability(projectNameValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    projectName: {
                        value: projectNameValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    projectName: {
                        value: projectNameValue,
                        validateStatus: 'error',
                        errorMsg: 'This projectname is already taken'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                projectName: {
                    value: projectNameValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validateManagerEmailAvailability() {
        // First check for client side errors in email
        const managerEmailValue = this.state.managerEmail.value;
        const managerEmailValidation = this.validateManagerEmail(managerEmailValue);

        if(managerEmailValidation.validateStatus === 'error') {
            this.setState({
                managerEmail: {
                    value: managerEmailValue,
                    ...managerEmailValidation
                }
            });    
            return;
        }

        this.setState({
            managerEmail: {
                value: managerEmailValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkManagerEmailAvailability(managerEmailValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    managerEmail: {
                        value: managerEmailValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    managerEmail: {
                        value: managerEmailValue,
                        validateStatus: 'error',
                        errorMsg: 'Manager email does not exist'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                managerEmail: {
                    value: managerEmailValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validateSubLobNameAvailability() {
        // First check for client side errors in SubLobname
        const subLobNameValue = this.state.subLobName.value;
        const subLobNameValidation = this.validateSubLobName(subLobNameValue);

        if(subLobNameValidation.validateStatus === 'error') {
            this.setState({
                subLobName: {
                    value: subLobNameValue,
                    ...subLobNameValidation
                }
            });
            return;
        }

        this.setState({
            subLobName: {
                value: subLobNameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkSubLobNameAvailability(subLobNameValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    subLobName: {
                        value: subLobNameValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    subLobName: {
                        value: subLobNameValue,
                        validateStatus: 'error',
                        errorMsg: 'This subLobname does not exist'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                subLobName: {
                    value: subLobNameValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validateCustomerNameAvailability() {
        // First check for client side errors in Customername
        const customerNameValue = this.state.customerName.value;
        const customerNameValidation = this.validateCustomerName(customerNameValue);

        if(customerNameValidation.validateStatus === 'error') {
            this.setState({
                customerName: {
                    value: customerNameValue,
                    ...customerNameValidation
                }
            });
            return;
        }

        this.setState({
            customerName: {
                value: customerNameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkCustomerNameAvailability(customerNameValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    customerName: {
                        value: customerNameValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    customerName: {
                        value: customerNameValue,
                        validateStatus: 'error',
                        errorMsg: 'This customername does not exist'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                customerName: {
                    value: customerNameValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

}

export default CreateProject;