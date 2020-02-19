<template>
    <div class="home">
        <div class="home-top">
            <van-row type="flex" align="center" style="margin-left: -10px;
    margin-right: -10px;
    position: fixed;
    z-index: 5;
    top: 0px;
    background: red;
    left: 0;
    right: 0;
    height: 1.5rem;" :gutter="20">
                <van-col :span="6" class="home-city" @click="showCity">
                    {{cityName}}
                    <van-icon name="arrow-down" />
                </van-col>
                <van-col :span="15">
                    <van-search class="home-search" placeholder="搜索" v-model="value" @focus="toSearch" />
                </van-col>
                <van-col :span="4" style="padding: 10px" @click="toNotify">
                    <van-icon :name="iconIn" size="24px" />
                </van-col>
            </van-row>
            <van-row type="flex" justify="center" style="color: #fff;margin-top: 40px;font-size: 14px;position: relative; z-index:3;" :gutter="20">
                <!-- <van-col> -->
                <van-row :gutter="10" style="width: 100vw;
    padding: 0px 10px;
    flex: 0 0 auto;
    box-sizing: border-box;" type="flex" justify="space-between" v-if="carCon">
                    <van-col :span="3" @click="toCarDetail()">
                        <van-image width="40" height="40" round :src="carCon.autoPic||setPic" />
                    </van-col>
                    <van-col :span="10" @click="toCarDetail()" style="text-align: left;">
                        <div style="font-size: 15px;font-weight: bold;" class="van-ellipsis">{{carCon.AutoBrandName}} - {{ carCon.MAutoModelName}}</div>
                        <div style="font-size: 13px;" class="van-ellipsis">{{carCon.AutoModelName}}</div>

                    </van-col>
                    <van-col :span="9" style="text-align: left;font-size:12px;">
                        <div @click="changeCar">
                            <van-icon name="replay" />更换车型
                        </div>
                        <div @click="toCarDetail()">
                            当前里程:{{mi}}km
                            <!-- <van-field class="input-box" v-model="value" placeholder="请输入" />公里 -->

                            <van-image width="14" height="14" :src="editPic" />
                        </div>
                    </van-col>
                </van-row>
                <van-row v-else @click="toKeep(10)" :gutter="10" style="width: 100%;padding: 0 10px;" type="flex" justify="center">
                    <van-col :span="3">
                        <van-image width="40" height="40" round style="background: #fff;" :src="setPic" />
                    </van-col>
                    <van-col :span="15">
                        <div style="font-size: 15px;text-align: left;" class="over">
                            添加您的爱车
                            <br>
                            我们会按车型推荐合适的商品
                        </div>
                    </van-col>
                </van-row>
                <!-- </van-col> -->
            </van-row>
            <div style="font-size: 0;margin-top: -4rem;">
                <a :href="adList[0] && adList[0].ADList[0].ADLink">
                    <img :src="adList[0] && adList[0].ADList[0].ADImg" style="width: 100%;min-height: 10rem;" alt />
                </a>
            </div>
        </div>
        <div class="home-part">
            <van-row class="home-project" type="flex" justify="space-around" :gutter="10">
                <van-col class="home-project-item" v-for="(item,index) of keepList" :key="index">
                    <img :src="item.imageUrl" @click="toKeep(item.projectID)" alt />
                    <div>{{item.projectName}}</div>
                </van-col>
            </van-row>
        </div>
        <div class="need-part">
            <van-divider>
                <van-icon size="20px" name="cart-circle" />每日必逛
            </van-divider>
            <van-row :gutter="10" class="line1-part">
                <van-col class="home-project-item row-item" :span="16">
                    <a :href="adList[1] && adList[1].ADList[0].ADLink">
                        <img :src="adList[1] && adList[1].ADList[0].ADImg" alt />
                    </a>
                </van-col>
                <van-col class="home-project-item row-item" :span="8">
                    <a :href="adList[2] && adList[2].ADList[0].ADLink">
                        <img :src="adList[2] && adList[2].ADList[0].ADImg" alt />
                    </a>
                </van-col>
            </van-row>
            <van-grid :border="false" :column-num="3" :gutter="10">
                <van-grid-item class="home-project-item row-item">
                    <a :href="adList[3] && adList[3].ADList[0].ADLink">
                        <img :src="adList[3] && adList[3].ADList[0].ADImg" alt />
                    </a>
                </van-grid-item>
                <van-grid-item class="home-project-item row-item">
                    <a :href="adList[4] && adList[0].ADList[0].ADLink">
                        <img :src="adList[4] && adList[4].ADList[0].ADImg" alt />
                    </a>
                </van-grid-item>
                <van-grid-item class="home-project-item row-item">
                    <a :href="adList[5] && adList[5].ADList[0].ADLink">
                        <img :src="adList[5] && adList[5].ADList[0].ADImg" alt />
                    </a>
                </van-grid-item>
            </van-grid>
        </div>
        <div class="need-part">
            <van-divider>
                <van-icon size="20px" name="like-o" />猜你喜欢
            </van-divider>
            <van-row :gutter="10" class="line1-part">
                <van-col class="home-project-item row-item" :span="12">
                    <a :href="adList[6] && adList[6].ADList[0].ADLink">
                        <img :src="adList[6] && adList[6].ADList[0].ADImg" alt />
                    </a>
                </van-col>
                <van-col class="home-project-item row-item" :span="12">
                    <a :href="adList[6] && adList[6].ADList[1].ADLink">
                        <img :src="adList[6] && adList[6].ADList[1].ADImg" alt />
                    </a>
                </van-col>
            </van-row>
            <van-grid :border="false" :column-num="4" :gutter="10">
                <van-grid-item class="home-project-item row-item">
                    <a :href="adList[7] && adList[7].ADList[0].ADLink">
                        <img :src="adList[7] && adList[7].ADList[0].ADImg" alt />
                    </a>
                </van-grid-item>
                <van-grid-item class="home-project-item row-item">
                    <a :href="adList[7] && adList[7].ADList[1].ADLink">
                        <img :src="adList[7] && adList[7].ADList[1].ADImg" alt />
                    </a>
                </van-grid-item>
                <van-grid-item class="home-project-item row-item">
                    <a :href="adList[7] && adList[7].ADList[2].ADLink">
                        <img :src="adList[7] && adList[7].ADList[2].ADImg" alt />
                    </a>
                </van-grid-item>
                <van-grid-item class="home-project-item row-item">
                    <a :href="adList[7] && adList[7].ADList[3].ADLink">
                        <img :src="adList[7] && adList[7].ADList[3].ADImg" alt />
                    </a>
                </van-grid-item>
            </van-grid>
        </div>
        <div class="mb10">
            <a :href="adList[8] && adList[8].ADList[0].ADLink">
                <img style="width: 100%;" :src="adList[8] && adList[8].ADList[0].ADImg" alt />
            </a>
        </div>
        <van-action-sheet v-model="show">
            <van-area :columns-num="3" :area-list="areaList" @confirm="confirmArea" @cancel="show = false;" />
        </van-action-sheet>
        <footerTabbar></footerTabbar>
    </div>
