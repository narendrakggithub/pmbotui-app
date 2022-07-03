import React, { Component } from 'react';
import { getAccountsToAssignEDL, getAllEDLUserNamesOwnedByUser, assignEDLForAccount} from '../util/APIUtils';
import './dashboard.css';
import Select from 'react-select';
import { notification } from 'antd';
import { APP_NAME } from '../constants';

class EDLAccountLink extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountsToAssignEDL: [],
            allPossibleEDLS: []
        }
        this.loadAccountsToAssignEDL = this.loadAccountsToAssignEDL.bind(this);
        this.loadAllPossibleEDLS = this.loadAllPossibleEDLS.bind(this);
    }
    

    loadAccountsToAssignEDL() {
        let promise;
        promise = getAccountsToAssignEDL();
        if(!promise) {
            return;
        }
        this.setState({
            isLoading: true
        });
        promise            
        .then(response => {
            this.setState({ accountsToAssignEDL: response })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
        
    }

    loadAllPossibleEDLS() {
        let promise;
        promise = getAllEDLUserNamesOwnedByUser();
        if(!promise) {
            return;
        }
        this.setState({
            isLoading: true
        });
        promise            
        .then(response => {
            this.setState({ allPossibleEDLS: response })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
        
    }

    componentDidMount() {
        this.loadAccountsToAssignEDL();
        this.loadAllPossibleEDLS();
    }

    getIndexOfId(arr, id) {
        return arr.findIndex(obj => obj.id+"" === id+"");
    }

    renderTableData() {
        const allPossibleEDLView = [];
        this.state.allPossibleEDLS.forEach((item, index) => {
            allPossibleEDLView.push({id:item.id, value: item.userName, label:item.fullName + " | " + item.grade + " | " + item.userName});   
        });

            return this.state.accountsToAssignEDL.map((account, index) => {
                let edlIndex = this.getIndexOfId(allPossibleEDLView, account.edlId);
                console.log("edlIndex="+edlIndex);                
                return (
                <tr key={account.id}>
                        <td>{index+1}</td>
                        <td>{account.accountName}</td>
                        <td >
                        <Select 
                            size="large"
                            name="edl"
                            autoComplete="off"
                            placeholder="Select EDL"
                            options={allPossibleEDLView} 
                            defaultValue={allPossibleEDLView[edlIndex]}
                            onChange={(event) => this.changeEDLForAccount(event, account.accountName)}
                        />
                       </td>
                </tr>
                )
            })
     }

    render() {
        const hasRecords = this.state.accountsToAssignEDL.length>0;
        return (hasRecords  
            ? (<div className="fullpageview-container">
                <h1 className="h1titleleft">Accounts waiting for EDL</h1>
                <h1 className="h1titleright">**Any changes are auto saved</h1> 
                <div className="fullpageview-content">
                        <table id='tablecss'>
                        <tbody>
                            <tr>
                                <th key='0'>S. No</th>
                                <th key='1'>Account Name</th>
                                <th key='2'>EDL</th>
                            </tr>
                            {this.renderTableData()}
                        </tbody>
                        </table>
                </div>
            </div>)
            : <div/>
        );
    }

    changeEDLForAccount(event, accountName) {
        const edlUserName = event.value;

        assignEDLForAccount(edlUserName, accountName)
        .then(response => {
            notification.success({
                message: APP_NAME,
                description: "EDL assigned to account: "+accountName,
            });          
        }).catch(error => {
            notification.error({
                message: APP_NAME,
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
    }
}

export default EDLAccountLink;