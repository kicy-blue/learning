function page(path) {
    return () => import(/* webpackChunkName: '' */ `../view/${path}`).then(m => m.default || m)
}

export default [
    {
        path: "*",
        // redirect: "/search"
		 // redirect: "/login"
        redirect: "/home"
    },
    // {
    //     path: '/index',
    //     name : 'index',
    //     component : page('layout.vue'),
    //     meta : { keepAlive: true, title:'首页'},
    //     redirect: '/home',
    //     children: [
    //         // 所有路由写这里
    //         {
    //             path: '/demo',
    //             name : 'demo',
    //             component : () => import(/* webpackChunkName: "demo" */'../pages/demo/demo.vue'),
    //             meta : { keepAlive: false, title:'demo',noTpl:true}
    //         },
    //     ]
    // },
    {
        path: "/login",
        name: "login",
        // component: page('login.vue'),
		 component: page('login/login.vue'),
        meta: {title: "登录"}
    },
	{
	    path: "/register",
	    name: "register",
		 component: page('login/register.vue'),
	    meta: {title: "注册登录"}
	},
	{
	    path: "/condition",
	    name: "condition",
		 component: page('login/condition.vue'),
	    meta: {title: "用户协议"}
	},
    {
        path: "/home",
        name: "home",
        component: page('home/home.vue'),
        meta: {title: "首页"}
    },
    {
        path: "/search",
        name: "search",
        component: page('search/search.vue'),
        meta: {title: "搜索"}
    },
	{
	    path: "/searchList",
	    name: "searchList",
	    component: page('search/searchList.vue'),
	    meta: {title: "商城"}
	},
    {
        path: "/user",
        name: "user",
        component: page('user/index.vue'),
        meta: {
            title: "会员中心"
        }
    },
    {
        path: "/cart",
        name: "cart",
        component: page('cart/index.vue'),
        meta: {
            title: "购物车"
        }
    },
    {
        path: "/goods/list",
        name: "goods-list",
        component: page('goods/list.vue'),
        meta: {
            title: "商品列表"
        }
    },
    {
        path: "/goods/detail",
        name: "goods-detail",
        component: page('goods/detail.vue'),
        meta: {
            title: "商品详情"
        }
    },
	{
	    path: "/maintain/record",
	    name: "maintain-record",
	    component: page('maintain/record.vue'),
	    meta: {
	        title: "保养记录"
	    }
	},
	{
	    path: "/maintain/intelligence",
	    name: "maintain-intelligence",
	    component: page('maintain/intelligence.vue'),
	    meta: {
	        title: "智能保养"
	    }
	},
	{
	    path: "/maintain/record/add",
	    name: "maintain-record-add",
	    component: page('maintain/addrecord.vue'),
	    meta: {
	        title: "增加保养记录"
	    }
	},
	{
	    path: "/maintain/record/info",
	    name: "maintain-record-info",
	    component: page('maintain/recordinfo.vue'),
	    meta: {
	        title: "保养记录信息"
	    }
	},
	{
	    path: "/maintain/record/addparts",
	    name: "maintain-record-addparts",
	    component: page('maintain/addparts.vue'),
	    meta: {
	        title: "添加配件"
	    }
	},
	
    {
        path: "/goods/collect",
        name: "goods-collect",
        component: page('goods/collect.vue'),
        meta: {
            title: "收藏商品"
        }
    },
    {
        path: "/order/comment",
        name: "order-comment",
        component: page('order/comment.vue'),
        meta: {
            title: "评论"
        }
    },
    {
        path: "/order/list",
        name: "order-list",
        component: page('order/list.vue'),
        meta: {
            title: "订单列表"
        }
    },
    {
        path: "/order/detail",
        name: "order-detail",
        component: page('order/detail.vue'),
        meta: {
            title: "订单详情"
        }
    },
    {
        path: "/order/detail2",
        name: "order-detail2",
        component: page('order/detail2.vue'),
        meta: {
            title: "订单详情2"
        }
    },
    {
        path: "/order/confirm",
        name: "order-confirm",
        component: page('order/confirm.vue'),
        meta: {
            title: "确认订单"
        }
    },
    {
        path: "/order/confirm/list",
        name: "order-confirm-list",
        component: page('order/confirmList.vue'),
        meta: {
            title: "订单清单"
        }
    },
    {
        path: "/order/confirm/keep",
        name: "order-confirm-keep",
        component: page('order/confirm_keep.vue'),
        meta: {
            title: "确认订单 - 保养项目"
        }
    },
    {
        path: "/order/servershop",
        name: "order-servershop",
        component: page('order/servershop.vue'),
        meta: {
            title: "选择服务店"
        }
    },
	{
	    path: "/order/servershopd/details",
	    name: "order-servershop-details",
	    component: page('order/servershopdetail/index.vue'),
	    meta: {
	        title: "服务店详情"
	    }
	},
    {
        path: "/order/pay",
        name: "order-pay",
        component: page('order/pay.vue'),
        meta: {
            title: "订单支付"
        }
    },
    {
        path: "/feedback",
        name: "feedback",
        component: page('feedback/feedback.vue'),
        meta: {
            title: "反馈"
        }
    },
    {
        path: "/rank",
        name: "rank",
        component: page('rank/rank.vue'),
        meta: {
            title: "积分"
        }
    },
    {
        path: "/balance",
        name: "balance",
        component: page('balance/balance.vue'),
        meta: {
            title: "余额"
        }
    },
    {
        path: "/address",
        name: "address-address",
        component: page('address/address.vue'),
        meta: {
            title: "收获地址"
        }
    },
    {
        path: "/address/add",
        name: "address-add",
        component: page('address/add.vue'),
        meta: {
            title: "添加地址"
        }
    },
    {
        path: "/question",
        name: "question",
        component: page('question/question.vue'),
        meta: {
            title: "问答"
        }
    },
    {
        path: "/about",
        name: "about",
        component: page('about/about.vue'),
        meta: {
            title: "关于"
        }
    },
    {
        path: "/set",
        name: "set",
        component: page('set/system.vue'),
        meta: {
            title: "系统设置"
        }
    },
    {
        path: "/notify",
        name: "notify",
        component: page('system/notify.vue'),
        meta: {
            title: "系统消息"
        }
    },
    {
        path: "/set/name",
        name: "set-name",
        component: page('set/name.vue'),
        meta: {
            title: "修改昵称"
        }
    },
    {
        path: "/keep/select",
        name: "keep-select",
        component: page('keep/select.vue'),
        meta: {
            title: "选择保养项目"
        }
    },
    {
        path: "/keep/buy",
        name: "keep-buy",
        component: page('keep/buy.vue'),
        meta: {
            title: "购买页面"
        }
    },
    {
        path: "/preCen/preCen",
        name: "preCen",
        component: page('preCen/preCen.vue'),
        meta: {
            title: "个人中心"
        }
    },
    {
        path: "/index/index",
        name: "index",
        component: page('index/index.vue'),
        meta: {
            title: "首页"
        }
    },
    {
        path: "/types/types2",
        name: "types2",
        component: page('types/types2.vue'),
        meta: {
            title: "分类"
        }
    },
    {
        path: "/types/selectCar",
        name: "select-car",
        component: page('types/selectCar.vue'),
        meta: {
            title: "车型选择"
        }
    },
    {
        path: "/types/selectOutput",
        name: "select-output",
        component: page('types/selectOutput.vue'),
        meta: {
            title: "车型排量选择"
        }
    },
    {
        path: "/manCar/manCar",
        name: "manCar",
        component: page('manCar/manCar.vue'),
        meta: {
            title: "管理车辆"
        }
    },
    {
        path: "/myLoveCar/myLoveCar",
        name: "myLoveCar",
        component: page('myLoveCar/myLoveCar.vue'),
        meta: {
            title: "我的爱车"
        }
    },
    {
        path: "/discount",
        name: "discount",
        component: page('discount/discount.vue'),
        meta: {
            title: "优惠券"
        }
    },
    {
        path: "/moreDate",
        name: "moreDate",
        component: page('moreDate/moreDate.vue'),
        meta: {
            title: "更多项目"
        }
    },
];