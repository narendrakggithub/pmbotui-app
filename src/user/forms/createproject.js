import React, { Component } from 'react';
import { createProject, checkProjectNameAvailability, 
    checkSubLobNameAvailability, confirmProjectManagerAvailabilityForUser, 
    checkCustomerNameAvailability, getAllReporteesOfCurrentUser,
    getMySubLobList, getMyCustomerList, serCheckSubLobIDAvailabilityForUser,
    serCheckCustomerIdAvailabilityForUser} from '../../util/APIUtils';
import './createproject.css';
import {ANYNAME_MAX_LENGTH, APP_NAME} from '../../constants';
import Select from 'react-select';
import { Form, Input, Button, notification } from 'antd';
import validator from 'validator';
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
            subLobId: {
                value: ''
            },
            customerId: {
                value: ''
            },
            pmUserName: {
                value: ''
            },
            eligibleProjectManagers: [],
            mySubLobList: [],
            myCustomerList: []

        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateProjectNameAvailability = this.validateProjectNameAvailability.bind(this);
        this.checkProjectManagerAvailabilityForUser = this.checkProjectManagerAvailabilityForUser.bind(this);
        this.validateSubLobNameAvailability = this.validateSubLobNameAvailability.bind(this);
        this.validateCustomerNameAvailability = this.validateCustomerNameAvailability.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.loadEligibleProjectManagers = this.loadEligibleProjectManagers.bind(this);
        this.loadSubLobList = this.loadSubLobList.bind(this);
        this.loadCustomerList = this.loadCustomerList.bind(this);
    }

    loadEligibleProjectManagers() {
        let promise;
        promise = getAllReporteesOfCurrentUser();
        if(!promise) {
            return;
        }
        this.setState({
            isLoading: true
        });
        promise            
        .then(response => {
            this.setState({ eligibleProjectManagers: response })
            
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
    }

    componentDidMount() {
        this.loadEligibleProjectManagers();
        this.loadSubLobList();
        this.loadCustomerList();
    }

    loadSubLobList() {
        let promise;
        promise = getMySubLobList();
        if(!promise) {
            return;
        }
        this.setState({
            isLoading: true
        });
        promise            
        .then(response => {
            this.setState({ mySubLobList: response })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
    }

    loadCustomerList() {
        let promise;
        promise = getMyCustomerList();
        if(!promise) {
            return;
        }
        this.setState({
            isLoading: true
        });
        promise            
        .then(response => {
            this.setState({ myCustomerList: response })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
    }

    handleInputChange(event, validationFun, label) {
        const target = event.target;
        const inputName = target.name;        
        console.log(target.name);
        const inputValue = target.value;
        console.log(target.value);

        this.setState({
            [inputName] : {
                value: inputValue,
                ...validationFun(inputValue, label)
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
    
        const createProjectRequest = {
            projectName: this.state.projectName.value,
            startDate: this.state.startDate.value,
            endDate: this.state.endDate.value,
            pmUserName: this.state.pmUserName.value,
            subLobId: this.state.subLobId.value,
            customerId: this.state.customerId.value
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

    

    handlePMUserNameChange(event, validationFun, label) {  
        const inputValue = event.value;
        this.setState({
            pmUserName : {
                value: inputValue
            }
        });
        validationFun(inputValue, label);
    }

    handleSubLobIDChange(event, validationFun, label) {  
        const inputValue = event.value;
        this.setState({
            subLobId : {
                value: inputValue
            }
        });
        validationFun(inputValue, label);
    }

    handleCustomerIDChange(event, validationFun, label) {  
        const inputValue = event.value;
        this.setState({
            customerId : {
                value: inputValue
            }
        });
        validationFun(inputValue, label);
    }

    render() {
        const lvPMListView = [];
        this.state.eligibleProjectManagers.forEach((item, index) => {
            lvPMListView.push({value: item.userName, label:item.fullName});   
        });

        const lvSubLobListView = [];
        this.state.mySubLobList.forEach((item, index) => {
            lvSubLobListView.push({value: item.id, label:item.subLobName});   
        });

        const lvCustomerListView = [];
        this.state.myCustomerList.forEach((item, index) => {
            lvCustomerListView.push({value: item.id, label:item.customerName});   
        });

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
                                onChange={(event) => this.handleInputChange(event, this.validateNameField, 'Project')} />    
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
                                onChange={(event) => this.handleInputChange(event, this.validateStartDate ,'Start date')} />    
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
                                onChange={(event) => this.handleInputChange(event, this.validateEndDate,'End date')} />    
                        </FormItem>
                        <FormItem 
                            label="Project Manager"
                            hasFeedback
                            validateStatus={this.state.pmUserName.validateStatus}
                            help={this.state.pmUserName.errorMsg}>
                            <Select 
                                size="large"
                                name="pmUserName"
                                autoComplete="off"
                                placeholder="Select Project Manager"
                                onBlur={(event) => this.checkProjectManagerAvailabilityForUser(event)}
                                options={lvPMListView} 
                                onChange={(event) => this.handlePMUserNameChange(event, this.validateNameField, 'Project Manager')} 
                            />     
                        </FormItem>
                        <FormItem label="Sub Lob Name"
                            hasFeedback
                            validateStatus={this.state.subLobId.validateStatus}
                            help={this.state.subLobId.errorMsg}>
                            <Select 
                                size="large"
                                name="subLobId"
                                autoComplete="off"
                                placeholder="Select Sub LoB"
                                onBlur={(event) => this.uiCheckSubLobAvailabilityForUser(event)}
                                options={lvSubLobListView} 
                                onChange={(event) => this.handleSubLobIDChange(event, this.checkIDSelection, 'Sub Lob')} 
                            />    
                        </FormItem>
                        <FormItem label="Customer name"
                            hasFeedback
                            validateStatus={this.state.customerId.validateStatus}
                            help={this.state.customerId.errorMsg}>
                            <Select 
                                size="large"
                                name="customerId"
                                autoComplete="off"
                                placeholder="Select Customer"
                                onBlur={(event) => this.uiCheckCustomerIdAvailabilityForUser(event)}
                                options={lvCustomerListView} 
                                onChange={(event) => this.handleCustomerIDChange(event, this.checkIDSelection, 'Customer')} 
                            />    
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

    uiCheckSubLobAvailabilityForUser(event) {
        // First check for client side errors in sbuname

        const subLobIdValue = this.state.subLobId.value;
        const subLobIdValidation = this.validateNameField(subLobIdValue, 'Sub Lob');

        if(subLobIdValidation.validateStatus === 'error') {
            this.setState({
                subLobId: {
                    value: subLobIdValue,
                    ...subLobIdValidation
                }
            });
            return;
        }

        this.setState({
            subLobId: {
                value: subLobIdValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        serCheckSubLobIDAvailabilityForUser(subLobIdValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    subLobId: {
                        value: subLobIdValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    subLobId: {
                        value: subLobIdValue,
                        validateStatus: 'error',
                        errorMsg: 'This SBU head name is not valid'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                subLobId: {
                    value: subLobIdValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    uiCheckCustomerIdAvailabilityForUser(event) {
        // First check for client side errors in sbuname

        const customerIdValue = this.state.customerId.value;
        const customerIdValidation = this.validateNameField(customerIdValue, 'Customer');

        if(customerIdValidation.validateStatus === 'error') {
            this.setState({
                customerId: {
                    value: customerIdValue,
                    ...customerIdValidation
                }
            });
            return;
        }
        this.setState({
            customerId: {
                value: customerIdValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        serCheckCustomerIdAvailabilityForUser(customerIdValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    customerId: {
                        value: customerIdValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    customerId: {
                        value: customerIdValue,
                        validateStatus: 'error',
                        errorMsg: 'This SBU head name is not valid'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                customerId: {
                    value: customerIdValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
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

    checkIDSelection = (nameField, label) => {
        console.log('nameField = '+nameField.id);
        if(nameField.id < 1) {
            return {
                validateStatus: 'error',
                errorMsg: label+' name may not be empty'                
            }
        }
        return {
            validateStatus: null,
            errorMsg: null
        }
    }

    isFormInvalid() {
        return !(
            this.state.projectName.validateStatus === 'success' &&
            this.state.startDate.validateStatus === 'success' &&
            this.state.endDate.validateStatus === 'success' &&
            this.state.pmUserName.validateStatus === 'success' &&
            this.state.subLobId.validateStatus === 'success' &&
            this.state.customerId.validateStatus === 'success'
        );
    }

    validateStartDate = (startDate) => {
        if(!validator.isDate(startDate)) {
            return {
                validateStatus: 'error',
                errorMsg: 'Start date may not be empty'                
            }
        }
        console.log('valid');
        return {
            validateStatus: 'success',
            errorMsg: null
        }
    }

    validateEndDate = (endDate) => {
        if(!validator.isDate(endDate)) {
            return {
                validateStatus: 'error',
                errorMsg: 'End date may not be empty'                
            }
        }

        var stDate = new Date(this.state.startDate.value); 
        var enDate = new Date(endDate); 

        if(enDate.getTime() < stDate.getTime()) {
            return {
                validateStatus: 'error',
                errorMsg: 'End date should be after start date'                
            }
        }
        return {
            validateStatus: 'success',
            errorMsg: null
        }
    }

   

    validateProjectNameAvailability() {
        // First check for client side errors in projectname
        const projectNameValue = this.state.projectName.value;
        const projectNameValidation = this.validateNameField(projectNameValue, 'Project Name');

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

    checkProjectManagerAvailabilityForUser(event) {
        const pmUserNameValue = this.state.pmUserName.value;
        const pmUserNameValidation = this.validateNameField(pmUserNameValue, 'Project Manager');

        if(pmUserNameValidation.validateStatus === 'error') {
            this.setState({
                pmUserName: {
                    value: pmUserNameValue,
                    ...pmUserNameValidation
                }
            });
            return;
        }

        this.setState({
            pmUserName: {
                value: pmUserNameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        confirmProjectManagerAvailabilityForUser(pmUserNameValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    pmUserName: {
                        value: pmUserNameValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    pmUserName: {
                        value: pmUserNameValue,
                        validateStatus: 'error',
                        errorMsg: 'This Project Manager name is not valid'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                pmUserName: {
                    value: pmUserNameValue,
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