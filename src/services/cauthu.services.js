import api from './api';
import axiosClient from './axios-client';
import SecureLS from 'secure-ls';
import appsettings from '../appsetting.json';


const CauThuServices = {
    get : () => {
        const url = api.doibong.cauthu;
        return axiosClient.get(url);
    },
    create: (model) => {
        const url = api.doibong.cauthu;
        return axiosClient.post(url, model);
    },
    edit: (model) => {
        const url = api.doibong.cauthu;
        return axiosClient.put(url, model);
    },
    delete: (id) => {
        const url = api.doibong.cauthu;
        return axiosClient.delete(`${url}/${id}`);
    }
}

export default CauThuServices;