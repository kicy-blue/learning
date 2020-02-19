<template>
  <div class="confirm">
    <van-sticky class="mb10">
      <van-nav-bar sticky title="确认订单" left-arrow @click-left="onClickLeft" />
    </van-sticky>
    <div class="confirm-container">
      <van-cell v-if="hasAddress" class="address-item round-item mb10" is-link :to="{name: 'address-address',params: {back: 1}}">
        <van-row gutter="10" type="flex" align="center">
          <van-col span="6" class="u-color-gray">
            <!-- <van-image fit="contain" :src="icoAddress" /> -->
            收货地址
          </van-col>
          <van-col span="17">
            <van-row>
              <van-col span="8">{{info.userInfo.receiverName}}</van-col>
              <van-col span="11" style="color: #7D7D7D;">{{info.userInfo.receiverMobile}}</van-col>
            </van-row>
            <div class="van-multi-ellipsis--l2">{{info.userInfo.provinceName + info.userInfo.cityName + info.userInfo.areaName + info.userInfo.addressDetail}}</div>
          </van-col>
        </van-row>
      </van-cell>
      <van-cell v-else  class="address-item round-item mb10" is-link :to="{name: 'address-add'}">
        <van-row>添加收货地址</van-row>
      </van-cell>

      <van-cell class="goods-item round-item mb10" is-link @click="toConfirmList">
        <van-grid :gutter="10" :column-num="8" class="mb10">
          <template v-for="(itembox) of info.autoModelList">
            <van-grid-item style="padding: 5px;border: 1px solid #D2D2D2;margin-right: 5px;" v-for="(item,index) of itembox.itemList" :key="index">
              <van-image :src="item.itemImageUrl" width="30" height="30" />
            </van-grid-item>
          </template>
          <!-- <van-grid-item style="padding: 5px;border: 1px solid #D2D2D2;margin-right: 5px;" v-for="(item,index) of info.autoModelList[0].itemList" :key="index">
            <van-image :src="item.itemImageUrl" width="30" height="30" />
          </van-grid-item> -->
        </van-grid>
        <van-row style="color: #444444;font-size: 12px;padding-left: 10px;">
          <van-col>
            共
            <span class="c-danger">{{allTotal}}</span>件商品
            <!-- <span class="c-danger">2</span>项服务、
            <span class="c-danger">1</span>件赠品 -->
          </van-col>
        </van-row>
      </van-cell>
      <div class="round-item">
        <van-cell title="支付方式" value="网上支付" />
        <van-cell title="配送方式" is-link>
          <div slot="default">
            快递
            <!-- <span class="c-danger">7元</span> -->
          </div>
        </van-cell>
        <van-cell title="优惠券" v-if="!params.discountInfo.balanceAmountInfo || (info.discountInfo.MemberDiscount==0 && !params.discountInfo.balanceAmountInfo.isSelected)" is-link :value="info.discountInfo.couponInfo.couponName || '未使用'" @click="showList = true"/>
        <van-popup
          v-model="showList"
          position="right"
          style="width: 80%;height: 100%;"
          >
          <van-list class="list">
            <van-cell class="list-item" @click="selectCoupon('no')">
              <van-row type="flex" justify="space-between">
                <van-col :span="3">
                  <van-radio disabled checked-color="#07c160"></van-radio>
                </van-col>
                <van-col :span="21">
                  <div class="main-title">不使用优惠券</div>
                </van-col>
              </van-row>
            </van-cell>
            <van-cell
              class="list-item"
              v-for="(item,index) in couponlist"
              :key="index"
              @click="selectCoupon(item)"
            >
              <van-row type="flex" justify="space-between">
                <van-col :span="3">
                  <van-radio disabled checked-color="#07c160"></van-radio>
                </van-col>
                <van-col :span="21">
                  <div class="main-title">{{item.batchName}}</div>
                  <div class="time">有效期：{{item.expirationTime}}</div>
                </van-col>
              </van-row>
            </van-cell>
          </van-list>
        </van-popup>

        <van-switch-cell
          v-if="info.discountInfo.scoreInfo && info.discountInfo.scoreInfo.canUseScore"
          active-color="#07c160"
          inactive-color="#ee0a24"
          v-model="scoreChecked"
          :title="info.discountInfo.scoreInfo.scoreText"
          @change="selectScore"
        />
        <van-switch-cell
          v-if="info.discountInfo.balanceAmountInfo && info.discountInfo.balanceAmountInfo.canUseBalance"
          active-color="#07c160"
          inactive-color="#ee0a24"
          v-model="checked"
          :title="info.discountInfo.balanceAmountInfo.balanceAmountText"
          @change="selectBalance"
        />
        <van-cell title="发票信息" is-link value="个人 " />
        
        <van-cell>
          <van-field
            class="message-box"
            v-model="message"
            rows="2"
            autosize
            type="textarea"
            placeholder="如您有其他特需要求，请在此备注"
          />
        </van-cell>
        <van-cell v-for="(item,index) of info.statList" :key="index" :title="item.key+':'">
          <div slot="default">
            <span class="c-danger" :class="{'c-success': item.value.slice(0,1) == '-'}">{{item.text}}</span>
          </div>
        </van-cell>
      </div>
    </div>
    <van-dialog v-model="pwdShow" title="请输入密码" show-cancel-button @confirm="pwdToPay" @cancel="pwdShow = false">
      <van-field v-model="payPwd" type="password" style="border: 1px solid #ccc;"></van-field>
    </van-dialog>
    <orderBottom :total="info.totalAmount" :selectProject="allTotal" @toPay="toPay"/>
  </div>
