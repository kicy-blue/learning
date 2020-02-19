<template>
  <div class="page-discount">
    <van-sticky class="mb10">
      <van-nav-bar title="优惠券" left-arrow sticky @click-left="onClickLeft" />
      <van-tabs v-model="curTab" sticky>
        <van-tab v-for="(tab,index) in tabList" :title="tab.name" :name="tab.status" :key="index"></van-tab>
      </van-tabs>
      <!-- <van-tabs
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
      </van-tabs>-->
    </van-sticky>
    <van-list
      class="list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getDate"
    >
      <!-- <van-cell v-for="(item,index) in list[curTab]" :key="index" :title="item">

      </van-cell>-->
      <van-cell
        class="list-item"
        v-for="(item,index) in list"
        :class="{'used': curTab == 2, 'outtime': curTab == 3}"
        :key="index"
      >
        <van-row type="flex" justify="space-between">
          <van-col>
            <div class="main-title">{{item.explanation}}</div>
            <div class="time">{{item.validTime}}</div>
          </van-col>
          <van-col>
            <img height="40" src="~Assets/img/you.png" alt />
          </van-col>
        </van-row>
        <van-divider dashed />
        <van-row>{{item.couponType}}</van-row>
      </van-cell>
    </van-list>
    <!-- <van-coupon-list
      :show-exchange-bar="false"
      :coupons="coupons"
      :chosen-coupon="chosenCoupon"
      :disabled-coupons="disabledCoupons"
      :show-close-button="false"
      @change="onChange"
      @exchange="onExchange"
    />-->
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      finished: false,
      curTab: 1,
      list: [],
      tabList: [
        {
          name: "未使用",
          status: 1
        },
        {
          name: "已使用",
          status: 2
        },
        {
          name: "已过期",
          status: 3
        }
      ],
      coupons: [],
      disabledCoupons: [],
      params: {
        pageIndex: 0,
        pageSize: 15
      }
    };
  },
  mounted() {
    //  －1 已过期 0 未使用 1 已使用
    this.coupons = [];
    this.getDate(0);
  },
  methods: {
    onClickLeft() {
      history.go(-1);
    },
    getDate(type) {
      this.params.pageIndex++;
      this.loading = true;
      
        $.post("//app.yangche51.com/6_1/usercenter/coupon/getlist_1_0.ashx?luser=25619357_25BCFCEB637CEC440E22AA7CCFE5FB11", {
          pageIndex: this.params.pageIndex,
          pageSize: this.params.pageSize,
          statusType: this.curTab
        })
        .then(res => {
          this.loading = false;
          this.list = [...this.list, ...res.body.couponList];
          if (res.body.couponList.length < this.params.pageSize) {
            this.finished = true;
          }
        });
    },
    onChange(index) {
      this.chosenCoupon = index;
    },
    onExchange(code) {
      this.coupons.push(coupon);
    }
  },
  watch: {
    curTab(n, o) {
      this.params.pageIndex = 0;
      this.finished = false;
      this.list = [];
      this.getDate();
    }
  }
};
</script>
<style lang="less" scoped>
.page-discount {
  /deep/ .van-checkbox {
    display: none;
  }
}
.list {
  padding: 10px;
}
.list-item {
  background: #e42f33;
  border-radius: 8px;
  margin-bottom: 10px;
  .main-title {
    font-weight: bold;
    font-size: 18px;
  }
  .time {
    font-size: 14px;
  }
}
.van-coupon-list__empty p,
.van-divider {
  margin: 10px 0;
}
.van-cell__value--alone {
  color: #fff;
}
.used {
  opacity: 0.6;
}
.outtime {
  filter: grayscale(100%);
  opacity: 0.6;
}
</style>