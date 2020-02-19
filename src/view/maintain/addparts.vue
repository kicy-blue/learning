<template>
	<div class="maintain-page">
		<van-nav-bar
		 title=""
		 right-text="确定"
		 @click-right="confirm" />
		<div class="partsbox" v-for="(item,index) in partlist" :key="index">
			<span class="close" @click="removepart(index)">
				<van-icon name="close" /></span>
			<van-field v-model="item.itemName" label="配件名称" placeholder="请输入配件名称" />
			<van-field v-model="item.itemNumber" type="number" label="配件用量" placeholder="请输入配件用量" />
		</div>
		<div class="btnBox">
			<van-button class="btnBox-item" type="danger" size="large" text="继续添加配件" @click="addparts"></van-button>
		</div>
	</div>
</template>

<script>
	import {
		Toast,
		NavBar
	} from 'vant';
	export default {
		middleware: "auth",
		data() {
			return {
				projectId:'',
				partName: '',
				partCount: '',
				partlist: [{
					itemName: '',
					itemNumber: ''
				}]
			}
		},
		created() {
			const {
				projectId
			} = this.$route.params;
			this.projectId = projectId;
			const paramsInfo = JSON.parse(localStorage.getItem("maintainParams"));
			if (paramsInfo.projects && paramsInfo.projects.length>0) {
				paramsInfo.projects.map((v) => {
					if (v.projectId === this.projectId && v.items && v.items.length>0) {
						 this.partlist = v.items;
					}
				})
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
			confirm() {
				
				const paramsInfo = JSON.parse(localStorage.getItem("maintainParams"));
				if (paramsInfo.projects) {
					paramsInfo.projects.map((v) => {
						if (v.projectId === this.projectId) {
							v.items = this.partlist.filter(v=>v.itemName||v.itemNumber);
						}
					})
				}
				const params = {
					...paramsInfo
				}
				localStorage.setItem("maintainParams", JSON.stringify(params))
				this.$router.push({
					name: "maintain-record-info"
				});
			},
			addparts() {
				const partitem = {
					itemName: '',
					itemNumber: ''
				}
				this.partlist = [...this.partlist, partitem]
			},
			removepart(index) {
				const {
					partlist
				} = this;
				if (partlist.length === 1) {
					Toast('至少保留一条数据');
					return;
				}
				this.partlist = partlist.filter((v, i) => i !== index)
			},
			getProject() {
				let params = {};

				this.$http.post('/auto/auto/MaintainProject', params)
					.then((response) => {
						const {
							Body
						} = response.data;

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

		.van-nav-bar__text {
			color: #333;
		}
	}
</style>
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
	}

	.partsbox {
		padding: 5px;
		position: relative;

		.close {
			position: absolute;
			top: 0;
			right: 0;
			z-index: 99;
			font-size: 28px;
			color: red;
		}
	}
</style>