</template>
<script>
import orderBottom from "Components/order/orderBottom";
import MD5 from "../../services/MD5";
export default {
  middleware: "auth",
  data() {
    return {
      pwdShow: false,
      hasAddress: false,
      addressDetail: '',
      checked: false,
      scoreChecked: false,
      message: "",
      icoAddress: require("../../assets/img/ico-address.png"),
      info: {
        discountInfo: {
          balanceAmountInfo: {
            balanceAmountText: ''
          }
        }
      },
      params: {},
      allTotal: 0,
      couponlist: [{}],
      showList: false,
      payPwd: '',
    };
  },
  components: {
    orderBottom
  },
  mounted() {
    this.params = JSON.parse(sessionStorage.getItem('buyParams'))
    this.params.discountInfo = {}
    this.params.discountInfo.balanceAmountInfo = {}
    console.log(this.params)
    this.getData();
  },
  methods: {
    pwdToPay(){
      this.info.payPwd = (new MD5()).hexMd5(this.payPwd)
      this.toPay('true')
    },
    selectCoupon(item){
      // 选择优惠券
      if(item=='no'){
        this.params.discountInfo.couponInfo = null;
      }else{
        this.params.discountInfo.couponInfo=item;
      }
      this.showList = false;
      this.getData()
    },
    getConponList(){
      // 优惠券列表
      let params = {
        "userId": this.$store.state.auth.user.userId,
        "shoppingCartItemList": [
            // {
            //     "bargainPriceRuleId": 0,
            //     "itemId": 10052020,
            //     "price": 194,
            //     "buyCount": 1,
            //     "mallSourceType": 0
            // }
        ]
      }
      this.params.autoModelList.forEach((v,k)=>{
        v.itemList.forEach((j,i)=>{
          let obj = {
              "bargainPriceRuleId": j.bargarinRuleID || 0,
              "itemId": j.itemId || 0,
              "price": j.itemPrice || 0,
              "buyCount": j.itemCount || 0,
              "mallSourceType": j.mallSourceType || 0
          }
          params.shoppingCartItemList.push(obj)
        })
      })
      this.$http
        .post(
          "order/CreateOrder/GetCouponList",
          params
        )
        .then(res => {
          this.couponlist = res.data.Body;
        });
    },
    selectScore(){
      this.params.discountInfo.scoreInfo.isSelected = this.scoreChecked
      this.getData()
    },
    selectBalance(){
      // 余额抵扣
      this.params.discountInfo.balanceAmountInfo.isSelected = this.checked
      this.getData()
    },
    toConfirmList(){
      this.$router.push({
        name: 'order-confirm-list',
        params: {
          list: this.info.autoModelList
        }
      })
    },
    toPay(pwdPay){
      if(this.checked && !pwdPay){
        this.pwdShow = true;
        return;
      }
      this.$http
        .post(
          "order/CreateOrder/SubmitOrder",
          this.info
        )
        .then(response => {
          if(response.data.Body.status == 0){
            this.$router.push({
              name: 'order-pay',
              query: {
                orderId: response.data.Body.orderId,
                orderCode: response.data.Body.orderCode
              }
            })
          }else{
            this.$toast(response.data.Body.message);
          }
        });
    },
    setAddress(){
      this.info.userInfo.userId = this.$store.state.auth.user.userId;
      this.info.userInfo.receiverName = this.addressDetail.consignee
      this.info.userInfo.receiverMobile = this.addressDetail.mobliePhone
      this.info.userInfo.provinceId = this.addressDetail.provinceId
      this.info.userInfo.provinceName = this.addressDetail.provinceName
      this.info.userInfo.cityId = this.addressDetail.cityId
      this.info.userInfo.cityName = this.addressDetail.cityName
      this.info.userInfo.areaId = this.addressDetail.areaId
      this.info.userInfo.areaName = this.addressDetail.areaName
      this.info.userInfo.addressDetail = this.addressDetail.address
    },
    getData() {
      this.$http
        .post(
          "/order/CreateOrder/CheckOutOrder_MustLogin?_=" +
            new Date().getTime(),
          this.params
        )
        .then(response => {
            this.allTotal = 0;
          this.params = response.data.Body
          this.info = response.data.Body
          this.info.autoModelList.forEach((v,k) => {
            v.itemList.forEach((j)=>{
              this.allTotal += j.itemCount
            })
          })
          this.info.userInfo.userId ? this.hasAddress = true : this.hasAddress = false;
          this.addressDetail = JSON.parse(sessionStorage.getItem('addressDetail'))
          if(this.addressDetail){
            this.setAddress();
          }
          this.getConponList();
        });
    },
    onClickLeft() {
      history.go(-1);
    },
  }
};
</script>
<style lang="less" scoped>
.confirm {
  .confirm-container {
    padding: 0 10px 80px;
  }
  .van-nav-bar__text {
    color: #323233;
  }
  .address-item,
  .goods-item {
    .van-cell__left-icon,
    .van-cell__right-icon {
      line-height: 2rem;
    }
  }
  /deep/ .van-grid-item__content {
    padding: 0;
  }
  .message-box {
    background: #e9e9e9;
    border-radius: 5px;
  }
  .address-item {
    background: #fff;
  }
  .van-card {
    background: #fff;
  }
  .van-button {
    height: 100%;
  }
}

.list {
  padding: 10px;
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
}
</style>