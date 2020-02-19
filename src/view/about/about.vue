<template>
  <div class="about">
<!--    <van-sticky>
      <van-nav-bar sticky title="关于" left-arrow @click-left="onClickLeft" />
    </van-sticky> -->

    <van-cell-group class="mb10 about-top">
        <img src="~Assets/img/logo.png" style="width: 50%;" alt="">
        <div class="version">
            V4.8.5
        </div>
        <div>
            <van-button class="to-rank" round type="danger">去评分</van-button>
        </div>
    </van-cell-group>
    <van-cell-group class="mb10">
        <van-cell title="关于养车无忧" is-link url="//m.yangche51.com/mobile/promotion/aboutus/"/>
        <van-cell title="客服热线" value="400-900-3919"/>
    </van-cell-group>
  </div>
</template>
<script>
import areaList from "Assets/js/area.js";
export default {
  data() {
    return {
      params: {
        name: "",
        phone: "",
        city: "地区",
        load: "",
        checked: false
      },
      areaList,
      show: false
    };
  },
  methods: {
    onClickLeft() {
      history.go(-1);
    },
  }
};
</script>
<style lang="less" scoped>
.about {
    .about-top{
        text-align: center;
        padding-top: 60px;
        padding-bottom: 40px;
    }
    .version{
        margin: 40px 0 20px;
        font-size: 20px;
        font-weight: bold;
    }
    .to-rank{
        width: 75%;
        font-size: 18px;
    }
  .van-nav-bar__text {
    color: #323233;
  }
}
</style>