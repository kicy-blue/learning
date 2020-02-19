<template>
  <div class="page-select">
    <!--<van-sticky>-->
    <van-nav-bar sticky title="选择保养项目" left-arrow @click-left="onClickLeft" />
    <van-tabs v-model="active" animated sticky>
      <van-tab :title="'更换项（'+resultA.length+'/'+listAl+'）'">
        <div class="select-main">
          <van-pull-refresh v-model="onLoading" @refresh="onRefresh">
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
              class="list-box"
            >
              <van-cell
                v-if="listA!=''"
                class="order-item"
                v-for="(item,index) of listA.projects"
                style=" margin-bottom: 10px;
padding: 0;border-radius: 5px;overflow: hidden;"
                :key="index"
              >
                <van-row class="order-item-top" :gutter="10">
                  <van-col span="5" style="color: #7D7D7D;">
                    <van-image fit="contain" :src="item.projectImage" />
                  </van-col>
                  <van-col span="16">
                    {{item.projectName}}
                    <br />
                    <span class="u-color-gray" style="font-size: 12px;">{{item.projectRate}}</span>
                  </van-col>
                  <van-col span="3">
                    <van-checkbox-group v-model="resultA">
                      <van-checkbox :name="item. projectId" checked-color="#07c160"></van-checkbox>
                    </van-checkbox-group>
                  </van-col>
                </van-row>
                <van-row class="order-item-bottom" :gutter="10">
                  <van-col :span="22">{{item.matchMessage||"暂无"}}</van-col>
                  <van-col :span="2">
                    <van-icon name="ellipsis" />
                  </van-col>
                </van-row>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
      <van-tab :title="'检测项目（'+resultB.length+'/'+listBl+'）'">
        <div class="select-main">
          <van-pull-refresh v-model="onLoading" @refresh="onRefresh">
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
              class="list-box"
            >
              <van-cell
                v-if="listB!=''"
                class="order-item"
                v-for="(item,index) of listB.projects"
                :key="index"
              >
                <van-row class="order-item-top" :gutter="10">
                  <van-col span="5" style="color: #7D7D7D;">
                    <van-image fit="contain" :src="item.projectImage" />
                  </van-col>
                  <van-col span="16">
                    {{item.projectName}}
                    <br />
                    <span class="u-color-gray" style="font-size: 12px;">{{item.projectRate}}</span>
                  </van-col>
                  <van-col span="3">
                    <van-checkbox-group v-model="resultB">
                      <van-checkbox :name="item. projectId" checked-color="#07c160"></van-checkbox>
                    </van-checkbox-group>
                  </van-col>
                </van-row>
                <van-row class="order-item-bottom" :gutter="10">
                  <van-col :span="22">{{item.matchMessage||"暂无"}}</van-col>
                  <van-col :span="2">
                    <van-icon name="ellipsis" />
                  </van-col>
                </van-row>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
      <van-tab :title="'养护项（'+resultC.length+'/'+listCl+'）'">
        <div class="select-main">
          <van-pull-refresh v-model="onLoading" @refresh="onRefresh">
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
              class="list-box"
            >
              <van-cell
                v-if="listC!=''"
                class="order-item"
                v-for="(item,index) of listC.projects"
                :key="index"
              >
                <van-row class="order-item-top" :gutter="10">
                  <van-col span="5" style="color: #7D7D7D;">
                    <van-image fit="contain" :src="item.projectImage" />
                  </van-col>
                  <van-col span="16">
                    {{item.projectName}}
                    <br />
                    <span class="u-color-gray" style="font-size: 12px;">{{item.projectRate}}</span>
                  </van-col>
                  <van-col span="3">
                    <van-checkbox-group v-model="resultC">
                      <van-checkbox :name="item. projectId" checked-color="#07c160"></van-checkbox>
                    </van-checkbox-group>
                  </van-col>
                </van-row>
                <van-row class="order-item-bottom" :gutter="10">
                  <van-col :span="22">{{item.matchMessage||"暂无"}}</van-col>
                  <van-col :span="2">
                    <van-icon name="ellipsis" />
                  </van-col>
                </van-row>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
    </van-tabs>
    <!--</van-sticky>-->
    <a
      class="select-btn"
      href="javascript:;"
      @click="submit"
    >确定（{{resultA.length+resultB.length+resultC.length}}）</a>
  </div>
