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
    getPositionHistoryByRfid: (rfid, pageIndex, pageSize) => {
        let url = `api/positions/${rfid}?page_index=${pageIndex}&page_size=${pageSize}`;
        return method.get(url);
    },
    getImage: () => {
        let url = "api/files";
        return method.get(url);
    },
    showImage: (params) => {
        let url = "api/image/" + params;
        return method.getFile(url);
    },
    getOrder: (id, receiver) => {
        let url = `api/delivery/${id}/email-receiver/${receiver}`;
        return method.get(url);
    },
    createDelivery: params => {
        let url = "api/delivery";
        return method.post(params, url);
    },
    getDeliveryByDriverUserName: (pageIndex, pageSize, userNameAdmin, driverUsername) => {
        let url = `api/deliveries?page_index=${pageIndex}&page_size=${pageSize}&created_by=${userNameAdmin}&driver=${driverUsername}`;
        return method.get(url);
    },
    getDeliveryCANCELED: (pageIndex, pageSize) => {
        let url = `api/deliveries/canceled?page_index=${pageIndex}&page_size=${pageSize}`;
        return method.get(url);
    },
    driverGetDeliveryByStatus: (pageIndex, pageSize, status) => {
        let url = `api/me/driver/deliveries?page_index=${pageIndex}&page_size=${pageSize}&status=${status}`;
        return method.get(url);
    },
    confirmDelivery: (id) => {
        let url = `api/driver/start-delivery/${id}`;
        return method.post({}, url);
    },
    completeDelivery: (id) => {
        let url = `api/driver/completed-delivery/${id}`;
        return method.post({}, url);
    },
    cancelDelivery: (id) => {
        let url = `api/driver/cancel-delivery/${id}`;
        return method.post({}, url);
    },
    getPositionByUserName: (username) => {
        let url = `api/driver/${username}/position-log`;
        return method.get(url);
    },
    changeDriverDelivery: (params, id) => {
        let url = `api/delivery/${id}`;
        return method.patch(params, url);
    },
    getDistrictByCity: () => {
        let url = `api/address/district?city=Th%C3%A0nh%20ph%E1%BB%91%20H%C3%A0%20N%E1%BB%99i`;
        return method.get(url);
    },
    getMyCarInfo: () => {
        let url = `api/me/cars-info`;
        return method.get(url);
    },
    getUserInfo: (userName, pageIndex, pageSize) => {
        let url = `api/admin/user-info?user_name=${userName}&page_index=${pageIndex}&page_size=${pageSize}`;
        return method.get(url);
    },
    permissionAdmin: (params) => {
        let url = `api/admin/permission`;
        return method.post(params, url);
    }
};

export default service;
