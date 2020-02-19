<template>
	<div class="intelligence-page">
		<div class="header"></div>
		<div class="body">
			<div class="info">
				<div class="info-top">
					<van-image width="40" height="40" round :src="carCon.autoPic||setPic" />
					<!-- <img :src="carCon.autoPic||setPic" alt /> -->
					<h5>{{carCon.AutoBrandName}} - {{ carCon.MAutoModelName}}</h5>
					<span @click="changeCar">
						<van-icon name="replay" /> 更换车型</span>
				</div>
				<p>{{carCon.AutoModelName}}</p>
				<van-row class="info-main">
					<van-col span="12" class="info-main-item">
						<p>
							<van-icon name="edit" />行驶里程</p>
						<div class="suffixBox">
							<van-field v-model="nowMileage" placeholder="输入行驶里程" />
							<span v-show="nowMileage" class="suffixBox-icon">km</span>
						</div>
					</van-col>
					<van-col span="12" class="info-main-item">
						<p>
							<van-icon name="calender-o" />上路时间</p>
						<van-field v-model="onRoadTime" placeholder="选择上路时间" @click="focusTime" @blur="blurTime" readonly />
						<van-popup
						 v-model="show"
						 position="bottom"
						 round
						 :style="{ height: '50%' }">
							<van-datetime-picker
							 type="year-month"
							 :min-date="minDate"
							 :max-date="maxDate"
							 @confirm="confirm" 
							 @cancel="cancel"/>
						</van-popup>
					</van-col>
				</van-row>
			</div>
			<div class="content">
				<p class="content-tips">定时更新“行驶里程”，精准检测保养项目</p>
				<div id="main" style="width: 80%;height:280px;margin: 0 auto;"></div>
				<van-row class="content-main">
					<van-col span="8" class="content-main-item">
						<p class="text-title">更换项</p>
						<p>
							<b v-if="!checked[1]" :class="resNum[1]>0 ? 'text-red' : ''">{{resNum[1]}}项</b>
							<van-loading v-else type="spinner" size="24px" />
						</p>
					</van-col>
					<van-col span="8" class="content-main-item">
						<p class="text-title">检测项</p>
						<p>
							<b v-if="!checked[2]" :class="resNum[2]>0 ? 'text-red' : ''">{{resNum[2]}}项</b>
							<van-loading v-else type="spinner" size="24px" />
						</p>
					</van-col>
					<van-col span="8" class="content-main-item">
						<p class="text-title">养护项</p>
						<p>
							<b v-if="!checked[3]" :class="resNum[3]>0 ? 'text-red' : ''">{{resNum[3]}}项</b>
							<van-loading v-else type="spinner" size="24px" />
						</p>
					</van-col>
				</van-row>
			</div>
			<div class="btnBox">
				<van-button class="btnBox-item" type="danger" size="large" :text="allchecked ? '停止检测':'开始检测'" @click="checkFn"></van-button>
			</div>
		</div>
	</div>
</template>