</template>
<script>
import footerTabbar from "Components/footer/footer";
import areaList from "Assets/js/area.js";

export default {
    data() {
        return {
            mi: "",//里程
            carCon: "",
            iconIn: require("../../assets/img/ico-msg.png"),
            setPic: require("../../assets/img/defaultCar.png"),
            activeNames: ["1"],
            editPic: require("../../assets/img/edit.png"),
            value: '',
            show: false,
            areaList,
            cityName: "深圳市",
            adList: [],
            keepList: []
        };
    },
    components: {
        footerTabbar
    },
    mounted() {
        this.getKeepList()
        this.getAdList();
        if (localStorage.getItem('YC51_Web_Auto')) {
            this.carCon = JSON.parse(localStorage.getItem('YC51_Web_Auto'))
        } else {
            this.getDefaultCar();
        }
        this.mi = (this.carCon.mi)
    },
    methods: {
        getKeepList() {
            this.$http.post("//app.yangche51.com/6_1/maintenance/newgetshortcutproject_3_0.ashx", {
                type: 0
            }).then(res => {
                this.keepList = res.data.body
            });
        },
        changeCar() {
            this.$router.push({ "name": 'manCar' })
        },
        toCarDetail() {
            this.$router.push({ "name": 'myLoveCar', query: { "autoModelSubId": this.carCon.s, "year": this.carCon.y } })
        },
        getDefaultCar() {
            this.$http.get("//app.yangche51.com/6_1/car/syncar_1_0.ashx?luser=25619357_25BCFCEB637CEC440E22AA7CCFE5FB11").then(res => {
                let data = res.data.body.autoModel
                let arr = []
                data.carParams.forEach((v, k) => {
                    arr[k] = {}
                    arr[k].k = v.paramTypeId
                    arr[k].v = v.paramValueId
                    arr[k].kn = v.paramTypeName
                    arr[k].vn = v.paramValue
                })
                data.carParams = arr
                var value = {
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
                this.carCon = value
                localStorage.setItem('YC51_Web_Auto', JSON.stringify(value));
            });
        },
        getAdList() {
            this.$http.post("svcmall/Home/GetAdList", {
                advIds: "101631,101632,101633,101634,101635,101636,101637,101638,101639"
            }).then(res => {
                this.adList = res.data.Body
            });
        },
        toNotify() {
            this.$router.push({
                name: "notify"
            });
        },
        toSearch() {
            this.$router.push({
                name: "searchList"
            });
        },
        showCity() {
            this.show = true;
        },
        confirmArea(item) {
            this.cityName = item[1].name;
            this.show = false;
        },
        // setProjectInfo(homeQuery) {
        //     let projectInfo = []
        //     let item = homeQuery.split('|');
        //     item.forEach((v, k) => {
        //         let arr = v.split('_')
        //         projectInfo[k] = {}
        //         projectInfo[k].projectId = arr[0]
        //         projectInfo[k].parts = arr[1].split(',')
        //     })
        // },
        toKeep(type) {
            //是否已选择车型
            if (this.carCon && this.carCon.n) {
                //已选择
                if (type == 0) {//更换车型
                    this.$router.push({ name: 'types2', query: { type: type } });
                }
                if (type == 1) {//智能保养
                    // this.$router.push({name: 'keep-buy',query:{type:"home",data: '7_48|9_12'}});
                    this.$router.push({ name: 'maintain-intelligence' });

                }
                if (type == 2) {//小保养
                    localStorage.removeItem("projectInfo");
                    this.$router.push({ name: 'keep-buy', query: { type: "home", data: '7_48|9_12' } });
                }
                if (type == 3) {//大保养
                    localStorage.removeItem("projectInfo");
                    this.$router.push({ name: 'keep-buy', query: { type: "home", data: '7_48|8_19,103,104|9_12|10_25,26' } });
                }
                if (type == 4) {//空气大净化
                    localStorage.removeItem("projectInfo");
                    this.$router.push({ name: 'keep-buy', query: { type: "home", data: '12_17|12_18|65_190|64_197' } });
                }
                if (type == 5) {//更换电瓶
                    localStorage.removeItem("projectInfo");
                    this.$router.push({ name: 'keep-buy', query: { type: "home", data: '21_47|66_215|67_210' } });
                }
                if (type == 6) {//更换雨刷器
                    localStorage.removeItem("projectInfo");
                    this.$router.push({ name: 'keep-buy', query: { type: "home", data: '51_189|30_217|53_214|59_184|61_216|60_196' } });
                }
                if (type == 7) {//空气滤芯
                    localStorage.removeItem("projectInfo");
                    this.$router.push({ name: 'keep-buy', query: { type: "home", data: '14_24|14_83|15_9|15_60|18_49|75_187' } });
                }
                if (type == 8) {//更换防冻液
                    localStorage.removeItem("projectInfo");
                    this.$router.push({ name: 'keep-buy', query: { type: "home", data: '48_188|26_195|26_36|26_37|72_38|72_213|22_11' } });
                }
                if (type == 9) {//更多项目
                    this.$router.push({ name: 'moreDate' });
                }
            }
            else {
                //未选择
                this.$router.push({
                    name: 'types2', query: { type: type }
                });
            }
        }
    }
};
</script>
<style lang="less" scoped>
.home {
    padding-bottom: 60px;
    width: 100%;
    overflow: hidden;
    .home-top {
        background: #fff;
        font-size: 14px;
        padding-top: 1.5rem;
        text-align: center;
    }
    .home-city {
        color: #fff;
        text-align: right;
    }
    .home-search {
        padding: 0;
        border-radius: 99px;
        overflow: hidden;
    }
    .home-part {
        // width: 90%;
        padding: 20px 5% 0;
        background: #fff;
    }
    .home-project {
        flex-wrap: wrap;
        img {
            height: 50px;
        }
    }
    .line1-part {
        padding: 0 10px;
        margin-bottom: 10px;
    }
    .home-project-item {
        text-align: center;
        line-height: 1;
        font-size: 10px;
        margin-bottom: 10px;
    }
    .row-item {
        height: 100px;
        img {
            height: 100%;
        }
    }
    .need-part {
        margin-bottom: 20px;
        /deep/ .van-grid-item__content {
            padding: 0;
        }
        img {
            width: 100%;
            height: 100%;
        }
    }
    .part-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
    }
    .home-best {
        background: #fff;
        border-radius: 7px 7px 0 0;
        padding: 10px 15px;

        .home-best-item {
            .van-button {
                width: 100%;
                margin-bottom: 10px;
                color: #333 !important;
                &.on {
                    color: #fff !important;
                    background: linear-gradient(
                        to right,
                        rgb(255, 42, 0),
                        rgb(245, 154, 56)
                    );
                    border: 0px;
                }
            }
        }
    }
    .list-wrap {
        background: #fff;
        border-radius: 7px;
        padding: 10px 15px 20px;
        .van-cell {
            padding-left: 0;
            padding-right: 0;
        }
    }
    .input-box {
        width: 60px;
        background: transparent;
        padding: 0;
        display: inline-block;
        vertical-align: bottom;
        color: #fff;
        /deep/ input {
            color: #fff;
            text-align: center;
        }
        /deep/ input::placeholder {
            color: #fff;
        }
    }
}
</style>