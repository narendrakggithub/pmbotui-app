import React, { Component } from 'react';
import { getNewUsersToApprove, getAllGrades, updateGradeForAssociate, updateManagerForAssociate,
    approveAssociateLogin, getAllAssociates} from '../util/APIUtils';
import './dashboard.css';
import GreenTick from '../greentick.svg';
import RedCross from '../redcross.svg';
import Select from 'react-select';
import { notification } from 'antd';
import { APP_NAME } from '../constants';

class ApproveNewUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
                   
            gradeSelected: {
                value: ''
            },
            newUsersToApprove: [],
            allSupervisors: [],
            allGrades: []
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.loadNewUsersToApprove = this.loadNewUsersToApprove.bind(this);
        this.loadAllSupervisors = this.loadAllSupervisors.bind(this);
        this.loadAllGrades = this.loadAllGrades.bind(this);
    }
    

    loadNewUsersToApprove() {
        let promise;
        promise = getNewUsersToApprove();
        if(!promise) {
            return;
        }
        this.setState({
            isLoading: true
        });
        promise            
        .then(response => {
            this.setState({ newUsersToApprove: response })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
        
    }

    loadAllSupervisors() {
        let promise;
        promise = getAllAssociates();
        if(!promise) {
            return;
        }
        this.setState({
            isLoading: true
        });
        promise            
        .then(response => {
            this.setState({ allSupervisors: response })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
        
    }

    loadAllGrades() {
        let promise;
        promise = getAllGrades();
        if(!promise) {
            return;
        }
        this.setState({
            isLoading: true
        });
        promise            
        .then(response => {
            this.setState({ allGrades: response })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
        
    }

    componentDidMount() {
        this.loadAllGrades();
        this.loadAllSupervisors();
        this.loadNewUsersToApprove();
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

    getIndexOfValue(arr, value) {
        return arr.findIndex(obj => obj.value+"" === value+"");
    }

    getIndexOfId(arr, id) {
        return arr.findIndex(obj => obj.id+"" === id+"");
    }

    deleteIdxFromArray(arr, idx) {
        arr.splice(idx, idx);
    }    

    renderTableData() {

        const gradeViews = [];
        this.state.allGrades.forEach((grade, index) => {
            gradeViews.push({value: grade.id, label:grade.description});   
        });

        const supervisorViews = [];
        this.state.allSupervisors.forEach((supervisor, index) => {
            supervisorViews.push({id:supervisor.id, value: supervisor.userName, label:supervisor.fullName + " | " + supervisor.grade + " | " + supervisor.userName});   
        });

            return this.state.newUsersToApprove.map((user, index) => {
                let verified;
                let approved;
                let newsupervisorViews = supervisorViews.slice();

                if (user.isVerified) {
                    verified = <img src={GreenTick} alt="Verified" className="icon" />
                } else {
                    verified = <img src={RedCross} alt="Not Verified" className="icon" />
                }

                if (user.isApproved) {
                    approved = true;
                    
                } else {
                    approved = false;
                }

                let gradeIndex = this.getIndexOfValue(gradeViews, user.gradeId);
                console.log(gradeViews);
                console.log("gradeIndex='" + gradeIndex+"': id='"+user.gradeId+"'");
                let usrIndex = this.getIndexOfId(newsupervisorViews, user.id);

                this.deleteIdxFromArray(newsupervisorViews, usrIndex);
                
                let mgrIndex = this.getIndexOfId(newsupervisorViews, user.managerId);
                console.log("mgrIndex=" + mgrIndex);

                return (
                <tr key={user.userName}>
                        <td>{index+1}</td>
                        <td>{user.fullName}</td>
                        <td>{user.userName}</td>
                        <td>{user.email}</td>
                        <td >
                        <Select 
                            size="large"
                            name="strGrade"
                            autoComplete="off"
                            placeholder="Select grade"
                            options={gradeViews} 
                            defaultValue={gradeViews[gradeIndex]}
                            onChange={(event) => this.changeGradeForAssociate(event, user.userName)}
                        />
                        </td>
                        <td className='tdcenter'>{verified}</td>
                        <td>
                        <Select 
                            size="large"
                            name="strManager"
                            autoComplete="off"
                            placeholder="Select manager"
                            options={newsupervisorViews} 
                            defaultValue={supervisorViews[mgrIndex]}
                            onChange={(event) => this.changeManagerForAssociate(event, user.userName)}
                        />
                        </td>
                        <td className='tdcenter'><input type="checkbox" defaultChecked={approved} onChange={(event) => this.evApproveAssociate(event, user.userName)} /></td>
                </tr>
                )
            })
     }

    render() {
        const hasRecords = this.state.newUsersToApprove.length>0;
            return (hasRecords  
                ? (<div className="fullpageview-container">
                    <h1 className="h1titleleft">Associates waiting for approvals</h1>
                    <h1 className="h1titleright">**Any changes are auto saved</h1> 
                    <div className="fullpageview-content">
                            <table id='tablecss'>
                            <tbody>
                                <tr>
                                    <th key='0'>S. No</th>
                                    <th key='1'>Full Name</th>
                                    <th key='2'>userName</th>
                                    <th key='3'>Email</th>
                                    <th key='4'>Grade</th>
                                    <th key='5' className='tdcenter'>Email Verified?</th>
                                    <th key='6'>Supervisor</th>
                                    <th key='7' className='tdcenter'>Approve</th>
                                </tr>
                                {this.renderTableData()}
                            </tbody>
                            </table>
                    </div>
                </div>)
                : <div/>
            );
        }

        changeGradeForAssociate(event, userName) {
            const gradeSelectedValue = event.value;
    
            this.setState({
                gradeSelected: {
                    value: gradeSelectedValue,
                    validateStatus: 'validating',
                    errorMsg: null
                }
            });
    
            updateGradeForAssociate(gradeSelectedValue, userName)
            .then(response => {
                notification.success({
                    message: APP_NAME,
                    description: "Grade updated",
                });          
            }).catch(error => {
                notification.error({
                    message: APP_NAME,
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
            });
        }

        changeManagerForAssociate(event, userName) {
            const managerUsername = event.value;

            console.log("managerUsername:"+managerUsername);
    
            updateManagerForAssociate(managerUsername, userName)
            .then(response => {
                notification.success({
                    message: APP_NAME,
                    description: "Manager updated",
                });          
            }).catch(error => {
                notification.error({
                    message: APP_NAME,
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
            });
        }

        evApproveAssociate(event, userName) {
            //TODO: Please correct
            /*console.log(event.target.value);
            if(!event.target.value) {
                event.target.checked = false;
                notification.error({
                    message: APP_NAME,
                    description: 'Please select grade first !!'
                });
            } else {*/
                approveAssociateLogin(userName, event.target.checked)
                .then(response => {
                    notification.success({
                        message: APP_NAME,
                        description: "Approved",
                    });          
                }).catch(error => {
                    notification.error({
                        message: APP_NAME,
                        description: error.message || 'Sorry! Something went wrong. Please try again!'
                    });
                });
            //}
        }
    
}

export default ApproveNewUser;