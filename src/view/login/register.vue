<template>
	<div class="page page-login">
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
				 type="number"
				 placeholder="请输入验证码" />
			</div>
			<div class="cell-field">
				<img class="cell-field-item" src="../../assets/img/password.png" />
				<van-field
				 v-model="LoginPswd"
				 type="password"
				 placeholder="请输入密码" />
			</div>
			<div class="cell-field">
				<img class="cell-field-item" src="../../assets/img/password.png" />
				<van-field
				 v-model="LoginPswdAgain"
				 type="password"
				 placeholder="请再次输入密码" />
			</div>
		</van-cell-group>
		<div class="login-btn">
			<van-button @click="submit" round :color="registerInfo ? '#ee0a24' : '#ccc'" type="primary" block>同意并登录</van-button>
		</div>
		<div class="operate-btn" v-if="!check">
			<span>新用户登录即完成注册，代表同意
				<a style="color:#3e87f5" @click="goCondition">《养车无忧用户协议》</a>
			</span>
		</div>
		<div class="login-bottom">
			<!-- <other-login /> -->
		</div>
	</div>
</template>

<script>
	import MD5 from "../../services/MD5";
	import otherLogin from "./other-login.vue";
	import loginLogo from "./login-logo.vue";
	import { mapGetters } from 'vuex';
	import {
		NavBar,
		Field,
		Image,
		Button,
		Divider,
		Toast,
	} from 'vant';
	import {
		validateTel,
		countDown,
		getVerifyCode,
		checkVerifyCode 
	} from './util.js';
	export default {
		name: "login",
		layout: 'default',
		components: {
			otherLogin,
			loginLogo
		},
		data() {
			return {
				LoginPswd: "",
				LoginPswdAgain: '',
				Mobile: '',
				VerifyCode: '',
				second: 1,
				VerifyType:5,
			}
		},
		created() {
			/*验证码类型 ：
			  ** 1： ForgetPwd ； 2：ModifyLoginPwd ；3 ModifyPayPwd
			  ** 4： NoPwdLogin ；5：Register ； 6 ： Activity
			 */
			const {type} = this.$route.params;
			this.VerifyType = type || 5;
			console.log('this.VerifyType',this.VerifyType)
		},
		computed: {
			registerInfo() {
				const check = this.Mobile && this.LoginPswd && this.VerifyCode && this.LoginPswdAgain ? true : false;
				return check;
			},
			...mapGetters({
				check: 'auth/check'
			})
		},
		methods: {
			goCondition() {
				this.$router.push({
					name: 'condition'
				})
			},
			//该页面用于忘记密码和修改密码：
			submit() {
				if (!this.registerInfo) return;
				let util = {
					regisster: () => {
						//注册：
						this.$http.post('customer/Goldmine/RegisterByMobile', {
								Mobile: this.Mobile,
								VerifyCode: this.VerifyCode,
								LoginPswd
							})
							.then((response) => {
	
							})
					},
					//修改密码
					modifyPwd:()=>{
						const LoginPswd = (new MD5()).hexMd5(this.LoginPswd);
						let params = {
							Mobile: this.Mobile,
							LoginPswd,
							VerifyCode :this.VerifyCode
						}
						this.$http.post('customer/UserInfo/ModifyLoginPswd', params).then((response) => {
							const {
								Body
							} = response.data;
							if(Body && Body.StatusCode==0){
							    Toast('密码修改成功');
								this.$store.dispatch('auth/saveToken', {
									token: Body.ticket,
									remember: 365
								}).then((res) => {
									this.$router.push({
										name: 'home'
									})
								})
							} else {
								const msg = Body.Message || "密码修改失败";
								Toast(msg);
							}	
						});
					}
						
				}
				
				//检测手机号：
				if (!validateTel(this.Mobile)) return;
				//检测密码：
				if(this.LoginPswd.length<6){
				    Toast("密码长度不能小于6位");
				}else if(this.LoginPswd.length>16){
				    Toast("密码长度不能大于16位");
				}
				if (this.LoginPswd !== this.LoginPswdAgain) {
					Toast("两次输入的密码不一致，请重新输入");
					return;
				}
				//检测验证码：
				if(this.VerifyCode.length!==6){
				    Toast("请输入正确的验证码");
				    return;
				}
				if(this.VerifyCode == 5){
					util.regisster();
				}else{
					// 需要校验验证码的类型：1、修改密码，2、忘记密码，3、修改支付密码
					let params_code = {
						VerifyType: this.VerifyType,
						Mobile: this.Mobile,
						VerifyCode: this.VerifyCode,
						// Mode: 0,
					};
					if(this.VerifyType== 2){
						util.modifyPwd();
					}else{
						checkVerifyCode({
							props:this,
							params:params_code,
							callback: (res) => {
								if(!res) return;
								util.modifyPwd();
							},
						});
					}
					
				}
					
			},
			//获取验证码： 
			getCode() {
				const {
					Mobile
				} = this;
				if (!validateTel(Mobile)) return;
				let params = {
					Mobile,
					VerifyType: this.VerifyType,
					// ActivityNo: "A10004",
					Mode: 0
				};
				getVerifyCode({
					props:this,
					params,
					callback: (data) => {
						this.second = data;
					},
				});
			},
		}
	}
</script>
<style>
	.page-login .van-tabs__nav--card {
		margin: 0 15%;
	}

	.cell-field .van-button--small {
		width: 86px;
		line-height: 25px;
	}
</style>

<style lang="less" scoped>
	.page {
		background: #fff;
		padding: 0px 20px;
		position: relative;
		// padding-bottom: 288px;
	}

	.page-login {
		min-height: 100vh;
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
		color: '#666';
		font-size: 12px;
	}

	.btn-group {
		display: flex;
		justify-content: space-around;
	}

	.btn-group-item {
		float: left;
		width: 1.4rem;
		height: 1.4rem;
		/* margin: .5rem .965rem; */
	}

	.cell-field {
		display: flex;

		&-item {
			width: 18px;
			height: 18px;
			margin-top: 13px;
			margin-right: 10px;
		}

		.van-field__button {
			width: 86px;
			height: 30px;

		}
	}

	.login-bottom {
		height: 160px;
	}
</style>
