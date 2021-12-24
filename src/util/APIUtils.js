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

export function getAllPolls(page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/polls?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAllSBUHeadNames() {
    return request({
        url: API_BASE_URL + "/sbu/getEligibleSBUHeads",
        method: 'GET'
    });
}

export function checkSBUHeadAvailability(sbuHeadName) {
    return request({
        url: API_BASE_URL + "/sbu/checkSBUHeadAvailability?sbuHeadUserName=" + sbuHeadUserName,
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

export function renderInDropDown(state, val) {
    return (
        state.userName.toLowerCase().indexOf(val.toLowerCase()) !== -1
    );
  }

export function getUserVotedPolls(userName, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + userName + "/votes?page=" + page + "&size=" + size,
        method: 'GET'
    });
}