import React, { Component } from 'react';
import { createLob, getAllReporteesOfCurrentUser, getAllAccountsOwnedByUser, 
    checkLobNameAvailabilityForUser, confirmAccountIdExistenceForUser,
    confirmLobLeadExistenceForUser } from '../../util/APIUtils';
import Select from 'react-select';
import './createform.css';
import {   
    ANYNAME_MAX_LENGTH,
    APP_NAME
} from '../../constants';

import { Form, Input, Button, notification } from 'antd';
const FormItem = Form.Item;

class CreateLOB extends Component {
    constructor(props) {
        super(props);
        this.state = {       
            lobName: {
                value: ''
            },
            lobLeadUserName: {
                value: ''
            },
            lobLeadsInfo: [],
            accountId: {
                value: ''
            },
            accountsInfo: []
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateLobNameAvailabilityForUser = this.validateLobNameAvailabilityForUser.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.loadPossibleLobLeadNames = this.loadPossibleLobLeadNames.bind(this);
        this.loadPossibleAccountNames = this.loadPossibleAccountNames.bind(this);
    }
    loadPossibleLobLeadNames() {
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
            this.setState({ lobLeadsInfo: response })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
    }

    loadPossibleAccountNames() {
        let promise;
        promise = getAllAccountsOwnedByUser();
        if(!promise) {
            return;
        }
        this.setState({
            isLoading: true
        });
        promise            
        .then(response => {
            this.setState({ accountsInfo: response })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
    }

    componentDidMount() {
        this.loadPossibleLobLeadNames();
        this.loadPossibleAccountNames();
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

    handleLobLeadUserNameChange(event, validationFun, label) {  
        const inputValue = event.value;
        //this.state.pdlUserName.value=inputValue;

        this.setState({
            lobLeadUserName : {
                value: inputValue
            }
        });

        validationFun(inputValue, label);
    }
    handleAccountIdChange(event, validationFun, label) {  
        const inputValue = event.value;
        //this.state.accountId.value=inputValue;
        this.setState({
            accountId : {
                value: inputValue
            }
        });
        validationFun(inputValue, label);
    }

    handleSubmit(event) {
        event.preventDefault();
    
        const createLobRequest = {
            lobName: this.state.lobName.value,
            lobLeadUserName: this.state.lobLeadUserName.value,
            accountId: this.state.accountId.value,
        };
        createLob(createLobRequest)
        .then(response => {
            notification.success({
                message: APP_NAME,
                description: "Thank you! You've successfully created Lob!",
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
            this.state.lobName.validateStatus === 'success' &&
            this.state.lobLeadUserName.validateStatus === 'success' &&
            this.state.accountId.validateStatus === 'success' 
        );
    }

    render() {
        const accountIdViews = [];
        this.state.accountsInfo.forEach((item, index) => {
            accountIdViews.push({value: item.id, label:item.accountName});   
        });

        const lobLeadFullNameViews = [];
        this.state.lobLeadsInfo.forEach((item, index) => {
            lobLeadFullNameViews.push({value: item.userName, label:item.userName});   
        });

        
        
        return (
            <div className="createform-container">
                <h1 className="page-title">Create Lob</h1>
                <div className="createform-content">
                    <Form onSubmit={this.handleSubmit} className="createform-form">
                        <FormItem label="Account name">
                            <Select 
                            size="large"
                            name="accountId"
                            autoComplete="off"
                            placeholder="Select Account"
                            onBlur={(event) => this.validateAccountIdAvailabilityForUser(event)}
                            options={accountIdViews} 
                            onChange={(event) => this.handleAccountIdChange(event, this.validateNameField, 'Account')} /> 
                            
                        </FormItem>

                        <FormItem label="Lob name"
                            hasFeedback
                            validateStatus={this.state.lobName.validateStatus}
                            help={this.state.lobName.errorMsg}>
                            <Input 
                                size="large"
                                name="lobName" 
                                autoComplete="off"
                                placeholder="A unique Lob name"
                                value={this.state.lobName.value} 
                                onBlur={this.validateLobNameAvailabilityForUser}
                                onChange={(event) => this.handleInputChange(event, this.validateNameField, 'Lob')} />    
                        </FormItem>

                        <FormItem label="Lob Lead name">
                            <Select 
                            size="large"
                            name="lobLeadUserName"
                            autoComplete="off"
                            placeholder="Select Lob Lead"
                            onBlur={(event) => this.validateLobLeadAvailabilityForUser(event)}
                            options={lobLeadFullNameViews} 
                            onChange={(event) => this.handleLobLeadUserNameChange(event, this.validateNameField, 'Lob Lead')} /> 
                            
                        </FormItem>

                        <FormItem>
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                className="createform-form-button"
                                disabled={this.isFormInvalid()}>Create LOB</Button>
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


    validateAccountIdAvailabilityForUser(event) {
        const accountIdValue = this.state.accountId.value;
        const accountIdValidation = this.validateNameField(accountIdValue, 'Account');
        if(accountIdValidation.validateStatus === 'error') {
            this.setState({
                accountId: {
                    value: accountIdValue,
                    ...accountIdValidation
                }
            });
            return;
        }

        this.setState({
            accountId: {
                value: accountIdValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        confirmAccountIdExistenceForUser(accountIdValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    accountId: {
                        value: accountIdValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    accountId: {
                        value: accountIdValue,
                        validateStatus: 'error',
                        errorMsg: 'This Account name is not valid'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                accountId: {
                    value: accountIdValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }


    validateLobNameAvailabilityForUser() {
        const lobNameValue = this.state.lobName.value;
        const lobNameValidation = this.validateNameField(lobNameValue, 'Lob');

        if(lobNameValidation.validateStatus === 'error') {
            this.setState({
                lobName: {
                    value: lobNameValue,
                    ...lobNameValidation
                }
            });
            return;
        }

        this.setState({
            lobName: {
                value: lobNameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkLobNameAvailabilityForUser(lobNameValue, this.state.accountId.value)
        .then(response => {
            if(response.available) {
                this.setState({
                    lobName: {
                        value: lobNameValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    lobName: {
                        value: lobNameValue,
                        validateStatus: 'error',
                        errorMsg: 'This Lob name is already taken'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                lobName: {
                    value: lobNameValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validateLobLeadAvailabilityForUser(event) {
        const lobLeadUserNameValue = this.state.lobLeadUserName.value;
        const lobLeadUserNameValidation = this.validateNameField(lobLeadUserNameValue, 'Lob lead');

        if(lobLeadUserNameValidation.validateStatus === 'error') {
            this.setState({
                lobLeadUserName: {
                    value: lobLeadUserNameValue,
                    ...lobLeadUserNameValidation
                }
            });
            return;
        }

        this.setState({
            lobLeadUserName: {
                value: lobLeadUserNameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        confirmLobLeadExistenceForUser(lobLeadUserNameValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    lobLeadUserName: {
                        value: lobLeadUserNameValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    lobLeadUserName: {
                        value: lobLeadUserNameValue,
                        validateStatus: 'error',
                        errorMsg: 'This Lob lead name is not valid'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                lobLeadUserName: {
                    value: lobLeadUserNameValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }



}

export default CreateLOB;