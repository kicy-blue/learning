<template>
	<div class="maintain-page">
		<div>
			<van-field v-model="serviceTime" label="保养时间" @click="focusTime" @blur="blurTime" readonly placeholder="请选择保养的时间" />
			<van-field v-model="mileage" type="number" label="保养里程" placeholder="请输入保养时的里程" />
			<van-field value="" label="请选择保养项目" readonly />
			<div class="projectbox">
				<van-grid :column-num="3" :gutter="10">
					<van-grid-item
					 v-for="(item,index) in projects"
					 :key="item.projectId+'_'+index"
					 :text="item.projectName"
					 @click="chooseProject(item)"
					 :class="actives.indexOf(item.projectId)>-1?'active' : ''" />
				</van-grid>
			</div>
			<van-popup
			 v-model="show"
			 position="bottom"
			 round
			 :style="{ height: '50%' }">
				<van-datetime-picker
				 type="date"
				 @confirm="confirm" />
			</van-popup>
		</div>
		<div class="btnBox">
			<van-button class="btnBox-item" type="danger" size="large" text="下一步" @click="next"></van-button>
		</div>
	</div>
</template>

<script>
	import {
		DatetimePicker,
		Popup,
		Field,
		Grid,
		GridItem
	} from 'vant';
	import {
		getAuto
	} from './util.js';
	import moment from 'moment';
	export default {
		middleware: "auth",
		data() {
			return {
				serviceTime: '',
				mileage: '',
				show: false,
				actives: [],
				projects: [],
				carCon: {},
				projectItems: []
			}
		},
		created() {
			this.carCon = getAuto();
			this.getProject();
			const paramsInfo = localStorage.getItem("maintainParams") ? JSON.parse(localStorage.getItem("maintainParams")) : {};
			if (paramsInfo) {
				const {
					serviceTime,
					mileage,
					projects
				} = paramsInfo;
				this.serviceTime = serviceTime;
				this.mileage = mileage;
				this.projectItems = projects || [];
				this.actives = projects ? projects.map(v => v.projectId) : []
			}
		},
		methods: {
			chooseProject(item) {
				const {
					projectId,
					categoryId,
					projectName,
					projectImage
				} = item;
				const {
					actives,
					projectItems
				} = this;
				if (actives.indexOf(projectId) > -1) {
					this.actives = actives.filter((v) => v !== projectId);
					this.projectItems = projectItems.filter((v) => v.projectId !== projectId);
				} else {
					this.actives.push(projectId);
					this.projectItems.push({
						projectId,
						categoryId: categoryId || 81,
						projectName,
						projectImage
					});
				}
			},
			focusTime() {
				this.show = true;
			},
			blurTime() {
				this.show = false;
			},
			confirm(value) {
				this.serviceTime = moment(value).format('YYYY-MM-DD');
				this.show = false;
			},
			next() {
				const paramsInfo = localStorage.getItem("maintainParams") ? JSON.parse(localStorage.getItem("maintainParams")) : {};
				const params = {
					...paramsInfo,
					serviceTime: this.serviceTime,
					mileage: this.mileage,
					projects: this.projectItems
				}
				localStorage.setItem("maintainParams", JSON.stringify(params))
				this.$router.push({
					name: "maintain-record-info"
				});
			},
			getProject() {
				let paramsedit = {
					contextData: localStorage.getItem("contextData"),
					autoModelSubId: this.carCon.s,
					tempMaintainInfo: "",
					resultType: 0,
					onRoadTime: "",
					projectInfo: [{
						"projectId": "7",
						"parts": ["48"]
					}, {
						"projectId": "9",
						"parts": ["12"]
					}],
					year: this.carCon.y,
					nowMileage: this.carCon.mi,
					autoParams: []
				};
				let paramsadd = {
					contextData: localStorage.getItem("contextData"),
					autoModelSubId: this.carCon.s,
					tempMaintainInfo: "",
					resultType: 0,
					onRoadTime: "",
					projectInfo: [{
						"projectId": "7",
						"parts": ["48"]
					}, {
						"projectId": "9",
						"parts": ["12"]
					}],
					year: this.carCon.y,
					nowMileage: this.carCon.mi,
					autoParams: []
				};

				this.$http.post('/auto/auto/MaintainProject', paramsadd)
					.then((response) => {
						const {
							Body
						} = response.data;
						if (Body.maintain && Body.maintain.length > 0) {
							const {
								maintain
							} = Body;
							let arr = [];
							maintain.map((v) => {
								v.projects && v.projects.length > 0 && arr.push(...v.projects)
							})
							this.projects = arr;
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
			margin-right: 20px;
		}

		.active {
			.van-grid-item__content {
				background: #fb1010;

				.van-grid-item__text {
					color: #fff;
				}
			}
		}

	}
</style>
<style scoped lang="less">
	@import "./index.less";
</style>
