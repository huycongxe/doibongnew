import api from './api';
import axiosClient from './axios-client';
import SecureLS from 'secure-ls';
import appsettings from '../appsetting.json';


const MeetingServices = {
    get : (email) => {
        const url = api.meeting.meeting_by_user;
        return axiosClient.get(`${url}/${email}`);
    },
    create_qr_by_meeting: (model) => {
        const url = api.lobby.create_qr_by_meeting;
        return axiosClient.post(url, model);
    },
    create_qr_bonus_meeting: (model) => {
        const url = api.lobby.create_qr_bonus_meeting;
        return axiosClient.post(url,model);
    },
    create_qr: (model) => {
        const url = api.lobby.create_qr;
        return axiosClient.post(url, model);
    }
}

export default MeetingServices;