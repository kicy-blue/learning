import {
	Dialog,
	Toast
} from 'vant';
export function validateTel(tel) {
	// let TEL_REGEXP = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
	let TEL_REGEXP = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
	if (TEL_REGEXP.test(tel)) {
		return true;
	}
	Dialog.alert({
		message: tel ? '请输入正确的手机号码' : '请输入手机号码'
	})
	return false;
}
export function countDown({
	time,
	callback
}) {
	let second = time;
	const timer = setInterval(() => {
		second--;
		if (second) {
			callback && callback(second)
		} else {
			clearInterval(timer);
		}
	}, 1000);
	// return second;

}
//url上拼接参数:
export function connectParams(params) {
	let arr = [];
	for (let k in params) {
		let param = `${k}=`;
		if (params[k]) {
			param = `${k}=${params[k]}`;
		}
		arr.push(param);
	}
	return arr.join("&");
}
export function getRequest() {
	let url = window.location.search;
	let theRequest = new Object();
	if (url.indexOf("?") != -1) {
		let str = url.substr(1); //获取url中"?"符后的字串  
		let strs = str.split("&");
		for (let i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}
//截取路由参数
export function getQueryString(name, urlParams) {
	console.log('urlparams', urlParams)
	let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	console.log('reg===', reg)
	let r = urlParams.substr(1).match(reg) || window.location.search.substr(1).match(reg);
	console.log('r', r)
	if (r != null) return unescape(r[2]);
	return null;
}

//获取验证码: 
export function getVerifyCode({
	props,
	params,
	callback
}) {
	const {
		Mobile
	} = props;
	if (!validateTel(Mobile)) return;

	props.$http.post('customer/VerifyCode/SendVerifyCode', params).then((response) => {
		// console.log('response.data222222222', response.data)
		const {
			Body,
		} = response.data;
		const msg = Body.Message || '验证码发送失败';
		Toast(msg);
		if (Body && Body.SendStatusCode === 0) {
			//获取验证码倒计时
			const getSecond = countDown({
				time: 60,
				callback: (data) => {
					callback && callback(data)
				},
			});
		}
	});
}
//验证验证码:
export function checkVerifyCode({
	props,
	params,
	callback
}) {
	props.$http.post('customer/VerifyCode/CheckVerifyCode', params).then((resCode) => {
		
		// console.log('res_code1111111111:', resCode);
		const {
			Body
		} = resCode.data;
		if (Body && Body.CheckStatusCode == 0) {
			callback && callback(true)
		} else {
			const msg = Body.Message || "验证码不正确";
			Toast(msg);
		}
	})
}
