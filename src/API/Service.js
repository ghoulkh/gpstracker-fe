import method from './Method';
import config from './Config';

let service = {
    login: params => {
        let url = "api/auth/login";
        return method.post(params, url);
    },
    register: params => {
        let url = "api/user";
        return method.post(params, url);
    },
    loginWithGoogle: () => {
        let url = "oauth2/authorization/google";
        window.location.href = config.HOST + '/' + url;
    },
    loginWithFacebook: () => {
        let url = "oauth2/authorization/facebook";
        window.location.href = config.HOST + '/' + url;
    },
    logoutApi: params => {
        let url = "user/logout";
        return method.post(params, url);
    },
    currentUser: () => {
        let url = "api/user";
        return method.get(url);
    },
    registerRfid: params => {
        let url = "api/user/admin/car-info/author";
        return method.post(params, url);
    },
    getInfoCar: (pageIndex, pageSize) => {
        let url = `api/cars-info?page_index=${pageIndex}&page_size=${pageSize}`;
        return method.get(url);
    },
    getPositionRfidInOneDay: (rfid, startTime, endTime) => {
        let url = `api/positions?rfid=${rfid}&start_time=${startTime}&end_time=${endTime}`;
        return method.get(url);
    },
    getInfoPost: id => {
        let url = "api/post/" + id;
        return method.get(url);
    },
    getHouseFilter: params => {
        let url = "api/search/houses/address-title?" + params;
        return method.get(url);
    },
    getDistrict: () => {
        let url = "api/address/district?city=Thành phố Hà Nội";
        return method.get(url);
    },
    getStreet: params => {
        let url = "api/address/street?district=" + params;
        return method.get(url);
    },
    getComment: id => {
        let url = "api/comment/post/" + id;
        return method.get(url);
    },
    getRating: params => {
        let url = "api/rating/user/" + params;
        return method.get(url);
    },
    comment: (id, params) => {
        let url = "api/comment/post/" + id;
        return method.post(params, url)
    }
};

export default service;
