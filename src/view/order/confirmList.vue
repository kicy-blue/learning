<template>
  <div class="collect-list">
    <van-sticky class="mb10">
      <van-nav-bar sticky title="商品清单" left-arrow @click-left="onClickLeft" />
    </van-sticky>
      <van-list
        class="list-box"
      >
        <van-swipe-cell
          v-for="(item,index) of list"
          :key="index"
        >
          <van-cell class="order-item">
            <van-row gutter="10">
              <van-col span="8">
                <van-image fit="contain" :src="item.itemImageUrl" />
              </van-col>
              <van-col span="16">
                <div class="van-multi-ellipsis--l2 mb10">{{item.itemName}}</div>
                <van-row>
                  <van-col :span="24" style="color: #FF0015">{{item.itemPriceText}}</van-col>
                </van-row>
              </van-col>
            </van-row>
          </van-cell>
        </van-swipe-cell>
      </van-list>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      let list = this.$route.params.list
      console.log(list)
      let arr = []
      list.forEach((v)=>{
        arr = [...arr,...v.itemList]
      })
      this.list = arr
    },
    onClickLeft() {
      history.go(-1);
    },
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