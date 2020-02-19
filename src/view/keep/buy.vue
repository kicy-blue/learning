<template>
  <div class="detail2">
    <div class="detail-top-wrap">
      <van-sticky>
        <van-nav-bar class="detail-top" :border="false" sticky left-arrow @click-left="onClickLeft()">
          <div slot="title" class="over">{{carCon.n}}</div>
          <van-icon :name="tocar" slot="right" @click="changeCar"/>
        </van-nav-bar>
      </van-sticky>
      <van-row type="flex" justify="center" style="color: #fff;margin-top: 20px;font-size: 14px;" :gutter="20">
        <van-col>
          <van-row :gutter="10">
            <van-col>
              <van-image width="40" height="40" :src="setPic" />
            </van-col>
            <van-col>
              <div>更换{{selectProject}}个项目</div>
              <div>
                里程：
                <van-field class="input-box" v-model="value" placeholder="请输入" maxlength="7" @input="over"/>公里
                <van-image width="14" height="14" :src="editPic" />
              </div>
            </van-col>
          </van-row>
        </van-col>
        <van-col>
          <router-link class="more-item" :to="{name: 'keep-select',query: {data: homeQuery}}">更多保养项目</router-link>
        </van-col>
      </van-row>
    </div>
    <div class="detail-part">
      <!-- <van-row class="order-item-top" :gutter="10">
        <van-col span="5" style="color: #7D7D7D;">
          <van-image fit="contain" src="https://img.yzcdn.cn/vant/cat.jpeg" />
        </van-col>
        <van-col span="16">
          机油／轮滑油
          <br />
          <span class="u-color-gray" style="font-size: 12px;">5000km或6个月／次</span>
        </van-col>
        <van-col span="3">
          <van-checkbox v-model="checked" checked-color="#07c160"></van-checkbox>
        </van-col>
      </van-row>-->
      <div class="detail-best mb10"  v-for="(item,index) of maintain" :key="index"  v-show="maintain[index].projects!=''">
        <van-cell v-for="(items,indexs) of item.projects" :key="indexs">
          <van-row class="part-title" type="flex" justify="space-between" :gutter="5">
            <!-- <van-col> -->
            <van-col span="3" style="color: #7D7D7D;">
              <van-image fit="contain" :src="items.projectImage" />
            </van-col>
            <van-col span="15">
              {{items.projectName}}
              <br />
              <span class="title-desc">{{items.projectRate}}</span>
            </van-col>
            <!-- </van-col> -->
            <van-col span="5">
              <div style="display: flex;" v-if="result.indexOf(index+''+indexs)==-1">
                <a class="edit-link" href="javascript:;">编辑</a>
                <van-checkbox-group v-model="result">
                  <van-checkbox style="margin-left: 5px;" :name="index+''+indexs" @click="now()" checked-color="#07c160"></van-checkbox>
                </van-checkbox-group>
              </div>
              <div v-else style="text-align: right;" @click="nowEnd(index+''+indexs)">
                <a class="edit-link" href="javascript:;">完成</a>
              </div>
            </van-col>
          </van-row>

          <div class="serve-part mt10" v-for="(itemss,indexss) of items.items" :key="indexss">
            <van-row gutter="15" class="mb20">
              <van-col span="7">
                <van-image fit="contain" :src="itemss.itemImage" />
              </van-col>
              <van-col span="17">
                <div class="van-multi-ellipsis--l2 mb10">{{itemss.itemName}}</div>
                <van-row class="mb10">
                  <!--<van-tag round plain type="success">xxxx</van-tag>-->
                  <!--<van-tag round plain type="success">xxxx</van-tag>-->
                  <!--<van-tag round plain type="success">xxxx</van-tag>-->
                </van-row>
                <van-row class="mb10">
                  <van-col :span="16" class="c-danger" style="font-weight: bold;">¥ {{(itemss.itemPrice/100).toFixed(2)}}</van-col>
                  <van-col :span="8" class="align-r" style="color: #7D7D7D;">x{{itemss.itemNumber}}</van-col>
                </van-row>
                <!-- <van-row class="size-s">
                  参考用量：3.6L 您也可以
                  <span class="c-danger">添加1L装</span>
                </van-row> -->
              </van-col>
            </van-row>
            <van-row gutter="15" class="mb20" type="flex" align="center" v-show="result.indexOf(index+''+indexs)!=-1">
              <van-col span="7">
                <van-image fit="contain" :src="itemss.itemImage" />
              </van-col>
              <van-col span="10">
                <div class="mb10 size-s">
                  <van-stepper v-model="itemss.itemNumber" button-size="32px" integer />
                </div>
              </van-col>
              <van-col span="7">
                <van-row type="flex" justify="center" :gutter="10">
                  <van-col>
                    <a class="u-color-gray" @click="conNum(index,indexs,indexss,1)">删除</a>
                  </van-col>
                  <van-col>
                    <a style="color: #000" @click="conNum(index,indexs,indexss,0)">更换</a>
                  </van-col>
                </van-row>
              </van-col>
            </van-row>
          </div>
        </van-cell>
      </div>
      
      <router-link class="more" :to="{name: 'keep-select',query: {data: homeQuery}}">更多保养项目</router-link>
    </div>
    <orderBottom :total="total" @toPay="toPay" :selectProject="selectProject"></orderBottom>
  </div>