</template>
<script>
export default {
  data() {
    return {
      carCon: "",
      maintain: [], //数据
      listA: [], //全部数据
      listB: [], //全部数据
      listC: [], //全部数据
      listAl: 0,
      listBl: 0,
      listCl: 0,
      resultA: [], //已选择数据
      resultB: [], //已选择数据
      resultC: [], //已选择数据
      active: 0,
      onLoading: false,
      loading: false,
      finished: true,
      subList: "",
      homeQuery: this.$route.query.data
    };
  },
  created() {
    if (localStorage.getItem("YC51_Web_Auto")) {
      this.carCon = JSON.parse(localStorage.getItem("YC51_Web_Auto"));
    } else {
      this.carCon = "";
    }
    this.content();
  },
  methods: {
    onClickLeft() {
      history.go(-1);
    },
    onRefresh() {
      setTimeout(() => {
        this.$toast("刷新成功");
        this.onLoading = false;
      }, 500);
    },
    onClickLeft() {
      history.go(-1);
    },
    onLoad() {},
    submit() {
      var list = [];
      this.listA.projects.forEach((v,k)=>{
        if(this.resultA.includes(v.projectId)){
          list.push({
            parts: v.parts,
            projectId: v.projectId
          });
        }
      })
      this.listB.projects.forEach((v,k)=>{
        if(this.resultB.includes(v.projectId)){
          list.push({
            parts: v.parts,
            projectId: v.projectId
          });
        }
      })
      this.listC.projects.forEach((v,k)=>{
        if(this.resultC.includes(v.projectId)){
          list.push({
            parts: v.parts,
            projectId: v.projectId
          });
        }
      })
      
      localStorage.setItem("projectInfo", JSON.stringify(list));
      this.$router.push({
        name: "keep-buy",
        query: {
          data: this.homeQuery
        }
      });
    },
    //获取页面数据
    content() {
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

      console.log(projectInfo)
      var data = {
        contextData: localStorage.getItem("contextData"),
        autoModelSubId: this.carCon.s,
        tempMaintainInfo: "",
        resultType: 0,
        onRoadTime: "",
        projectInfo: projectInfo,
        // [
          // { projectId: 7, parts: [48] },
          // { projectId: 9, parts: [12] }
        // ],
        year: this.carCon.y,
        nowMileage: this.carCon.mi,
        autoParams: []
      };
      this.isLoading = true;
      this.$http.post("auto/auto/MaintainProject", data).then(response => {
        this.isLoading = false;
        this.maintain = response.data.Body.maintain;
        sessionStorage.setItem("modifyData", response.data.Body.requestData);

        if (response.data.Body.maintain[0]) {
          this.listA = response.data.Body.maintain[0];
          this.listAl = response.data.Body.maintain[0].projects.length;

          this.listA.projects.forEach((v,k)=>{
            if(v.isChecked == 1){
              this.resultA.push(v.projectId)
            }
          })
        } else {
          this.listA = [];
          this.listAl = 0;
        }
        if (response.data.Body.maintain[1]) {
          this.listB = response.data.Body.maintain[1];
          this.listBl = response.data.Body.maintain[1].projects.length;

          this.listB.projects.forEach((v,k)=>{
            if(v.isChecked == 1){
              this.resultB.push(v.projectId)
            }
          })
        } else {
          this.listB = [];
          this.listBl = 0;
        }
        if (response.data.Body.maintain[2]) {
          this.listC = response.data.Body.maintain[2];
          this.listCl = response.data.Body.maintain[2].projects.length;

          this.listC.projects.forEach((v,k)=>{
            if(v.isChecked == 1){
              this.resultC.push(v.projectId)
            }
          })
        } else {
          this.listC = [];
          this.listCl = 0;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.page-select {
  padding-bottom: 40px;
  .select-main {
    // margin-top: 60px;
  }
  .list-box {
    padding: 10px;
  }
  .order-item {
    margin-bottom: 10px;
    padding: 0;
    border-radius: 5px;
    overflow: hidden;
  }
  .order-item-top {
    padding: 10px;
  }
  .order-item-bottom {
    padding: 5px 10px;
    background: #dfdfdf;
    color: #fff;
    line-height: 30px;
  }
  .select-btn {
    display: block;
    text-align: center;
    background: #ff0015;
    color: #fff;
    font-size: 18px;
    line-height: 50px;
    position: fixed;
    bottom: 0;
    width: 100%;
  }
}
</style>