<template>
	<div class="servershopdetailCom-page evaluateCon">
		<div class="evaluateCon-item evalCus">
			<div class="evalCus-record">
				<div><b class="textcolor-red" style="font-size: 30px;">{{data.ShopScore}}</b></div>
				<div>好评率<b class="textcolor-red">{{data.GoodCommnentPercent}}</b></div>
			</div>
			<div class="evalCus-star">
				<div class="evalCus-star-item" v-for="(item,index) in commentArr" :key="item.code+index">
					<span class="textcolor-gray" style="margin-right: 5px;">{{item.value}}</span>
					<van-rate
					 v-model="data[item.code]"
					 :size="15"
					 allow-half
					 color="#ee0a24"
					 void-icon="star"
					 void-color="#eee" />
					<span class="textcolor-red" style="margin-left: 5px;">{{data[item.code] || 0}}</span>
				</div>
			</div>
		</div>
		<div class="evaluateCon-item evalBtns">
			<van-button @click="changeComment(item.code)"
			 :class="commentType!==item.code?'activeEval':''"
			 size="small" round type="danger" v-for="(item,index) in buttonList" :key="item.code+index">
				{{item.value}}</van-button>
		</div>
		<div class="evaluateCon-item evalRecord">
			<van-list
			 v-model="loading"
			 :finished="finished"
			 finished-text="没有更多了"
			 @load="onLoad">
				<van-cell v-for="item in CommentList" :key="item">
					<van-row class="order-item-top" :gutter="10">
						<van-col span="5" style="color: #7D7D7D;">
							<!-- https://img.yzcdn.cn/vant/cat.jpeg -->
							<van-image round width="45" height="45" :src="item.UserHeadImage || ''" />
						</van-col>
						<van-col span="12">
							{{item.UserName}}
							<br />
							<van-rate
							 v-model="item.CommetScore"
							 :size="12"
							 allow-half
							 color="#ee0a24"
							 void-icon="star"
							 void-color="#eee" />
							<span class="textcolor-red" style="margin-left: 5px;">{{item.CommetScore}}</span>
						</van-col>
						<van-col span="7">
							<span>{{item.CommentTime}}</span>
						</van-col>
					</van-row>
					<van-row>
						<p>{{item.CommentContent}}</p>
					</van-row>
					<van-grid :border="false" :column-num="2">
						<van-grid-item v-for="(image, index) in item.Images" :key="index+'_'+image">
							<van-image :src="image" @click="previewImgs(index,item.Images)" />
						</van-grid-item>
					</van-grid>
					
					<div class="replybox" v-if="item.ReplyList && item.ReplyList.length>0">
						<div  v-for="(ritem, rindex) in item.ReplyList" :key="rindex+'_'+ritem.UserName">
							<van-row :gutter="10">
								<van-col span="12" style="color: #7D7D7D;">
									<span><van-icon name="chat-o" size="18" style="margin-right: 5px;"/>{{ritem.UserName}}</span>
								</van-col>
							</van-row>
							<van-row>
								<p>{{ritem.ReplyContent}}</p>
							</van-row>
						</div>
					</div>
				</van-cell>
			</van-list>
		</div>

	</div>
</template>

<script>
	import {
		ImagePreview,
		List,
		Button,
		Rate,
		Icon,
		Divider 
	} from 'vant';
	import {
		commentArr,
		buttonList
	} from './util.js';
	export default {
		middleware: "auth",
		props: {
			serviceShopId: String,
		},
		data() {
			return {
				loading: false,
				finished: false,
				host: '//spp.yangche51.com/',
				CommentList: [],
				buttonList: [],
				commentArr: [],
				PageIndex:1,
				data: {},
				commentType: '00',
				PageInfo:{},
			};
		},
		//计算属性
		computed: {
			getShopScore() {
				return this.data.ShopScore ? Math.round(this.data.ShopScore) : 0;
			}
		},
		created() {
			const {
				id
			} = this.$route.params;

		},
		mounted() {
			this.commentArr = commentArr;
			this.buttonList = buttonList;
			this.getCommentList();
		},
		methods: {
			previewImgs(index, imgs) {
				ImagePreview({
					images: imgs,
					startPosition: index,
				});
			},
			changeComment(type) {
				this.commentType = type;
				this.CommentList = [];
				this.PageIndex = 1;
				this.finished = false;
				this.getCommentList();
			},
			getCommentList() {
				this.loading = true;
				let params = {
					ServiceShopId: this.serviceShopId || '1953',
					CommentType: this.commentType =='00' ? '0' : this.commentType,
					PageIndex: this.PageIndex,
					PageSize: 10,
					noHeader:true
				}
				this.$http
					.post(`${this.host}Comment/GetServiceShopCommentList_2_1.ashx`, params)
					.then(response => {
						this.loading = false;
						const {
							body,
							result,
						} = response.data;
						if (result.errCode === 0 && body.CommentList && body.CommentList.length>0) {
							// console.log('body.CommentList---1111',body.CommentList)
							this.PageInfo = body.PageInfo;
							this.CommentList = [...this.CommentList,...body.CommentList]
							this.data = body || {};
							this.commentArr.map((v)=>{
								v.score = body[v.code] ? Math.round(body[v.code]) : 0;
							});
							if (this.CommentList.length >= this.PageInfo.TotalCount) { //测试
								this.finished = true;
							}
						}else{
							console.log('body.CommentList--222',body.CommentList)
							this.finished = true;
						}
						
					});
			},
			onLoad() {
				console.log('this.CommentList.length <= this.PageInfo.TotalCount',this.CommentList.length <= this.PageInfo.TotalCount)
				if (this.CommentList.length <= this.PageInfo.TotalCount) {
					this.finished = false;
					this.PageIndex = this.PageIndex + 1;
					this.getCommentList();
				}
				
			}
		}
	}
</script>

<style lang="less" scoped>
	.activeEval {
		opacity: 0.6;
	}
	.textcolor {
		&-red {
			color: #FF1D1A;
		}

		&-gray {
			color: #777;
		}
	}

	.evaluateCon {
		&-item {
			margin-top: 10px;
			background: #fff;
			padding: 10px;
		}

		.evalCus {
			display: flex;
			width: 100%;

			&-record {
				width: 40%;
				text-align: center;
			}

			&-star {
				width: 60%;

				&-item {
					display: flex;
					margin-bottom: 6px;
				}
			}
		}

		.evalBtns {
			display: flex;
			justify-content: space-around;
		}
	}
	.replybox{
		    background: #f6f9f9;
		    padding: 8px;
		}
	
</style>
