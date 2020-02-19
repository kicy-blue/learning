<template>
  <div class="address">
    <van-sticky class="mb10">
      <van-nav-bar
        sticky
        title="收获地址"
        right-text="添加地址"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
      />
    </van-sticky>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      class="list-box"
    >
      <van-cell class="order-item" v-for="(item,index) of addressList" :key="index">
        <van-row gutter="10" type="flex" align="center">
          <van-col span="4">
            <van-image fit="contain" :src="icoAddress" />
          </van-col>
          <van-col span="20" @click="select(item)">
            <van-row class="mb10">
              <van-col span="8">{{item.consignee}}</van-col>
              <van-col span="11" style="color: #7D7D7D;">{{item.mobliePhone}}</van-col>
              <van-col span="5" style="text-align: right;color: #8C8B8B;" @click="edit(item)">编辑</van-col>
            </van-row>
            <div
              class="van-multi-ellipsis--l2"
            >{{item.provinceName}}{{item.cityName}}{{item.areaName}}{{item.address}}</div>
          </van-col>
        </van-row>
      </van-cell>
    </van-list>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: 0,
      onLoading: false,
      loading: false,
      finished: true,
      icoAddress: require("../../assets/img/ico-address.png"),
      addressList: []
    };
  },
  mounted() {
    this.getAddressList();
  },
  methods: {
    select(item){
      sessionStorage.setItem('addressDetail',JSON.stringify(item))
      if(this.$route.params.back){  
        history.go(-1)
      }
    },
    edit(item) {
      this.$router.push({
        name: "address-add",
        params: {
          item: item
        }
      });
    },
    getAddressList() {
      this.$http
        .get(
          "//app.yangche51.com/6_1/usercenter/address/getaddresslist_1_0.ashx?luser=25619357_25BCFCEB637CEC440E22AA7CCFE5FB11"
        )
        .then(res => {
          this.addressList = res.data.body;
        });
    },
    onClickLeft() {
      history.go(-1);
    },
    onLoad() {},
    onClickRight() {
      this.$router.push({
        name: "address-add"
      });
    }
  }
};
</script>
<style lang="less" scoped>
.address {
  .van-nav-bar__text {
    color: #323233;
  }
}
.list-box {
  min-height: 100%;
  .order-item {
    background: #fff;
  }
  .van-card {
    background: #fff;
  }
  .van-button {
    height: 100%;
  }
}
</style>