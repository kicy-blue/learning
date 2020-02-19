<template>
	<div class="servershopdetailCom-page detailCon">
		<ul class="labelDesc">
			<li v-for="(item,index) in details.LabelList" :key="item.LabelDesc+'-'+item.type">
			{{item.LabelDesc}}
			</li>
		</ul>
		<div class="main">
			<div class="main-item">
				<h5 class="main-item-title">门店概况</h5>
				<p class="main-item-con">{{details.ServiceDetailDesc}}</p>
			</div>
			<div class="main-item">
				<h5 class="main-item-title">技术力量</h5>
				<ul class="main-item-con main-item-skill">
					<li v-for="(item,index) in details.ServiceShopQualificationList" :key="item.QualificationId">
					<van-icon name="arrow" /> 
					{{item.QualificationName}}
					</li>
				</ul>
			</div>
			<div class="main-item">
				<h5 class="main-item-title">硬件设施</h5>
				<ul class="main-item-con main-item-equip">
					<li v-for="(item,index) in details.ServiceShopEquipList" :key="item.EquipTemplateId">
					{{item.EquipTemplateName}}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import {Icon 
	} from 'vant';
	import {
	} from './util.js';
	export default {
		middleware: "auth",
		props: {
			serviceShopId: String,
		},
		data() {
			return {
				loading: false,
				host: '//spp.yangche51.com/',
				details:{}
			};
		},
		created() {
			const {
				id
			} = this.$route.params;

		},
		mounted() {
			this.getDetails();
		},
		methods: {
			getDetails() {
				console.log('============详情')
				this.loading = true;
				let params = {
					ServiceShopId: this.serviceShopId || '1953',//1953测试
					noHeader:true
				}
				this.$http
					.post(`${this.host}ServiceShop/GetShopFurtherInfo_2_0.ashx`, params)
					.then(response => {
						this.loading = false;
						const {
							body,
							result,
						} = response.data;
						if(body && result && result.errCode==0){
							const {} = body;
							this.details = body;
							console.log('body==',body)
						}
						
					});
			},
		}
	}
</script>

<style lang="less" scoped>
	h5,p{
		margin: 0;
		padding: 0;
	}
	.labelDesc{
		padding: 10px 10px 0;
		background-color: #fff;
		li{
			display: inline-block;
			padding: 6px 18px;
			border: 1px solid #ee0a24;
			border-radius: 6px;
			margin-right: 14px;
			color:#ee0a24 ;
			margin-bottom: 10px;
		}
	}
	.main{
		margin-top: 15px;
		background-color: #fff;
		padding: 10px;
		&-item{
			margin-bottom: 15px;
			p{
				line-height: 22px;
			}
			&-title{
				color: #5E5E5E;
				font-size: 15px;
				margin-bottom: 10px;
				font-weight: bolder;
			}
			&-con{
				color: #9E9E9E;
			}
			&-skill{
				li{
					line-height: 25px;
					i{
						    width: 12px;
						    height: 12px;
						    border: 1px solid red;
						    border-radius: 21px;
						    color: red;
						    text-align: center;
						    font-size: 12px;
					}
				}
			}
			&-equip{
				display: flex;
				flex-wrap: wrap;
				border: 1px solid #D8D8D8;
				border-bottom: none;
				border-right: none;
				li{
					width: 50%;
					padding: 12px 0;
					border-bottom: 1px solid #D8D8D8;
					border-right: 1px solid #D8D8D8;
					box-sizing: border-box;
					text-align: center;
				}
				li:nth-of-type(odd){
					
				}
			}
		}
	}
</style>
