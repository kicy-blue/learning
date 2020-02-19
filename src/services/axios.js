import axios from 'axios';
import store from '../store';

const qs = require('qs');
import md5 from 'js-md5';

axios.defaults.withCredentials = false;
axios.defaults.baseURL = '/api/';
// axios.defaults.baseURL = '//mm.yangche51.com';

axios.interceptors.request.use(request => {

	if (request.url.includes('//spp.yangche51.com')) {
		request.url = request.url;
		request.headers.common['X-Requested-With'] = `XMLHttpRequest`
		request.headers.common['ontent-type'] = 'application/x-www-form-urlencoded';
	} else if (!request.url.includes('//app.yangche51.com')) {
		let preurl = request.url[0] == '/' ? '' : '/';
		request.url = '//mm.yangche51.com' + preurl + request.url;
		request.headers.common['X-Requested-With'] = `XMLHttpRequest`
		request.headers.common['ontent-type'] = 'application/x-www-form-urlencoded';
	}
	// axios.defaults.headers.common['Access-Control-Expose-Headers'] = 'Set-Cookie';
	let token = store.getters['auth/token']
	let data = request.data
	if (token) {

	} else {
		token = '';

	}
	let dataValue = {
		Header: {
			SourceType: 1,
			UserPermit: '',
			SignCode: '5a2f40a07cf128b88f5e8319d57eda7a',
			UserTicket: token,
			AllowOriginUrl: '',
			ExpandInfo: '',
			AutoInfo: localStorage.getItem('YC51_Web_Auto') || '',
		},
		Body: JSON.stringify(data),
	}
	let SignCode = md5(dataValue.Header.SourceType + dataValue.Body + dataValue.Header.UserTicket)
	dataValue.Header.SignCode = SignCode;
	let bodyData = {
		data: JSON.stringify(dataValue)
	}
	request.data = qs.stringify(bodyData);
	if(data && data.noHeader){
		const {noHeader,...newData} = data;
		request.data = qs.stringify(newData);
	}
	return request;
});

// 设置拦截器
axios.interceptors.response.use((response) => {
	return response;
}, (err) => {
	// if(err.response){

	// }
	return Promise.reject(err);
});
export default axios;
