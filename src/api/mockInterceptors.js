// 对axios进行二次封装
import axios from 'axios'

// // 进度条
import nProgress from 'nprogress';
// // 进度条样式
import 'nprogress/nprogress.css'

const requests = axios.create({
    baseURL: '/mock',
    timeout: 2000,
})

// 请求拦截器 - 请求发送之前，请求拦截器可以监测到，
requests.interceptors.request.use((config) => {
    // 发送请求前，进度条开始
    nProgress.start();
    // config是一个配置对象，其中的headers属性较为重要
    return config;
});
// 响应拦截器
requests.interceptors.response.use(res => {
    // 请求发送完成后，进度条结束
    nProgress.done();
    return res.data;
}, err => {
    return Promise.reject(new Error('Failed!'));
})

export default requests