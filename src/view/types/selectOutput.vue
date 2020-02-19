<template>
    <div>
        <div class="topTabBox">
            <van-nav-bar title="车型选择" :border="false" left-arrow  @click-left="back"/>
            <div class="topTitle" >
                <span>{{selectMapA}}</span>
                <span> > {{selectMapB}}</span>
                <!-- <span v-if="now>=4"> > {{selectMapC.valueName}}</span>
                <span v-if="now>=5"> > {{selectMapD.valueName}}</span> -->
            </div>
        </div>
        <div class="cenBox">
            <div class="output-container">
                <div class="left">
                    <div style="padding: 5px 20px;">排量</div>
                    <van-sidebar v-model="curOutput" @change="changeOutout">
                        <van-sidebar-item v-for="(outputItem,index) of outputList" :key="index" :title="outputItem.autoModelSubName" />
                    </van-sidebar>
                </div>
                <div class="right">
                    <!-- <div>
                        <div style="padding: 10px 20px;">排量</div>
                        <van-cell v-for="(item,index) of optionItems" :key="index" :title="item.autoAreaName" @click="toNext(item.valueId,item.valueType,item.autoAreaName)" />
                    </div> -->
                    <van-list v-model="loading2"
                    :finished="finished"
                    finished-text="没有更多了">
                        <div>
                            <div v-for="(item,index) of mainList" :key="index">
                                <van-index-anchor :index="item.year" />
                                <van-cell v-for="(items,indexs) of item.autoModelArray" :key="indexs" :title="items.autoModelName" @click="typesF(items,item)" />
                            </div>
                        </div>
                    </van-list>
                </div>
            </div>
        </div>
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
                curOutput: 0,
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
                mainList: [],
                loading2: false,
            };
        },
        mounted: function() {
            // this.typesB();
//            console.log(this.id);
            this.selectMapA = this.$route.query.selectMapA;
            this.selectMapB = this.$route.query.selectMapB;
            this.getOutputList();
        },
        methods: {
            back(){
                this.$router.go(-1);
            },
            getOutputList(){
                $.post('//app.yangche51.com/6_1/car/getautomodelsublist_1_0.ashx',{
                    mainAutoModelId: this.$route.query.id
                }).then((response)=>{
                    // var data={
                    //     "contextData":JSON.stringify(response.data.Body),
                    //     "valueId":this.id1,
                    //     "valueType":"1"
                    // };
                    // this.isLoading = true;
                    // this.$http.post('auto/auto/autoOption',data).then((response)=>{
                    //     this.isLoading=false;
                    //     this.BodyA=response.data.Body;
                        this.outputList=response.body;
                        this.getList(this.outputList[0].autoModelSubIds)
                    //     this.selectMapA=response.data.Body.selectMap[0];
                    // })
                })
            },
            getList(id){
                this.mainList = []
                this.finished = false
                this.loading2 = true
                $.post('//app.yangche51.com/6_1/car/getyearandmodel_1_0.ashx',{
                    autoModelSubIds: id
                }).then((res)=>{
                    this.loading2 = false
                    this.finished = true
                    this.mainList = res.body;
                    console.log(this.mainList)
                })
            },
            changeOutout(index){
                this.getList(this.outputList[index].autoModelSubIds);
                console.log(this.curOutput)
            },
            //获取结束
            typesF(item,parentItem){
                this.year = parentItem.year
                this.autoBrandName=this.selectMapA;
                this.autoModelName=item.autoModelName;
                this.autoModelSubName=this.outputList[Number(this.curOutput)].autoModelSubName

                this.s = item.autoModelSubId
                this.n = `${this.autoBrandName} ${this.autoModelName} ${this.autoModelSubName}${this.year}`
                this.goNext(item.id)
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
                    autoPic: localStorage.getItem('autoPic'),
                    AutoBrandName: this.selectMapA,
                    MAutoModelName: this.selectMapB,
                    AutoModelName: this.autoModelName
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
                    // this.$router.push({
                    //     name: 'manCar'
                    // });
                    history.go(-3)

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
            height: calc(100vh - 100px);
            overflow: auto;
        }
    }
</style>

