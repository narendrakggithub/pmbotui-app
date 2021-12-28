import { API_BASE_URL, POLL_LIST_SIZE, ACCESS_TOKEN } from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export function getAllSBUHeadNames() {
    return request({
        url: API_BASE_URL + "/sbu/getEligibleSBUHeads",
        method: 'GET'
    });
}

/*export function getAllPossibleEDLUserNames() {
    return request({
        url: API_BASE_URL + "/user/getAllPossibleEDLUserNames",
        method: 'GET'
    });
}

export function getAllPossiblePDLUserNames() {
    return request({
        url: API_BASE_URL + "/user/getAllPossiblePDLUserNames",
        method: 'GET'
    });
}

export function getAllPossibleSBUNames() {
    return request({
        url: API_BASE_URL + "/user/getAllPossibleSBUNames",
        method: 'GET'
    });
}*/

export function getAllSBUNamesOwnedByUser() {
    return request({
        url: API_BASE_URL + "/sbu/getAllSBUNamesOwnedByUser",
        method: 'GET'
    });
}

export function getAllPDLUserNamesOwnedByUser() {
    return request({
        url: API_BASE_URL + "/user/getAllPDLUserNamesOwnedByUser",
        method: 'GET'
    });
}

export function getAllReporteesOfCurrentUser() {
    return request({
        url: API_BASE_URL + "/user/getAllReporteesOfCurrentUser",
        method: 'GET'
    });
}

export function getAllAccountsOwnedByUser() {
    return request({
        url: API_BASE_URL + "/account/getAllAccountsOwnedByUser",
        method: 'GET'
    });
}

export function getAllLobsOwnedByUser() {
    return request({
        url: API_BASE_URL + "/lob/getAllLobsOwnedByUser",
        method: 'GET'
    });
}

