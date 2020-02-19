<template>
    <div>
        <div class="topTabBox">
            <van-nav-bar title="车型选择"  :border="false" left-arrow  @click-left="back"/>
            <div class="topTitle" >
                <span>{{selectMapA}}</span>
                <!-- <span v-if="now>=4"> > {{selectMapC.valueName}}</span>
                <span v-if="now>=5"> > {{selectMapD.valueName}}</span> -->
            </div>
        </div>
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了">
            <div class="cenBox">
                <div v-if="now==1||now==2" v-for="(item,index) of optionItems" :key="index">
                    <van-index-anchor :index="item.autoAreaName" />
                    <van-cell v-for="(items,indexs) of item.autoSeries" :key="indexs" :title="items.name" @click="toNext(items.key,items.valueType,items.name)" />
                </div>
            </div>
        </van-list>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import { List } from 'vant';
    import { Toast } from 'vant';
    export default {
        components: {

        },
        data() {
            return {
                curOutput: '',
                outputList: [],
                list:[],
                loading: false,//底部
                finished: false,//底部
                optionItems:"",
                selectMapA:"",
                selectMapB:"",
                selectMapC:"",
                selectMapD:"",
                autoBrandName:"",
                autoModelName:"",
                autoModelSubName:"",
                s:"",
                n:"",
                year:"",
                now:2,
                id1:this.$route.query.id1,
                type:this.$route.query.type,
            };
        },
        mounted: function() {
            this.typesB();
            this.selectMapA = this.$route.query.selectMapA;
//            console.log(this.id);
        },
        methods: {
            changeOutout(index){
                this.typesD(this.outputList[index]['valueId']);
            },
            back(){
                this.$router.go(-1);
            },
            //获取二级分类
            typesB(){
                var data={
                    "contextData":"",
                    "valueId":"0",
                    "valueType":"0"
                };
                this.isLoading = true;
                $.post('//app.yangche51.com/6_1/car/picker/getAutoSeriesList_1_0.ashx',{
                    autoBrandId: this.id1
                }).then((response)=>{
                    this.loading = false;
                    this.finished = true;

                    this.isLoading=false;
                    // var data={
                    //     "contextData":JSON.stringify(response.data.Body),
                    //     "valueId":this.id1,
                    //     "valueType":"1"
                    // };
                    // this.isLoading = true;
                    // this.$http.post('auto/auto/autoOption',data).then((response)=>{
                    //     this.isLoading=false;
                    //     this.BodyA=response.data.Body;
                        this.optionItems=response.body;
                    //     this.selectMapA=response.data.Body.selectMap[0];
                    // })
                })
            },
            //获取三级分类
            typesC(id){
                var data={
                    "contextData":JSON.stringify(this.BodyA),
                    "valueId":id,
                    "valueType":"3"
                };
                this.isLoading = true;
                this.$http.post('auto/auto/autoOption',data).then((response)=>{
                    this.isLoading=false;
                    this.BodyB=response.data.Body;
                    this.optionItems=response.data.Body.optionItems;
                    // this.selectMapB=response.data.Body.selectMap[1];
                    this.outputList = response.data.Body.optionItems
                })
            },
            //获取四级分类
            typesD(id){
                var data={
                    "contextData":JSON.stringify(this.BodyB),
                    "valueId":id,
                    "valueType":"4"
                };
                this.isLoading = true;
                this.$http.post('auto/auto/autoOption',data).then((response)=>{
                    this.isLoading=false;
                    this.BodyC=response.data.Body;
                    this.optionItems=response.data.Body.optionItems;
                    this.selectMapC=response.data.Body.selectMap[2];
                })
            },
            //获取五级分类
            typesE(id){
                var data={
                    "contextData":JSON.stringify(this.BodyC),
                    "valueId":id,
                    "valueType":"6"
                };
                this.isLoading = true;
                this.$http.post('auto/auto/autoOption',data).then((response)=>{
                    this.isLoading=false;
                    this.BodyD=response.data.Body;
                    this.optionItems=response.data.Body.optionItems;
                    this.selectMapD=response.data.Body.selectMap[3];

                })
            },
            //获取结束
            typesF(id,type){
                if(type==0){
                    var contextData=JSON.stringify(this.BodyC);
                    var valueType="6"
                }else{
                    var contextData=JSON.stringify(this.BodyD);
                    var valueType="5"
                }
                var data={
                    "contextData":contextData,
                    "valueId":id,
                    "valueType":valueType
                };
                this.isLoading = true;
                this.$http.post('auto/auto/autoOption',data).then((response)=>{
                    this.isLoading=false;
                    console.log(response)
                    this.s=response.data.Body.autoInfo.autoModelSubId;
                    this.n=response.data.Body.autoInfo.autoBrandName+" "+response.data.Body.autoInfo.autoModelName+" "+response.data.Body.autoInfo.autoModelSubName+""+response.data.Body.autoInfo.year;
                    this.autoBrandName=response.data.Body.autoInfo.autoBrandName;
                    this.autoModelName=response.data.Body.autoInfo.autoModelName;
                    this.autoModelSubName=response.data.Body.autoInfo.autoModelSubName;
                    this.year=response.data.Body.autoInfo.year;
                    this.goNext(id)
                })
            },
            //当前显示分类
            clickNow(e,id){
                if(e==1){
                    this.$router.go(-1);//返回上一层
                    return;
                }
                this.now=e;
                this.toNext(id,e)
            },
            //下一级
            toNext(id,type,name){
                console.log(id,type,name)
                this.now=type;
                this.$router.push({
                    name: 'select-output',
                    query: {
                        id: id,
                        selectMapA: this.selectMapA,
                        selectMapB: name,
                        type: this.type
                    }
                })
                if(type==3){
                    this.typesC(id);
                }
                if(type==4){
                    this.typesD(id);
                }
                if(type==6){
                    if(this.BodyA.selectMap[0].valueId=="S,A,2658"){
                        this.typesF(id,0);
                        return;
                    }
                    this.typesE(id);
                }
                if(type==5){
                    this.typesF(id,1);
                }
            },
            goNext(id){
                var value={
                    ap: [],//车型参数信息
                    i: "",//车型图片
                    m: 0,//车型月份
                    mi: 0,//当前行驶里程
                    n: this.n,//车型显示名称
                    rt: 0,//上路时间
                    s: this.s,//车型排量编号
                    sync: true,
                    y: this.year,//车型年份
                }
                localStorage.setItem('YC51_Web_Auto',JSON.stringify(value));
                localStorage.setItem('contextData',"");
                localStorage.setItem('projectInfo',"");
                if(this.type==0){//更换车型
                    this.$router.push({name: 'home'});
                }
                if(this.type==1){//智能保养
                    this.$router.push({name: 'keep-buy',query:{id:id}});
                }
                if(this.type==2){//小保养
                    this.$router.push({name: 'keep-buy',query:{id:id}});
                }
                if(this.type==3){//大保养
                    this.$router.push({name: 'keep-buy',query:{id:id}});
                }
                if(this.type==4){//更换轮胎
                    this.$router.push({name: 'keep-buy',query:{id:id}});
                }
                if(this.type==5){//更换电瓶
                    this.$router.push({name: 'keep-buy',query:{id:id}});
                }
                if(this.type==6){//更换雨刷器
                    this.$router.push({name: 'keep-buy',query:{id:id}});
                }
                if(this.type==7){//空气滤芯
                    this.$router.push({name: 'keep-buy',query:{id:id}});
                }
                if(this.type==8){//更换防冻液
                    this.$router.push({name: 'keep-buy',query:{id:id}});
                }
                if(this.type==9){//更多项目
                    this.$router.push({name: 'moreDate'});
                }
                if(this.type==10){//添加爱车
                    var strcookie = document.cookie;//获取cookie字符串
                    var arrcookie = strcookie.split("; ");//分割
                    // 遍历匹配
                    for ( var i = 0; i < arrcookie.length; i++) {
                        var arr = arrcookie[i].split("=");
                        if (arr[0] == "app_ticket"){
                            this.coock=arr[1];
                        }
                    }
                    var data={
                            "myAutoName":this.n,
                            "id":0,
                            "isSelected":false,
                            "autoBrandId":0,
                            "autoModelId":0,
                            "autoModelSubId":this.s,
                            "mainAutoModelID":0,
                            "year":this.year,
                            "AutoBrandName":this.autoBrandName,
                            "AutoModelName":this.autoModelName,
                            "AutoModelSubName":this.autoModelSubName,
                            "MAutoModelName":null,
                            "startYearMonth":0,
                            "endYearMonth":0,
                            "autoPic":"",
                            "firstTime":"",
                            "month":0,
                            "carName":null,
                            "vinCode":null,
                            "tipMessage":null,
                    }

                    $.ajaxSettings.async = false;
                    $.post("//app.yangche51.com/6_1/car/savecar_2_0.ashx?luser="+this.coock,{"autoModel":JSON.stringify(data)},function(e){
                        Toast('添加成功');
                    });
                    $.ajaxSettings.async = true;
//                    setTimeout(function(){
                        this.$router.go(-2);//返回上一层
//                    },1000)

                }
            }
        }
    };
</script>
<style scoped lang="less">
    .topTabBox{
        position: fixed;z-index: 2;width: 100%;
    }
    .topTitle{
        color: #fff;font-size: 15px;padding:15px;
    }
    .topTabBox,.van-nav-bar{
        background: #ff0015;
    }
    .van-ellipsis,.van-nav-bar .van-icon{
        color: #fff;
    }
    .cenBox{
        padding-top: 100px;
    }
    .output-container{
        display: flex;
        .left{
            flex: 0 0 auto;
        }
        .right{
            flex: 1;
        }
    }
</style>

