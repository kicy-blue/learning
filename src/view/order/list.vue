<template>
  <div class="order-list">
    <van-sticky>
      <van-nav-bar sticky title="全部订单" left-arrow @click-left="onClickLeft" />
      <van-tabs
        v-model="params.type"
        @change="getList"
        sticky
        class="detail-tab"
        :swipe-threshold="5"
      >
        <van-tab title="全部" :name="0"></van-tab>
        <van-tab title="待付款" :name="1"></van-tab>
        <van-tab title="待发货" :name="2"></van-tab>
        <van-tab title="待收货" :name="3"></van-tab>
        <van-tab title="待评价" :name="4"></van-tab>
      </van-tabs>
    </van-sticky>
    <van-pull-refresh v-model="onLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        class="list-box"
      >
        <van-cell class="order-item" v-for="(item,index) of list" :key="index">
          <van-row class="mb10">
            <van-col span="16" style="color: #7D7D7D;">订单编号：{{item.orderCode}}</van-col>
            <van-col span="8" style="text-align: right;">{{item.displayOrderStatus}}</van-col>
          </van-row>
          <van-row gutter="10" class="mb10" @click="toDetail(item.orderId)">
            <van-col span="8">
              <van-image fit="contain" :src="item.items[0].imageSrc" />
            </van-col>
            <van-col span="16">
              <div class="van-multi-ellipsis--l2 mb10">
                {{item.items[0] && item.items[0].itemName}}
                <!-- 【正品授权】壳牌/Shell喜力半合成机油HX7 5W-40 SN/CF蓝壳啊打啊啊啊啊啊啊啊啊啊 -->
              </div>
              <van-row>
                <van-col :span="8" style="color: #7D7D7D;">共{{item.items.length}}件</van-col>
                <van-col :span="16" class="align-r">{{item.displayOrderAmount}}</van-col>
              </van-row>
            </van-col>
          </van-row>
          <div class="item-footer align-r">
            <van-button
              plain
              round
              size="small"
              type="default"
              v-for="(buttons,index) of item.actions"
              :key="index"
              @click="handle(buttons.actionId,item)"
            >{{buttons.actionText}}</van-button>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
export default {
  data() {
    return {
      onLoading: false,
      loading: false,
      finished: false,
      params: {
        type: 0,
        pageIndex: 1
      },
      list: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.params.type = this.$route.query.type || 0;
      this.getList();
    });
  },
  methods: {
    toDetail(orderId) {
      this.$router.push({
        name: "order-detail",
        query: {
          orderId: orderId
        }
      });
    },
    handle(actionId, item) {
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
                  orderId: item.orderId
                })
                .then(res => {
                  this.$toast("成功取消该订单");
                  this.getList();
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
              orderId: item.orderId,
              orderCode: item.orderCode
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
                  orderId: item.orderId
                })
                .then(res => {
                  this.$toast("成功删除该订单");
                  this.getList();
                });
            })
            .catch(() => {
              // on cancel
            });
          break;
        case 4:
          // 评论
          this.$router.push({
            name: "order-comment",
            query: {
              orderId: item.orderId,
            }
          });
          break;
        case 5:
          // 再次购买
          this.$router.push({
            name: "goods-detail",
            query: {
              id: item.items[0].itemId
            }
          });
          break;
      }
    },
    onRefresh() {
      this.getList();
    },
    onClickLeft() {
      history.go(-1);
    },
    onLoad() {},
    async getList() {
      this.isLoading = true;
      this.finished = false;
      this.$http
        .post("Order/CreateOrder/GetOrderList", this.params)
        .then(res => {
          this.isLoading = false;
          this.list = res.data.Body.orders;
          this.onLoading = false;
          this.finished = true;
          // sessionStorage.setItem('test',JSON.stringify(res.data.Body.orders[0]))
        });
    }
  }
};
</script>
<style lang="less" scoped>
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
</style>