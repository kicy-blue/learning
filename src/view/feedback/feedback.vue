<template>
  <div class="feedback">
    <van-nav-bar
      class="mb10"
      title="意见反馈"
      right-text="发送"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <van-cell-group>
      <van-field v-model="msg" rows="5" autosize type="textarea" placeholder="你的意见对我们至关重要！" />
    </van-cell-group>
  </div>
</template>
<style lang="less" scoped>
.feedback{
  .van-nav-bar__text {
    color: #ff0015;
    font-size: 16px;
  }
}
</style>
<script>
export default {
  data() {
    return {
      msg: ""
    };
  },
  methods: {
    onClickLeft() {
      history.go(-1);
    },
    onClickRight() {
      if(!this.msg){
        this.$toast('反馈内容不能为空')
        return;
      }
      $.post('//app.yangche51.com/6_1/usercenter/sysmessage/getfeedback_1_0.ashx?luser=25619357_25BCFCEB637CEC440E22AA7CCFE5FB11',{
        content: this.msg
      }).then(res => {
        if(res.header.statusCode == 200){
          this.msg = '';
          this.$toast('反馈成功')
          history.go(-1)
        }
      })
      
    }
  }
};
</script>>