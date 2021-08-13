import axios from 'axios';
import queryString from 'query-string';

// var baseURL = 'http://127.0.0.1:8000/'
var baseURL = 'http://doibong-deploy.eba-6znexcnp.ap-southeast-1.elasticbeanstalk.com/'

const axiosClient = axios.create({
    baseURL: baseURL,
    headers: {
        'content-type': 'application/json'
    },
    paramsSerializer: params => queryString.stringify(params),
});


export default axiosClient;
