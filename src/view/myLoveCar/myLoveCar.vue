<template>
  <div>
    <van-nav-bar
      title="我的爱车"
      right-text="管理车辆"
      left-arrow
      :border="false"
      :fixed="true"
      @click-left="back"
      @click-right="manCar"
    />
    <div class="cenBox">
      <div class="bgRed"></div>
      <div class="box1">
        <div class="cen">
          <div class="cen1">
            <img :src="con.autoPic||Img" alt />
          </div>
          <div class="cen2">
            <div>
              <div class="cenTxt1 over">{{list.AutoBrandName||"暂无"}} - {{list.MAutoModelName}}</div>
              <!--<van-tag round type="danger" color="#FF5462">标签</van-tag>-->
            </div>
            <div class="cenTxt2 over">{{list.AutoModelName||"暂无"}}</div>
          </div>
        </div>
        <div class="cen">
          <div class="cenBox1">
            <div>
              <div>发动机排量</div>
              <div>{{list.AutoModelSubName||"暂无"}}</div>
            </div>
            <div>
              <div>生产年份</div>
              <div>{{con.year||"暂无"}}</div>
            </div>
          </div>
          <div class="cenBox2">
            <div>车型名称</div>
            <div>{{list.AutoModelName||"暂无"}}</div>
          </div>
          <div class="cenBox1">
            <div>
              <div>行驶里程</div>
              <input style="width: 50px" type="text" v-model.number="mileage" placeholder="0" />KM
              <!-- <div>{{mileage||0}}KM</div> -->
            </div>
            <div @click="selectStartTime">
              <div>上路时间</div>
              <div>{{con.firstTime||"暂无"}}</div>
            </div>
          </div>
        </div>

        <div class="btnBox">
          <van-button type="danger" size="large"  text="保存爱车" @click="saveCar"></van-button>
        </div>
      </div>
    </div>
    <van-action-sheet v-model="show">
        <van-datetime-picker
            v-model="currentDate"
            type="year-month"
            :min-date="minDate"
            :max-date="maxDate"
            :formatter="formatter"
            @confirm="confirm"
            @cancel="cancel"
        />
    </van-action-sheet>
  </div>
</template>

