<template>
	<div>
		<div style="padding-bottom: 1.1rem">
			<div class="topBox">
				<div class="topImgBox">
					<router-link :to="{name: 'set'}">
						<img src="../../assets/img/设置.png" alt />
					</router-link>
					<router-link :to="{name: 'notify'}">
						<img src="../../assets/img/ico-msg.png" alt />
					</router-link>
				</div>
				<div class="topCenBox">
					<div class="topLogoBox">
						<div class="logoBox">
							<img
							 v-if="myUserInfo.userPhoto"
							 :src="myUserInfo.userPhoto.imgUrl||myUserInfo.userPhoto.originalImgUrl"
							 alt />
						</div>
					</div>
					<div class="topMoneyBox">
						<div v-if="myUserInfo.nickName" class="over name" @click="goModifyName">{{myUserInfo.nickName}}</div>
						<div v-else class="over name" @click="goLogin">登录</div>
						<div class="moneyBxo">
							{{myUserInfo.mobile}}
							<!-- <div>
								<img src="../../assets/img/余额宝.png" alt />
								<span class="over">{{myUserInfo.userAccount||""}}</span>
							</div>
							<div>
								<img src="../../assets/img/余额2.png" alt />
								<span class="over">{{myUserInfo.userScore||""}}</span>
							</div> -->
						</div>
					</div>
				</div>
			</div>
			<div class="cenBox">
				<div class="flexBox numBox">
					<router-link class="flexBox-item" :to="{name: 'balance'}">
						<div class="over">{{myUserInfo.userAccount || 0}}</div>
						<div>余额</div>
					</router-link>
					<router-link class="flexBox-item" :to="{name: 'rank'}">
						<div class="over">{{myUserInfo.userScore || 0}}</div>
						<div>积分</div>
					</router-link>
					<router-link class="flexBox-item" :to="{name: 'discount'}">
						<div class="over">{{myUserInfo.couponCount || 0}}</div>
						<div>优惠券</div>
					</router-link>
				</div>
			</div>

			<div class="cenBox">
				<div class="helpBox">
					<span>我的订单</span>
					<router-link class="all-order" :to="{name: 'order-list'}">查看全部订单></router-link>
				</div>
				<div class="flexBox" style="padding-top: 15px;">
					<router-link class="flexBox-item" :to="{name: 'order-list',query: {type: 1}}">
						<div class="flexImg1">
							<van-icon size="35" :name="icon1" :info="check ? myOrderNum.unpaid : ''" />
						</div>
						<div class="flexTxt1">待付款</div>
					</router-link>
					<router-link class="flexBox-item" :to="{name: 'order-list',query: {type: 2}}">
						<div class="flexImg1">
							<van-icon size="35" :name="icon2" :info="check ? myOrderNum.undelivered : ''" />
						</div>
						<div class="flexTxt1">待发货</div>
					</router-link>
					<router-link class="flexBox-item" :to="{name: 'order-list',query: {type: 3}}">
						<div class="flexImg1">
							<van-icon size="35" :name="icon3" :info="check ? myOrderNum.unSigned : ''" />
						</div>
						<div class="flexTxt1">待收货</div>
					</router-link>
					<router-link class="flexBox-item" :to="{name: 'order-list',query: {type: 4}}">
						<div class="flexImg1">
							<van-icon size="35" :name="icon4" :info="check ? myOrderNum.unReviewed : ''" />
						</div>
						<div class="flexTxt1">待评价</div>
					</router-link>
				</div>
			</div>

			<div class="cenBox cenBotBox">
				<div class="flexBox">
					<div @click="loveCar">
						<div class="flexImg2">
							<img src="../../assets/img/记录拷贝.png" alt />
						</div>
						<div class="flexTxt2">爱车档案</div>
					</div>
					<router-link class="flexBox-item" :to="{name: 'maintain-record'}">
						<div class="flexImg2">
						<img src="../../assets/img/记录.png" alt />
						</div>
						<div class="flexTxt2">保养记录</div>
					</router-link>
					<router-link class="flexBox-item" :to="{name: 'goods-collect'}">
						<div class="flexImg2">
							<img src="../../assets/img/收藏(1)拷贝.png" alt />
						</div>
						<div class="flexTxt2">收藏商品</div>
					</router-link>
				</div>
				<div class="flexBox">
					<router-link class="flexBox-item" :to="{name: 'address-address'}">
						<div class="flexImg2">
							<img src="../../assets/img/地址拷贝.png" alt />
						</div>
						<div class="flexTxt2">收货地址</div>
					</router-link>
					<!--<div>-->
					<!--<div class="flexImg2"><img src="../../assets/img/心拷贝.png" alt=""/></div>-->
					<!--<div class="flexTxt2">我的心得</div>-->
					<!--</div>-->
					<!--<div>-->
					<!--<div class="flexImg2"><img src="../../assets/img/评论拷贝.png" alt=""/></div>-->
					<!--<div class="flexTxt2">收到评论</div>-->
					<!--</div>-->
					<router-link class="flexBox-item" :to="{name: 'feedback'}">
						<div class="flexImg2">
							<img src="../../assets/img/_意见反馈拷贝.png" alt />
						</div>
						<div class="flexTxt2">意见反馈</div>
					</router-link>
					<div @click="share">
						<div class="flexImg2">
							<img src="../../assets/img/分享(1)拷贝.png" alt />
						</div>
						<div class="flexTxt2">分享好友</div>
					</div>
				</div>
			</div>
		</div>
		<footerTabbar></footerTabbar>
	</div>
