<template>
  <div class="address-add">
    <van-sticky class="mb10">
      <van-nav-bar sticky title="添加地址" left-arrow @click-left="onClickLeft" />
    </van-sticky>
    <van-cell-group class="mb10">
      <van-field v-model="params.consignee" type="text" label="收货人" placeholder="请输入收货人" />
      <van-field v-model="params.mobliePhone" type="text" label="手机号" placeholder="请输入手机号" />
      <van-cell title="所在地区" is-link :value="params.city" @click="showCity" />
      <van-field v-model="params.address" placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元室等" />
    </van-cell-group>
    <van-cell-group>
      <van-cell title="设为默认地址">
        <van-switch size="24px" v-model="params.checked" active-color="#07c160" />
      </van-cell>
      <van-cell title="删除收货地址" style="color: #FF0015" @click="deleteArea"></van-cell>
      
      <van-cell>
        <van-button block round type="danger" @click="save">保存</van-button>
      </van-cell>
    </van-cell-group>
    <van-action-sheet v-model="show">
      <van-area :area-list="areaList" @confirm="confirmArea" @cancel="cancelArea" />
    </van-action-sheet>
  </div>
</template>
<script>
import areaList from "Assets/js/area.js";
export default {
  data() {
    return {
      params: {
        checked: false,
        deliveryId: 0,
        consignee: '',
        provinceId: '',
        cityId: '',
        areaId: '',
        address: '',
        city: "地区",
        postCode: '',
        mobliePhone: '',
        telPhone: '',
      },
      areaList,
      show: false,
      item: {}
    };
  },
  mounted(){
    this.item = this.$route.params.item;
    this.params = {...this.item}
    this.params.city = this.item.provinceName+this.item.cityName+this.item.areaName
    // this.params.deliveryId = item.deliveryId;
  },
  methods: {
    deleteArea(){
      this.$dialog.confirm({
        title: '提示',
        message: '确定删除吗'
      }).then(() => {
        $.post(
          "//app.yangche51.com/6_1/usercenter/address/delete_1_0.ashx?luser=25619357_25BCFCEB637CEC440E22AA7CCFE5FB11",{
            deliveryId: this.params.deliveryId
          }
        )
        .then(res => {
          if(res.header.statusCode == 200){
            this.$toast('删除成功');
            history.go(-1)
          }
        });
      }).catch(() => {
        // on cancel
      });
      
      
    },
    onClickLeft() {
      history.go(-1);
    },
    showCity() {
      this.show = true;
    },
    confirmArea(item) {
      this.params.provinceId = item[0].code
      this.params.cityId = item[1].code
      this.params.areaId = item[2].code
      this.show = false;
      this.params.city = `${item[0].name} / ${item[1].name} / ${item[2].name}`
    },
    cancelArea() {
      this.show = false;
    },
    save(){
      $.post(
        "//app.yangche51.com/6_1/usercenter/address/save_1_0.ashx?luser=25619357_25BCFCEB637CEC440E22AA7CCFE5FB11",this.params
      )
      .then(res => {
        if(res.header.statusCode == 200){
          this.$toast('保存成功');
          history.go(-1)
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.address-add {
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