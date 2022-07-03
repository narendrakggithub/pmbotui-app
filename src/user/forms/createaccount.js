import React, { Component } from 'react';
import { createAccount, checkAccountNameAvailability, 
    getAllPDLUserNamesOwnedByUser, getAllSBUNamesOwnedByUser, confirmSBUNameExistence,
    confirmPDLUserExistence } from '../../util/APIUtils';
import Select from 'react-select';
import './createform.css';
import {   
    ANYNAME_MAX_LENGTH,
    APP_NAME
} from '../../constants';

import { Form, Input, Button, notification } from 'antd';
const FormItem = Form.Item;

class CreateAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {       
            accountName: {
                value: ''
            },
            pdlUserName: {
                value: ''
            },
            pdlFullNames: [],
            sbuName: {
                value: ''
            },
            sbuNames: []
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateAccountNameAvailability = this.validateAccountNameAvailability.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.loadPossiblePDLNames = this.loadPossiblePDLNames.bind(this);
        this.loadPossibleSBUNames = this.loadPossibleSBUNames.bind(this);
    }
    loadPossiblePDLNames() {
        let promise;
        promise = getAllPDLUserNamesOwnedByUser();
        if(!promise) {
            return;
        }
        this.setState({
            isLoading: true
        });
        promise            
        .then(response => {
            this.setState({ pdlFullNames: response })
            console.log(this.state.pdlFullNames);
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
    }

    loadPossibleSBUNames() {
        let promise;
        promise = getAllSBUNamesOwnedByUser();
        console.log('test');
        console.log(promise);
        if(!promise) {
            return;
        }
        this.setState({
            isLoading: true
        });
        promise            
        .then(response => {
            this.setState({ sbuNames: response })
            console.log(this.state.sbuNames);
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
    }

    componentDidMount() {
        this.loadPossiblePDLNames();
        this.loadPossibleSBUNames();
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

    handlePdlUserNameChange(event, validationFun, label) {  
        const inputValue = event.value;
        //this.state.pdlUserName.value=inputValue;

        this.setState({
            pdlUserName : {
                value: inputValue
            }
        });

        validationFun(inputValue, label);
    }
    handleSBUNameChange(event, validationFun, label) {  
        const inputValue = event.value;
        //this.state.sbuName.value=inputValue;
        this.setState({
            sbuName : {
                value: inputValue
            }
        });
        validationFun(inputValue, label);
    }

    handleSubmit(event) {
        console.log('about to submit');
        event.preventDefault();
    
        const createAccountRequest = {
            accountName: this.state.accountName.value,
            pdlUserName: this.state.pdlUserName.value,
            sbuName: this.state.sbuName.value,
        };
        createAccount(createAccountRequest)
        .then(response => {
            notification.success({
                message: APP_NAME,
                description: "Thank you! You've successfully created Account!",
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
            this.state.accountName.validateStatus === 'success' &&
            this.state.pdlUserName.validateStatus === 'success' &&
            this.state.sbuName.validateStatus === 'success' 
        );
    }

    render() {
        const sbuNameViews = [];
        this.state.sbuNames.forEach((sbuNameTmp, index) => {
            sbuNameViews.push({value: sbuNameTmp.sbuName, label:sbuNameTmp.sbuName});   
        });

        const pdlFullNameViews = [];
        this.state.pdlFullNames.forEach((pdlFullName, index) => {
            pdlFullNameViews.push({value: pdlFullName.userName, label:pdlFullName.fullName});   
        });

        
        
        return (
            <div className="createform-container">
                <h1 className="page-title">Create Account</h1>
                <div className="createform-content">
                    <Form onSubmit={this.handleSubmit} className="createform-form">
                        <FormItem label="SBU name">
                            <Select 
                            size="large"
                            name="sbuName"
                            autoComplete="off"
                            placeholder="Select SBU"
                            onBlur={(event) => this.validateSBUNameAvailability(event)}
                            options={sbuNameViews} 
                            onChange={(event) => this.handleSBUNameChange(event, this.validateNameField, 'SBU')} /> 
                            
                        </FormItem>

                        <FormItem label="Account name"
                            hasFeedback
                            validateStatus={this.state.accountName.validateStatus}
                            help={this.state.accountName.errorMsg}>
                            <Input 
                                size="large"
                                name="accountName" 
                                autoComplete="off"
                                placeholder="A unique Account name"
                                value={this.state.accountName.value} 
                                onBlur={this.validateAccountNameAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validateNameField, 'Account')} />    
                        </FormItem>

                        <FormItem label="PDL name">
                            <Select 
                            size="large"
                            name="pdlUserName"
                            autoComplete="off"
                            placeholder="Select PDL"
                            onBlur={(event) => this.validatePDLAvailability(event)}
                            options={pdlFullNameViews} 
                            onChange={(event) => this.handlePdlUserNameChange(event, this.validateNameField, 'PDL')} /> 
                            
                        </FormItem>

                        <FormItem>
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                className="createform-form-button"
                                disabled={this.isFormInvalid()}>Create Account</Button>
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


    validateSBUNameAvailability(event) {
        // First check for client side errors in sbuname

        const sbuNameValue = this.state.sbuName.value;
        const sbuNameValidation = this.validateNameField(sbuNameValue, 'SBU');



        if(sbuNameValidation.validateStatus === 'error') {
            this.setState({
                sbuName: {
                    value: sbuNameValue,
                    ...sbuNameValidation
                }
            });
            return;
        }

        this.setState({
            sbuName: {
                value: sbuNameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        confirmSBUNameExistence(sbuNameValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    sbuName: {
                        value: sbuNameValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    sbuName: {
                        value: sbuNameValue,
                        validateStatus: 'error',
                        errorMsg: 'This SBU name is not valid'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                sbuName: {
                    value: sbuNameValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }


    validateAccountNameAvailability() {
        const accountNameValue = this.state.accountName.value;
        const accountNameValidation = this.validateNameField(accountNameValue, 'Account');

        if(accountNameValidation.validateStatus === 'error') {
            this.setState({
                accountName: {
                    value: accountNameValue,
                    ...accountNameValidation
                }
            });
            return;
        }

        this.setState({
            accountName: {
                value: accountNameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkAccountNameAvailability(accountNameValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    accountName: {
                        value: accountNameValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    accountName: {
                        value: accountNameValue,
                        validateStatus: 'error',
                        errorMsg: 'This Account name is already taken'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                accountName: {
                    value: accountNameValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validatePDLAvailability(event) {
        const pdlUserNameValue = this.state.pdlUserName.value;
        const pdlUserNameValidation = this.validateNameField(pdlUserNameValue, 'PDL');

        if(pdlUserNameValidation.validateStatus === 'error') {
            this.setState({
                pdlUserName: {
                    value: pdlUserNameValue,
                    ...pdlUserNameValidation
                }
            });
            return;
        }

        this.setState({
            pdlUserName: {
                value: pdlUserNameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        confirmPDLUserExistence(pdlUserNameValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    pdlUserName: {
                        value: pdlUserNameValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    pdlUserName: {
                        value: pdlUserNameValue,
                        validateStatus: 'error',
                        errorMsg: 'This PDL name is not valid'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                pdlUserName: {
                    value: pdlUserNameValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }



}

export default CreateAccount;