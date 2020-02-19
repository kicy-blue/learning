<template>
  <div>
    <van-sticky class="mb10">
      <van-nav-bar title="购物车" left-arrow sticky @click-left="onClickLeft" />
    </van-sticky>
    <div class="cart-main">
      <van-checkbox-group ref="checkboxGroup" class="card-goods" v-model="checkedGoods">
        <div v-for="(model,modelIndex) in autoModelList" :key="modelIndex">
          <van-swipe-cell>
            
            <template slot="right">
              <van-button square type="danger" text="删除" />
            </template>
          </van-swipe-cell>

          <van-swipe-cell
            :key="'goods-'+goods.itemId"
            v-for="(goods,goodsIndex) in model.itemList"
            :right-width="65"
            style="background: #fff;"
          >
            <van-cell-group>
              <van-checkbox
                :label-disabled="true"
                class="card-goods__item"
                :key="goods.itemId"
                :name="goods"
              >
                <van-card
                  :title="goods.itemName"
                  :desc="goods.desc||''"
                  :price="goods.itemPrice"
                  :thumb="goods.imageSrc"
                >
                  <template slot="footer">
                    <van-row type="flex" justify="space-between" style="margin-top: 10px;">
                      <van-col :span="16" style="text-align: left;">{{model.autoModelName}}</van-col>
                      <van-col :span="8">

                      <van-stepper
                        :name="goods.key"
                        @change="onQtyChange"
                        min="1"
                        v-model="goods.itemCount"
                        :max="goods.maxBuy"
                      />
                      </van-col>
                    </van-row>
                  </template>
                </van-card>
              </van-checkbox>
            </van-cell-group>
            <template slot="right">
              <van-button
                @click="removeGoods(goods,goodsIndex,model.itemList)"
                class="goods-del"
                square
                type="danger"
                text="删除"
              />
            </template>
          </van-swipe-cell>
        </div>
      </van-checkbox-group>
    </div>

    <van-submit-bar
      :price="totalPrice"
      :disabled="!checkedGoods.length"
      :button-text="submitBarText"
      @submit="onSubmit"
    >
      <van-checkbox @change="OnCheckAll(checkAll)" v-model="checkAll">全选</van-checkbox>
    </van-submit-bar>
  </div>
</template>

<script>
import {
  Checkbox,
  CheckboxGroup,
  Card,
  SubmitBar,
  Toast,
  SwipeCell
} from "vant";

export default {
  middleware: "auth",
  components: {
    [Card.name]: Card,
    [Checkbox.name]: Checkbox,
    [SubmitBar.name]: SubmitBar,
    [CheckboxGroup.name]: CheckboxGroup,
    [SwipeCell.name]: SwipeCell
  },

  data() {
    return {
      checkedGoods: [],
      autoModelList: [],
      checkAll: false,
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
            autoBrandId: "",
            autoModelId: "",
            autoModelSubId: "",
            year: "",
            autoBrandName: "",
            autoModelName: "",
            autoModelSubName: "",
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
                itemId: "",
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

  computed: {
    submitBarText() {
      const count = this.checkedGoods.length;
      return "结算" + (count ? `(${count})` : "");
    },

    totalPrice() {
      // 计算金额
      let total = 0;
      this.checkedGoods.forEach(item => {
        total =
          total +
          parseInt(parseFloat(item.itemPrice) * 100) * parseInt(item.itemCount);
      });

      return total;
    }
  },
  created() {
    this.getGoods();
  },
  methods: {
    onClickLeft(){
      history.go(-1)
    },
    formatPrice(price) {
      return (price / 100).toFixed(2);
    },

    onSubmit() {
        //   Toast("点击结算");
        let ids = []
        this.checkedGoods.forEach(v => {
            ids.push(v.itemId)
        })
        let params = JSON.parse(JSON.stringify(this.autoModelList));
        this.autoModelList.forEach((v,k) => {
            params[k].itemList = [];
            v.itemList.forEach((j,i) => {
                if(ids.includes(j.itemId)){
                    params[k].itemList.push(j)
                }
            })
        })
      this.buyParams.autoModelList = params;
      console.log(params)
      sessionStorage.setItem("buyParams", JSON.stringify(this.buyParams));
      this.$router.push({
        name: "order-confirm"
      });
    },
    getGoods() {
      this.$http
        .post("/Order/ShoppingTrolley/GetShoppingTrolley")
        .then(response => {
          this.autoModelList = response.data.Body.autoModelList;
        });
    },
    onQtyChange(value, name) {
      // 更新购物车
      let data = {
        items: [{ key: name.name, itemCount: value }]
      };
      this.$http
        .post("/Order/ShoppingTrolley/AlterItemCountByKey", data)
        .then(response => {});
    },
    removeGoods(goods, goodsIndex, itemList) {
      this.$dialog
        .confirm({
          message: "您确定要删除该商品吗？"
        })
        .then(() => {
          // 删除购物车
          let data = {
            items: [{ key: goods.key }]
          };
          this.$http
            .post("/Order/ShoppingTrolley/RemoveItemByKey", data)
            .then(response => {
              itemList.splice(goodsIndex, 1);
            });
        })
        .catch(() => {});
    },

    OnCheckAll(checkAll) {
      this.$refs.checkboxGroup.toggleAll(checkAll);
    }
  }
};
</script>

<style lang="less">
.cart-main{
      height: calc(100vh - 3rem);
    overflow: auto;
}
.card-goods {
  padding: 10px 0;
  background-color: #fff;

  &__item {
    position: relative;
    background-color: #fafafa;

    .van-checkbox__label {
      width: 100%;
      height: auto; // temp
      padding: 0 10px 0 15px;
      box-sizing: border-box;
    }

    .van-checkbox__icon {
      top: 50%;
      left: 10px;
      z-index: 1;
      position: absolute;
      margin-top: -10px;
    }

    .van-card__price {
      color: #f44;
    }
  }

  .goods-del {
    height: 100%;
  }
}
.card-goods__item{
  background: #fff;
}
.van-card{
  background: #fff;

}
</style>
