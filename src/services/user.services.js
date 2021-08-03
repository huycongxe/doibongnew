import api from './api';
import axiosClient from './axios-client';

const UserServices = {
    get : () => {
        const url = api.user.all_user;
        return axiosClient.get(url);
    },

    login: (model) => {
        const url = api.user.login;
        return axiosClient.post(url, model);
    }

}

export default UserServices;