</template>

<script>
	import footerTabbar from "Components/footer/footer";
	import axios from 'axios';
	import { mapGetters } from 'vuex';
	export default {
		components: {
			footerTabbar
		},
		data() {
			return {
				myUserInfo: {},
				myOrderNum: {},
				icon1: require("../../assets/img/钱包拷贝2.png"),
				icon2: require("../../assets/img/圆角矩形11拷贝.png"),
				icon3: require("../../assets/img/货车拷贝.png"),
				icon4: require("../../assets/img/评价@2x拷贝.png"),
				carCon: {}
			};
		},
		created() {
			this.myCen();
		},
		computed: {
			...mapGetters({
				check: 'auth/check'
			})
		},
		mounted(){

		},
		methods: {
			copy(message) {
				let input = document.createElement("input");
				input.value = message;
				input.readOnly = true;
				document.body.appendChild(input);
				input.select();
				input.setSelectionRange(0, input.value.length), document.execCommand('Copy');
				document.body.removeChild(input);
			},
			share(){
				this.$dialog.alert({
					title: '分享',
					message: '点击复制链接分享给好友',
					confirmButtonText: '复制链接'
				}).then(() => {
					this.copy(location.href);
					this.$toast('复制成功，去分享给好友吧')
				});
			},
			myCen() {
				var data = {};
				this.isLoading = true;
				this.$http.post("customer/UserInfo/MyManager", data).then(response => {
					this.myUserInfo = response.data.Body.myUserInfo || {};
					this.myOrderNum = response.data.Body.myOrderNum;
					this.isLoading = false;
				});
			},
			loveCar() {
				this.carCon=JSON.parse(localStorage.getItem('YC51_Web_Auto'))
				//我的车
				// this.$router.push({
				// 	name: "manCar"
				// });
				this.$router.push({"name":'myLoveCar'})
			},
			goLogin() {
				this.$router.push({
					name: "login"
				});
			},
			goModifyName() {
				this.$router.push({
					name: "set-name",
					params: {
						name: this.myUserInfo.nickName
					}
				});
			}
			// manCar(){
			//      this.$router.push({ "name":'manCar'})
			//    }
		}
	};
</script>

<style scoped>
	.topBox {
		height: 160px;
		padding: 0 20px;
		background-image: linear-gradient(to right, #ff0712, #fd6200);
	}

	.topImgBox {
		text-align: right;
		padding-top: 10px;
	}

	.topImgBox img {
		width: 20px;
		margin-left: 20px;
	}

	.moneyBxo img {
		width: 20px;
	}

	.logoBox {
		width: 70px;
		height: 70px;
		background: #fff;
		padding: 3px;
		border-radius: 50%;
		box-shadow: -2px 3px 10px #555;
		margin: 10px;
	}

	.logoBox img {
		width: 70px;
		height: 70px;
		border-radius: 50%;
	}

	.topCenBox {
		overflow: hidden;
		margin-top: 15px;
	}

	.topLogoBox {
		float: left;
		margin-right: 10px;
	}

	.topMoneyBox {
		float: left;
		color: #fff;
		font-size: 18px;
		width: 67%;
	}

	.moneyBxo {
		font-size: 13px;
		overflow: hidden;
		width: 100%;
	}

	.moneyBxo div {
		float: left;
		max-width: 48%;
	}

	.moneyBxo div:first-child {
		margin-right: 5%;
	}

	.moneyBxo div img {
		width: 15px;
		margin-right: 5px;
		float: left;
	}

	.moneyBxo div span {
		float: left;
		max-width: 81%;
	}

	.name {
		margin: 20px 0 5px 0;
	}

	.over {
		overflow: hidden;
		text-overflow: ellipsis;
		display: inline-block;
		white-space: nowrap;
		max-width: 100%;
	}

	.cenBox {
		margin: 15px 20px;
		background: #fff;
		border-radius: 10px;
		padding: 15px 20px;
	}

	.numBox>div,
	.flexBox-item {
		line-height: 25px;
	}

	.numBox {
		color: #4b4b4b;
		font-weight: 400;
	}

	.numBox .over {
		color: #000;
	}

	.helpBox {
		overflow: hidden;
	}

	.helpBox span:first-child {
		float: left;
		font-weight: bold;
		font-size: 17px;
		color: #4b4b4b;
	}

	.helpBox .all-order {
		float: right;
		color: #bbb;
		font-size: 15px;
	}

	.flexBox {
		display: flex;
		width: 100%;
		overflow: hidden;
	}

	.flexBox>div,
	.flexBox-item {
		width: 50%;
		text-align: center;
	}

	.flexImg1 {
		margin: 5px 0;
	}

	.flexTxt1 {
		font-size: 15px;
		color: #4b4b4b;
		font-weight: 400;
	}

	.flexImg2 {
		height: 20px;
		margin-bottom: 5px;
	}

	.flexTxt2 {
		font-weight: 400;
		line-height: 25px;
		color: #4b4b4b;
		font-size: 12px;
		margin-bottom: 25px;
	}

	.flexImg1 img {
		width: 35px;
		vertical-align: bottom;
	}

	.flexImg2 img {
		height: 20px;
	}

	.cenBotBox {
		padding: 20px 30px 0 30px;
	}
</style>
