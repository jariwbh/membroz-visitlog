import axios from '../Helpers/axiosInst'

function getList() {
    const body = {
        "search": [
            { "searchfield": "status", "searchvalue": "active", "criteria": "eq", "datattype": "text" }
        ]
    }
    return axios.post('users/filter', body);
}


function getByID(id) {
    return axios.get('users/' + id);
}

function save(host) {
    if (host._id === "") {
        let body = { ...host }
        delete body._id
        return axios.post('users', body);
    } else {
        return axios.put('users/' + host._id, host);
    }
}

function deleteMe(id) {
    return axios.delete('users/' + id);
}

export { getList, getByID, save, deleteMe }