<template>
  <div class="server-page">
    <van-sticky>
      <van-nav-bar sticky title="选择服务店" left-arrow @click-left="onClickLeft" />
      <van-dropdown-menu active-color="#ee0a24" style="margin-bottom: 10px;">
        <van-dropdown-item @change="getList('reset')" v-model="params.orderBy" :options="option" />
        <van-dropdown-item title="筛选" ref="item">
          <van-cell title="所在地区" is-link :value="city" @click="showCity" />
        </van-dropdown-item>
      </van-dropdown-menu>
    </van-sticky>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="getList()"
        class="list-box"
      >
        <van-cell class="order-item mb10" v-for="(item,index) of itemList" :key="index" @click="showShopDetails(item.serviceShopId)">
          
          <van-row gutter="10" class="mb10">
            <van-col span="6">
              <van-image fit="contain" :src="item.shopImage" />
            </van-col>
            <van-col span="18">
              <div class="van-multi-ellipsis--l2 mb10">{{item.name}}</div>
              <van-row class="mb10">
                <van-col span="6" style="text-align: left;">
                  <span style="padding:0 5px ;background: #ee0a24;color: #fff;border-radius: 5px;">{{item.techLevel}}</span>
                </van-col>
                <van-col span="7" style="color: #7D7D7D;">
                  评分
                  <span class="c-danger">{{item.shopScore}}</span>
                </van-col>
                <van-col span="9" style="color: #7D7D7D;">
                  好评率
                  <span class="c-danger">{{item.goodCommnentPer}}</span>
                </van-col>
              </van-row>
              <div class="van-multi-ellipsis--l2 mb10 u-color-gray">{{item.address}}</div>
              <!-- <van-row>
                <van-col :span="8" style="color: #7D7D7D;">共{{item.items.length}}件</van-col>
                <van-col :span="16" class="align-r">{{item.displayOrderAmount}}</van-col>
              </van-row>-->
            </van-col>
          </van-row>
          <div class="item-footer align-r">
            <van-button plain round size="small" type="danger" @click="select(item)">选择</van-button>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
    <div class="cur-place">
      <van-row
        style="line-height: 1.2;padding: 10px;color: #ee0a24;font-size: 12px;"
      >
        <van-col :span="16">如果该地区无养车无忧服务店或太远,可选择[配送至个人], 在到自己信任的服务店。</van-col>
        <van-col :span="8">
          <van-button type="danger" round @click="select('none')" size="small">暂不选择</van-button>
        </van-col>
      </van-row>
      <div>当前位置：{{curPlace}}</div>
    </div>
    <van-action-sheet v-model="show">
      <van-area
        :area-list="areaList"
        :columns-placeholder="['请选择', '请选择', '全部地区']"
        @confirm="confirmArea"
        @cancel="cancelArea"
      />
    </van-action-sheet>
  </div>
</template>
<script>
import areaList from "Assets/js/area.js";
export default {
  middleware: "auth",
  data() {
    return {
      areaList,
      loading: false,
      isLoading: false,
      finished: false,
      option: [
        { text: "距离最近", value: 1 },
        { text: "人气最高", value: 2 },
        { text: "技术最佳", value: 3 },
        { text: "配送到店", value: 5 }
      ],
      itemList: [],
      city: "",
      params: {
        orderBy: 1
      },
      show: false,
      curPlace: ""
    };
  },
  created() {
    this.params = JSON.parse(sessionStorage.getItem("serverData"));
    this.getList();
  },
  methods: {
	  showShopDetails(id){
	  		 this.$router.push({
	  		 	name: 'order-servershop-details',
	  		 	params: {
	  		 		id
	  		 	}
	  		 })
	  },
    select(item) {
      if(item == 'none'){
        sessionStorage.setItem("getServiceShopInfo", 'none');
      }else{
        let data = {};
        data.telephone = item.telephone;
        data.serviceShopName = item.name;
        data.serviceShopAddress = item.address;
        data.serviceShopId = item.serviceShopId;
        data.deliveryToShop = item.deliveryToShop;
        sessionStorage.setItem("getServiceShopInfo", JSON.stringify(data));
      }
      history.go(-1);
    },
    confirmArea(item) {
      this.params.provinceId = item[0].code;
      this.params.cityId = item[1].code;
      this.params.districtId = item[2].code || 0;
      this.show = false;
      this.city = `${item[0].name} / ${item[1].name} / ${item[2].name}`;
      this.getList("reset");
    },
    cancelArea() {
      this.show = false;
    },
    onClickLeft() {
      history.go(-1);
    },
    onRefresh() {
      this.getList("reset");
    },
    getList(isReset) {
      if (isReset) {
        this.itemList = [];
        this.params.pageIndex = 1;
      } else {
        this.params.pageIndex++;
      }
      this.isLoading = true;
      this.loading = true;
      this.$http
        .post("Order/ServiceShop/GetServiceShopListForMultiAuto", this.params)
        .then(response => {
          this.isLoading = false;
          this.loading = false;
          this.curPlace = response.data.Body.currentLocationText;
          this.itemList = [
            ...this.itemList,
            ...response.data.Body.serviceShopList
          ];
          if (response.data.Body.serviceShopList.length < 10) {
            this.finished = true;
          }
        });
    },
    showCity() {
      this.show = true;
    }
  }
};
</script>
<style lang="less" scoped>
.server-page {
  .list-box {
    padding: 10px;
    // background: #F0F0F0;
    .order-item {
      border-radius: 10px;
      background: #fff;
      margin-bottom: 5px;
      overflow: hidden;
    }
    .van-card {
      background: #fff;
    }
    .item-footer {
      .van-button {
        margin-left: 10px;
      }
    }
  }
  /deep/ .van-pull-refresh__track {
    padding-bottom: 100px;
  }
  .cur-place {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;
    line-height: 40px;
    padding: 0 20px;
    box-shadow: 0 -2px 20px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>