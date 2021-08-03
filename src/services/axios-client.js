import axios from 'axios';
import queryString from 'query-string';
// import SecureLS from 'secure-ls';
import appsettings from '../appsetting.json'

// var ls = new SecureLS({ encodingType: 'aes', isCompression: false, encryptionSecret: appsettings.encryption_secret });
// var baseURL = 'http://localhost:51790/'
var baseURL = 'http://172.16.160.51:8083/'

const axiosClient = axios.create({
    baseURL: baseURL,
    headers: {
        'content-type': 'application/json'
    },
    paramsSerializer: params => queryString.stringify(params),
});

// axiosClient.interceptors.request.use(async (config) => {
//     let access = JSON.parse(ls.get('access'));
//     if (access)
//         config.headers.authorization = `Bearer ${access.token}`;

//     return config;
// });

// axiosClient.interceptors.response.use((response) => {
//     console.log(response)
//     if (response && response.data) {
//         if (response.data.error == 2) {
//             window.location.replace("/identity/login");
//         } else {
//             return response.data;
//         }
//     }

//     return response;
// }, (error) => {
//     console.log(error);
//     if ((error.response && error.response.status == 401))
//         window.location.replace("/identity/login");

//     throw error;
// });

export default axiosClient;
