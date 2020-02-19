<template>
	<div class="page-search">
		<form action="/">
			<van-search
			ref="searchInput"
			 v-model="value"
			 placeholder="搜索你想要的商品"
			 show-action
			 shape="round"			 
			 @search="onSearch"
			 @cancel="onCancel"
			 @keyup.enter="onSearch" />
		</form>
		<div class="histroy">
			<span class="itemTitle">最近搜索</span>
			<span class="itemBtn" @click="clearHistory" v-show="isHaveHisCookie">清除</span>
		</div>
		<div class="searchContent" v-show="isHaveHisCookie">
			<span class="search_name" v-for="(his,index) in historySearch" :key="index" @click="tapToList(this,his)">{{his}}</span>
		</div>
		<div class="noSearchHistory" v-show="!isHaveHisCookie">
			暂无搜索历史
		</div>
		<div class="host">
			<span class="itemTitle">热门搜索</span>
			<span class="itemBtn" @click="refreshHot">
				<img src="../../assets/img/mall/refresh_07.png" class="refresh_icon" />
				换一批
			</span>
		</div>
		<div class="searchContent">
			<span class="search_name" v-for="(hot,index) in hotSearch" :key="index" @click="(e)=>tapToList(e,hot,index)">{{hot}}</span>

		</div>
	</div>


</template>

<script>
	import Cookies from 'js-cookie'
	import {
		Search,
		Toast
	} from 'vant';
	export default {
		name: "searchList",
		layout: 'default',
		data() {
			return {
				value: '',
				isHaveHisCookie: false,
				isLoading: false,
				hotSearchPage: 1,
				historySearch: [],
				hotSearch: []
			}
		},
		mounted() {
			this.getHistorySearch();
			this.getHotSearch();
			// console.log(this.$refs.searchInput)
			$(this.$refs.searchInput).find('input').focus();
		},
		methods: {
			getHistorySearch() {
				let historyCookie = Cookies.get("historySearchCookie") || [];
				console.log(historyCookie)
				if (historyCookie && historyCookie.length > 0) {
					this.isHaveHisCookie = true;
					this.historySearch = historyCookie.split(','); 
				} else {
					this.isHaveHisCookie = false;
				}
			},
			getHotSearch() {
				let params = {
					pageIndex: this.hotSearchPage,
					pageSize: 10
				};
				this.isLoading = true;
				this.$http.post('svcmall/Mall/GetHotSearchList', params).then((response) => {
					this.isLoading = false;
					const {
						Body,
						Header
					} = response.data;
					if (Header.IsSuccess == 1) {
						this.hotSearch = Body;
					} else {
						Toast(Header.Message);
					}
				});
			},
			onSearch(val) {
				this.searchVal = val;
				this.gotoList();
			},
			tapToList(e, text) {
				this.searchVal = text;
				if (!this.searchVal) {
					return;
				}
				this.historySearch.unshift(this.searchVal);     
				let new_arr = [];
				this.historySearch.map((v) => {
					if (!new_arr.includes(v)) {
						new_arr.push(v);
					}
				})
				if (new_arr.length > 10) {
					new_arr.splice(0, 10);
				}
				this.historySearch = new_arr;
				let cookieSearch = this.historySearch.join(",");
				Cookies.set('historySearchCookie', cookieSearch, {path: '/'});// $.cookie("historySearchCookie",cookieSearch,{path:'/'});
				Cookies.set('searchKey', this.searchVal,  {path: '/'});// $.cookie("searchKey",this.searchVal,{path:'/'});
				Cookies.set('searchType', 1,  {path: '/'});// $.cookie("searchType",1,{path:'/'});
				let carInfo = Cookies.get('YC51_Web_Auto');// let carInfo=$.cookie("YC51_Web_Auto");
				this.$router.push({
					name: 'goods-list',
					params:{searchtype:1},
					query: {
						keyword: this.searchVal
					}
				})
				
			},
			onCancel() {
				window.history.go(-1);
			},
			clearHistory() {
				Cookies.remove('historySearchCookie'); //$.cookie('historySearchCookie', ""); 
				this.historySearch = Cookies.get('historySearchCookie') || [] //$.cookie("historySearchCookie");
				this.isHaveHisCookie = false;
			},
			refreshHot() {
				this.hotSearchPage++;
				if (this.hotSearchPage > 3) {
					this.hotSearchPage = 1;
				}
				this.getHotSearch();
			},
			clearSearch() {
				if (this.searchVal) {
					this.searchVal = "";
				}
			},
			gotoList() {
				if (!this.searchVal) {
					return;
				}
				this.searchVal = this.searchVal.replace(/^\</, "$lt;").replace(/\>$/, "&gt;");
				this.historySearch.unshift(this.searchVal);
				let new_arr = [];
				this.historySearch.map((v) => {
					if (!new_arr.includes(v)) {
						new_arr.push(v);
					}
				})
				this.historySearch = new_arr;
				let cookieSearch = this.historySearch.join(",");
				Cookies.set('historySearchCookie',cookieSearch,  {path: '/'});//$.cookie("historySearchCookie", cookieSearch, {path: '/'});
				Cookies.set('searchKey',this.searchVal,  {path: '/'});//$.cookie("searchKey", this.searchVal, {path: '/'});
				Cookies.set('searchType',this.searchVal,  {path: '/'}); //$.cookie("searchType", 1, {path: '/'});
				let carInfo = Cookies.get('YC51_Web_Auto');// let carInfo=$.cookie("YC51_Web_Auto");
				
				// let gotoUrl = hostUrl + "/Mall/#!/productlist?searchtype=1";
				// if (!carInfo) {
				// 	window.location.href = hostUrl + "/comonets/#!/changecar?backurl=" + encodeURIComponent(gotoUrl);
				// } else {
				// 	window.location.href = gotoUrl;
				// }
				this.$router.push({
					name: 'goods-list',
					params:{searchtype:1},
					query: {
						keyword: this.searchVal
					}
				})

			},
		}
	}
</script>
<style>
	.page-search .van-search__action {
	    color: #888;
	}
	.page-search .van-search__content {
	    /* border: 1px solid #FF0015; */
	    /* background-color: #fff; */
	}
</style>

<style scoped lang="less">
	.itemTitle {
		color: #666;
		font-weight: bolder;
		float: left;
		width: 7rem;
		margin-left: .3rem;
	}

	.noSearchHistory {
		height: 2rem;
		line-height: 2rem;
		text-align: center;
		color: #d2d2d2;
	}

	.histroy,
	.host {
		margin-top: 10px;
		margin-bottom: .3rem;
		height: .6rem;
	}
	.histroy{
		margin-top: 15px;
	}

	.itemBtn {
		float: right;
		width: 2.4rem;
		margin-right: .3rem;
		text-align: right;
		color: #0693dd;
	}

	.searchContent {
		padding: 0 .3rem;
	}

	.search_name {
		padding: .1rem .35rem;
		border-radius: .35rem;
		display: inline-block;
		border: 1px solid #d8d8d8;
		color: #a9a9a9;
		margin-right: .2rem;
		margin-bottom: .3rem;
	}

	.nav,
	.nav_name,
	.search_name {
		background: #fff;
	}
</style>
