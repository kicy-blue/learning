<template>
	<div class="maintain-page">
		<van-loading v-if="loading" type="spinner" class="loading" size="30" />
		<div class="content">
			<div class="no-data" v-if="recordData.length==0">
				<p>
					<van-icon name="notes-o" />
				</p>
				<p>暂无保养记录</p>
				<p><span class="no-data-tips">记录各项保养时间，系统准时给您保养提醒，记录爱车保养费用，养车成本一目了然</span></p>
			</div>
			<div v-else class="inforecord" v-for="(item,index) in recordData" :key="item.logId">
				<div class="inforecord-logo">自助保养</div>
				<van-row class="inforecord-main">
					<van-col span="12" class="inforecord-main-item">
						<p>上路时间</p>
						<p>{{item.serviceTime}}</p>
					</van-col>
					<van-col span="12" class="inforecord-main-item">
						<p>保养时里程数</p>
						<p>{{item.mileage ||0}}km</p>
					</van-col>
				</van-row>
				<template v-for="(p,pindex) in item.projects">
					<div class="project" :key="item.projectId">
						<h5 class="project-title">{{p.projectName}}</h5>
						<div style="margin-top: 12px;">
							<template v-if="p.items && p.items.length>0" v-for="(i,iindex) in p.items">
								<div class="project-items" :key="i.itemName+i.itemId">
									<span><i class="icon-sycle"></i>{{i.itemName}}</span>
									<label><span style="margin-right: 3px;">x</span>{{i.itemNumber}}</label>
								</div>
								<van-divider v-if="iindex!=(p.items.length-1)" :style="{ margin:0,background: '#EEEEEE', borderColor: '#aeaeaf', padding: '0 16px' }" />
							</template>
						</div>
					</div>
					<van-divider :style="{ margin:0,marginBottom:10,background: '#EEEEEE', borderColor: '#aeaeaf', padding: '0 0px' }" />
				</template>
				<div class="inforecord-footer cusbutton">
					<span @click="remove(item.logId)" class="cusbutton-small cusbutton-color-gray">删除</span>
					<span @click="edit(item)" class="cusbutton-small cusbutton-color-red">编辑</span>
				</div>
			</div>
		</div>
		<div class="btnBox">
			<van-button class="btnBox-item" type="danger" size="large" text="" @click="add">
				<i class="btnBox-icon">+</i>立即添加
			</van-button>
		</div>
	</div>
</template>

<script>
	import {
		Panel,
		Divider,
		Dialog,
		Toast,
		Loading
	} from 'vant';
	import {
		getAuto
	} from './util.js';
	export default {
		middleware: "auth",
		data() {
			return {
				pageIndex: 1,
				recordData: [],
				carCon: {},
				loading: false
			}
		},
		created() {
			this.carCon = getAuto();
			this.getRecord();
		},
		methods: {
			remove(id) {
				Dialog.confirm({
					title: '确认删除这条记录吗？',
					message: ''
				}).then(() => {
					this.loading = true;
					this.$http.post('/auto/auto/DeleteAutoMaintain', {
							logId: id
						})
						.then((response) => {
							this.loading = false;
							const {
								Body,
								Header
							} = response.data;
							if (Header && Header.IsSuccess) {
								Toast(`删除成功！`);
								this.getRecord();
							} else {
								Toast('新增失败');
							}
						})
				}).catch(() => {
					// on cancel
				});

			},
			edit(item) {
				if (localStorage.getItem("maintainParams")) localStorage.removeItem("maintainParams");
				localStorage.setItem("maintainParams", JSON.stringify(item));
				this.$router.push({
					name: "maintain-record-add",
					params: {
						type: 'edit'
					}
				});
			},
			add() {
				if (localStorage.getItem("maintainParams")) localStorage.removeItem("maintainParams");
				this.$router.push({
					name: "maintain-record-add"
				});
			},
			getRecord() {
				let params = {
					pageIndex: this.pageIndex,
					pageSize: 10,
					autoModelSubId: this.carCon.s,
					year: this.carCon.y,
					userId: 25619357
				}
				this.loading = true;
				this.$http.post('/auto/auto/MaintainHistory', params)
					.then((response) => {
						this.loading = false;
						const {
							Body
						} = response.data;
						if (Body.autoModelInfo) this.basicInfo = Body.autoModelInfo;
						if (Body && Body.maintainLogs && Body.maintainLogs.data.length > 0) {
							const {
								total,
								data
							} = Body.maintainLogs;
							this.recordData = data;
						} else {
							this.recordData = [];
						}
					})
			}
		}
	}
</script>

<style scoped lang="less">
	@import "./index.less";

	.van-button--large {
		border-radius: 50px;
	}

	.btnBox {
		&-item {
			width: 50%;
			margin-left: 25%;
		}

		&-icon {
			font: italic bold 12px/20px arial, sans-serif;
			width: 20px;
			height: 20px;
			display: inline-block;
			border-radius: 20px;
			border: 1px solid;
			color: red;
			font-size: 18px;
			background: #fff;
			line-height: 20px;
			margin-right: 3px;
			position: relative;
			top: 1px;
		}
	}

	.no-data {
		width: 100%;
		margin-top: 200px;
		color: #908e8e;

		p {
			text-align: center;

			i {
				font-size: 40px;
				border: 1px solid;
				width: 60px;
				height: 60px;
				border-radius: 60px;
				line-height: 60px;
			}

			.no-data-tips {
				color: red;
				display: inline-block;
				width: 80%;
			}
		}
	}
</style>