</template>

<script>
import footerTabbar from "Components/footer/footer";
import orderBottom from "Components/order/orderBottom";
export default {
  data() {
    return {
      carCon:"",
      type:this.$route.query.type,//从哪里进入
      lcCen:JSON.parse(localStorage.getItem('YC51_Web_Auto')),
      total:"",//支付金额
      selectProject:"",//多少项
      totalProject:"",//多少个
      result:[],//是否编辑
      maintain:"",//数据
      iconIn: require("../../assets/img/ico-msg.png"),
      activeNames: ["1"],
      value: "",//里程
      value1: "",
      checked: true,
      option1: [
        { text: "车型1", value: 0 },
        { text: "车型2", value: 1 },
        { text: "车型3", value: 2 }
      ],
      editPic: require("../../assets/img/edit.png"),
      setPic: require("../../assets/img/set.png"),
      tocar: require("../../assets/img/tocar.png"),
      homeQuery: this.$route.query.data
    };
  },
  components: {
    footerTabbar,
    orderBottom
  },
  created(){
    
    if(localStorage.getItem('YC51_Web_Auto')){
      this.carCon=JSON.parse(localStorage.getItem('YC51_Web_Auto'))
    }else{
      this.carCon=""
    }
    this.content(this.lcCen.mi)
    this.value=(this.lcCen.mi)
  },
  methods: {
    changeCar(){
      this.$router.push({"name":'manCar'})
    },
    toPay(){
      let keepList = [];
      this.maintain.forEach((v,k) => {
        v.projects.forEach((j,i) => {
          j.items.forEach((item,key)=>{
            let box = {}
            box.itemId = item.itemId
            box.itemName = item.itemName
            box.itemCount = item.itemNumber
            box.itemPrice = item.itemPrice
            box.itemImageUrl = item.itemImage
            box.itemUnit = item.itemUnitsNumber
            keepList.push(box)
          })
        })
      })
      console.log(keepList)
      sessionStorage.setItem('keepList',JSON.stringify(keepList))
      this.$router.push({
        name: 'order-confirm-keep'
      })
    },
    onClickLeft(e){
      if(this.type=="home"){
        history.go("-1");
      }else{
        history.go("-2");
      }

    },
    over(){
      this.carCon.mi=this.value||0;
      localStorage.setItem('YC51_Web_Auto',JSON.stringify(this.carCon))
    },
    //获取页面数据
    content(){
      let projectInfo = []
      if(localStorage.getItem('projectInfo')){
        projectInfo = JSON.parse(localStorage.getItem('projectInfo'))
      }else{
        let item = this.homeQuery.split('|');
        item.forEach((v,k) => {
          let arr = v.split('_')
          projectInfo[k] = {}
          projectInfo[k].projectId = arr[0]
          projectInfo[k].parts = arr[1].split(',')
        })
      }
      var data={
        contextData:localStorage.getItem('contextData'),//请求上下文
        autoModelSubId:this.carCon.s,//车型id
        tempMaintainInfo:"",
        resultType:2, //返回类型0只有项目，1附带推荐配件信息，2自定义服务项目配件信息
        onRoadTime:"",//上路时间
        projectInfo: projectInfo,//保养项目(缓存)
        year:this.carCon.y,//年份 //车型生产年份
        nowMileage:this.carCon.mi,//里程数
        autoParams:[] //车型参数
      };
      this.isLoading = true;
      this.$http.post('auto/auto/MaintainProject',data).then((response)=>{
        this.isLoading=false;
        this.maintain=response.data.Body.maintain;
        sessionStorage.setItem('modifyData',response.data.Body.requestData);
        this.total=(response.data.Body.totalPrice/100).toFixed(2);
        this.selectProject=response.data.Body.selectProject;
        this.totalProject=response.data.Body.totalProject;
        localStorage.setItem('contextData',response.data.Body.contextData);
      })
    },
    now(){
      if(this.result.length>0){
        this.content()
      }
    },
    nowEnd(item){
      let index = this.result.indexOf(item)
      this.result.splice(index,1)
    },
    //修改/删除
    conNum(idx,idxs,idxss,type){
      console.log(this.maintain[idx].projects[idxs])
      var data={
        contextData:"03cd9171-6f81-4723-b401-0df1c00ffbc1",
        modifyType:type,//1删除 0修改
        items:[
          {
            itemName:this.maintain[idx].projects[idxs].items[idxss].itemName,
            itemNumber:this.maintain[idx].projects[idxs].items[idxss].itemNumber,
            itemPrice:this.maintain[idx].projects[idxs].items[idxss].itemPrice,
            itemId:this.maintain[idx].projects[idxs].items[idxss].itemId,
            itemImage:this.maintain[idx].projects[idxs].items[idxss].itemImage
          },
        ],
        partId:this.maintain[idx].projects[idxs].items[idxss].partId,
        projectId:this.maintain[idx].projects[idxs].projectId
      };
      this.isLoading = true;
      this.$http.post('auto/auto/modifyProjectItem',data).then((response)=>{
        console.log(response)
        this.isLoading=false;
        this.maintain=response.data.Body.maintain;
        this.total=(response.data.Body.totalPrice/100).toFixed(2);
        this.selectProject=response.data.Body.selectProject;
        this.totalProject=response.data.Body.totalProject;
      })
    },
  }
};

