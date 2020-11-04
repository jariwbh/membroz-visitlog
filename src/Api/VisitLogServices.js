import axios from '../Helpers/axiosInst'
import moment from 'moment'

function getList() {
    const body = {
        "search": [
            { "searchfield": "status", "searchvalue": "active", "criteria": "eq", "datattype": "text" }
        ],
        "select": [
            { "fieldname": "visitorid", "value": 1 },
            { "fieldname": "hostid", "value": 1 },
            { "fieldname": "checkin", "value": 1 },
            { "fieldname": "checkout", "value": 1 }
        ]
    }
    return axios.post('visitlogs/filter', body);
}


function getByID(id) {
    return axios.get('visitlogs/' + id);
}

function save(visitLog) {
    if (visitLog._id === "") {
        visitLog.checkin = moment();
        let body = { ...visitLog }
        delete body._id
        return axios.post('visitlogs', body);
    } else {
        return axios.put('visitlogs/' + visitLog._id, visitLog);
    }
}

function deleteMe(id) {
    return axios.delete('visitlogs/' + id);
}

export { getList, getByID, save, deleteMe }