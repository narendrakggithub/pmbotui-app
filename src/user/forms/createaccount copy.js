import React, { Component } from 'react';
import { createAccount, checkAccountNameAvailability, getAllEDLUserNamesOwnedByUser, 
    getAllPDLUserNamesOwnedByUser, getAllSBUNamesOwnedByUser, confirmSBUNameExistence,
    confirmPDLUserExistence, confirmEDLUserExistence } from '../../util/APIUtils';
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
            edlUserName: {
                value: ''
            },
            edlFullNames: [],
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
        this.loadPossibleEDLNames = this.loadPossibleEDLNames.bind(this);
        this.loadPossiblePDLNames = this.loadPossiblePDLNames.bind(this);
        this.loadPossibleSBUNames = this.loadPossibleSBUNames.bind(this);
    }



    loadPossibleEDLNames() {
        let promise;
        promise = getAllPossibleEDLUserNames();
        if(!promise) {
            return;
        }
        this.setState({
            isLoading: true
        });
        promise            
        .then(response => {
            this.setState({ edlFullNames: response })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
    }

    loadPossiblePDLNames() {
        let promise;
        promise = getAllPossiblePDLUserNames();
        if(!promise) {
            return;
        }
        this.setState({
            isLoading: true
        });
        promise            
        .then(response => {
            this.setState({ pdlFullNames: response })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
    }

    loadPossibleSBUNames() {
        let promise;
        promise = getAllSBUNamesOwnedByUser();
        if(!promise) {
            return;
        }
        this.setState({
            isLoading: true
        });
        promise            
        .then(response => {
            this.setState({ sbuNames: response })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
    }

    componentDidMount() {
        this.loadPossibleEDLNames();
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

    handleEdlUserNameChange(event, validationFun, label) {  
        const inputValue = event.value;
        //this.state.edlUserName.value=inputValue;

        this.setState({
            edlUserName : {
                value: inputValue
            }
        });

        validationFun(inputValue, label);
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
        event.preventDefault();
    
        const createAccountRequest = {
            accountName: this.state.accountName.value,
            edlUserName: this.state.edlUserName.value,
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
            this.state.edlUserName.validateStatus === 'success' &&
            this.state.pdlUserName.validateStatus === 'success' &&
            this.state.sbuName.validateStatus === 'success' 
        );
    }

    render() {
        const edlFullNameViews = [];
        this.state.edlFullNames.forEach((edlFullName, index) => {
            edlFullNameViews.push({value: edlFullName.userName, label:edlFullName.userFullName});   
        });

        const pdlFullNameViews = [];
        this.state.pdlFullNames.forEach((pdlFullName, index) => {
            pdlFullNameViews.push({value: pdlFullName.userName, label:pdlFullName.userFullName});   
        });

        const sbuNameViews = [];
        this.state.sbuNames.forEach((sbuNameTmp, index) => {
            sbuNameViews.push({value: sbuNameTmp.userFullName, label:sbuNameTmp.userFullName});   
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

                        <FormItem label="EDL name">
                            <Select 
                            size="large"
                            name="edlUserName"
                            autoComplete="off"
                            placeholder="Select EDL"
                            onBlur={(event) => this.validateEDLAvailability(event)}
                            options={sbuNameViews} 
                            onChange={(event) => this.handleEdlUserNameChange(event, this.validateNameField, 'EDL')} /> 
                            
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
        const accountNameValidation = this.validateAccountName(accountNameValue, 'Account');

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

    validateEDLAvailability(event) {
        const edlUserNameValue = this.state.edlUserName.value;
        const edlUserNameValidation = this.validateNameField(edlUserNameValue, 'EDL');

        if(edlUserNameValidation.validateStatus === 'error') {
            this.setState({
                edlUserName: {
                    value: edlUserNameValue,
                    ...edlUserNameValidation
                }
            });
            return;
        }

        this.setState({
            edlUserName: {
                value: edlUserNameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        confirmEDLUserExistence(edlUserNameValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    edlUserName: {
                        value: edlUserNameValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    edlUserName: {
                        value: edlUserNameValue,
                        validateStatus: 'error',
                        errorMsg: 'This EDL name is not valid'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                edlUserName: {
                    value: edlUserNameValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }


}

export default CreateAccount;