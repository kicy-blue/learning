<template>
  <div class="set-system">
    <van-sticky class="mb10">
      <van-nav-bar
        sticky
        title="支付"
        left-arrow
        @click-left="onClickLeft"
        right-text="查看订单"
        @click-right="onClickRight"
      />
    </van-sticky>

    <van-cell-group class="mb10">
      <van-row>
        <van-col :span="24" style="text-align: center;padding: 20px;">实际应付</van-col>
        <van-col :span="24" style="text-align: center;padding-bottom: 20px;">
          <span class="c-danger">¥</span>
          <span class="c-danger" style="font-size: 30px;">{{detail.orderAmount}}</span>
        </van-col>
      </van-row>
    </van-cell-group>
    <!-- <van-cell-group class="mb10">
        <van-cell title="您的订单号" :value="params.orderCode" />
        <van-cell title="购物清单" :value="detail.ItemCount" />
        <van-cell title="待付金额" :value="'¥ ' + detail.orderAmount" />
    </van-cell-group>-->
    <div style="padding: 5px 10px;" class="u-color-gray">请选择付款方式</div>
    <van-radio-group v-model="radio">
      <van-cell-group>
        <van-cell
          v-for="(item,index) of payTypeList"
          :key="index"
          :title="item.name"
          clickable
          :icon="item.icon"
          @click="radio = item.key"
        >
          <van-radio checked-color="#07c160" slot="right-icon" :name="item.key" />
        </van-cell>
      </van-cell-group>
    </van-radio-group>
    <van-button
      style="width: 90%;margin: 1rem auto;"
      block
      round
      type="danger"
      @click="submitPay"
    >确认支付</van-button>
  </div>
</template>
<script>
import areaList from "Assets/js/area.js";
export default {
  data() {
    return {
      yhk: require("../../assets/img/icon_yhk.png"),
      payTypeList: [
        // {
        //   name: "支付宝支付",
        //   icon: require("../../assets/img/icon_zfb.png"),
        //   key: "0"
        // }
        // {
        //   name: '微信支付',
        //   icon: require('../../assets/img/wxpay.png'),
        //   key: '1'
        // },
      ],
      orderId: "",
      detail: {
        ItemCount: "",
        orderAmount: ""
      },
      params: {
        orderId: "",
        orderCode: ""
      },
      radio: "0",
      openid: ''
    };
  },
  mounted() {
    if(this.getIsWxClient()){
      this.payTypeList.push(
        {
          name: '微信支付',
          icon: require('../../assets/img/wxpay.png'),
          key: '1'
        },
      )
      this.radio = '1'
      this.getOpenid();
    }else{
      this.payTypeList.push(
        {
          name: "支付宝支付",
          icon: require("../../assets/img/icon_zfb.png"),
          key: "0"
        }
      )
    }
    this.params.orderId = this.$route.query.orderId;
    this.params.orderCode = this.$route.query.orderCode;
    this.getDetail();
  },
  methods: {
    getOpenid(){
      $.get('//wechat.yangche51.com/oauth.ashx?url=http%3a%2f%2fmobile.yangche51.com%2f%23%2forder%2fpay%3forderId%3d831274%26orderCode%3d1581091232321',
        (res, status) => {
          this.openid = res.body;
        }
      )
    },
    getIsWxClient () {
      /**
       * 判断是否是微信环境
       */
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        }
        return false;
    },
    submitPay() {
      switch (Number(this.radio)) {
        case 0:
          this.payzfb();
          break;
        case 1:
          this.paywx();
          break;
      }
    },
    onClickRight() {
      this.$router.push({
        name: "order-detail",
        query: {
          orderId: this.params.orderId
        }
      });
    },
    paywx() {
      $.get('//pay.yangche51.com/wapPayment.ashx',{
          // 订单编码
          hidOrderCode: this.detail.orderCode,
          hidPayPlat: 19,
          // 订单id
          hidOrderIds: this.detail.hidOrderIds,
          // 微信openid
          oID: this.openid,
          hidOrderamount: this.detail.orderAmount
        },
        (msg, status) => {
          WeixinJSBridge.invoke('getBrandWCPayRequest',{
            appid: msg.appid,
            timeStamp: msg.timestamp,
            nonceStr: msg.noncestr,
            package: msg.package,
            signType: msg.signType,
            paySign: msg.sign
          },function(res){
            if(res.err_msg == 'get_brand_wcpay_request：ok'){

            }else{
              alert(msg.err_msg)
            }
          })
        }
      )
    },
    payzfb() {
      let notify_url = encodeURIComponent(
        "//mm.yangche51.com/comonets/#!/paysucess/"
      );
      let s_url = encodeURIComponent(
        `//mm.yangche51.com/comonets/#!/payorder/?orderId=${this.params.orderId}&orderCode=${this.params.orderCode}`
      );

      let href = `//pay.yangche51.com/payment.aspx?hidOrderCodes=${this.params.orderCode}&hidUserId=${this.$store.state.auth.user.userId}&hidPayPlat=24&hidOrderIds=${this.params.orderId}&hidOrderamount=${this.detail.hidOrderAmount}&notify_url=${notify_url}&s_url=${s_url}`;

      console.log(href);

      location.href = href;
    },
    payyhk() {
      //   this.$http.get('//krow.feiduzi2.com/copystat?callback=jsonp1578747359427&qd=by030&t=7.355531860774166&h=has&_time=1578747359427').then(res => {

      //   })
      this.$http
        .get("//pay.yangche51.com/payment.aspx", {
          params: {
            hidOrderCodes: this.params.orderCode,
            hidUserId: this.$store.state.auth.user.userId,
            hidPayPlat: 20,
            hidOrderIds: this.params.orderId,
            hidOrderamount: this.detail.hidOrderAmount,
            notify_url: "//mm.yangche51.com/comonets/#!/paysucess/",
            s_url: `//mm.yangche51.com/comonets/#!/payorder/?orderId=${this.params.orderId}&orderCode=${this.params.orderCode}`
          }
        })
        .then(response => {
          // self.detail = response.data.Body
          // console.log(self.detail)
          // self.detail.ItemCount = `${self.detail.ItemCount}件商品`
        });
    },
    async getDetail() {
      this.$http
        .post("/Order/CreateOrder/PayOrderDetail", this.params)
        .then(response => {
          this.detail = response.data.Body;
          this.detail.ItemCount = `${this.detail.ItemCount}件商品`;
        });
    },
    onClickLeft() {
      history.go(-1);
    }
  }
};
</script>
<style lang="less" scoped>
.set-system {
  .van-nav-bar__text {
    color: #323233;
  }
  .login-out {
    display: block;
    text-align: center;
    line-height: 50px;
    height: 50px;
  }
}
</style>