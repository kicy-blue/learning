<template>
	<div class="servershopdetail-page">
		<div class="my-swipe">
			<van-swipe @change="changeSwipe" name="indicator">
				<van-swipe-item v-for="(image, index) in data.ShopImagePathList" :key="index+'-'+image">
					<img v-lazy="image" />
				</van-swipe-item>
				<div class="my-swipe-slot" slot="indicator">
					<div class="my-swipe-footer">
						<div class="connectinfo">
							<span>{{data.ServiceTime}}</span>
							<span>
								<a :href="'tel:' + data.Telephone">
									<van-icon name="phone-o" /></a></span>
						</div>
					</div>
					<!-- <div class="custom-indicator">
						{{ current + 1 }}/4
					</div> -->
					<div class="handle-topright">
						<!-- <van-icon name="like-o" @click="collection" data-title="收藏"/> -->
						<van-icon name="shopping-cart-o" data-title="购物车" @click="gocart"/>
						<van-icon name="share" data-title="分享"/>
					</div>
				</div>

			</van-swipe>
		</div>
		<div class="maincontent">
			<div class="maincontent-item basicinfo">
				<div class="basicinfo-name">{{data.DisplayName}}</div>
				<div class="basicinfo-evaluate">
					<div class="basicinfo-evaluate-ileft">
						<span class="tech-level">{{data.TechLevel}}</span>
						<span>评分<b class="textcolor-red">{{data.ShopScore}}</b></span>
						<span>好评率<b class="textcolor-red">{{data.GoodCommnentPercent}}</b></span>
					</div>
					<div class="basicinfo-evaluate-iright">
						<a class="textcolor-green"
						:href="'http://api.map.baidu.com/marker?location='+data.Lat+','+data.Lng+'&title='+data.DisplayName+'&content='+data.Address+'&output=html&src=webapp.baidu.openAPIdemo'">
							<van-icon name="location-o" />
							导航
						</a>
					</div>
				</div>
				<div class="textcolor-gray">{{data.Address}} <b class="textcolor-red">{{Distance}}</b></div>
			</div>
			<div class="maincontent-item2">
				<van-tabs @click="changeTab">
					<van-tab title="保养">
						<project :serviceShopId="serviceShopId" @getProjectIds="getProjectIds" />
					</van-tab>
					<van-tab title="评价" class="">
						<commont :serviceShopId="serviceShopId" />
					</van-tab>
					<van-tab title="详情">
						<cus-details :serviceShopId="serviceShopId" />
					</van-tab>
				</van-tabs>
			</div>
		</div>
		<div class="operate-btn">
			<van-button @click="chooseShop" size="large" block style="background: red;">选择此店</van-button>
		</div>
	</div>
</template>

<script>
	import Cookies from 'js-cookie'
	import commont from './commnent.vue';
	import project from './project.vue';
	import cusDetails from './details.vue';
	import {
		Button,
		Swipe,
		SwipeItem,
		Lazyload,
		Icon,
		Tab,
		Tabs,
		Sidebar,
		SidebarItem,
		Rate,
		Toast
	} from 'vant';
	import {
		MP,
		getLocation,
	} from './util.js';
	MP(); //引入baiduMap
	export default {
		middleware: "auth",
		components: {
			commont,
			project,
			cusDetails
		},
		data() {
			return {
				starVal: 4.5,
				current: 0,
				serviceShopId: '',
				data: {},
				recordList: [],
				loading: false,
				finished: false,
				host: '//spp.yangche51.com/',
				token: '',
				shoplongitude: '',
				shoplatitude: '',
				userAddress: '',
				userLongitude: '',
				userLatitude: '',
				Distance: '',
				Address: '',
			};
		},
		created() {
			const {
				id
			} = this.$route.params;
			this.serviceShopId = id;
			this.getDetails();
			this.getcookie();
		},
		methods: {
			getcookie() {
				var strcookie = document.cookie; //获取cookie字符串
				var arrcookie = strcookie.split("; ");
				for (var i = 0; i < arrcookie.length; i++) {
					var arr = arrcookie[i].split("=");
					if (arr[0] == "app_ticket") {
						this.token = arr[1];
					}
				}
			},
			gocart(){
				this.$router.push({ name: "cart" });
			},
			//收藏
			collection() {
				let id = this.serviceShopId ? Number(this.serviceShopId) : ''
				let params = {
					itemIds: JSON.stringify([id]),
					noHeader: true
				}
				this.$http
					.post(`//app.yangche51.com/6_1/usercenter/favourite/appendfavitem_1_0.ashx?luser=${this.token}`, params)
					.then(response => {
						const {
							body,
							result
						} = response.data;
						Toast(result.msg);
					});
			},
			getProjectIds(ids) {
				this.projectIds = ids;
			},
			changeTab(name, title) {

			},
			changeSwipe(index) {
				this.current = index;
			},
			chooseShop() {
				const params = {
					projectIds: this.projectIds,
					telephone: this.data.Telephone,
					serviceShopName: this.data.DisplayName,
					serviceShopAddress: this.data.Address,
					serviceShopId: this.data.ServiceShopId,
					deliveryToShop: this.data.deliveryToShop
				}
				sessionStorage.setItem("getServiceShopInfo", JSON.stringify(params));
				this.$router.push({
					name: 'order-confirm-keep',
					params: JSON.stringify(params)
				})
			},
			getDetails(id) {
				const params = {
					serviceShopId: this.serviceShopId || '1953', //id:1953 测试用
					noHeader: true
				}
				// http://spp.yangche51.com/ServiceShop/GetShopFurtherInfo_2_0.ashx
				this.loading = true;
				this.$http
					.post(`${this.host}ServiceShop/GetServiceShopInfo_2_0.ashx`, params)
					.then(response => {
						this.loading = false;
						const {
							body
						} = response.data
						this.data = body;
						this.Address = body.Address;
						if (body && body.Lng && body.Lat) {
							const {
								Lng,
								Lat,
								Address
							} = body;
							getLocation({
								payload: {
									Lng,
									Lat,
									Address
								},
								callback: (val) => {
									this.Distance = val;
								}
							})
						}

					});
			},

		}
	}
