<template>
        <div>
            <van-nav-bar class="topTab" title="管理车辆"  :border="false" :fixed="true" left-arrow  @click-left="back"/>
                <div class="cenBox">
                       <div v-for="(item,index) of list" :key="index" class="cen">
                           <div class="cen1">
                               <img :src="item.autoPic||Img" alt=""/>
                           </div>
                           <div class="cen2">
                               <div>
                                   <span class="cenTxt1 over">{{item.AutoBrandName}}</span>
                                   <!--<van-tag round type="danger" color="#FF5462">标签</van-tag>-->
                               </div>
                               <div class="cenTxt2 over">{{item.AutoModelName}}</div>
                               <div class="cebBtnBox">
                                   <span @click="Del(item.id)">删除</span>
                                   <span @click="Selected(index,item)" :class="item.isSelected==true?'tSel':'fSel'">{{item.isSelected==true?"已设为默认":"设为默认"}}</span>
                               </div>
                           </div>
                       </div>
                    </div>
            <div class="botBox">
                <div>
                    <van-button type="danger" size="large" :icon=img text="添加爱车" @click="addCar"></van-button>
                </div>
            </div>

        </div>

</template>

<script>
    import {mapGetters} from "vuex";
    import Vue from 'vue';
    import { PullRefresh } from 'vant';
    import { List } from 'vant';
    import { Toast } from 'vant';
    export default {
        components: {

        },
        data() {
            return {
                coock:"",
                Img: require('@/assets/img/car.jpg'),
                list:[],
                loading: false,//底部
                finished: false,//底部
                isLoading: false,//下拉
                img:require("../../assets/img/加号.png"),
                id:this.$route.query.id
            };
        },
        mounted: function() {
        },
        created(){
            this.content()
        },
        methods: {
            back(){
                this.$router.go(-1);//返回上一层
            },
            //数据
            content(){
                var list="";
                var strcookie = document.cookie;//获取cookie字符串
                var arrcookie = strcookie.split("; ");//分割
                // 遍历匹配
                for ( var i = 0; i < arrcookie.length; i++) {
                    var arr = arrcookie[i].split("=");
                    if (arr[0] == "app_ticket"){
                        this.coock=arr[1];
                    }
                }
                $.ajaxSettings.async = false;
                $.get("//app.yangche51.com/6_1/car/mycar/getlistbyuserid_1_0.ashx?luser="+this.coock, function(result){
                    list=result.body;
                });
                $.ajaxSettings.async = true;
                this.list=list;
            },
            //查看详情
            goDetal(autoModelSubId,year,index){
                this.$router.push({"name":'myLoveCar',query:{"autoModelSubId":autoModelSubId,"year":year,"index":index}})
            },
            //删除
            Del(id){
                $.ajaxSettings.async = false;
                $.post("//app.yangche51.com/6_1/car/mycar/delete_1_0.ashx?luser="+this.coock,{"id":id},function(e){
                    Toast('删除成功');
                });
                $.ajaxSettings.async = true;
                this.content()
            },
            //设为默认
            Selected(index,item){
                var list=this.list;
                for(var i=0;i<list.length;i++){
                    if(i==index){
                        list[i].isSelected=true;
                    }else{
                        list[i].isSelected=false;
                    }
                }
                $.ajaxSettings.async = false;
                $.post("//app.yangche51.com/6_1/car/getcar_1_0.ashx?luser="+this.coock,{
                    autoModelSubId: item.autoModelSubId,
                    year: item.year
                }).then(res => {
                        this.$toast('设置成功');
                        let data = res.body.autoModel
                        let arr = []
                        data.carParams.forEach((v,k) => {
                            arr[k] = {}
                            arr[k].k = v.paramTypeId
                            arr[k].v = v.paramValueId
                            arr[k].kn = v.paramTypeName
                            arr[k].vn = v.paramValue
                        })
                        data.carParams = arr
                        var value={
                            ap: data.carParams,//车型参数信息
                            i: "",//车型图片
                            m: 0,//车型月份
                            mi: data.mileage,//当前行驶里程
                            n: data.carName,//车型显示名称
                            rt: data.startYearMonth,//上路时间
                            s: data.autoModelSubId,//车型排量编号
                            sync: true,
                            y: data.year,//车型年份
                            autoPic: data.autoPic,
                            AutoBrandName: data.AutoBrandName,
                            MAutoModelName: data.MAutoModelName,
                            AutoModelName: data.AutoModelName
                        }
                        localStorage.setItem('YC51_Web_Auto',JSON.stringify(value));
                        history.go(-1)
                    }
                );
                $.ajaxSettings.async = true;
                this.content()
            },
            //添加爱车
            addCar(){
                this.$router.push({"name":'types2',query:{"type":10}})
            },
        }
    };
</script>

<style scoped>
    .cenBox{
        margin: 45px 0 65px 0;
    }
    .botBox{
        position: fixed;bottom: 0;background: #F8F8F8;width: 100%;
    }
    .botBox>div{
        padding:5px 20px 10px 20px;
    }
    .cenBox>div{
        overflow: hidden;
    }
    .van-button--large{
        border-radius: 50px;
    }
    .cen{
        background: #fff;border-radius: 5px;margin: 10px;padding: 15px;overflow: hidden;
    }
    .cen1,.cen2{
        float: left;
    }
    .cen1{
        width: 20%;
    }
    .cen1 img{
        height: 40px;
        width: 40px;
    }
    .cen2{
        width: 80%;
    }
    .cen2 div{
        overflow: hidden;
    }
    .cen2 .cenTxt1{
        font-size: 15px;float: left;max-width: 80%;margin-right: 5px;font-weight: bold;color: #282828;
    }
    .cenTxt2{
        font-size: 12px;color: #282828;margin: 10px 0;
    }
    .cebBtnBox{
        text-align: right;
    }
    .cebBtnBox span{
        display: inline-block;border-radius: 20px;border: 1px solid #eee;padding: 0 10px;height: 25px;line-height: 25px;
    }
    .cebBtnBox span:first-child{
        color: #282828;margin-right: 20px;
    }
    .tSel{
        background: #eee;color: #8c8c8c;
    }
    .over{
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        white-space: nowrap;
        max-width: 100%;
    }
</style>