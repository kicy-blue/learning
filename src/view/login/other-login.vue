<template>
	<div class="otherLogin-page">
		<van-divider :style="{ padding: '20px 0','border-color':'#8b8f96' }">第三方登录</van-divider>
		<div class="btn-group">
			<img @click="()=>goLogin('wechat')" class="btn-group-item" src="../../assets/img/weixin.png" />
			<img  @click="()=>goLogin('qq')" class="btn-group-item" src="../../assets/img/qq-small.png" />
			<img class="btn-group-item" src="../../assets/img/wb.png" />
		</div>
	</div>
</template>

<script>
	import {
		Divider
	} from 'vant';
	import {connectParams,getQueryString} from "./util.js";
	export default {
		name: "other-login",
		layout: 'default',
		data() {
			return {
				
			}
		},
		created() {},
		methods: {
			goLogin(type){
				// H5 授权微信第三方登录
				// 第一步：拉取授权页面进行授权登录
				const host = window.location.host;
				const appid = '716027609'; //自己的appid
				const redirect_uri = `//${host}/home`; //授权登录后返回的页面
				let pages = `https://open.weixin.qq.com/connect/oauth2/authorize?`;
				let paramsUrl = {
					appid,
					redirect_uri,
					response_type:'code',
					scope:'snsapi_userinfo',
					state:'STATE#wechat_redirect',
				}
				
				if(type == 'qq'){
					pages = `https://xui.ptlogin2.qq.com/cgi-bin/xlogin?`;
					paramsUrl = {
						appid,
						redirect_uri,
						pt_3rd_aid:'100300197',
						daid:'383',
						pt_skey_valid:'0',
						style:'35',
						s_url:'//connect.qq.com',
						refer_cgi:'authorize',
						which:'',
						response_type:'code',
						client_id:'100300197',
						state:'75031506457153594997622548219434'
					};
				}
				
				pages = pages+connectParams(paramsUrl);
				
				//非静默授权，snsapi_userinfo 需要用户手动同意
				console.log('pages',pages)
				// console.log(getQueryString('appid','&'+connectParams(paramsUrl)))
				// return;
				window.location.href = pages;
				// 第二步：获取页面返回的code
				//解析url参数:
				var getRequest = function() {
					var url = window.location.search;
					var theRequest = new Object();
					if (url.indexOf("?") != -1) {
						var str = url.substr(1); //获取url中"?"符后的字串  
						var strs = str.split("&");
						for (var i = 0; i < strs.length; i++) {
							theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
						}
					}
					return theRequest;
				}
				console.log('getRequest.code',getRequest.code)
				 
				//判断url中是否有code
				if(getRequest.code){
					// H5获取微信accesstoken
					// this.getWxAccessToken(getRequest.code);
				}
				// 第三步：通过code换取网页授权access_token,
				// (这些步骤后端会处理 前端只需要调用后端的一个接口)
				// 会返回openid，通过openid登录就好了
			}
		}
	}
</script>

<style scoped>
	.otherLogin-page{
		position: absolute;
		bottom: 20px;
		width: 90%;
		/* margin-top: 20px; */
	}
	.btn-group {
		display: flex;
		justify-content: space-around;
	}
	.btn-group-item {
		float: left;
		width: 40px;
		height: 40px;
	}
</style>