<script>
	import moment from 'moment';
	import echarts from 'echarts';
	let counter = 0;
	import {
		getAuto
	} from './util.js';
	import {
		Col,
		Row,
		Dialog,
		Toast
	} from 'vant';
	export default {
		middleware: "auth",
		data() {
			return {
				con: {}, //数据
				minDate: new Date(),
				maxDate: new Date(),
				// currentDate: new Date(),
				setPic: require("../../assets/img/defaultCar.png"),
				onRoadTime: moment(new Date()).format('YYYY-MM'),
				nowMileage: '',
				show: false,
				token: '',
				carCon: {},
				checked: {
					1: false,
					2: false,
					3: false
				},
				resNum: {
					1: '0',
					2: '0',
					3: '0'
				},
				count: 0,
				timer: null,
				coock:'',
			}
		},
		computed: {
			allchecked() {
				return this.checked[1] || this.checked[2] || this.checked[3]
			}
		},
		created() {
			this.getcookie();
			this.carCon = getAuto();
			// console.log('this.carCon',this.carCon)
			this.nowMileage = this.carCon.mi;
			this.content();
		},
		mounted() {
			this.renderChart();
		},

		methods: {
			changeCar() {
				this.$router.push({
					"name": 'manCar'
				})
			},
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
			focusTime() {
				this.show = true;
			},
			blurTime() {
				this.show = false;
			},
			confirm(value) {
				this.onRoadTime = moment(value).format('YYYY-MM');
				this.show = false;
			},
			cancel(){
			    this.show = false
			},
			content() {
			  var strcookie = document.cookie; //获取cookie字符串
			  var arrcookie = strcookie.split("; "); //分割
			  // 遍历匹配
			  for (var i = 0; i < arrcookie.length; i++) {
			    var arr = arrcookie[i].split("=");
			    if (arr[0] == "app_ticket") {
			      this.coock = arr[1];
			    }
			  }
			
			  var con = "";
			  var formData = new FormData();
			  formData.append("year", this.carCon.y);
			  formData.append("autoModelSubId", this.carCon.s);
			  var url =
			    "//app.yangche51.com/6_1/car/mycar/getdetailbyautomodelsubid_1_0.ashx?luser=" +
			    this.coock;
			  $.ajaxSettings.async = false;
			  $.ajax({
			    type: "POST",
			    url: url,
			    data: formData,
			    // 告诉jQuery不要去处理发送的数据
			    processData: false,
			    // 告诉jQuery不要去设置Content-Type请求头
			    contentType: false,
			    success: (e) => {
			      console.log(e.body);
			      if(e.header.statusCode == 500){
			        this.$toast(e.result.msg)
			        return ;
			      }
			      con = e.body;
			      this.con = con;
			      this.minDate = new Date(`${this.con.startYearMonth.toString().slice(0,4)}-${this.con.startYearMonth.toString().slice(-2)}`)
			      this.maxDate = new Date(`${this.con.endYearMonth.toString().slice(0,4)}-${this.con.endYearMonth.toString().slice(-2)}`)
			    }
			  });
			  $.ajaxSettings.async = true;
			  
			  
			  var list = "";
			  $.ajaxSettings.async = false;
			  $.get(
			    "//app.yangche51.com/6_1/car/mycar/getlistbyuserid_1_0.ashx?luser=" +
			      this.coock,
			    function(result) {
			      list = result.body;
			    }
			  );
			  $.ajaxSettings.async = true;
			  list.forEach((v,k)=>{
			    if(v.autoModelSubId == this.carCon.s){
			      this.list = list[k];
			    }
			  })
			  this.getcarmileage();
			},
			//获取里程
			getcarmileage() {
			  let data = {
			    autoModel: ''
			  }
			  data.autoModel = JSON.stringify(this.con)
			  // data.autoModel = '{"myAutoName":"丰田 锐志 2013款 2.5V 手自一体 尊锐导航版 2.5L 2017年产","id":7510826,"isSelected":true,"autoBrandId":0,"autoModelId":0,"autoModelSubId":118308,"mainAutoModelID":0,"year":2017,"AutoBrandName":"丰田","AutoModelName":"锐志 2013款 2.5V 手自一体 尊锐导航版","AutoModelSubName":"2.5L","MAutoModelName":null,"startYearMonth":0,"endYearMonth":0,"autoPic":"","firstTime":"","month":0,"carName":null,"vinCode":null,"tipMessage":null}'
			  var url = "//app.yangche51.com/6_1/car/getcarmileage_1_0.ashx?luser=" + this.coock;
			  $.post(
			    url,
			    data,
			    (res, status) => {
			      this.nowMileage = res.body;
			      // console.log(res);
			    }
			  );
			},
			cutNumber(str) {
				if (!str) return;
				const pattern = /\d+/g;
				return str.match(pattern)[0] || 0;
			},

			checkFn() {
				if (!this.nowMileage || !this.onRoadTime) {
					Dialog({
						title: '提示',
						message: '请输入检测信息'
					});
					return;
				}
				this.resNum = {
					1: '0',
					2: '0',
					3: '0'
				};
				const autoModel = {
					autoModelSubId: this.carCon.s,
					carParams: [{
						"paramTypeId": 7,
						"paramTypeName": "原厂机油粘度",
						"paramValue": "展示所有粘度机油自助选购",
						"paramValueId": 178601
					}, {
						"paramTypeId": 9,
						"paramTypeName": "防冻液颜色",
						"paramValue": "",
						"paramValueId": 0
					}],
					"firstTime": "2020-01",
					"month": "0",
					"year": "2010"
				};
				const autoParams = [{
					"paramTypeId": 7,
					"paramTypeName": "原厂机油粘度",
					"paramValue": "展示所有粘度机油自助选购",
					"paramValueId": 178601
				}, {
					"paramTypeId": 9,
					"paramTypeName": "防冻液颜色",
					"paramValue": "",
					"paramValueId": 0
				}];
				const params = {
					autoModel: JSON.stringify(autoModel),

					// autoModelSubId:106471,
					autoParams: JSON.stringify(autoParams),
					autoModelSubId: this.carCon.s,
					nowMileage: this.nowMileage,
					onRoadTime: this.onRoadTime,
					userId: 25619357,
					year: this.carCon.y,
					noHeader: true
				}
				this.$http
					.post(`//app.yangche51.com/6_1/maintenance/getMaintainProject_3_0.ashx?luser=${this.token}`, params)
					.then(response => {
						const {
							body,
							result
						} = response.data;
						// console.log('response', response)
						const projects = [];
						const items = {}
						if (body && body.maintain && body.maintain.length > 0) {
							body.maintain.map((v, index) => {
								projects.push({
									[v.maintainType]: v.projects
								})
								let itemVal = 0;
								//检测出需要更换的项目  maintain[0].projects[0].isChecked==1
								let checkNum = 0;
								if(v.projects && v.projects.length>0){
									v.projects.map((p,index)=>{
										if(p.isChecked) checkNum++;
									})
								}
								Object.keys(this.resNum).forEach((key, index) => {
									if (v.maintainType == key) {
										items[key] = checkNum;
										// items[key] = this.cutNumber(v.textMessage);
									}
								})
							})
							this.checked[1] = true;
							this.renderChart(0, 1, items);
							if (this.timer) setTimeout(() => {
								this.resNum[1] = items[1];
								this.checked[1] = false;
								this.checked[2] = true;
								this.renderChart(0, 2, items);
							}, 3200)
							if (this.timer) setTimeout(() => {
								this.resNum[2] = items[2];
								this.checked[2] = false;
								this.checked[3] = true;
								this.renderChart(0, 3, items);
							}, 7400)
							setTimeout(() => {
								this.resNum[3] = items[3];
								this.checked[3] = false;
							}, 9390)
							setTimeout(() => {
								this.$router.push({name: 'keep-buy',query:{type:"home",data: '7_48|8_19,103,104|9_12|10_25,26'}});
							}, 10390)
						} else {
							Toast('该车型暂无检测信息')
						}



					});
			},
			renderChart(sVal = 0, key, items) {
				counter = 0;
				console.log('counter', counter)
				let myChart = echarts.init(document.getElementById('main'));
				// 指定图表的配置项和数据
				let option = {
					tooltip: {
						formatter: '{a} <br/>{b} : {c}%'
					},
					series: [{
						name: '检测',
						type: 'gauge',
						detail: {
							formatter: '{value}%'
						},
						data: [{
							value: 0,
							// name: '完成率'
						}]
					}]
				};
				myChart.setOption(option);
				// 使用刚指定的配置项和数据显示图表。
				if (key) {
					this.timer = setInterval(() => {
						if (counter <= 10) {
							option.series[0].data[0].value = counter * 10;
							myChart.setOption(option, false);
							counter = counter + 1;
						} else {
							option.series[0].data[0].value = 0;
							myChart.setOption(option, false);
						}
					}, 300);
				}

				if (this.timer) setTimeout(() => {
					clearInterval(this.timer);
				}, 3000 * key + 250 * (key - 1) + 300)
			}
		}
	}
</script>
<style lang="less">
	.intelligence-page {

		.van-field__control {
			text-align: center;
		}
	}
</style>
<style scoped lang="less">
	@import "./intelligence.less";
</style>
