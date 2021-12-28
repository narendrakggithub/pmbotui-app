import React, { Component } from 'react';
import { createCustomer, getAllReporteesOfCurrentUser, getAllAccountsOwnedByUser, 
    checkCustomerNameAvailabilityForUser, confirmAccountIdExistenceForUser,
    confirmCustomerLeadExistenceForUser } from '../../util/APIUtils';
import Select from 'react-select';
import './createform.css';
import {   
    ANYNAME_MAX_LENGTH,
    APP_NAME
} from '../../constants';

import { Form, Input, Button, notification } from 'antd';
const FormItem = Form.Item;

class CreateCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {       
            customerName: {
                value: ''
            },
            customerLeadUserName: {
                value: ''
            },
            customerLeadsInfo: [],
            accountId: {
                value: ''
            },
            accountsInfo: []
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateCustomerNameAvailabilityForUser = this.validateCustomerNameAvailabilityForUser.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.loadPossibleCustomerLeadNames = this.loadPossibleCustomerLeadNames.bind(this);
        this.loadPossibleAccountNames = this.loadPossibleAccountNames.bind(this);
    }
    loadPossibleCustomerLeadNames() {
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
            this.setState({ customerLeadsInfo: response })
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
        this.loadPossibleCustomerLeadNames();
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

    handleCustomerLeadUserNameChange(event, validationFun, label) {  
        const inputValue = event.value;
        //this.state.pdlUserName.value=inputValue;

        this.setState({
            customerLeadUserName : {
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
        console.log('about to submit');
        event.preventDefault();
    
        const createCustomerRequest = {
            customerName: this.state.customerName.value,
            customerLeadUserName: this.state.customerLeadUserName.value,
            accountId: this.state.accountId.value,
        };
        createCustomer(createCustomerRequest)
        .then(response => {
            notification.success({
                message: APP_NAME,
                description: "Thank you! You've successfully created Customer!",
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
            this.state.customerName.validateStatus === 'success' &&
            this.state.customerLeadUserName.validateStatus === 'success' &&
            this.state.accountId.validateStatus === 'success' 
        );
    }

    render() {
        const accountIdViews = [];
        this.state.accountsInfo.forEach((item, index) => {
            accountIdViews.push({value: item.id, label:item.accountName});   
        });

        const customerLeadFullNameViews = [];
        this.state.customerLeadsInfo.forEach((item, index) => {
            customerLeadFullNameViews.push({value: item.userName, label:item.userName});   
        });

        
        
        return (
            <div className="createform-container">
                <h1 className="page-title">Create Customer</h1>
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

                        <FormItem label="Customer name"
                            hasFeedback
                            validateStatus={this.state.customerName.validateStatus}
                            help={this.state.customerName.errorMsg}>
                            <Input 
                                size="large"
                                name="customerName" 
                                autoComplete="off"
                                placeholder="A unique Customer name"
                                value={this.state.customerName.value} 
                                onBlur={this.validateCustomerNameAvailabilityForUser}
                                onChange={(event) => this.handleInputChange(event, this.validateNameField, 'Customer')} />    
                        </FormItem>

                        <FormItem label="Customer Lead name">
                            <Select 
                            size="large"
                            name="customerLeadUserName"
                            autoComplete="off"
                            placeholder="Select Customer Lead"
                            onBlur={(event) => this.validateCustomerLeadAvailabilityForUser(event)}
                            options={customerLeadFullNameViews} 
                            onChange={(event) => this.handleCustomerLeadUserNameChange(event, this.validateNameField, 'Customer Lead')} /> 
                            
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


    validateCustomerNameAvailabilityForUser() {
        const customerNameValue = this.state.customerName.value;
        const customerNameValidation = this.validateNameField(customerNameValue, 'Customer');

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

        checkCustomerNameAvailabilityForUser(customerNameValue, this.state.accountId.value)
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
                        errorMsg: 'This Customer name is already taken'
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

    validateCustomerLeadAvailabilityForUser(event) {
        const customerLeadUserNameValue = this.state.customerLeadUserName.value;
        const customerLeadUserNameValidation = this.validateNameField(customerLeadUserNameValue, 'Customer lead');

        if(customerLeadUserNameValidation.validateStatus === 'error') {
            this.setState({
                customerLeadUserName: {
                    value: customerLeadUserNameValue,
                    ...customerLeadUserNameValidation
                }
            });
            return;
        }

        this.setState({
            customerLeadUserName: {
                value: customerLeadUserNameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        confirmCustomerLeadExistenceForUser(customerLeadUserNameValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    customerLeadUserName: {
                        value: customerLeadUserNameValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    customerLeadUserName: {
                        value: customerLeadUserNameValue,
                        validateStatus: 'error',
                        errorMsg: 'This Customer lead name is not valid'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                customerLeadUserName: {
                    value: customerLeadUserNameValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }



}

export default CreateCustomer;