<template>
	<div class="servershopdetailCom-page project">
		<div class="project-left project-item">
			<van-sidebar v-model="activeKey" @change="changeTabLeft">
				<template v-for="(item,index) in data">
					<van-sidebar-item :title="item.maintainTypeName" :key="index+item.maintainTypeName" />
				</template>
			</van-sidebar>
		</div>

		<div class="project-right project-item">
			<template v-for="(item,index) in data">
				<div class="select-main" v-show="(activeKey+1)===item.maintainType">
					<van-pull-refresh v-model="loading">
						<van-list
						 v-model="loading"
						 :finished="finished"
						 finished-text="没有更多了"
						 class="list-box">
							<van-cell
							 v-if="item.projects"
							 v-for="(pitem,pindex) of item.projects"
							 :key="pindex"
							 class="project-cell">
								<van-row class="project-item-top" :gutter="10">
									<van-col span="5" style="color: #7D7D7D;">
										<van-image fit="contain" :src="pitem.projectImage" />
									</van-col>
									<van-col span="16">
										{{pitem.projectName}}
										<br />
										<span class="u-color-gray" style="font-size: 12px;">{{pitem.projectRate}}</span>
									</van-col>
									<van-col span="3">
										<van-checkbox-group v-model="checkType[pitem.maintainType]" @change="changeCheck">
											<van-checkbox :name="pitem.projectId" checked-color="#07c160"></van-checkbox>
										</van-checkbox-group>
									</van-col>
								</van-row>
								<van-row class="project-item-bottom" :gutter="10">
									<van-col :span="22">{{item.projectDesc||"暂无"}}</van-col>
									<van-col :span="2">
										<van-icon name="ellipsis" />
									</van-col>
								</van-row>
							</van-cell>
						</van-list>
					</van-pull-refresh>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
	import {
		Sidebar,
		SidebarItem,
		List
	} from 'vant';
	import {} from './util.js';
	export default {
		middleware: "auth",
		props: {
			serviceShopId: String,
		},
		data() {
			return {
				loading: false,
				host: '//spp.yangche51.com/',
				activeKey: 0,
				data: [],
				finished: true,
				checkType:{
					1:[],
					2:[],
					3:[],
				}
			};
		},
		mounted() {
			this.getProject();
		},
		methods: {
			changeCheck(val){
				this.$emit('getProjectIds',val)
			},
			changeTabLeft(index) {

			},
			getProject() {
				this.loading = true;
				let autoModel = {
					"AutoModelSubId": 106471,
					"Year": 2010,
					"AutoParams": [{
						"ParamTypeId": 7,
						"ParamValueId": 178601
					}]
				};
				let params = {
					ServiceShopId: this.serviceShopId || '1953',//id:1953 测试用
					autoModel: JSON.stringify(autoModel),
					noHeader:true
				}
				this.$http
					.post(`${this.host}ServiceProject/GetServiceShopProject_2_0.ashx`, params)
					.then(response => {
						this.loading = false;
						const {
							body,
							result,
						} = response.data;
						if (result.errCode === 0) {
							this.data = body.MaintenanceTypes || {};
						}

					});
			},
		}
	}
</script>
<style lang="less">
	.servershopdetailCom-page {
		.van-sidebar-item--select {
			border: none;
		}
	}
</style>
<style lang="less" scoped>
	.project-cell {
		margin-bottom: 10px;
		padding: 0;
		border-radius: 5px;
		overflow: hidden;
	}

	.project {
		padding-top: 10px;
		display: flex;

		&-left {}

		&-right {
			flex-grow: 1;
			padding: 0 8px;

		}

		&-item {
			&-bottom {
				padding: 3px 8px;
				background: #e0e0d6;
				color: #fff;
				line-height: 0.8rem;
			}

			&-top {
				padding: 8px;
			}
		}
	}
</style>
