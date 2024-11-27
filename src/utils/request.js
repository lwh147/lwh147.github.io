import axios from 'axios';

// 创建axios实例
const service = axios.create({
    baseURL: '', // 只有前端所以后端请求公共url为空
});

// 响应拦截
service.interceptors.response.use(
    response => {
        const res = response.data;
        console.log('拦截到响应：' + res);
        return res;
    },
    error => {
        console.log('拦截到响应：' + error);
        return Promise.reject(error);
    }
);

export default service;
