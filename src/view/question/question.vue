<template>
  <div class="question">
    <div class="question-top">
      <div style="text-align: right;padding: 10px">
        <a href="tel:4009003919">
          <van-icon :name="iconIn" size="24px" />
        </a>
      </div>
      <van-row type="flex" justify="center">
        <van-col span="24" style="text-align: center;">
          <a href="https://kf1.xuxw.top/addons/kefu/index/mobile?fixed_csr=0">
            <img src="../../assets/img/hi.png" style="width:80%" alt="">
          </a>
        </van-col>
      </van-row>
    </div>
    <div class="question-part">
      <div class="question-best mb10">
        <div class="part-title" style="padding: 0;">大家都在问</div>
        <van-row gutter="20" class="question-best-item">
          <!-- <van-col span="8">
            <van-button class="on" round size="small">售后问题</van-button>
          </van-col>-->
          <van-col span="8" v-for="(item,index) of type" :key="index">
            <van-button
              :class="{on: index === curTypeIndex}"
              round
              size="small"
              @click="changeType(index)"
            >{{item.QuestionTypeName}}</van-button>
          </van-col>
        </van-row>
      </div>
      <div class="list-wrap">
        <div class="part-title">帮助中心</div>
        <van-collapse
          @change="getDetail"
          v-model="activeNames"
          v-for="(item,index) of questionList"
          :key="index"
          accordion
        >
          <van-collapse-item :title="item.QuestionTitle" :name="item.QuestionID">
            <span v-html="item.QuestionAnswer"></span>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>
    <footerTabbar></footerTabbar>
  </div>
</template>
<script>
import footerTabbar from "Components/footer/footer";
import axios from "axios";
import { GetQuestionType } from "Services/index.js";
export default {
  data() {
    return {
      iconIn: require("../../assets/img/call.png"),
      activeNames: ["1"],
      type: [],
      curTypeIndex: "",
      questionList: []
    };
  },
  components: {
    footerTabbar
  },
  mounted() {
    this.getType();
    this.getAllList();
  },
  methods: {
    getDetail(id) {
      $.post(
        "//app.yangche51.com/6_1/Qa/GetQuestionDetailByID.ashx",
        {
          QuestionID: id
        },
        (res, status) => {
          this.questionList.forEach((v, k) => {
            if (v.QuestionID == id) {
              // v.detail = res.
              v.QuestionAnswer = res.body.QuestionAnswer;
            }
          });
          console.log(this.questionList);
        }
      );
    },
    changeType(index) {
      this.curTypeIndex = index;
      this.getList(this.type[index].QuestionTypeID);
    },
    async getType() {
      let res = await GetQuestionType();
      this.type = res.data.body;
    },
    getAllList() {
      $.post(
        "//app.yangche51.com/6_1/Qa/GetFrontShowQuestion_Paging.ashx",
        {
          PageNo: 1,
          PageSize: 15
        },
        (res, status) => {
          this.questionList = res.body.QuestionList;
        }
      );
    },
    async getList(id) {
      $.post(
        "//app.yangche51.com/6_1/Qa/GetQuestionListByType.ashx",
        {
          PageNo: 1,
          PageSize: 15,
          QuestionTypeID: id
        },
        (res, status) => {
          this.questionList = res.body.QuestionList;
        }
      );
    }
  }
};
</script>
<style lang="less" scoped>
.question {
  padding-bottom: 60px;
  /deep/ .van-collapse-item__content {
    p {
      margin: 5px 0;
    }
    img {
      max-width: 100%;
    }
  }
  .question-top {
    background: #ff0015;
    padding-bottom: 30px;
  }
  .question-part {
    width: 90%;
    margin: -20px auto 0;
  }
  .part-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
    padding-left: 15px;
    padding-right: 15px;
  }
  .question-best {
    background: #fff;
    border-radius: 7px 7px 0 0;
    padding: 10px 15px;

    .question-best-item {
      .van-button {
        width: 100%;
        margin-bottom: 10px;
        color: #333 !important;
        &.on {
          color: #fff !important;
          background: linear-gradient(
            to right,
            rgb(255, 42, 0),
            rgb(245, 154, 56)
          );
          border: 0px;
        }
      }
    }
  }
  .list-wrap {
    background: #fff;
    border-radius: 7px;
    padding: 10px 0 20px;
    .van-cell {
      padding-left: 0;
      padding-right: 0;
    }
  }
}
</style>