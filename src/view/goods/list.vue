<template>
  <div class="goods-page">
    <van-sticky>
      <van-dropdown-menu active-color="#ee0a24" style="margin-bottom: 10px;">
        <van-dropdown-item @change="goods" v-model="value" :options="option" />
        <van-dropdown-item title="筛选" ref="item">
          <van-row v-show="brandList.length">
            <div style="padding: 10px 20px" class="mb10">
              <div :span="24" class="mb10">品牌</div>
              <div :span="24">
                <van-tag
                  size="medium"
                  :class="{'brand-on': item.brandId == query.brandId}"
                  @click="changeBrand(item.brandId)"
                  v-for="(item,index) of brandList"
                  :key="index"
                  plain
                  round
                  type="warning"
                >{{item.brandName}}</van-tag>
              </div>
            </div>
            <van-button block type="info" @click="reset">重置</van-button>
          </van-row>
        </van-dropdown-item>
      </van-dropdown-menu>
    </van-sticky>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="isLoading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-row
          class="goods-list"
          gutter="10"
          style="flex-wrap: wrap;padding: 0 10px;"
          type="flex"
          justify="space-between"
          >
          <van-col :key="'goods'+item.itemId" v-for="item in itemList" class="goods-item" span="12">
            <router-link :to="{name:'goods-detail',query:{id:item.itemId}}">
              <div class="pic-wrap">
                <van-image class="goods-pic" :src="item.defaultItemImagePath" />
                <div class="goods-info">
                  <div class="van-multi-ellipsis--l2 goods-tit">{{item.itemName}}</div>
                  <div>
                    <!-- <van-tag
                      style="overflow: hidden;height: 16px;"
                      :key="'tag'+item.itemId+index"
                      v-for="(tag,index) in item.tagList"
                      class="goods-tag"
                      plain
                      type="danger"
                      round
                    >{{tag}}</van-tag> -->
                  </div>
                  <div class="goods-bottom">
                    <span class="price">
                      ¥<span class="big-price">{{item.showPrice}}</span>
                    </span>
                    <span class="buy-nums">{{item.soldNumber}}购买</span>
                  </div>
                </div>
              </div>
            </router-link>
          </van-col>
        </van-row>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
export default {
  // middleware: "auth",
  data() {
    return {
      isLoading: false,
      value: 0,
      finished: false,
      option: [
        { text: "排序", value: 0 },
        { text: "销量", value: 6 },
        { text: "价格生序", value: 1 },
        { text: "价格降序", value: 2 },
        { text: "新品", value: 3 }
      ],
      totalCount: 0,
      brandList: [],
      itemList: [],
      query: {
        subNavId: null,
        brandId: 0,
        pageIndex: 1,
        pageSize: 15,
        keyword: ""
      }
    };
  },
  created() {
    this.query = Object.assign(this.query, this.$route.query);
    this.goods();
  },
  methods: {
    onLoad(){
      ++this.query.pageIndex
      this.goods()
    },
    reset() {
      this.query.brandId = 0;
      this.goods();
    },
    changeBrand(brandId) {
      this.query.brandId = brandId;
      this.goods();
    },
    onRefresh() {
      this.finished = false
      this.query.pageIndex = 1;
      this.itemList = [];
      this.goods();
    },
    goods() {
      this.isLoading = true;
      if (this.query.keyword) {
        var data = {
          keyWord: this.query.keyword,
          itemParam: {
            sortType: this.value
          },
          pageIndex: this.query.pageIndex,
          pageSize: this.query.pageSize
        };
        this.$http.post("svcmall/Mall/SearchItem", data).then(response => {
          this.isLoading = false;
          this.totalCount = response.data.Body.totalCount;
          this.itemList = [...this.itemList,...response.data.Body.itemList];
          this.brandList = response.data.Body.brandList;
          if(response.data.Body.itemList.length < this.query.pageSize){
            this.finished = true
          }
        });
      } else {
        var data = {
          itemParam: {
            brandId: this.query.brandId,
            sortType: this.value,
            subNavId: this.query.subNavId
          },
          pageIndex: this.query.pageIndex,
          pageSize: this.query.pageSize
        };
        this.$http.post("svcmall/Mall/GetItemList", data).then(response => {
          this.isLoading = false;
          this.totalCount = response.data.Body.totalCount;
          this.itemList = [...this.itemList,...response.data.Body.itemList];
          this.brandList = response.data.Body.brandList;
          if(response.data.Body.itemList.length < this.query.pageSize){
            this.finished = true
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.goods-page {
  .goods-list {
    .goods-item {
      margin-bottom: 10px;
      &>a{
        display: block;
        background: #fff;
      }
    }
  }

  .pic-wrap {
    background: #fff;
  }

  .goods-pic {
    width: 100%;
    height: 150px;
  }

  .goods-tit {
    height: 44px;
    line-height: 22px;
    margin-bottom: 5px;
    
  }

  .goods-info {
    padding: 0 5px;
  }

  .goods-tag {
    margin-right: 8px;
  }

  .goods-bottom {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .big-price {
      font-size: 22px;
    }

    .price {
      color: #ff0015;
    }

    .buy-nums {
      color: #7d7d7d;
    }
  }
  .brand-on {
    color: #fff;
    background: #ff976a;
  }
}
</style>