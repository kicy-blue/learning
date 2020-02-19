<template>
    <div>
        <div class="topTabBox">
            <van-nav-bar class="topTab" title="车型选择"  :border="false" left-arrow  @click-left="back"/>
            <div>
                <van-search v-model="value" placeholder="请输入车系名称（如：思域）"/>
            </div>
        </div>
        <div class="cenBox">
            <div class="redBox" v-if="value==''">
                <div class="redTxt">热门品牌</div>
                <div class="redCenBox">
                    <div v-for="(item,index) of R" :key="index" @click="goDetail(item)">
                        <img :src="item.autoBrandPic||''" alt=""/>
                        <div>{{item.autoBrandName}}</div>
                    </div>
                </div>
            </div>
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了">
                <van-index-bar :index-list="indexList" highlight-color="#FF0015">
                    <!--sticky-offset-top="110"-->
                    <div v-for="(item,index) of S" :key="index">
                        <!-- <van-index-anchor :index="item.autoBrandId"></van-index-anchor> -->
                        <van-index-anchor :index="item.autoBrandId" v-if="value==''"/>
                        <van-cell  v-if="items.autoBrandName.indexOf(value)!=-1" v-for="(items,indexs) in item.optionItems" :key="indexs" @click="goDetail(items)" :icon="items.autoBrandPic" :title="items.autoBrandName" />
                    </div>
                </van-index-bar>
            </van-list>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        data() {
            return {
                loading: false,//底部
                finished: false,//底部
                value:"",//输入的值
                R:"",//热门
                S:"",//一般
                type:this.$route.query.type,//跳转类型
                indexList: [],
            };
        },
        created(){
            this.getCategory();
        },
        methods: {
            back(){
                this.$router.go(-1);//返回上一层
            },
            getCategory(){
                var data={
                    "contextData":"",
                    "autoBrandId":"0",
                    "valueType":"0"
                };
                this.isLoading = true;
                this.$http.get('//app.yangche51.com/6_1/car/picker/getautobrandlist_2_0.ashx').then((response)=>{
                    this.loading = false;
                    this.finished = true;

                    this.isLoading=false;
                    this.R=response.data.body.hotBrandList;
                    let otherList = [];
                    let item = {
                        optionItems: [],
                        autoBrandId: 'A',
                    }
                    response.data.body.brandList.forEach((v,k)=>{
                        if(item.autoBrandId == v.alphabet){
                            
                        }else{
                            otherList.push(Object.assign({},item))
                            this.indexList.push(item.autoBrandId)
                            item.optionItems = [];
                            item.autoBrandId = v.alphabet
                        }
                        item.optionItems.push(v)
                        if(k === this.S.length-1){
                            otherList.push(Object.assign({},item))
                        }
                    })
                    console.log(otherList)
                    this.S = otherList
                })
            },
            goDetail(item){
                let id = item.autoBrandId
                let name = item.autoBrandName
                localStorage.setItem('autoPic',item.autoBrandPic)
                this.$router.push({name:'select-car',query:{id1:id,type:this.type,selectMapA: name}})
            },
        }
    };
</script>
<style scoped>
    .topTabBox{
        position: fixed;z-index: 2;width: 100%;
    }
    .cenBox{
        padding-top: 100px;
    }
    .topTabBox,.topTab,.van-search{
        background: #ff0015!important;
    }
    .van-ellipsis,.van-nav-bar .van-icon{
        color: #fff;
    }
    .van-search__content{
        border-radius: 20px;
    }
    .redTxt{
        color: #333;
        padding: 5px 15px;
    }
    .redCenBox{
        background: #fff;
        overflow: hidden;
        padding: 15px 10px 0 10px;
    }
    .redCenBox>div{
        width: 20%;
        float: left;
        margin-bottom: 15px;
        padding: 10px 0;
        text-align: center;
    }
    .redCenBox img{
        height: 20px;
    }
    .redCenBox>div div{
        font-size: 14px;color: #333;
    }
</style>