export function checkSBUHeadAvailability(sbuHeadName) {
    return request({
        url: API_BASE_URL + "/sbu/checkSBUHeadAvailability?sbuHeadUserName=" + sbuHeadName, //just cmd
        method: 'GET'
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function createProject(createProjectRequest) {
    return request({
        url: API_BASE_URL + "/project/createProject",
        method: 'POST',
        body: JSON.stringify(createProjectRequest)
    });
}

export function createSbu(createSbuRequest) {
    return request({
        url: API_BASE_URL + "/sbu/createSbu",
        method: 'POST',
        body: JSON.stringify(createSbuRequest)
    });
}

export function createAccount(createAccountRequest) {
    return request({
        url: API_BASE_URL + "/account/createAccount",
        method: 'POST',
        body: JSON.stringify(createAccountRequest)
    });
}

export function createLob(createLobRequest) {
    return request({
        url: API_BASE_URL + "/lob/createLobRequest",
        method: 'POST',
        body: JSON.stringify(createLobRequest)
    });
}

export function createCustomer(createCustomerRequest) {
    return request({
        url: API_BASE_URL + "/customer/createCustomerRequest",
        method: 'POST',
        body: JSON.stringify(createCustomerRequest)
    });
}

export function createSubLob(createSubLobRequest) {
    return request({
        url: API_BASE_URL + "/subLob/createSubLobRequest",
        method: 'POST',
        body: JSON.stringify(createSubLobRequest)
    });
}

export function checkUserNameAvailability(userName) {
    return request({
        url: API_BASE_URL + "/user/checkUserNameAvailability?userName=" + userName,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}

export function checkManagerEmailAvailability(managerEmail) {
    return request({
        url: API_BASE_URL + "/user/checkManagerEmailAvailability?managerEmail=" + managerEmail,
        method: 'GET'
    });
}

export function checkProjectNameAvailability(projectName) {
    return request({
        url: API_BASE_URL + "/project/checkProjectNameAvailability?projectName=" + projectName,
        method: 'GET'
    });
}

export function checkSbuNameAvailability(sbuName) {
    return request({
        url: API_BASE_URL + "/sbu/checkSbuNameAvailability?sbuName=" + sbuName,
        method: 'GET'
    });
}

export function confirmSBUNameExistence(sbuName) {
    return request({
        url: API_BASE_URL + "/user/confirmSBUNameExistence?sbuName=" + sbuName,
        method: 'GET'
    });
}

export function confirmPDLUserExistence(pdlUserName) {
    return request({
        url: API_BASE_URL + "/user/confirmPDLUserExistence?pdlUserName=" + pdlUserName,
        method: 'GET'
    });
}

export function confirmEDLUserExistence(edlUserName) {
    return request({
        url: API_BASE_URL + "/user/confirmEDLUserExistence?edlUserName=" + edlUserName,
        method: 'GET'
    });
}

export function checkAccountNameAvailability(accountName) {
    return request({
        url: API_BASE_URL + "/account/checkAccountNameAvailability?accountName=" + accountName,
        method: 'GET'
    });
}

export function checkLobNameAvailabilityForUser(lobName, accountId) {
    return request({
        url: API_BASE_URL + "/lob/checkLobNameAvailabilityForUser?lobName=" + lobName+ "&accountId=" + accountId,
        method: 'GET'
    });
}

export function checkCustomerNameAvailabilityForUser(customerName, accountId) {
    return request({
        url: API_BASE_URL + "/customer/checkCustomerNameAvailabilityForUser?customerName=" + customerName+ "&accountId=" + accountId,
        method: 'GET'
    });
}

export function checkSubLobNameAvailabilityForUser(subLobName, lobId) {
    return request({
        url: API_BASE_URL + "/subLob/checkSubLobNameAvailabilityForUser?subLobName=" + subLobName+ "&lobId=" + lobId,
        method: 'GET'
    });
}

export function confirmAccountIdExistenceForUser(accountId) {
    return request({
        url: API_BASE_URL + "/account/confirmAccountIdExistenceForUser?accountId=" + accountId,
        method: 'GET'
    });
}

export function confirmLobIdExistenceForUser(lobId) {
    return request({
        url: API_BASE_URL + "/lob/confirmLobIdExistenceForUser?lobId=" + lobId,
        method: 'GET'
    });
}

export function confirmLobLeadExistenceForUser(lobLeadUserNameValue) {
    return request({
        url: API_BASE_URL + "/user/confirmLobLeadExistenceForUser?lobLeadUserNameValue=" + lobLeadUserNameValue,
        method: 'GET'
    });
}

export function confirmCustomerLeadExistenceForUser(customerLeadUserName) {
    return request({
        url: API_BASE_URL + "/user/confirmCustomerLeadExistenceForUser?customerLeadUserName=" + customerLeadUserName,
        method: 'GET'
    });
}

export function confirmSubLobLeadExistenceForUser(subLobLeadUserName) {
    return request({
        url: API_BASE_URL + "/user/confirmSubLobLeadExistenceForUser?subLobLeadUserName=" + subLobLeadUserName,
        method: 'GET'
    });
}

export function checkSubLobNameAvailability(subLobName) {
    return request({
        url: API_BASE_URL + "/subLob/checkSubLobNameAvailability?subLobName=" + subLobName,
        method: 'GET'
    });
}

export function checkCustomerNameAvailability(customerName) {
    return request({
        url: API_BASE_URL + "/customer/checkCustomerNameAvailability?customerName=" + customerName,
        method: 'GET'
    });
}

export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function getUserProfile(userName) {
    return request({
        url: API_BASE_URL + "/users/" + userName,
        method: 'GET'
    });
}

export function getUserCreatedPolls(userName, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + userName + "/polls?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAllPolls(page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/polls?page=" + page + "&size=" + size,
        method: 'GET'
    });
}


export function createPoll(pollData) {
    return request({
        url: API_BASE_URL + "/polls",
        method: 'POST',
        body: JSON.stringify(pollData)         
    });
}

export function castVote(voteData) {
    return request({
        url: API_BASE_URL + "/polls/" + voteData.pollId + "/votes",
        method: 'POST',
        body: JSON.stringify(voteData)
    });
}

export function getUserVotedPolls(userName, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + userName + "/votes?page=" + page + "&size=" + size,
        method: 'GET'
    });
}