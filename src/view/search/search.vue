<template>
    <div>
        <van-search placeholder="搜索" class="search-top" v-model="value" style="margin-bottom: 10px;" @focus="toSearch"/>
        <div class="search-container">
            <van-sidebar class="search-left" v-model="activeKey">
                <van-sidebar-item @click="changeSide(category)" :title="category.navCategoryName" :key="'category'+index" v-for="(category,index) in categories"/>
            </van-sidebar>
            <div class="search-right">
<!--                <div class="banner">-->
<!--                    <img src="~Assets/img/1.png" alt="">-->
<!--                </div>-->
                <van-row class="pro-list" gutter="20">

                    <van-col :key="'child'+index" v-for="(child,index)  in children" class="pro-item" span="8">
                        <router-link :to="{name:'goods-list',query:{subNavId:child.navCategoryId}}">
                            <div class="img-wrap">
                                <img :src="child.logoPath" alt="">
                            </div>
                            <div class="pro-type">{{child.navCategoryName}}</div>
                        </router-link>
                    </van-col>

                </van-row>
            </div>
        </div>
        <footerTabbar></footerTabbar>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import footerTabbar from 'Components/footer/footer'

    export default {
        layout: 'default',
        // middleware: 'auth',
        components: {
            footerTabbar
        },
        computed: {},
        mounted(){

        },
        data() {
            return {
                value: '',
                activeKey: 0,
                categories: [],
                children:[],
                allImgList: [],
            };
        },
        created() {
            this.getCategory();
        },
        methods: {
            changeSide(item){
                this.children = item.childs
            },
            toSearch(){
                this.$router.push({
                    name: 'searchList'
                });
            },
            getCategory() {
//                var AutoInfo=localStorage.getItem('YC51_Web_Auto');
                var data={
                    keyWord:this.$route.query.keyword,
                    itemParam:{
                        sortType:0,
                        pageIndex:1,
                        pageSize:15,
                    },
                }
                
                $.post('//app.yangche51.com/6_1/item/navcategory/list_1_0.ashx',data).then((response) => {
                    console.log(response)
                    this.categories = response.body;
                    this.children  = this.categories[0].childs;
                    this.categories.forEach((v)=>{
                        v.childs.forEach(j => {
                            // this.allImgList.push(j.logoPath)
                            let img = new Image();
                            img.src = j.logoPath
                        })
                    })
                })
            }

        }
    };
</script>
<style lang="less" scoped>
    .search-container {
        display: flex;
        height: calc(100vh - 120px);
        margin-top: 60px;
        padding-bottom: 60px;

        .van-sidebar-item {
            background: #fff;
            padding-left:5px ;
            padding-right:5px ;
        }

        .van-sidebar-item--select {
            background: #f8f8f8;
        }
    }

    .search-top {
        position: fixed;
        top: 0;
        z-index: 9;
        width: 100%;
    }

    .search-left {
        flex: 0 0 auto;
        height: 100%;
        overflow: auto;
    }

    .search-right {
        flex: 1;
        padding: 0 10px;
        height: 100%;
        overflow: auto;
    }

    .banner img {
        width: 100%;
    }

    .pro-list {
        font-size: 14px;
        line-height: 1.5;

        .img-wrap {
            height: 70px;
            position: relative;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .pro-type {
            height: 40px;
            line-height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            text-align: center;
            color: #fff;
            background: #B4B4B4;
        }

        .pro-item {
            margin-bottom: 10px;
        }
    }
</style>