</script>
<style>
	.servershopdetail-page {
		margin-bottom: 50px;

		.van-swipe {
			background: #fff;
			height: 300px;
		}
	}
</style>
<style lang="less" scoped>
	.my-swipe {
		img {
			max-height: 300px;
		}

		.van-swipe-item {
			color: #fff;
			font-size: 20px;
			text-align: center;
			background-color: #fff;
			position: relative;
		}
	}

	.my-swipe-slot {
		.handle-topright {
			position: absolute;
			top: 20px;
			right: 20px;

			i {
				background: rgba(1, 1, 1, 0.5);
				display: inline-block;
				width: 30px;
				height: 30px;
				line-height: 30px;
				border-radius: 30px;
				text-align: center;
				color: #fff;
				font-size: 16px;
				margin-left: 20px;
			}
		}

		.my-swipe-footer {
			position: absolute;
			bottom: 5px;
			right: 8px;
			width: 100%;
			display: flex;
			justify-content: space-between;

			.custom-indicator {
				background: #ccc9c9;
				padding: 3px 10px;
				border-radius: 10px;
				color: #fff;
				height: 20px;
				line-height: 20px;
			}

			.connectinfo {
				background: rgba(1, 1, 1, 0.5);
				visibility: 0.8;
				color: #fff;
				height: 20px;
				line-height: 20px;
				padding: 5px 20px;
				border-top-right-radius: 25px;

				span:last-child {
					display: inline-block;

					text-align: center;

					background: #fff;
					color: #ccc;
					margin-left: 10px;
					width: 20px;
					height: 20px;
					border-radius: 20px;
				}
			}
		}
	}


	.maincontent {
		&-item {
			padding: 10px;
			background: #fff;
			margin-bottom: 10px;
		}
	}

	.basicinfo {
		&-name {
			color: #333;
			font-size: 14px;
			font-weight: bold;
			margin-bottom: 5px;
		}

		&-evaluate {
			display: flex;
			justify-content: space-between;
			margin-bottom: 5px;

			&-ileft {
				span {
					margin-right: 8px;
					display: inline-block;
				}

			}

			&-iright {
				background: #fff;
				border: #78D05B 1px solid;
				color: #78D05B;
				border-radius: 20px;
				height: 20px;
				line-height: 20px;
				padding-right: 4px;
				font-weight: bolder;

				.van-icon {
					color: #fff;
					background: #00A200;
					width: 20px;
					line-height: 20px;
					height: 100%;
					text-align: center;
					display: inline-block;
					border-radius: 20px;
				}
			}
		}
	}

	.textcolor {
		&-red {
			color: #FF1D1A;
		}

		&-gray {
			color: #777;
		}

		&-green {
			color: #78D05B;
		}
	}

	.tech-level {
		color: #fff;
		background: #FF1D1A;
		padding: 3px 10px;
		border-radius: 10px;
	}

	.operate-btn {
		position: fixed;
		bottom: 0;
		width: 100%;
		color: #fff;

		span {
			color: #fff;
			font-size: 16px;
		}
	}
</style>
