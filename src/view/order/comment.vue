<template>
  <div class="comment">
    <van-sticky>
      <van-nav-bar
        sticky
        title="发表评价"
        left-arrow
        @click-left="onClickLeft"
      />
    </van-sticky>
    <van-cell-group>
      <van-cell v-for="(item,index) of params.itemReviewList" :key="index">
        <van-row style="padding: 20px 0;">
          <van-row gutter="10" class="mb10" type="flex" align="center" justify="space-around">
            <van-col :span="4" style="margin-right: 20px;">
              <van-image fit="contain" :src="item.imageSrc" />
            </van-col>
            <van-col :span="8" style="font-size: .35rem;text-align: center;">商品满意度</van-col>
            <van-col :span="14" style="text-align: center;">
              <van-rate
                v-model="item.itemMark"
                :size="26"
                color="#ee0a24"
                void-icon="star"
                void-color="#eee"
              />
            </van-col>
          </van-row>
        </van-row>

        <van-field
          v-model="item.content"
          rows="5"
          autosize
          type="textarea"
          class="comment-textarea"
          placeholder="亲，商品使用的怎么样，写下你的感受吧！"
        />
        <div class="upload-wrap">
          <!-- <van-uploader v-model="fileList" multiple :max-count="3" :after-read="uploadImg"/> -->
          <van-uploader v-model="fileList[item.itemId]" multiple :max-count="3" :after-read="uploadImg"/>
        </div>
      </van-cell>
      <div class="main-title">综合满意度</div>
      <van-cell>
        <van-row>
          <van-col span="8" style="text-align: center;">
            物流满意度
          </van-col>
          <van-col span="14">
            <van-rate
                v-model="params.logisticsMark"
                :size="26"
                color="#ee0a24"
                void-icon="star"
                void-color="#eee"
              />
          </van-col>
        </van-row>
        <van-row>
          <van-col span="8" style="text-align: center;">
            客服满意度
          </van-col>
          <van-col span="14">
            <van-rate
                v-model="params.cSMark"
                :size="26"
                color="#ee0a24"
                void-icon="star"
                void-color="#eee"
              />
          </van-col>
        </van-row>
        <van-row>
          <van-col span="8" style="text-align: center;">
            购物便捷度
          </van-col>
          <van-col span="14">
            <van-rate
                v-model="params.shopMark"
                :size="26"
                color="#ee0a24"
                void-icon="star"
                void-color="#eee"
              />
          </van-col>
        </van-row>
      </van-cell>
      <div class="main-title" v-if="serviceShopInfo">服务店满意度</div>
      <van-cell v-if="serviceShopInfo">
      <!-- <van-cell> -->
        <van-cell>
          <van-row style="padding: 20px 0;">
            <van-row gutter="10" class="mb10" type="flex" align="center" justify="space-around">
              <van-col :span="4" style="margin-right: 20px;">
                <van-image fit="contain" :src="serviceShopInfo.shopImage || ''" />
              </van-col>
              <van-col :span="20" style="font-size: .35rem;">
                {{serviceShopInfo.name}}
                <br>
                {{serviceShopInfo.address}}
              </van-col>
            </van-row>
          </van-row>
          <van-field
            v-model="params.shopReviewInfo.content"
            rows="5"
            autosize
            type="textarea"
            class="comment-textarea"
            placeholder="亲，请填写您对服务店的感受吧！"
          />
          <div class="upload-wrap">
            <van-uploader v-model="serveFileList" multiple :max-count="3" />
          </div>
        </van-cell>

        <van-row type="flex" align="center" justify="space-around" style="text-align: center;margin-bottom: 10px;padding: 20px 0;">
          <van-col span="6" @click="params.shopReviewInfo.commentType = 1">
            <img class="comment-pic" style="transform: scale(1.1)" :src="r1" :class="{light: params.shopReviewInfo.commentType == 1}" alt="">
            <span :class="{light: params.shopReviewInfo.commentType == 1}">好评</span>
          </van-col>
          <van-col span="6" @click="params.shopReviewInfo.commentType = 2">
            <img class="comment-pic" :src="r2" :class="{light: params.shopReviewInfo.commentType == 2}" alt="">
            <span :class="{light: params.shopReviewInfo.commentType == 2}">中评</span>
          </van-col>
          <van-col span="6" @click="params.shopReviewInfo.commentType = 3">
            <img class="comment-pic" :src="r3" :class="{light: params.shopReviewInfo.commentType == 3}" alt="">
            <span :class="{light: params.shopReviewInfo.commentType == 3}">差评</span>
          </van-col>
        </van-row>
        <van-row>
          <van-col span="8" style="text-align: center;">
            服务态度
          </van-col>
          <van-col span="14">
            <van-rate
                v-model="params.shopReviewInfo.serviceScore"
                :size="26"
                color="#ee0a24"
                void-icon="star"
                void-color="#eee"
              />
          </van-col>
        </van-row>
        <van-row>
          <van-col span="8" style="text-align: center;">
            技术水平
          </van-col>
          <van-col span="14">
            <van-rate
                v-model="params.shopReviewInfo.techScore"
                :size="26"
                color="#ee0a24"
                void-icon="star"
                void-color="#eee"
              />
          </van-col>
        </van-row>
        <van-row>
          <van-col span="8" style="text-align: center;">
            店内环境
          </van-col>
          <van-col span="14">
            <van-rate
                v-model="params.shopReviewInfo.envirScore"
                :size="26"
                color="#ee0a24"
                void-icon="star"
                void-color="#eee"
              />
          </van-col>
        </van-row>
      </van-cell>
    </van-cell-group>
    <!-- <div style="position: fixed;bottom: 0;width: 100%;background: #fff;"> -->

    <van-button
      style="width: 90%;margin: 1rem auto;"
      block
      round
      type="danger"
      @click="onClickRight"
    >发表评价</van-button>
    <!-- </div> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      r1: require("../../assets/img/r1.png"),
      r2: require("../../assets/img/r2.png"),
      r3: require("../../assets/img/r3.png"),
      fileList: [],
      serveFileList: [],
      message: "",
      detail: {},
      serviceShopInfo: {
        shopImage: '',
      },
      params: {
        saleOrderId: "",
        logisticsMark: 5, //物流评分,
        cSMark: 5, //客服评分,
        shopMark: 5, //购物评分,
        // (门店评分)
        shopReviewInfo: {
          serviceShopId: "", //门店id
          content: "", //评价内容
          commentType: 1, //1
          serviceScore: 5, //服务态度,
          envirScore: 5, //店面环境,
          techScore: 5 //技术水平
        },
        // (商品评价)
        itemReviewList: [
          {
            itemId: "", //商品id,
            itemMark: 5, //商品评分,
            content: "" //评价内容
          }
        ]
      }
    };
  },
  computed: {
    rateText() {
      switch (this.params.itemReviewList[0].itemMark) {
        case 1:
          return "非常差";
        case 2:
          return "差";
        case 3:
          return "一般";
        case 4:
          return "好";
        case 5:
          return "非常好";
      }
    }
  },
  mounted() {
    this.params.saleOrderId = this.$route.query.orderId;
    this.getDetail();
  },
  methods: {
    uploadImg(file,detail){
      // debugger
      // file.file.name = '123.png'
      // console.log(this.fileList)
      //   $.post("//app.yangche51.com/6_1/usercenter/order_2/submitorderreviewinfo_1_1.ashx?luser=25619357_25BCFCEB637CEC440E22AA7CCFE5FB11", data, {
      //   headers: {
      //     "Content-Type": "multipart/form-data"
      //   }
      // })
    },
    getDetail() {
      this.$http
        .post("Order/CreateOrder/GetOrderDetail", {
          orderId: this.$route.query.orderId
        })
        .then(res => {
          // this.detail = res.data.Body.autos[0].packages[0].items[0];
          res.data.Body.autos[0].packages[0].items.forEach(v=>{
            v.itemMark = 5;
            v.content = ''
          })
          this.params.itemReviewList = res.data.Body.autos[0].packages[0].items;
          this.serviceShopInfo = res.data.Body.serviceShopInfo;
          if(this.serviceShopInfo){
            this.params.shopReviewInfo.serviceShopId = this.serviceShopInfo.serviceShopId
          }else{
            this.params.shopReviewInfo.serviceShopId = 0
          }
        });
    },
    onClickLeft() {
      history.go(-1);
    },
    onClickRight() {
      console.log(this.fileList)
      var data = new FormData()
      this.fileList.forEach((v,k)=>{
        v.forEach((j,i) => {
          data.append('image', j.file, `${k}_${i+1}.${j.file.name.split('.')[1]}`)
        })
      })
      this.serveFileList.forEach((v,k)=>{
        // data.append('image', v.file, `${this.params.shopReviewInfo.serviceShopId}_${k+1}.${v.file.name.split('.')[1]}`)
        data.append('image', v.file, `shopImgs_${k+1}.${v.file.name.split('.')[1]}`)
      })
      data.append('reviewInfo',JSON.stringify(this.params))
      $.ajax({
        url: '//app.yangche51.com/6_1/usercenter/order_2/submitorderreviewinfo_1_1.ashx?luser=25619357_25BCFCEB637CEC440E22AA7CCFE5FB11',
        type: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        success: (res) => {
          this.$toast(res.result.msg)
          if(!res.result.errCode){
            history.go(-1)
          }
        }
      })
      // $.post(
      //   "//app.yangche51.com/6_1/usercenter/order_2/submitorderreviewinfo_1_1.ashx?luser=25619357_25BCFCEB637CEC440E22AA7CCFE5FB11",
      //   {
      //     reviewInfo: this.params
      //   }
      // ).then(res => {
      //   if (res.header.statusCode == 200) {
      //     this.$toast("评价成功");
      //     history.go(-1);
      //   }
      // });
    }
  }
};
</script>
<style lang="less" scoped>
.comment {
  .main-title{
    margin: 10px 20px;
    font-size: 14px;
    color: #8C8B8B;
  }
  .van-nav-bar__text {
    color: #ff0015;
    font-size: 16px;
  }
  .upload-wrap {
    padding: 20px 0;
  }
  .comment-textarea {
    background: #e9e9e9;
    border-radius: 5px;
  }
  /deep/ .van-uploader__upload {
    background: #e9e9e9;
  }
  /deep/ .van-cell-group{
    background: transparent;
  }
  .comment-pic{
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    filter: grayscale(100%);
    width: 30%;
    margin-right: 10px;
  }
  .light{
    filter: grayscale(0);
    color: #d81e06;
  }
}
</style>