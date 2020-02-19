<template>
  <div class="rank">
    <van-sticky>
    <van-nav-bar
      class="rank-top"
      title="余额"
      right-text="充值"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div class="profit-box">
      <span class="profit-total">{{currentBalanceText}}</span>
    </div>
    <van-row class="tab" type="flex" justify="center">
      <van-col span="12" style="border-right: 1px solid rgba(255,255,255,.5);" @click="changeType(1)">收入</van-col>
      <van-col span="12" @click="changeType(2)">支出</van-col>
    </van-row>
    </van-sticky>
    <van-pull-refresh v-model="pullLoading" @refresh="onRefresh">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <!-- 收入 -->
      <van-cell :class="item.direction == 1 ? 'profit-in' : 'profit-out'" v-for="(item,index) in dataList" :key="index">
        <van-row>
          <van-col span="2">
            <van-icon :name="item.direction == 1 ? iconIn : iconOut" size="24" />
          </van-col>
          <van-col span="16">
            <van-row>
              <van-col>{{item.memo}}</van-col>
              <!-- <van-col class="size-s u-color-gray">已完成</van-col> -->
            </van-row>
            <van-row>
              <van-col class="u-color-gray size-s">{{item.changeTime}}</van-col>
            </van-row>
          </van-col>
          <van-col span="6" class="item-right">
            <van-row>
              <van-col span="24" class="profit-num">{{item.valueText}}</van-col>
            </van-row>
            <van-row>
              <van-col span="24">{{item.name}}</van-col>
            </van-row>
          </van-col>
        </van-row>
      </van-cell>
    </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      finished: false,
      iconIn: require("../../assets/img/balance-in.png"),
      iconOut: require("../../assets/img/balance-out.png"),
      currentBalanceText: "",
      params: {
        direction: 0,
        pageIndex:1,
        pageSize:15
      },
      dataList: [],
      pullLoading: false,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    onRefresh(){
      this.pullLoading = true;
      this.changeType(this.params.direction)
    },
    changeType(type){
      this.dataList = [];
      this.finished = false
      this.params.pageIndex = 1;
      this.params.direction = type;
      this.getData();
    },
    getData() {
      this.loading = true;
      this.$http.post("customer/UserInfo/GetUserAccountLog", this.params).then(res => {
        this.loading = false;
        this.pullLoading = false;
        this.totalCount = res.data.Body.totalCount;
        this.currentBalanceText = res.data.Body.currentBalanceText;
        this.dataList = [...this.dataList,...res.data.Body.dataList];
        if(res.data.Body.dataList.length < this.params.pageSize){
          this.finished = true
        }
      });
    },
    onClickLeft() {
      history.go(-1);
    },
    onClickRight() {
      this.$toast("敬请期待");
    },
    onLoad() {
      ++this.params.pageIndex
      this.getData()
    }
  }
};
</script>
<style>
.rank .van-hairline--bottom::after {
  border: 0;
}
</style>
<style lang="less" scoped>
.rank {
  .size-s {
    margin-left: 5px;
  }
  .rank-top {
    background: #ff0015;
    color: #fff;
    .van-nav-bar__title {
      color: #fff;
    }
    .van-nav-bar__text {
      color: #fff;
      font-size: 16px;
    }
    .van-icon {
      color: #fff;
    }
  }
  .tab {
    text-align: center;
    background: #ff0015;
    color: #fff;
    font-size: 18px;
    line-height: 2;
  }
  .item-right {
    text-align: right;
  }
  .profit-in {
    .profit-num {
      color: #2ac600;
    }
  }
  .profit-out {
    .profit-num {
      color: #ff8a00;
    }
  }
  .profit-box {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    height: 100px;
    background: #ff0015;
    .profit-total {
      font-size: 24px;
    }
  }
}
</style>