</script>

<style lang="less">
.detail {
  .van-hairline--bottom::after {
    width: 0;
  }
}
</style>
<style lang="less" scoped>
  .over{
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    white-space: nowrap;
  }
.detail2 {
  padding-bottom: 60px;
  .van-cell:not(:last-child)::after {
    border: 0;
  }
  .input-box {
    width: 60px;
    background: transparent;
    padding: 0;
    display: inline-block;
    vertical-align: bottom;
    color: #fff;
    /deep/ input {
      color: #fff;
      text-align: center;
    }
    /deep/ input::placeholder {
      color: #fff;
    }
  }
  .title-desc {
    font-size: 12px;
    font-weight: normal;
    color: #8c8b8b;
  }
  .edit-link {
    color: #8c8b8b;
    font-weight: normal;
  }
  .van-nav-bar .van-icon {
    color: #fff;
  }
  .detail-top-wrap {
    height: 140px;
    background: #ff0015;
  }
  .detail-top {
    background: #ff0015;
    color: #fff;
    .van-nav-bar__title {
      color: #fff;
    }
  }
  .more{
    width: 70%;
    margin: 20px auto;
    border-radius: 5px;
    text-align: center;
    line-height: 30px;
    color: #FF0015;
    border: 1px solid #FF0015;
    display: block;
    padding: 5px;
    background: #fff;
  }
  .more-item {
    width: 100%;
    border-radius: 5px;
    text-align: center;
    line-height: 30px;
    color: #fff;
    border: 1px solid #fff;
    display: block;
    padding: 5px;
  }
  .van-card {
    padding: 10px 0;
    border-bottom: 1px solid #d2d2d2;
    background: #fff;
    .van-card__price {
      color: #ff0015;
    }
  }
  .detail-part {
    width: 90%;
    margin: -20px auto 10px;
  }
  .part-title {
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 10px;
    border-bottom: 1px dashed #ccc;
    // margin-bottom: 10px;
  }
  .detail-best {
    background: #fff;
    border-radius: 7px;
    padding: 10px 0;
  }
}
</style>