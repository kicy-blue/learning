<template>
  <div class="detail-bottom">
    <van-row type="flex" justify="end" align="center">
      <van-col span="2">
        <!-- <img :src="worker" alt=""> -->
        <!-- <router-link :to="{name: 'question'}"> -->
          <a href="https://kf1.xuxw.top/addons/kefu/index/mobile?fixed_csr=0">
            <van-image fit="contain" :src="worker" />
          </a>
        <!-- </router-link> -->
      </van-col>
      <van-col span="16" style="display: flex;align-items: center;">
        <van-row type="flex" align="center" style="flex-wrap: wrap;text-align: right;margin-right: 10px;font-size: 14px;color: #8C8B8B;width: 100%">
          <van-col :span="24" style="flex: 0 0 auto;">
            {{selectProject}}项合计：
            <span class="c-danger" style="font-size: 18px;font-weight: bold;">￥{{total}}</span>
          </van-col>
          <van-col :span="24" style="flex: 0 0 auto;">不包含安装费</van-col>
        </van-row>
      </van-col>
      <van-col span="6">
        <van-button round type="danger" @click="toPay">去结算</van-button>
      </van-col>
    </van-row>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: String,
      default: '0'
    },
    selectProject: {
      default: '0'
    },
  },
  data() {
    return {
      worker: require("../../assets/img/worker.png")
    }
  },
  methods: {
    toPay(){
      this.$emit('toPay')
    }
  }
};
</script>

<style lang="less" scoped>
.detail-bottom {
  background: #fff;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 10px;
  z-index: 999;
}
</style>