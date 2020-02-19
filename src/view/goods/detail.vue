<template>
  <div v-if="goods " class="goods goods-detail">
    <van-swipe class="goods-swipe" :autoplay="3000">
      <van-swipe-item v-for="thumb in goods.itemDetailInfo && goods.itemDetailInfo.itemImageUrl" :key="thumb">
        <img :src="thumb" />
      </van-swipe-item>
    </van-swipe>

    <van-cell-group class="part">
      <div class="share-box">
        <van-icon name="share" />分享
      </div>
      <van-cell>
        <div class="goods-price">
          {{ goods.itemDetailInfo && goods.itemDetailInfo.itemPriceText }}
          <span
            class="sale-num"
          >已售出{{goods.itemDetailInfo && goods.itemDetailInfo.soldNumber}}件</span>
        </div>
        <div class="goods-title van-multi-ellipsis--l2">{{ goods.itemDetailInfo && goods.itemDetailInfo.itemName }}</div>
        <div class="goods-desc">暗黑科技 智能自修复 持久抗高温</div>
      </van-cell>
      <van-cell class="goods-give">
        <van-tag class="goods-tag" plain type="danger" round>赠送</van-tag>
        <span>赠送{{goods.itemDetailInfo && goods.itemDetailInfo.sendScore}}积分，相当于商品价格¥ {{goods.itemDetailInfo &&goods.itemDetailInfo.scoreEqualPrice}}</span>
      </van-cell>
      <van-row class="quality-part">
        <van-col span="6" v-if="item.isSelected == 1" v-for="(item,index) of goods.serviceTipsList" :key="index">
          <van-icon class="quality-icon" name="passed" />
          <span class="quality-text">{{item.itemServiceTipsName}}</span>
        </van-col>
      </van-row>
    </van-cell-group>

    <van-cell-group>
      <van-tabs v-model="active" @click="tabsClick" scrollspy sticky class="detail-tab">
        <van-tab name="goods" title="商品"></van-tab>
        <van-tab name="review" title="评价">
          <van-cell-group class="detail-comment">
            <van-cell class="mb10" v-show="!reviews.data.length">
              暂无评价
            </van-cell>
            <van-cell
              :key="'review'+indexReview"
              v-for="(review,indexReview)  in reviews.data"
              class="mb10"
              >
              <van-row gutter="20">
                <van-col span="3">
                  <van-image
                    round
                    width="0.8rem"
                    height="0.8rem"
                    :src="review.userPhoto ? '//c5.yangche51.com/'+review.userPhoto : 'https://img.yzcdn.cn/vant/cat.jpeg'"
                  />
                </van-col>
                <van-col span="12">
                  <div class="username">
                    {{review.userName}}
                    <!-- <span class="goods-type">本田 思域</span> -->
                  </div>
                  <van-rate
                    class="rate-star"
                    v-model="review.itemMark"
                    size=".3rem"
                    color="#ee0a24"
                    void-icon="star"
                    void-color="#eee"
                  />
                </van-col>
                <van-col class="u-color-gray comment-time" span="6">{{review.reviewdTime}}</van-col>
              </van-row>
              <van-row class="mb10">
                <div class="van-multi-ellipsis--l2 mb10">{{review.content}}</div>
                <div>
                  <van-grid :gutter="10" :column-num="3">
                    <van-grid-item
                      v-for="(img,indexImg) in review.images"
                      :key="'image'+indexImg"
                      icon="photo-o"
                    >
                      <van-image :src="img" />
                    </van-grid-item>
                  </van-grid>
                </div>
                <!-- <div class="reply-box">
                  <p>小优回复</p>
                  <div>感谢</div>
                </div> -->
              </van-row>
              <!-- <van-row class="u-color-gray comment-bottom">
                <van-col span="12">浏览 520</van-col>
                <van-col span="12">
                  <van-tag plain round class="comment-tag">
                    <van-icon name="comment-o" />0
                  </van-tag>
                  <van-tag plain round class="comment-tag">
                    <van-icon name="good-job-o" />0
                  </van-tag>
                </van-col>
              </van-row> -->
            </van-cell>
            <a href="javascript:;" style="color: #1989fa;text-align: center;display: block;" v-if="hasmore" @click="goodsDetailReview">查看更多评价</a>
            <van-divider v-else>没有更多了</van-divider>
          </van-cell-group>
        </van-tab>
        <van-tab name="desc" title="详情">
          <van-row class="detail-pic-part" style="width: 100%">
            <div
              class="rich"
              v-if="goods.itemIntroduce"
              v-html="goods.itemIntroduce"
              span="24"
            ></div>
          </van-row>
        </van-tab>
      </van-tabs>
    </van-cell-group>
    <van-goods-action style="z-index: 999;">
      <van-goods-action-icon icon="chat-o">
        <a href="https://kf1.xuxw.top/addons/kefu/index/mobile?fixed_csr=0">客服</a>
      </van-goods-action-icon>
      <van-goods-action-icon icon="cart-o" :info="cartNumber" @click="onClickCart">购物车</van-goods-action-icon>
      <van-goods-action-button type="warning" @click="addCart">加入购物车</van-goods-action-button>
      <van-goods-action-button type="danger" @click="toBuy">立即购买</van-goods-action-button>
    </van-goods-action>
    <van-sku
      v-model="showBuyDetail"
      :sku="sku"
      :goods="goods"
      :goods-id="goodsID"
      :quota="0"
      @buy-clicked="toBuy"
      @add-cart="addCart"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      goods: {},
      active: 1,
      rateVal: 3,
      hasmore: true,
      goodsID: null,
      reviews: {
        data: [],
        count: 0,
        userTotal: 0
      },
      pageIndex: 0,
      cartNumber: 0,
      showBuyDetail: false,
      sku: {
        // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
        // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
        tree: [
          //   {
          //     k: "颜色", // skuKeyName：规格类目名称
          //     v: [
          //       {
          //         id: "30349", // skuValueId：规格值 id
          //         name: "红色", // skuValueName：规格值名称
          //         imgUrl: "https://img.yzcdn.cn/1.jpg", // 规格类目图片，只有第一个规格类目可以定义图片
          //         previewImgUrl: "https://img.yzcdn.cn/1p.jpg" // 用于预览显示的规格类目图片
          //       },
          //       {
          //         id: "1215",
          //         name: "蓝色",
          //         imgUrl: "https://img.yzcdn.cn/2.jpg",
          //         previewImgUrl: "https://img.yzcdn.cn/2p.jpg"
          //       }
          //     ],
          //     k_s: "s1" // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
          //   }
        ],
        // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
        list: [
          {
            id: 2259, // skuId，下单时后端需要
            price: 100, // 价格（单位分）
            s1: "1215", // 规格类目 k_s 为 s1 的对应规格值 id
            s2: "1193", // 规格类目 k_s 为 s2 的对应规格值 id
            s3: "0", // 最多包含3个规格值，为0表示不存在该规格
            stock_num: 110 // 当前 sku 组合对应的库存
          }
        ],
        price: "", // 默认价格（单位元）
        stock_num: 227, // 商品总库存
        collection_id: 2261, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
        none_sku: false, // 是否无规格商品
        hide_stock: true // 是否隐藏剩余库存
      },
      goods: {
        // 商品标题
        title: "",
        // 默认商品 sku 缩略图
        picture: ""
      },
      
      buyParams: {
        orderSource: 1,
        payPwd: "",
        isOpenPayPwd: true,
        orderComposition: 2,
        remark: "",
        operationType: 0,
        totalAmount: 0,
        lng: 0,
        lat: 0,
        isNeedServiceShop: false,
        verificationInfo: {
          verificationCode: ""
        },
        serviceShopInfo: {
          serviceShopId: 0,
          serviceShopName: "",
          ServiceShopAddress: "",
          serviceShopTelephone: "",
          lng: 0,
          lat: 0,
          servicePrice: "",
          deliveryToShop: "0"
        },
        serviceModeList: [
          {
            serviceModeType: 0,
            serviceModeText: "",
            selected: false,
            isValid: false
          }
        ],
        userInfo: {
          userId: 0,
          receiverName: "",
          receiverMobile: "",
          provinceId: 0,
          provinceName: "",
          cityId: 0,
          cityName: "",
          areaId: 0,
          areaName: "",
          addressDetail: ""
        },
        autoModelList: [
          {
            autoBrandId: '',
            autoModelId: '',
            autoModelSubId: '',
            year: '',
            autoBrandName: '',
            autoModelName: '',
            autoModelSubName: '',
            autoModelTotalPrice: null,
            carParamList: [
              {
                paramTypeId: 0,
                paramTypeName: "",
                paramValueId: 0,
                paramValue: ""
              }
            ],
            packageName: "",
            itemList: [
              {
                itemId: '',
                itemCount: "1",
                mallSourceType: 0,
                mallSourceId: 0,
                key: ""
              }
            ],
            serviceItemList: []
          }
        ],
        giftItemList: [],
        discountInfo: {
          couponInfo: {
            couponName: "",
            couponCode: "",
            isUsed: false,
            effectiveTime: "",
            expirationTime: "",
            purchaseValue: 0,
            minMeetAmount: 0,
            remark: ""
          },
          scoreInfo: {
            canUseScore: false,
            useScore: 0,
            isSelected: false,
            scoreText: ""
          }
        },
        invoiceInfo: {
          taxId: 0,
          invoiceType: 0,
          invoiceHead: "",
          commanyName: null,
          taxNO: null,
          registerAddress: null,
          registerPhone: null,
          taxContent: null,
          bankName: null,
          bankNumber: null,
          vatStatus: 0,
          EVAInvoiceList: null
        },
        statList: [
          {
            key: "",
            value: ""
          }
        ]
      }
    };
  },
  created() {
    this.goodsID = this.$route.query.id;
    this.getCartNumber();
    this.goodsInfo();
  },
  methods: {
    toBuy(){
      this.buyParams.autoModelList[0]['autoBrandId'] = this.goods.autoModel && this.goods.autoModel.autoBrandId || 0
      this.buyParams.autoModelList[0]['autoModelId'] = this.goods.autoModel && this.goods.autoModel.autoModelId || 0
      this.buyParams.autoModelList[0]['autoModelSubId'] = this.goods.autoModel && this.goods.autoModel.autoModelSubId || 0
      this.buyParams.autoModelList[0]['year'] = this.goods.autoModel && this.goods.autoModel.year || 0
      this.buyParams.autoModelList[0]['autoBrandName'] = this.goods.autoModel && this.goods.autoModel.autoBrandName || 0
      this.buyParams.autoModelList[0]['autoModelName'] = this.goods.autoModel && this.goods.autoModel.autoModelName || 0
      this.buyParams.autoModelList[0]['autoModelSubName'] = this.goods.autoModel && this.goods.autoModel.autoModelSubName || 0
      this.buyParams.autoModelList[0]['itemList'][0].itemId = this.goodsID
      sessionStorage.setItem('buyParams',JSON.stringify(this.buyParams))
      this.$router.push({
        name: 'order-confirm'
      })
    },
    getCartNumber() {
      this.$http
        .post("/Order/ShoppingTrolley/GetTrolleyItemCount")
        .then(response => {
          this.cartNumber = response.data.Body;
        });
    },
    formatPrice() {
      return "¥" + (this.goods.price / 100).toFixed(2);
    },

    onClickCart() {
      this.$router.push({ name: "cart" });
    },
    addCart() {
      // this.$router.push("cart");
      this.appendItem([
        {
          itemId: this.goodsID,
          itemCount: 1,
          itemSecretType: 1,
          mallSourceType: 0,
          mallSourceId: 0
        }
      ]);
    },
    goodsInfo() {
      let carCon=JSON.parse(localStorage.getItem('YC51_Web_Auto'))
      $.post("//app.yangche51.com/6_1/item/getitemdetail_2_1.ashx?luser=25619357_25BCFCEB637CEC440E22AA7CCFE5FB11", {
          itemid: this.goodsID,
          autoModelSubId: carCon.s,
          userId: this.$store.state.auth.user ? this.$store.state.auth.user.userId : '',
          year: carCon.y,
        })
        .then(response => {
          this.goods = response.body;
          this.goods.desc = {};
          this.goods.desc = this.goods.itemIntroduce || '暂无内容'

          this.goodsDetailReview();
          this.goods.picture = this.goods.itemDetailInfo.itemImageUrl[0];
          this.goods.title = this.goods.itemDetailInfo.itemDisplayName;
          this.sku.price = this.goods.itemDetailInfo.showPrice;
        });
    },
    goodsDetailDesc() {
      this.$http
        .post("svcmall/Mall/GetItemDetailDesc", {
          itemId: this.goodsID,
          mallSourceType: 0,
          mallSourceId: 0
        })
        .then(response => {
          this.goods.desc = response.data.Body;
        });
    },

    // 评价
    goodsDetailReview() {
      this.pageIndex++
      this.$http
        .post("svcmall/Mall/GetItemDetailReview", {
          itemId: this.goodsID,
          pageIndex: this.pageIndex,
          pageSize: 15,
          imageFilter: 0
        })
        .then(response => {
          if(response.data.Body.itemReviewDetailInfoList.length < 15){
            this.hasmore = false;
          }
          this.reviews.data = [...this.reviews.data,...response.data.Body.itemReviewDetailInfoList];
          this.reviews.count = response.data.Body.reviewCount;
          this.reviews.userTotal = response.data.Body.reviewUserTotal;
        });
    },
    appendItem(itemList) {
      this.$http
        .post("Order/ShoppingTrolley/AppendItem", {
          clientType: 0,
          autoModel: null,
          itemList: itemList
        })
        .then(response => {
          this.$toast("添加成功");
          this.cartNumber = response.data.Body;
        });
    },
    tabsClick(name, title) {
      if (name == "goods") {
        window.scroll(0, 0);
        return;
      }
    }
  }
};
</script>

