<template>
  <div class="detail">
    <div class="detail-top-wrap">
      <van-sticky>
        <van-nav-bar class="detail-top" title="订单详情" sticky left-arrow @click-left="onClickLeft" />
      </van-sticky>
    </div>
    <div class="detail-part">
      <div class="detail-best mb10">
        <div class="part-title">商品</div>
        <van-card
          @click="handle(6,item.itemId)"
          v-for="(item,index) in detail.autos[0].packages[0].items"
          :key="index"
          :num="item.itemCount"
          :price="item.displayItemPrice.slice(1)"
          :title="item.itemName"
          :thumb="item.imageSrc"
        />
      </div>
      <div class="detail-best mb10">
        <van-row>
          <van-col :span="6">配送信息：</van-col>
          <van-col :span="18">
            {{detail.contactInfo.contactName}}
            {{detail.contactInfo.mobilePhone}}
            <br />
            {{detail.contactInfo.address}}
          </van-col>
        </van-row>
      </div>
      <div class="detail-best">
        <ul class="detail-list">
          <li class="detail-item">
            <span class="detail-tit">订单编号：</span>
            <span class="detail-cnt">{{detail.orderCode}}</span>
          </li>
          <li class="detail-item">
            <span class="detail-tit">下单时间：</span>
            <span class="detail-cnt">{{detail.displayCreateTime}}</span>
          </li>
          <li class="detail-item">
            <span class="detail-tit">支付方式：</span>
            <span class="detail-cnt">{{detail.displayPayType}}</span>
          </li>
          <li class="detail-item">
            <span class="detail-tit">开具发票：</span>
            <span class="detail-cnt">{{detail.invoiceHead}}</span>
          </li>
          <li class="detail-item" v-for="(item,index) of detail.stats" :key="index">
            <span class="detail-tit">{{item.key}}：</span>
            <span class="detail-cnt" :class="{'green-color': item.value.slice(1,2) == '-'}">{{item.value}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="detail-bottom">
      <van-row type="flex" justify="end">
        <van-col span="6" v-for="(item,index) of detail.actions" :key="index">
          <van-button
            plain
            round
            size="small"
            type="default"
            @click="handle(item.actionId)"
          >{{item.actionText}}</van-button>
        </van-col>
      </van-row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderId: "",
      detail: {}
    };
  },
  mounted() {
    this.orderId = this.$route.query.orderId;
    this.getDetail();
  },
  methods: {
    handle(actionId,id) {
      switch (actionId) {
        case 1:
          // 取消订单
          this.$dialog
            .confirm({
              message: "是否取消该订单"
            })
            .then(() => {
              this.$http
                .post("Order/CreateOrder/CancelOrder", {
                  orderId: this.detail.orderId
                })
                .then(res => {
                  this.$toast("成功取消该订单");
                  this.getDetail();
                });
            })
            .catch(() => {
              // on cancel
            });
          break;
        case 2:
          // 马上支付
          this.$router.push({
            name: "order-pay",
            query: {
              orderId: this.detail.orderId,
              orderCode: this.detail.orderCode
            }
          });
          break;
        case 3:
          // 删除订单
          this.$dialog
            .confirm({
              message: "是否删除该订单"
            })
            .then(() => {
              this.$http
                .post("Order/CreateOrder/DeleteOrder", {
                  orderId: this.detail.orderId
                })
                .then(res => {
                  this.$toast("成功删除该订单");
                  history.go(-1);
                });
            })
            .catch(() => {
              // on cancel
            });
          break;
        case 5:
          // 再次购买
          this.$router.push({
            name: "goods-detail",
            query: {
              id: this.detail.autos[0].packages[0].items[0].itemId
            }
          });
          break;
        case 6:
          // 再次购买
          this.$router.push({
            name: "goods-detail",
            query: {
              id: id
            }
          });
          break;
      }
    },
    getDetail() {
      this.$http
        .post("Order/CreateOrder/GetOrderDetail", {
          orderId: this.orderId
        })
        .then(res => {
          this.detail = res.data.Body;
          console.log(this.detail);
        });
    },
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
.green-color{
  color: #07c160;
}
.detail {
  padding-bottom: 60px;
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
    margin: -80px auto 10px;
  }
  .part-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .detail-best {
    background: #fff;
    border-radius: 7px;
    padding: 10px 15px;
    .van-card:last-of-type{
      border-bottom: 0;
    }
  }
  .detail-list {
    .detail-item {
      margin-bottom: 10px;
      .detail-tit {
        color: #8c8b8b;
      }
    }
  }
  .detail-bottom {
    background: #fff;
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 10px;
    z-index: 999;
  }
}
</style>