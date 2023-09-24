// 引入axios
import axios from "axios";
// 配置axios, 设置content-type
axios.defaults.headers.post["Content-Type"] = "application/json";
// 配置axios, 基础路径
axios.defaults.baseURL = "http://127.0.0.1:3000/api";
// 设置跨域携带cookie
axios.defaults.withCredentials = true;

// 定义post方法, url: 请求地址, data: 请求参数

// 响应拦截
axios.interceptors.response.use((response) => {
	// 如果响应的状态码是200, 则直接返回响应的数据
	if (response.status === 200 && response.data.errno === 0) {
		console.log(JSON.stringify(response.data));
		// 将_id替换为id, 先将对象转换为字符串, 然后再转换为对象, 使用正则表达式替换
		let dataStr = JSON.stringify(response.data).replace(/"_id"/g, '"id"');
		// 将替换后的字符串转换为对象
		response.data = JSON.parse(dataStr);
		return response;
	}
	// 如果响应的错误码是10003, 说明没有登录, 跳转到登录页面
	if (response.status === 200 && response.data.errno === 10003) {
		// 清除登录状态
		window.localStorage.removeItem("isLogin");
		// 刷新页面
		window.location.reload();
	}
});

/**
 * ajax请求函数模块, post
 * @param {string} url 请求的路径
 * @param {object} data 携带的参数, 格式是object
 * @returns {Promise} 返回一个promise对象, 包含响应的data数据
 */
const post = (url, data = {}) => {
	// 返回一个promise对象
	return new Promise((resolve, reject) => {
		// 调用axios的post方法, 传入url和data
		axios.post(url, data).then(
			(response) => {
				// 成功时调用resolve
				resolve(response.data);
			},
			(error) => {
				// 失败时调用reject
				reject(error);
			}
		);
	});
};
/**
 * ajax请求函数模块, put
 * @param {string} url 请求的路径
 * @param {object} data 携带的参数, 格式是object
 * @returns {Promise} 返回一个promise对象, 包含响应的data数据
 */
const put = (url, data = {}) => {
	// 返回一个promise对象
	return new Promise((resolve, reject) => {
		// 调用axios的put方法, 传入url和data
		axios.put(url, data).then(
			(response) => {
				// 成功时调用resolve
				resolve(response.data);
			},
			(error) => {
				// 失败时调用reject
				reject(error);
			}
		);
	});
};

/**
 * ajax请求函数模块, get
 * @param {string} url 请求的路径
 * @param {object} params 携带的参数, 格式是object
 * @returns {Promise} 返回一个promise对象, 包含响应的data数据
 */
const get = (url, params = {}) => {
	return new Promise((resolve, reject) => {
		axios
			.get(url, { params })
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				reject(error);
			});
	});
};

// 导出post方法
export { post, get, put };
