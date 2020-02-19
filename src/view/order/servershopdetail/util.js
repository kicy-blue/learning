// 评论类型 0 全部 1好评 2中评 3差评
export const buttonList = [{
		code: '00',
		value: '全部'
	},
	{
		code: '1',
		value: '好评'
	}, {
		code: '2',
		value: '中评'
	}, {
		code: '3',
		value: '差评'
	}
];
export const commentArr = [{
		code: 'ServiceScore',
		value: '服务评价'
	},
	{
		code: 'TechScore',
		value: '技术评价'
	}, {
		code: 'EnvirScore',
		value: '环境评价'
	}
];
export function MP() {
	const ak = '1NV70dFhCLQGi8u303C3pZT2scjw4ijo'
	return new Promise(function(resolve, reject) {
		window.onload = function() {
			resolve(BMap)
		}
		var script = document.createElement("script");
		script.type = "text/javascript";
		// script.src = "http://api.map.baidu.com/api?v=3.0&ak=" + ak;//3.0版本,用不了?
		script.src = "http://api.map.baidu.com/api?v=2.0&ak=" + ak + "&callback=init"; //2.0版本
		script.onerror = reject;
		document.head.appendChild(script);
	})
}

//获取距离:
export function getLocation({
	payload,
	callback
} = {}) {
	let geolocation = new BMap.Geolocation();
	const {
		Lng,
		Lat,
		Address
	} = payload;
	if (geolocation) {
		geolocation.getCurrentPosition((position) => {
			let map = new BMap.Map();
			let Longitude = position.longitude; //获取用户的经度
			let Latitude = position.latitude; //获取用户的纬度	
			let pointA = new BMap.Point(Longitude, Latitude); //用户的经纬度
			let pointB = new BMap.Point(Lng, Lat); //从数据库中取出商家的经纬度
			const distance = ((map.getDistance(pointA, pointB)) / 1000).toFixed(1) + 'km';
			callback && callback(distance)
		}, showError);
		//如果getCurrentPosition()运行成功，则向参数showPosition中规定的函数返回一个coordinates对象
		//getCurrentPosition()方法的第二个参数showError用于处理错误。它规定当获取用户位置失败时运行的函数
	} else {
		console.log("该设备浏览器不支持地理定位");
	}
}

export function showError(error) {
	switch (error.code) {
		case error.PERMISSION_DENIED:
			console.log("用户不允许地理定位")
			break;
		case error.POSITION_UNAVAILABLE:
			console.log("无法获取当前位置")
			break;
		case error.TIMEOUT:
			console.log("操作超时")
			break;
		case error.UNKNOWN_ERROR:
			console.log("未知错误")
			break;
	}
}