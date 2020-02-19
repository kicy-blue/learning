<template>
  <div class="set-system">
   <!-- <van-sticky class="mb10">
      <van-nav-bar sticky title="修改昵称" left-arrow @click-left="onClickLeft" />
    </van-sticky> -->
    <van-cell-group>
      <van-field v-model="value" placeholder="请输入昵称" clearable />
    </van-cell-group>
      <div class="tip">支持英文、数字、汉字，不超过10个字</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: '',
    };
  },
  created() {
  	const {name} = this.$route.params;
	this.value = name;
  },
  methods: {
    onClickLeft() {
      history.go(-1);
    }
  }
};
</script>
<style lang="less" scoped>
.set-system {
  .van-nav-bar__text {
    color: #323233;
  }
  .login-out {
    display: block;
    text-align: center;
    line-height: 50px;
    height: 50px;
  }
  .tip{
    background: #f8f8f8;
    font-size: 12px;
    padding: 5px 15px;
  }
}
</style>