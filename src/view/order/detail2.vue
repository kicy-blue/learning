<template>
  <div class="detail2">
    <div class="detail-top-wrap">
      <van-sticky>
        <van-nav-bar class="detail-top" sticky left-arrow @click-left="onClickLeft">
          <div slot="title">一汽大众奥迪-A3</div>
        </van-nav-bar>
      </van-sticky>
      <div>
        <van-field class="input-box" v-model="value" placeholder="请输入当前里程" />
      </div>
    </div>
    <div class="detail-part">
      <div class="detail-best mb10">
        <van-row class="part-title" type="flex" justify="space-between">
          <van-col>
            <van-checkbox v-model="checked" checked-color="#07c160">
              智能保养
              <br />
              <span class="title-desc">5000km或6个月/次</span>
            </van-checkbox>
          </van-col>
          <van-col>
            <div>
              <a class="edit-link" href="javascript:;">编辑</a>
            </div>
          </van-col>
        </van-row>
        <div class="serve-part mt10">
          <van-row gutter="15" class="mb20">
            <van-col span="7">
              <van-image fit="contain" src="https://img.yzcdn.cn/vant/cat.jpeg" />
            </van-col>
            <van-col span="17">
              <div
                class="van-multi-ellipsis--l2 mb10"
              >【正品授权】壳牌/Shell喜力半合成机油HX7 5W-40 SN/CF蓝壳啊打啊啊啊啊啊啊啊啊啊</div>
              <van-row class="mb10">
                <van-tag round plain type="success">半合成</van-tag>
                <van-tag round plain type="success">5W-40</van-tag>
                <van-tag round plain type="success">4L</van-tag>
              </van-row>
              <van-row class="mb10">
                <van-col :span="16" class="c-danger" style="font-weight: bold;">¥ 935.00</van-col>
                <van-col :span="8" class="align-r" style="color: #7D7D7D;">x1</van-col>
              </van-row>
              <van-row class="size-s">
                参考用量：3.6L 您也可以
                <span class="c-danger">添加1L装</span>
              </van-row>
            </van-col>
          </van-row>
          <van-row gutter="15" class="mb20" type="flex" align="center">
            <van-col span="7">
              <van-image fit="contain" src="https://img.yzcdn.cn/vant/cat.jpeg" />
            </van-col>
            <van-col span="17">
              <div
                class="van-multi-ellipsis--l2 mb10 size-s"
              >加<span class="c-danger">￥40</span>升级为壳牌全合成 HX7Plus机油加<span class="c-danger">￥40</span>升级为壳牌全合成 HX7Plus机油</div>
            </van-col>
          </van-row>
          <van-row gutter="15" class="mb20">
            <van-col span="7">
              <van-image fit="contain" src="https://img.yzcdn.cn/vant/cat.jpeg" />
            </van-col>
            <van-col span="17">
              <div
                class="van-multi-ellipsis--l2 mb10"
              >【正品授权】壳牌/Shell喜力半合成机油HX7 5W-40 SN/CF蓝壳啊打啊啊啊啊啊啊啊啊啊</div>
              <van-row class="mb10">
                <van-col :span="16" class="c-danger" style="font-weight: bold;">¥ 935.00</van-col>
                <van-col :span="8" class="align-r" style="color: #7D7D7D;">x1</van-col>
              </van-row>
            </van-col>
          </van-row>
        </div>
      </div>
      <div class="detail-best mb10" v-for="item of 7" :key="item">
        <van-row class="part-title" type="flex" justify="space-between">
          <van-col>
            <van-checkbox v-model="checked" checked-color="#07c160">
              智能保养
              <br />
              <span class="title-desc">5000km或6个月/次</span>
            </van-checkbox>
          </van-col>
          <van-col>
            <div>
              <a class="edit-link" href="javascript:;">￥500</a>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
    <orderBottom/>
  </div>
</template>
<script>
import footerTabbar from "Components/footer/footer";
import orderBottom from "Components/order/orderBottom";
export default {
  data() {
    return {
      iconIn: require("../../assets/img/ico-msg.png"),
      activeNames: ["1"],
      value: "",
      value1: "",
      checked: true,
      option1: [
        { text: "车型1", value: 0 },
        { text: "车型2", value: 1 },
        { text: "车型3", value: 2 }
      ],
    };
  },
  components: {
    footerTabbar,
    orderBottom
  },
  methods: {
    onClickLeft() {
      history.go(-1);
    }
  }
};
</script>
<style lang="less">
.detail {
  .van-hairline--bottom::after {
    width: 0;
  }
}
</style>
<style lang="less" scoped>
.detail2 {
  padding-bottom: 60px;
  .input-box {
    background: transparent;
    color: #fff;
    /deep/ input {
      color: #fff;
      text-align: center;
    }
    /deep/ input::placeholder {
      color: #fff;
    }
  }
  .title-desc {
    font-size: 14px;
    font-weight: normal;
    color: #8c8b8b;
  }
  .edit-link {
    color: #8c8b8b;
    font-weight: normal;
  }
  .van-nav-bar .van-icon {
    color: #fff;
  }
  .detail-top-wrap {
    height: 140px;
    background: #ff0015;
  }
  .detail-top {
    background: #ff0015;
    color: #fff;
    .van-nav-bar__title {
      color: #fff;
    }
  }
  .van-card {
    padding: 10px 0;
    border-bottom: 1px solid #d2d2d2;
    background: #fff;
    .van-card__price {
      color: #ff0015;
    }
  }
  .detail-part {
    width: 90%;
    margin: -20px auto 10px;
  }
  .part-title {
    font-size: 16px;
    font-weight: bold;
    // margin-bottom: 10px;
  }
  .detail-best {
    background: #fff;
    border-radius: 7px;
    padding: 10px 15px;
  }
  .detail-list {
    .detail-item {
      margin-bottom: 10px;
      .detail-tit {
        color: #8c8b8b;
      }
    }
  }
  
}
</style>