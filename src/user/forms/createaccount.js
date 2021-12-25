import React, { Component } from 'react';
import * as ReactDOM from "react-dom";
import { createSbu, checkSbuNameAvailability, getAllSBUHeadNames, checkSBUHeadAvailability } from '../../util/APIUtils';
import Autocomplete from 'react-autocomplete';
import Select from 'react-select';
import './createsbu.css';
import { Link } from 'react-router-dom';
import {   
    ANYNAME_MIN_LENGTH, ANYNAME_MAX_LENGTH,
    APP_NAME
} from '../../constants';

import { Form, Input, Button, notification, DatePicker } from 'antd';
const FormItem = Form.Item;

class CreateSbu extends Component {
    constructor(props) {
        super(props);
        this.state = {       
            sbuName: {
                value: ''
            },
            sbuHeadUserName: {
                value: ''
            },
            sbuHeadNames: []
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateSbuNameAvailability = this.validateSbuNameAvailability.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.loadSBUHeadList = this.loadSBUHeadList.bind(this);
    }

    loadSBUHeadList() {
        let promise;
        promise = getAllSBUHeadNames();
        

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise            
        .then(response => {
            console.log(response);
            this.setState({ sbuHeadNames: response })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
        
    }

    componentDidMount() {
        this.loadSBUHeadList();
    }

    handleInputChange(event, validationFun) {
        console.log(event);
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

    handleInputChange2(event, validationFun) {
        console.log(event);  
        const inputValue = event.value;
        this.state.sbuHeadUserName.value=inputValue;
        console.log(this.state.sbuHeadUserName.value);  
        validationFun(inputValue);
    }

    handleSubmit(event) {
        event.preventDefault();
    
        const createSbuRequest = {
            sbuName: this.state.sbuName.value,
            sbuHeadUserName: this.state.sbuHeadUserName.value
        };
        createSbu(createSbuRequest)
        .then(response => {
            notification.success({
                message: APP_NAME,
                description: "Thank you! You've successfully created SBU!",
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
            this.state.sbuName.validateStatus === 'success' &&
            this.state.sbuHeadUserName.validateStatus === 'success' 
        );
    }

    render() {
        const { editFields } = this.state;

        const sbuHeadNameViews = [];
        this.state.sbuHeadNames.forEach((sbuHeadName, sbuHeadNameIndex) => {
            sbuHeadNameViews.push({value: sbuHeadName.userName, label:sbuHeadName.userFullName});   
        });
        
        return (
            <div className="createSbu-container">
                <h1 className="page-title">Create SBU</h1>
                <div className="createSbu-content">
                    <Form onSubmit={this.handleSubmit} className="createSbu-form">
                        <FormItem label="SBU name"
                            hasFeedback
                            validateStatus={this.state.sbuName.validateStatus}
                            help={this.state.sbuName.errorMsg}>
                            <Input 
                                size="large"
                                name="sbuName" 
                                autoComplete="off"
                                placeholder="A unique SBU name"
                                value={this.state.sbuName.value} 
                                onBlur={this.validateSbuNameAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validateSbuName)} />    
                        </FormItem>
                        <FormItem label="SBU head name">
                            <Select 
                            size="large"
                            name="sbuHeadName"
                            autoComplete="off"
                            placeholder="A unique SBU Head name"
                            onBlur={(event) => this.checkSBUHeadAvailability(event)}
                            options={sbuHeadNameViews} 
                            onChange={(event) => this.handleInputChange2(event, this.validateSbuHeadName)} /> 
                            
                        </FormItem>
                        <FormItem>
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                className="createSbu-form-button"
                                disabled={this.isFormInvalid()}>Create SBU</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }

    // Validation Functions

    validateSbuName = (sbuName) => {
        if(!sbuName) {
            return {
                validateStatus: 'error',
                errorMsg: 'SBU name may not be empty'                
            }
        }

        if(sbuName.length > ANYNAME_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `SBU name is too long (Maximum ${ANYNAME_MAX_LENGTH} characters allowed)`
            }
        }

        return {
            validateStatus: null,
            errorMsg: null
        }
    }

    validateSbuHeadName = (sbuHeadName) => {
        console.log(sbuHeadName);
        if(!sbuHeadName) {
            return {
                validateStatus: 'error',
                errorMsg: 'SBU name may not be empty'                
            }
        }

        if(sbuHeadName.length > ANYNAME_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `SBU name is too long (Maximum ${ANYNAME_MAX_LENGTH} characters allowed)`
            }
        }

        return {
            validateStatus: null,
            errorMsg: null
        }
    }

    checkSBUHeadAvailability(event) {
        // First check for client side errors in sbuname

        const sbuHeadUserNameValue = this.state.sbuHeadUserName.value;
        const ssbuHeadUserNameValidation = this.validateSbuHeadName(sbuHeadUserNameValue);



        if(ssbuHeadUserNameValidation.validateStatus === 'error') {
            this.setState({
                sbuHeadUserName: {
                    value: sbuHeadUserNameValue,
                    ...ssbuHeadUserNameValidation
                }
            });
            return;
        }

        this.setState({
            sbuHeadUserName: {
                value: sbuHeadUserNameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkSBUHeadAvailability(sbuHeadUserNameValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    sbuHeadUserName: {
                        value: sbuHeadUserNameValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    sbuHeadUserName: {
                        value: sbuHeadUserNameValue,
                        validateStatus: 'error',
                        errorMsg: 'This SBU head name is not valid'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                sbuHeadUserName: {
                    value: sbuHeadUserNameValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }


    validateSbuNameAvailability() {
        // First check for client side errors in sbuname
        const sbuNameValue = this.state.sbuName.value;
        const sbuNameValidation = this.validateSbuName(sbuNameValue);

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

        checkSbuNameAvailability(sbuNameValue)
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
                        errorMsg: 'This sbuname is already taken'
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


}

export default CreateSbu;