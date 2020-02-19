<template>
  <div>
    <van-nav-bar
      class="topTab"
      title="更多项目"
      :fixed="true"
      :border="false"
      left-arrow
      @click-left="back"
    />
    <div class="conBox">
      <div v-for="(item,index) of list" :key="index" class="cen">
        <van-checkbox-group v-model="result">
          <van-checkbox :name="item.projectID">
            <img
              slot="icon"
              slot-scope="props"
              class="icn"
              :src="props.checked ? activeIcon : inactiveIcon"
            />
            <div class="cons">
              <div>
                <img :src="item.imageUrl" class="logo" alt />
              </div>
              <div>{{item.projectName}}</div>
            </div>
          </van-checkbox>
        </van-checkbox-group>
      </div>
    </div>
    <van-button
      type="danger"
      size="large"
      style="position: fixed;bottom: 0"
      @click="sub"
    >确定（{{result.length}}）</van-button>
  </div>
</template>

<script>
import { Checkbox, CheckboxGroup } from "vant";
export default {
  components: {},
  data() {
    return {
      list: "", //数据
      result: [], //已选数据
      activeIcon:
        "//c5.yangche51.com/specialresources/images/selfCenter/check.png",
      inactiveIcon:
        "//c5.yangche51.com/specialresources/images/selfCenter/uncheck.png"
      //                id:this.$route.query.id
    };
  },
  mounted: function() {
    //            console.log(this.id);
    console.log(this.result);
  },
  created() {
    this.con();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    con() {
      $.post(
        "//app.yangche51.com/6_1/maintenance/newgetshortcutproject_3_0.ashx",
        {
          type: 1
        }
      ).then(response => {
          console.log(response);
        this.list = response.body;
      });
    },
    sub() {
        console.log(this.result)
        let projectInfo = []
        this.list.forEach( v => {
            if(this.result.includes(v.projectID)){
                let item = v.projectUrl.split('|');
                item.forEach((v,k) => {
                    let arr = v.split('_')
                    let obj = {}
                    obj.projectId = arr[0]
                    obj.parts = arr[1].split(',')
                    projectInfo.push(obj)
                })
            }
        })
        console.log(projectInfo)
        localStorage.setItem("projectInfo", JSON.stringify(projectInfo));
        this.$router.push({ name: "keep-buy" });

    //   var list = [];
    //   console.log(this.result);
    //   for (var i = 0; i < this.result.length; i++) {
    //     for (
    //       var is = 0;
    //       is < this.list[this.result[i]].projectList.length;
    //       is++
    //     ) {
    //       list.push({
    //         parts: this.list[this.result[i]].projectList[is].parts,
    //         projectId: this.list[this.result[i]].projectList[is].projectId
    //       });
    //     }
    //   }
    //   localStorage.setItem("projectInfo", JSON.stringify(list));
    //   this.$router.push({ name: "keep-buy" });
    }
  }
};
</script>

<style scoped>
.topTab {
  background: #ff0015 !important;
}
.van-nav-bar__title,
.van-nav-bar .van-icon {
  color: #fff !important;
}
.conBox {
  margin: 45px 0 50px 0;
  overflow: hidden;
}
.cen {
  float: left;
  width: 24.4%;
  text-align: center;
  position: relative;
  border: 1px solid #eee;
  height: 80px;
}
.cons {
  position: absolute;
  width: 100%;
  left: 0;
  top: 10px;
}
.icn {
  height: 30px;
  position: absolute;
  top: 0;
}
.logo {
  height: 28px;
}
</style>