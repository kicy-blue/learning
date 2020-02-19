<template>
	<div class="maintain-page">
		<div>
			<van-field v-model="serviceShopName" label="服务门店" placeholder="请输入服务门店名称" />
			<van-field v-model="serviceCost" type="text" label="保养工时费" placeholder="请输入保养工时费" />
			<van-field v-model="amountCost" label="配件费" placeholder="请输入保养配件费" />
		</div>
		<div>
			<p class="field-lable">保养配件</p>
			<van-list class="list-box">
				<van-cell
				 v-if="projects"
				 v-for="(pitem,pindex) of projects"
				 :key="pindex"
				 class="project-cell">
					<van-row class="project-item-top" :gutter="10">
						<van-col span="18">
							<van-image fit="contain" width="50" height="50" :src="pitem.projectImage" />
							<span class="project-cell-name">{{pitem.projectName}}</span>
						</van-col>
						<van-col span="6">
							<span class="project-cell-btn" @click="addparts(pitem.projectId)">添加配件</span>
							<!-- <van-button round size="small" color="#fb1010" plain>添加配件</van-button> -->
						</van-col>
					</van-row>
					<van-row class="project-item-bottom" :gutter="10">
						配件 X {{pitem.items ? pitem.items.length : 0}}
					</van-row>
				</van-cell>
			</van-list>
		</div>
		<div>
			<p class="field-lable">备注</p>
			<van-cell-group>
				<van-field v-model="remarks"
				 rows="4"
				 autosize
				 type="textarea"
				 placeholder="如：本次机油还剩下1L，瞎猜可以少买" />
			</van-cell-group>
		</div>
		<div class="btnBox">
			<van-button class="btnBox-item" type="danger" size="large" text="确定" @click="confirm"></van-button>
		</div>
	</div>
</template>

<script>
	import {
		Field,
		Toast,
	} from 'vant';
	import {
		getAuto
	} from './util.js';
	import moment from 'moment';
	export default {
		middleware: "auth",
		data() {
			return {
				reamrks: '',
				carCon: {},
				projects: [],
				serviceShopName: '',
				serviceCost: '',
				amountCost: '',
				remarks: ''
			}
		},
		created() {
			this.carCon = getAuto();
			const paramsInfo = localStorage.getItem("maintainParams") ? JSON.parse(localStorage.getItem("maintainParams")) : {};
			if (paramsInfo) {
				const {serviceShopName,serviceCost,amountCost,projects,reamrks} = paramsInfo;
				this.serviceShopName = serviceShopName;
				this.serviceCost =serviceCost;
				this.amountCost = amountCost;
				this.projects = projects || [];
				this.reamrks = reamrks;
			}
		},
		methods: {
			chooseProject(item) {
				const {
					actives
				} = this;
				if (actives.indexOf(item) > -1) {
					this.actives = actives.filter((v) => v !== item)
				} else {
					this.actives.push(item);
				}
			},
			addparts(projectId) {
				let paramsInfo = JSON.parse(localStorage.getItem("maintainParams"));
				let newparamsInfo = {
					...paramsInfo,
					"serviceShopName": this.serviceShopName,
					"amountCost": this.amountCost,
					"serviceCost": this.serviceCost,
				}
				localStorage.setItem("maintainParams", JSON.stringify(newparamsInfo));
				this.$router.push({
					name: "maintain-record-addparts",
					params: {
						projectId
					}
				});
			},

			confirm(value) {
				this.dispatchAdd();
			},
			dispatchAdd() {
				let paramsInfo = JSON.parse(localStorage.getItem("maintainParams"));
				//提交时删除项目的images  
				if (paramsInfo.projects && paramsInfo.projects.length > 0) {
					paramsInfo.projects = paramsInfo.projects.map((rest) => {
						const {
							projectImage,
							...res
						} = rest;
						return res
					})
				}
				let params = {
					"logId": 0, //0是新增
					"mileage": 10000,
					"serviceShopId": 0,
					"serviceShopName": this.serviceShopName,
					"serviceType": 0,
					"serviceTime": "2019-11-10",
					"amountCost": this.amountCost,
					"serviceCost": this.serviceCost,
					"productCost": "300",
					"remarks": this.remarks,
					"projects": [{
						"items": [{
							"itemId": 0,
							"itemName": "轮胎",
							"itemPrice": "0",
							"itemNumber": 4,
							"orderId": null
						}],
						"projectId": 7,
						"projectName": "机油/润滑油",
						"categoryId": 81
					}],
					...paramsInfo
				}

				let newparams = {
					autoModelSubId: this.carCon.s,
					year: this.carCon.y,
					"userId": 25619357,
					"maintainLog": params
				}
				//编辑参数
				// {
				// 	"logId": 81722,
				// 	"mileage": 99999,
				// 	"serviceShopId": 0,
				// 	"serviceShopName": "宁波",
				// 	"serviceType": 0,
				// 	"serviceTime": "2019-11-10",
				// 	"amountCost": "500",
				// 	"serviceCost": "0",
				// 	"productCost": "300",
				// 	"remarks": null,
				// 	"projects": [{
				// 		"items": [{
				// 			"itemId": 0,
				// 			"itemName": "轮胎",
				// 			"itemPrice": "0",
				// 			"itemNumber": 4,
				// 			"orderId": null
				// 		}],
				// 		"projectId": 7,
				// 		"projectName": "机油/润滑油",
				// 		"categoryId": 81
				// 	}]
				// }
				
				let url = '/auto/auto/AddAutoMaintain';
				let typeText="新增";
				if(params.logId){
					url = '/auto/auto/EditAutoMaintain';
					typeText="编辑"
					newparams = params;
				}
				
				
				
				// console.log('newparams',newparams)
				this.$http.post(url, newparams)
					.then((response) => {
						const {
							Body,
							Header
						} = response.data;
						if (Header && Header.IsSuccess) {
							Toast(`${typeText}成功！`);
							setTimeout(() => {
								this.$router.push({
									name: 'maintain-record'
								})
							}, 1000)
						} else {
							Toast('新增失败');
						}
					})
			}
		}
	}
</script>
<style lang="less">
	.maintain-page {
		.van-field__label {
			width: auto;
			min-width: 100px;
			margin-right: 20px;
		}

		.van-col {
			display: flex;
		}

	}
</style>
<style scoped lang="less">
	@import "./index.less";

	.field-lable {
		padding-left: 20px;
	}

	.list-box {
		line-height: 50px;
	}

	.project-cell {
		&-name {
			display: inline-block;
			line-height: 50px;
			margin-left: 12px;
		}

		&-btn {
			padding: 5px 8px;
			border: 1px dashed red;
			color: red;
			border-radius: 20px;
			margin-top: 8px;
		}
	}

	.project-item-bottom {
		text-align: right;
		margin-right: 5px !important;
	}
</style>
