import React, { Component } from 'react';
import { createSubLob, getAllReporteesOfCurrentUser, getAllLobsOwnedByUser, 
    checkSubLobNameAvailabilityForUser, confirmLobIdExistenceForUser,
    confirmSubLobLeadExistenceForUser } from '../../util/APIUtils';
import Select from 'react-select';
import './createform.css';
import {   
    ANYNAME_MAX_LENGTH,
    APP_NAME
} from '../../constants';

import { Form, Input, Button, notification } from 'antd';
const FormItem = Form.Item;

class CreateSubLob extends Component {
    constructor(props) {
        super(props);
        this.state = {       
            subLobName: {
                value: ''
            },
            subLobLeadUserName: {
                value: ''
            },
            subLobLeadsInfo: [],
            lobId: {
                value: ''
            },
            lobsInfo: []
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateSubLobNameAvailabilityForUser = this.validateSubLobNameAvailabilityForUser.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.loadPossibleSubLobLeadNames = this.loadPossibleSubLobLeadNames.bind(this);
        this.loadPossibleLobNames = this.loadPossibleLobNames.bind(this);
    }
    loadPossibleSubLobLeadNames() {
        let promise;
        console.log('starting getAllReporteesOfCurrentUser');
        promise = getAllReporteesOfCurrentUser();
        if(!promise) {
            return;
        }
        this.setState({
            isLoading: true
        });
        promise            
        .then(response => {
            this.setState({ subLobLeadsInfo: response })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
    }

    loadPossibleLobNames() {
        let promise;
        promise = getAllLobsOwnedByUser();
        if(!promise) {
            return;
        }
        this.setState({
            isLoading: true
        });
        promise            
        .then(response => {
            this.setState({ lobsInfo: response })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
    }

    componentDidMount() {
        this.loadPossibleSubLobLeadNames();
        this.loadPossibleLobNames();
    }

    handleInputChange(event, validationFun, label) {
        const target = event.target;
        const inputName = target.name;        
        const inputValue = target.value;

        this.setState({
            [inputName] : {
                value: inputValue,
                ...validationFun(inputValue, label)
            }
        });
    }

    handleSubLobLeadUserNameChange(event, validationFun, label) {  
        const inputValue = event.value;
        //this.state.pdlUserName.value=inputValue;

        this.setState({
            subLobLeadUserName : {
                value: inputValue
            }
        });

        validationFun(inputValue, label);
    }
    handleLobIdChange(event, validationFun, label) {  
        const inputValue = event.value;
        //this.state.lobId.value=inputValue;
        this.setState({
            lobId : {
                value: inputValue
            }
        });
        validationFun(inputValue, label);
    }

    handleSubmit(event) {
        console.log('about to submit');
        event.preventDefault();
    
        const createSubLobRequest = {
            subLobName: this.state.subLobName.value,
            subLobLeadUserName: this.state.subLobLeadUserName.value,
            lobId: this.state.lobId.value,
        };
        createSubLob(createSubLobRequest)
        .then(response => {
            notification.success({
                message: APP_NAME,
                description: "Thank you! You've successfully created SubLob!",
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
            this.state.subLobName.validateStatus === 'success' &&
            this.state.subLobLeadUserName.validateStatus === 'success' &&
            this.state.lobId.validateStatus === 'success' 
        );
    }

    render() {
        const lobIdViews = [];
        this.state.lobsInfo.forEach((item, index) => {
            lobIdViews.push({value: item.id, label:item.lobName});   
        });

        const subLobLeadFullNameViews = [];
        this.state.subLobLeadsInfo.forEach((item, index) => {
            subLobLeadFullNameViews.push({value: item.userName, label:item.userName});   
        });

        
        
        return (
            <div className="createform-container">
                <h1 className="page-title">Create SubLob</h1>
                <div className="createform-content">
                    <Form onSubmit={this.handleSubmit} className="createform-form">
                        <FormItem label="Lob name">
                            <Select 
                            size="large"
                            name="lobId"
                            autoComplete="off"
                            placeholder="Select Lob"
                            onBlur={(event) => this.validateLobIdAvailabilityForUser(event)}
                            options={lobIdViews} 
                            onChange={(event) => this.handleLobIdChange(event, this.validateNameField, 'Lob')} /> 
                            
                        </FormItem>

                        <FormItem label="SubLob name"
                            hasFeedback
                            validateStatus={this.state.subLobName.validateStatus}
                            help={this.state.subLobName.errorMsg}>
                            <Input 
                                size="large"
                                name="subLobName" 
                                autoComplete="off"
                                placeholder="A unique SubLob name"
                                value={this.state.subLobName.value} 
                                onBlur={this.validateSubLobNameAvailabilityForUser}
                                onChange={(event) => this.handleInputChange(event, this.validateNameField, 'SubLob')} />    
                        </FormItem>

                        <FormItem label="SubLob Lead name">
                            <Select 
                            size="large"
                            name="subLobLeadUserName"
                            autoComplete="off"
                            placeholder="Select SubLob Lead"
                            onBlur={(event) => this.validateSubLobLeadAvailabilityForUser(event)}
                            options={subLobLeadFullNameViews} 
                            onChange={(event) => this.handleSubLobLeadUserNameChange(event, this.validateNameField, 'SubLob Lead')} /> 
                            
                        </FormItem>

                        <FormItem>
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                className="createform-form-button"
                                disabled={this.isFormInvalid()}>Create CUSTOMER</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }

    // Validation Functions

    validateNameField = (nameField, label) => {
        if(!nameField) {
            return {
                validateStatus: 'error',
                errorMsg: label+' name may not be empty'                
            }
        }

        if(nameField.length > ANYNAME_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: label + ` name is too long (Maximum ${ANYNAME_MAX_LENGTH} characters allowed)`
            }
        }

        return {
            validateStatus: null,
            errorMsg: null
        }
    }


    validateLobIdAvailabilityForUser(event) {
        const lobIdValue = this.state.lobId.value;
        const lobIdValidation = this.validateNameField(lobIdValue, 'Lob');
        if(lobIdValidation.validateStatus === 'error') {
            this.setState({
                lobId: {
                    value: lobIdValue,
                    ...lobIdValidation
                }
            });
            return;
        }

        this.setState({
            lobId: {
                value: lobIdValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        confirmLobIdExistenceForUser(lobIdValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    lobId: {
                        value: lobIdValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    lobId: {
                        value: lobIdValue,
                        validateStatus: 'error',
                        errorMsg: 'This Lob name is not valid'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                lobId: {
                    value: lobIdValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }


    validateSubLobNameAvailabilityForUser() {
        const subLobNameValue = this.state.subLobName.value;
        const subLobNameValidation = this.validateNameField(subLobNameValue, 'SubLob');

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

        checkSubLobNameAvailabilityForUser(subLobNameValue, this.state.lobId.value)
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
                        errorMsg: 'This SubLob name is already taken'
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

    validateSubLobLeadAvailabilityForUser(event) {
        const subLobLeadUserNameValue = this.state.subLobLeadUserName.value;
        const subLobLeadUserNameValidation = this.validateNameField(subLobLeadUserNameValue, 'SubLob lead');

        if(subLobLeadUserNameValidation.validateStatus === 'error') {
            this.setState({
                subLobLeadUserName: {
                    value: subLobLeadUserNameValue,
                    ...subLobLeadUserNameValidation
                }
            });
            return;
        }

        this.setState({
            subLobLeadUserName: {
                value: subLobLeadUserNameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        confirmSubLobLeadExistenceForUser(subLobLeadUserNameValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    subLobLeadUserName: {
                        value: subLobLeadUserNameValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    subLobLeadUserName: {
                        value: subLobLeadUserNameValue,
                        validateStatus: 'error',
                        errorMsg: 'This SubLob lead name is not valid'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                subLobLeadUserName: {
                    value: subLobLeadUserNameValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }



}

export default CreateSubLob;