<template>
  <div class="set-system">
    <!-- <van-sticky class="mb10">
      <van-nav-bar sticky title="系统设置" left-arrow @click-left="onClickLeft" />
    </van-sticky> -->
    <van-cell-group class="mb10">
        <!-- <van-cell title="个人信息" is-link/> -->
        <van-cell title="密码管理" is-link :to="{name:'register',params: {type:2}}"/>
        <van-switch-cell v-model="checked" title="推送消息" active-color="#07c160" inactive-color="#ee0a24" />
    </van-cell-group>
    <van-cell-group class="mb10">
      <van-cell title="关于我们" is-link to="about"/>
    </van-cell-group>
    <van-cell-group class="mb10">
      <a href="javascript:;" class="login-out c-danger" @click="loginOut">退出当前账号</a>
    </van-cell-group>
    <van-action-sheet v-model="show">
      <van-area :area-list="areaList" @confirm="confirmArea" @cancel="cancelArea" />
    </van-action-sheet>
  </div>
</template>
<script>
import areaList from "Assets/js/area.js";
import {Toast,Dialog} from 'vant';
export default {
  data() {
    return {
      params: {
        name: "",
        phone: "",
        city: "地区",
        load: "",
        checked: true
      },
      areaList,
      show: false,
      checked: true
    };
  },
  methods: {
    onClickLeft() {
      history.go(-1);
    },
	confirmArea(){},
	cancelArea(){},
	loginOut(){
		
		Dialog.confirm({
		  message: '是否确定注销账户？'
		}).then(() => {
		 this.$http.post('customer/Goldmine/UserLogout').then((red) => {
		 	const {
		 		Body,
		 		Header
		 	} = red.data;
		 	if(Header.ErrorCode==0){
		 	   this.$router.push({
		 	   	name: 'login'
		 	   })
		 	}else{
		 	    const msg = Header.Message || "失败";
		 	    Toast(msg);
		 	}
		 })
		}).catch(() => {
		});
		
	
	}
  }
};
</script>
<style lang="less" scoped>
.set-system {
  .van-nav-bar__text {
    color: #323233;
  }
  .login-out{
      display: block;
      text-align: center;
      line-height: 50px;
      height: 50px;
  }
}
</style>