<style lang="less">
.goods-detail {
  .rich {
    * {
      max-width: 100vw;
    }
  }
  .part {
    margin-bottom: 10px;
  }

  .reply-box {
    background: #e9e9e9;
    color: #7b7b7b;
    padding: 1px 10px 20px;
    border-radius: 5px;
  }

  .comment-bottom {
    padding-bottom: 5px;
  }

  .comment-tag {
    float: right;
    font-size: 14px;
    padding-left: 10px;
    padding-right: 10px;
    margin-right: 7px;

    i {
      margin-right: 5px;
    }
  }

  .detail-pic-part {
    font-size: 0;

    img {
      width: 100%;
    }
  }
}

.quality-part {
  background: #f2f7ff;
  color: #619bf1;
  padding: 10px 16px;
  box-sizing: border-box;

  .quality-icon {
    vertical-align: middle;
  }

  .quality-text {
    display: inline-block;
    vertical-align: middle;
  }
}

.share-box {
  position: absolute;
  right: 0;
  top: 10px;
  z-index: 1;
  color: #c3c3c3;
  background: #f0f0f0;
  padding: 3px 5px;
  border-radius: 99px 0 0 99px;

  i {
    vertical-align: -2px;
  }
}

.goods-price {
  font-size: 24px;
  color: #f44;
}

.goods-title {
  margin: 10px 0;
  font-size: 16px;
}

.sale-num {
  color: #8c8b8b;
  font-size: 14px;
}

.goods-desc {
  color: #8c8b8b;
}

// 评论
.detail-comment {
  .username {
    line-height: 1.2;
  }

  .goods-type {
    color: #8c8b8b;
  }

  .rate-star {
    font-size: 12px;
  }

  .comment-time {
    font-size: 12px;
    float: right;
  }
}

.goods {
  padding-bottom: 50px;

  &-swipe {
    img {
      width: 100%;
      display: block;
    }
  }
}
// .detail-comment .van-cell:last-of-type::after{
//   border: 0
// }
.van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after{
  border: 0;
}
</style>
