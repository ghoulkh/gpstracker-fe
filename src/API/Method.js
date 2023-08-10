import config from './Config';
import auth from './AuthService';
import {actLogout} from "../ActionService/Action.js";
import notice from "../Utils/Notice.js";

const method = {
    get: async (url) => {
        url = config.HOST + '/' + url
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth.getToken(),
            'Accept-Language': 'vi'
        }
        let response = await fetch(url, {
            method: 'GET',
            headers
        });
        let rs = await response.json();
        if (rs.code && rs.code === "UNAUTHORIZED") {
            return logoutUser();
        }
        switch (response.status) {
            case 200:
                return rs
            case 401:
                return logoutUser()
            default: {
                console.log('err')
                if (rs.code) {
                    throw (rs.description)
                }
                throw (rs.message)
            }
        }
    },
    getFile: async (url) => {
        url = config.HOST + '/' + url;
        let headers = {
            'Authorization': 'Bearer ' + auth.getToken(),
            'Accept-Language': 'vi'
        };
        let response = await fetch(url, {
            method: 'GET',
            headers
        });
        if (response.status === 401) {
            return logoutUser();
        }
        if (!response.ok) {
            throw new Error('Request failed: ' + response.status);
        }
        return await response.blob();
    },
    getFileV2: async (url) => {
        url = config.HOST + '/' + url;
        let headers = {
            'Authorization': 'Bearer ' + auth.getToken(),
            'Accept-Language': 'vi'
        };
        let response = await fetch(url, {
            method: 'GET',
            headers
        });
        if (response.status === 401) {
            return logoutUser();
        }
        if (!response.ok) {
            throw new Error('Request failed: ' + response.status);
        }
        return response;
    },
    post: async (data, url) => {
        console.log(JSON.stringify(data))
        url = config.HOST + '/' + url
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth.getToken(),
            'Accept-Language': 'vi',
        }
        let response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });

        let rs = await response.json();
        if (rs.code && rs.code === "UNAUTHORIZED") {
            return logoutUser();
        }
        switch (response.status) {
            case 200:
                return rs
            case 401:
                return logoutUser()
            default: {
                console.log(rs)
                throw (rs)
            }
        }
    },
    postForm: async (data, url) => {
        url = config.HOST + '/' + url
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': 'vi',
        }
        let response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
        switch (response.status) {
            case 200:
                return response
            default: {
                let rs = await response.json();
                console.log(rs)
                throw (rs)
            }
        }
    },
    delete: async (data, url) => {
        url = config.HOST + '/' + url
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth.getToken(),
            'Accept-Language': 'vi'
        }
        let response = await fetch(url, {
            method: 'DELETE',
            headers,
            body: JSON.stringify(data),
        });

        let rs = await response.json();
        if (rs.code && rs.code === "UNAUTHORIZED") {
            return logoutUser();
        }
        switch (response.status) {
            case 200:
                return rs
            case 401:
                return logoutUser()
            default: {
                console.log(rs)
                throw (rs)
            }
        }
    },
    put: async (data, url) => {
        url = config.HOST + '/' + url
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth.getToken(),
            'Accept-Language': 'vi'
        }

        let response = await fetch(url, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        });

        let rs = await response.json();
        if (rs.code && rs.code === "UNAUTHORIZED") {
            return logoutUser();
        }
        switch (response.status) {
            case 200:
                return rs
            case 401:
                return logoutUser()
            default: {
                console.log(rs)
                throw (rs)
            }
        }
    },
    patch: async (data, url) => {
        url = config.HOST + '/' + url
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth.getToken(),
            'Accept-Language': 'vi'
        }
        let response = await fetch(url, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(data),
        });

        let rs = await response.json();
        if (rs.code && rs.code === "UNAUTHORIZED") {
            return logoutUser();
        }
        switch (response.status) {
            case 200:
                return rs
            case 401:
                return logoutUser()
            default: {
                console.log(rs)
                throw (rs)
            }
        }
    },
}

function logoutUser() {
    notice.inf('Phiên đăng nhập đã hết hạn');
    actLogout();
    window.location.href = "/";
}

export default method
