<template>
  <div class="collect-list">
    <van-sticky class="mb10">
      <van-nav-bar sticky title="收藏商品" left-arrow @click-left="onClickLeft" />
    </van-sticky>
    <van-pull-refresh v-model="onLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        class="list-box"
      >
        <van-swipe-cell
          :before-close="beforeClose"
          v-for="(item,index) of collectList"
          :key="index"
        >
          <van-cell class="order-item" @click="toDetail(item.itemId)">
            <van-row gutter="10">
              <van-col span="8">
                <van-image fit="contain" :src="item.imageSrc" />
              </van-col>
              <van-col span="16">
                <div class="van-multi-ellipsis--l2 mb10">{{item.itemName}}</div>
                <van-row>
                  <van-col :span="24" style="color: #FF0015">{{item.itemPrice}}</van-col>
                </van-row>
              </van-col>
            </van-row>
          </van-cell>

          <template slot="right">
            <van-button square type="danger" text="删除" @click="deleteCollect(item.itemId)"/>
          </template>
        </van-swipe-cell>
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
      finished: true,
      params: {
        pageIndex: 1,
        pageSize: 10
      },
      collectList: [],
      total: 0
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
      deleteCollect(id){
          let itemIds = [id]
          $.post(
                "//app.yangche51.com/6_1/usercenter/favourite/removefavitem_1_0.ashx?luser=25619357_25BCFCEB637CEC440E22AA7CCFE5FB11",
                {
                    itemIds: JSON.stringify(itemIds)
                },
                (res, status) => {
                    this.onRefresh()
                }
            );
      },
    toDetail(id) {
      this.$router.push({ name: "goods-detail", query: { id: id } });
    },
    getList() {
      $.post(
        "//app.yangche51.com/6_1/usercenter/favourite/getfavitemlist_1_0.ashx?luser=25619357_25BCFCEB637CEC440E22AA7CCFE5FB11",
        this.params,
        (res, status) => {
          this.onLoading = false;
          this.loading = false;
          this.collectList = res.body.itemList || [];
          if (this.collectList.length < this.params.pageSize) {
            this.finished = true;
          } else {
            this.finished = false;
          }
        }
      );
    },
    onRefresh() {
      this.finished = false;
      this.loading = true;
      this.params.pageIndex = 1;
      this.getList();
    },
    onClickLeft() {
      history.go(-1);
    },
    onLoad() {
      ++this.params.pageIndex;
      this.getList();
    },
    beforeClose() {}
  }
};
</script>
<style lang="less" scoped>
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