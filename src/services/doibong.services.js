import api from './api';
import axiosClient from './axios-client';
import SecureLS from 'secure-ls';
import appsettings from '../appsetting.json';


const DoiBongServices = {
    get : () => {
        const url = api.doibong.doibong;
        return axiosClient.get(url);
    },
    
    create: (model) => {
        const url = api.doibong.doibong;
        return axiosClient.post(url, model);
    },
    edit: (model) => {
        const url = api.doibong.doibong;
        return axiosClient.put(url, model);
    },
    delete: (id) => {
        const url = api.doibong.doibong;
        return axiosClient.delete(`${url}/${id}`);
    },
    overall: () => {
        const url = api.doibong.overall;
        return axiosClient.get(url);
    },
    age: () => {
        const url = api.doibong.age;
        return axiosClient.get(url);
    },
    area: () => {
        const url = api.doibong.area;
        return axiosClient.get(url);
    },
    get_height_weight: () => {
        const url = api.doibong.height_weight;
        return axiosClient.get(url);
    }
}

export default DoiBongServices;