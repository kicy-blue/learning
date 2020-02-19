<template>
	<div class="page page-login">
		<!-- <span class="van-nav-bar">
			<div class="van-nav-bar__left"><i class="van-icon van-icon-arrow-left van-nav-bar__arrow"></i></div>
		</span> -->
		<van-tabs type="card">
			<van-tab title="账号登录">
				<login-logo />
				<van-cell-group>
					<div class="cell-field">
						<img class="cell-field-item" src="../../assets/img/user.png" />
						<van-field
						 v-model="loginName"
						 clearable
						 placeholder="请输入账号/手机号码" />
					</div>
					<div class="cell-field">
						<img class="cell-field-item" src="../../assets/img/password.png" />
						<van-field
						 v-model="loginPaswd"
						 type="password"
						 placeholder="请输入密码" />
					</div>
				</van-cell-group>
				<div class="login-btn">
					<van-button @click="submit(1)" round :color="loginInfo1 ? '#ee0a24' : '#ccc'" type="primary" block>同意并登录</van-button>
				</div>
				<div class="operate-btn">
					<span @click="()=>goTo(5)">注册</span>
					<a @click="()=>goTo(1)">忘记密码</a>
				</div>
			</van-tab>
			<van-tab title="验证登录">
				<login-logo />
				<van-cell-group>
					<div class="cell-field">
						<img class="cell-field-item" src="../../assets/img/user.png" />
						<van-field
						 v-model="Mobile"
						 type="number"
						 center
						 clearable
						 placeholder="请输入手机号">
							<van-button slot="button" round :color="second !== 1 ? '#ccc' : '#ee0a24'" size="small" type="primary" @click="getCode">
								{{second !== 1 ? second+'s': '获取验证码'}}
							</van-button>
						</van-field>
					</div>
					<div class="cell-field">
						<img class="cell-field-item" src="../../assets/img/code.png" />
						<van-field
						 v-model="VerifyCode"
						 type="password"
						 placeholder="请输入验证码" />
					</div>
				</van-cell-group>
				<div class="login-btn">
					<van-button @click="submit(2)" round :color="loginInfo2 ? '#ee0a24' : '#ccc'" type="primary" block>同意并登录</van-button>
				</div>
				<div class="operate-btn">
					<span>新用户登录即完成注册，代表同意
						<a style="color:#3e87f5" @click="goCondition">《养车无忧用户协议》</a>
					</span>
				</div>
			</van-tab>

		</van-tabs>
		<div class="login-bottom">
			<!-- <other-login /> -->
		</div>
	</div>
</template>

<script>
	import MD5 from "../../services/MD5";
	import otherLogin from "./other-login.vue";
	import loginLogo from "./login-logo.vue";
	import Cookies from 'js-cookie';
	import {
		validateTel,
		countDown,
		getVerifyCode,
	} from './util.js';
	import {
		Tab,
		Tabs,
		Field,
		Image,
		Button,
		Divider,
		Toast,
		Dialog
	} from 'vant';
	export default {
		name: "login",
		layout: 'default',
		components: {
			otherLogin,
			loginLogo,

		},
		data() {
			return {
				loginName: "",
				loginPaswd: "",
				Mobile: '',
				VerifyCode: '',
				VerifyType: 4,
				second: 1,
			}
		},
		init() {
			document.title = "登录";
		},
		created() {},
		beforeMount(){
			 Cookies.remove('UserTicket')
		},
		computed: {
			loginInfo1() {
				const check = this.loginName && this.loginPaswd ? true : false;
				return check;
			},
			loginInfo2() {
				const check = this.Mobile && this.VerifyCode ? true : false;
				return check;
			}
		},
		methods: {
			goCondition() {
				this.$router.push({
					name: 'condition'
				})
			},
			goTo(type) {
				this.$router.push({
					name: 'register',
					params: {
						type
					}
				})
			},
			submit(type) {
				/*
				type:1--账号密码登录，2--手机号验证码登录
				*/
				if (type == 1 && !this.loginInfo1) return;
				if (type == 2 && !this.loginInfo2) return;
				let util = {
					login: (url, params) => {
						//登录：
						this.$http.post(url, params)
							.then((response) => {
								const {
									Body
								} = response.data;
								const msg = Body ? Body.Message: '登录失败';
								Toast(msg);
								if (Body && Body.ResultCode === 0) {
									document.cookie = "app_ticket="+response.data.Body.appTicket;
									this.$store.dispatch('auth/saveToken', {
										token: Body.ticket,
										remember: 365
									}).then((res) => {
										this.$router.push({
											name: 'home'
										})
									})
								}

							})
					}
				}
				if (type == 1) {
					if (this.loginPaswd.length < 6 || this.loginPaswd.length > 16) {
						Toast("密码错误，请重新输入");
						return;
					}
					let params = {
						loginName: this.loginName,
						loginPaswd: (new MD5()).hexMd5(this.loginPaswd)
					}
					util.login('/customer/Goldmine/PaswdLogin', params);
				} else {
					//检测手机号：
					if (!validateTel(this.Mobile)) return;
					//检测验证码：
					if (this.VerifyCode.length !== 6) {
						Toast("请输入正确的验证码");
						return;
					}
					let params = {
						Mobile: this.Mobile,
						InviterUserId: 0,
						VerifyCode: this.VerifyCode
					}
					util.login('/customer/Goldmine/UserLogin', params);
				}

			},
			//获取验证码：
			getCode() {
				const {
					Mobile
				} = this;
				if (!validateTel(Mobile)) return;
				let params = {
					VerifyType: this.VerifyType,
					Mobile,
					Email: "",
					ActivityNo: "A10004",
					Mode: 0
				};
				getVerifyCode({
					props: this,
					params,
					callback: (data) => {
						this.second = data;
					},
				});
			}
		}
	}
</script>

<style>
	.page-login .van-tabs__nav--card {
		margin: 0 16%;
	}

	.page-login .van-nav-bar__left {
		top: -8px
	}

	.page-login .van-nav-bar__arrow {
		font-size: 25px;
	}

	.cell-field .van-button--small {
		width: 86px;
		line-height: 25px;
	}
</style>
<style scoped>
	.page {
		background: #fff;
		padding: 0px 20px;
		position: relative;
	}

	.page-login {
		min-height: 100vh;
		padding-top: 15px;
	}

	.img-back {
		position: fixed;
		left: 10px;
		top: 8px;
		width: 13px;
		height: 18px;
	}

	.van-field__label {
		width: 20px
	}

	.login-btn {
		margin: 50px 0 30px;
	}

	.operate-btn {
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		color: #666;
	}

	.cell-field {
		display: flex;
	}

	.cell-field-item {
		width: 18px;
		height: 18px;
		margin-top: 13px;
		margin-right: 10px;
	}

	.login-bottom {
		height: 160px;
	}
</style>