<script>
import axios from "axios";
export default {
  components: {},
  middleware: "auth",
  data() {
    return {
      minDate: new Date(),
      maxDate: new Date(),
      currentDate: new Date(),
      Img: require("@/assets/img/car.jpg"),
      mileage: 0, //里程数
      con: {}, //数据
      list: "", //数据
      img: require("../../assets/img/加号.png"),
      year: '',
      autoModelSubId: '',
      show: false,
      carCon: {},
    };
  },
  mounted: function() {},
  created() {
    this.carCon = JSON.parse(localStorage.getItem('YC51_Web_Auto'))
    this.year = this.carCon.y;
    this.autoModelSubId = this.carCon.s;
    this.content();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    manCar() {
      this.$router.push({ name: "manCar" });
    },
    content() {
      var strcookie = document.cookie; //获取cookie字符串
      var arrcookie = strcookie.split("; "); //分割
      // 遍历匹配
      for (var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split("=");
        if (arr[0] == "app_ticket") {
          this.coock = arr[1];
        }
      }

      var con = "";
      var formData = new FormData();
      formData.append("year", this.year);
      formData.append("autoModelSubId", this.autoModelSubId);
      var url =
        "//app.yangche51.com/6_1/car/mycar/getdetailbyautomodelsubid_1_0.ashx?luser=" +
        this.coock;
      $.ajaxSettings.async = false;
      $.ajax({
        type: "POST",
        url: url,
        data: formData,
        // 告诉jQuery不要去处理发送的数据
        processData: false,
        // 告诉jQuery不要去设置Content-Type请求头
        contentType: false,
        success: (e) => {
          console.log(e.body);
          if(e.header.statusCode == 500){
            this.$toast(e.result.msg)
            return ;
          }
          con = e.body;
          this.con = con;
          this.minDate = new Date(`${this.con.startYearMonth.toString().slice(0,4)}-${this.con.startYearMonth.toString().slice(-2)}`)
          this.maxDate = new Date(`${this.con.endYearMonth.toString().slice(0,4)}-${this.con.endYearMonth.toString().slice(-2)}`)
        }
      });
      $.ajaxSettings.async = true;
      
      
      var list = "";
      $.ajaxSettings.async = false;
      $.get(
        "//app.yangche51.com/6_1/car/mycar/getlistbyuserid_1_0.ashx?luser=" +
          this.coock,
        function(result) {
          list = result.body;
        }
      );
      $.ajaxSettings.async = true;
      list.forEach((v,k)=>{
        if(v.autoModelSubId == this.autoModelSubId){
          this.list = list[k];
        }
      })
      this.getcarmileage();
    },
    //获取里程
    getcarmileage() {
      let data = {
        autoModel: ''
      }
      data.autoModel = JSON.stringify(this.con)
      // data.autoModel = '{"myAutoName":"丰田 锐志 2013款 2.5V 手自一体 尊锐导航版 2.5L 2017年产","id":7510826,"isSelected":true,"autoBrandId":0,"autoModelId":0,"autoModelSubId":118308,"mainAutoModelID":0,"year":2017,"AutoBrandName":"丰田","AutoModelName":"锐志 2013款 2.5V 手自一体 尊锐导航版","AutoModelSubName":"2.5L","MAutoModelName":null,"startYearMonth":0,"endYearMonth":0,"autoPic":"","firstTime":"","month":0,"carName":null,"vinCode":null,"tipMessage":null}'
      var url = "//app.yangche51.com/6_1/car/getcarmileage_1_0.ashx?luser=" + this.coock;
      $.post(
        url,
        data,
        (res, status) => {
          this.mileage = res.body;
          console.log(res);
        }
      );
    },
    //保存爱车
    saveCar() {
      this.con.mileage = this.mileage;
      console.log(this.con.firstTime);
      $.post(
        "//app.yangche51.com/6_1/car/savecartimeandmileage_2_0.ashx?luser=25619357_25BCFCEB637CEC440E22AA7CCFE5FB11",
        {
          firstTime: this.confirm(this.con.firstTime),
          curMileage : this.mileage,
          autoModelSubId: this.con.autoModelSubId,
          year: this.con.year
        },
        (res, status) => {
          this.carCon.mi = this.mileage
          localStorage.setItem('YC51_Web_Auto',JSON.stringify(this.carCon))
          this.$toast("保存成功");
        }
      );
    },
    confirm(val){
        let year = new Date(val).getFullYear();
        let month = new Date(val).getMonth()+1;
        if(month<10){
            month = '0'+month
        }
        this.con.firstTime = `${year}-${month}`
        this.show = false
        return `${year}${month}`
    },
    cancel(){
        this.show = false
    },
    selectStartTime(){
        this.show = true;
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`
      }
      return value;
    }
  }
};
</script>

<style scoped>
.cen > div {
  overflow: hidden;
}
.cenBox1 > div {
  width: 39.5%;
  float: left;
  margin: 15px 0;
  padding: 0 5%;
}
.cenBox1 > div:first-child {
  border-right: 1px solid #d2d2d2;
}
.cenBox1 > div div:first-child,
.cenBox2 div:first-child {
  color: #646464;
  font-size: 15px;
  font-weight: 400;
}
.cenBox1 > div div:last-child,
.cenBox2 div:last-child {
  color: #000;
  font-size: 13px;
  margin-top: 5px;
  font-weight: 400;
}
.cenBox2 {
  border-top: 1px solid #d2d2d2;
  padding: 15px 5%;
  border-bottom: 1px solid #d2d2d2;
}
.bgRed {
  height: 80px;
  position: absolute;
  width: 100%;
  z-index: 0;
  top: 0;
  left: 0;
}
.cenBox {
  margin: 45px 0 30px 0;
  position: relative;
}
.box1 {
  position: relative;
  z-index: 1;
  top: 10px;
  padding: 0 20px;
}
.cen {
  background: #fff;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 5px 10px #ddd;
}
.van-nav-bar,
.bgRed {
  background: #ff0015;
}
.van-nav-bar__title,
.van-nav-bar__text,
.van-nav-bar .van-icon {
  color: #fff;
}
.van-button--large {
  border-radius: 50px;
}
.btnBox {
  width: 50%;
  margin: 50px auto 0 auto;
}
.cen1,
.cen2 {
  float: left;
}
.cen1 {
  width: 20%;
}
.cen1 img {
  height: 40px;
  width: 40px;
}
.cen2 {
  width: 80%;
}
.cen2 .cenTxt1 {
  font-size: 15px;
  max-width: 78%;
  margin-right: 5px;
  font-weight: bold;
  line-height: 1;
  color: #282828;
}
.cenTxt2 {
  font-size: 12px;
  color: #282828;
  margin: 10px 0;
  font-weight: 400;
}
.over {
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  white-space: nowrap;
  max-width: 100%;
}
</style>