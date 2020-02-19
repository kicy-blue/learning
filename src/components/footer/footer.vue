<template>
    <van-tabbar style="z-index: 999" v-model="active" active-color="#FF0015" inactive-color="#CFCFCF">
        <van-tabbar-item @click="changeTab(item.key)" v-for="(item,index) of tabbar" :key="index" :name="item.key" replace>
            <span>{{item.name}}</span>
            <img slot="icon" slot-scope="props" :src="props.active ? item.icon.active : item.icon.inactive">
        </van-tabbar-item>
    </van-tabbar>
</template>
<script>

export default {
    data() {
        return {
            active: 'home',
            tabbar: [
                {
                    key: 'home',
                    name: '首页',
                    icon: {
                        active: require("../../assets/img/tab1-on.png"),
                        inactive: require("../../assets/img/tab1.png")
                    }
                },
                {
                    key: 'search',
                    name: '分类',
                    icon: {
                        active: require("../../assets/img/tab2-on.png"),
                        inactive: require("../../assets/img/tab2.png")
                    }
                },
                {
                    key: 'question',
                    name: '客服',
                    icon: {
                        active: require("../../assets/img/tab3-on.png"),
                        inactive: require("../../assets/img/tab3.png")
                    }
                },
                {
                    key: 'preCen',
                    name: '我的',
                    icon: {
                        active: require("../../assets/img/tab4-on.png"),
                        inactive: require("../../assets/img/tab4.png")
                    }
                },
            ],

        }
    },
    mounted(){
        this.active = this.$route.name
    },
    methods: {
        changeTab(item){
            console.log(item)
            this.$router.push({
                name: item
            });
        }
    }
}
</script>
