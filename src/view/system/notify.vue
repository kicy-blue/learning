<template>
  <div class="page-discount">
      <van-nav-bar
      title="系统消息"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-panel v-for="(item,index) of list" :key="index" :title="item.title" :desc="item.msgContent">
      <div slot="default" style="font-size: 12px;text-align: right;padding: 5px 15px;color: #969799;">{{item.sendTime}}</div>
    </van-panel>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: []
    };
  },
  mounted() {
    this.getData()
  },
  methods: {
      getData(){
          $.post('//app.yangche51.com/6_1/usercenter/sysmessage/getsysmsglist_1_0.ashx?luser=25619357_25BCFCEB637CEC440E22AA7CCFE5FB11').then(res => {
            this.list = res.body
          })
      },
    onClickLeft() {
      history.go(-1);
    },
  }
};
</script>
<style lang="less" scoped>

</style>