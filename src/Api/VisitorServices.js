import axios from '../Helpers/axiosInst'

function getList() {
    const body = {
        "search": [
            { "searchfield": "status", "searchvalue": "active", "criteria": "eq", "datattype": "text" }
        ]
    }
    return axios.post('promotions/filter', body);
}


function getByID(id) {
    return axios.get('promotions/' + id);
}

function save(visitor) {
    if (visitor._id === "") {
        let body = { ...visitor }
        delete body._id
        return axios.post('promotions', body);
    } else {
        return axios.put('promotions/' + visitor._id, visitor);
    }
}

function deleteMe(id) {
    return axios.delete('promotions/' + id);
}

export { getList, getByID, save, deleteMe }