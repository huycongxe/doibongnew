import api from './api';
import axiosClient from './axios-client';
import SecureLS from 'secure-ls';
import appsettings from '../appsetting.json';


const ReportServices = {
    guest_from_to: (model) => {
        const url = api.report.guest_from_to;
        return axiosClient.post(url, model);
    },
  
}

export default ReportServices;