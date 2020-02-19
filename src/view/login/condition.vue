<template>
	<div class="page-condition">
		<!-- <van-nav-bar
		 title="养车无忧用户协议"
		 left-arrow
		 @click-left="onClickLeft" /> -->
		<div v-html="text" class="condition-main">
			{{text}}
		</div>
		<div class="fixedMenuBox">
			<div class="fixedMenu" :class="menuFlag? 'fixedMenuActive' : ''" @click="showMenu"></div>
			<div class="mainMenu" v-show="menuFlag">
				<div class="menuHome" @click="()=>goTo('home')">首页</div>
				<div class="menuSearch" @click="()=>goTo('search')">搜索</div>
				<div class="menuJiao"></div>
			</div>
		</div>
		<div v-show="btnFlag" class="back-top" @click="backTop">
			<van-icon name="upgrade" />
		</div>
	</div>
</template>

<script>
	const conditionText = '<div class="condition"> <div class="topCondition"> 本协议是您与养车无忧网（简称“本站”，网址：www.yangche51.com）所有者（以下简称为“养车无忧网”）之间就养车无忧网站服务等相关事宜所订立的契约，请您仔细阅读本注册协议，您点击“同意以下协议并注册”按钮后，本协议即构成对双方有约束力的法律文件。 </div> <div class="condiTitle"> 一、本站服务条款的确认和接纳 </div> <div class="condiContent"> 本站的各项电子服务的所有权和运作权归本站。本站提供的服务将完全按照其发布的服务条款和操作规则严格执行。用户同意所有服务条款并完成注册程序，才能成为本站的正式用户。用户确认：本协议条款是处理双方权利义务的约定，除非违反国家强制性法律，否则始终有效。在下订单的同时，您也同时承认了您拥有购买这些产品的权利能力和行为能力，并且将您对您在订单中提供的所有信息的真实性负责。 </div> <div class="condiTitle"> 二、服务简介 </div> <div class="condiContent"> <p>本站运用自己的操作系统通过国际互联网络为用户提供网络服务。同时，用户必须：</p> <p>(1)自行配备上网的所需设备，包括个人电脑、调制解调器或其它必备上网装置。</p> <p>(2)自行负担个人上网所支付的与此服务有关的电话费用、网络费用。</p> <p>基于本站所提供的网络服务的重要性，用户应同意。</p> <p>(1)提供详尽、准确的个人资料。</p> <p>(2)不断更新注册资料，符合及时、详尽、准确的要求。</p> <p>本站保证不公开用户的真实姓名、地址、电子邮箱和联系电话等用户信息， 除以下情况外：</p> <p>(1)用户授权本站透露这些信息。</p> <p>(2)相应的法律及程序要求本站提供用户的个人资料。</p> <p>用户同意，养车无忧网拥有通过邮件、短信电话等形式，向在本站注册、购物用户、收货人发送订单信息、促销活动等告知信息的权利。</p> <p>用户不得将在本站注册获得的账户借给他人使用，否则用户应承担由此产生的全部责任，并与实际使用人承担连带责任。</p> </div> <div class="condiTitle"> 三、商品信息 </div> <div class="condiContent"> <p>本站将尽最大努力保证您所购商品与网站上公布的价格一致。</p> <p>产品的价格和可获性都在本站上指明，这类信息将随时更改。</p> <p>您所订购的商品，如果发生缺货，您有权取消定单。</p> </div> <div class="condiTitle"> 四、送货 </div> <div class="condiContent"> <p>本站将会把产品送货上门，或送到物流公司指定的各地提货点，由用户自行去提货点提货。所有在本站上列出的送货时间为参考时间，参考时间的计算是根据库存状况、正常的处理过程和送货时间、送货地点的基础上估计得出的。</p> <p>请清楚准确地填写您的真实姓名、所属城市及联系方式。因如下情况造成订单延迟或无法配送等，本站将无法承担迟延配送的责任：</p> <p>(1)客户提供错误信息和不准确的地址；</p> <p>(2)货物送达无人提取，由此造成的重复配送所产生的费用及相关的后果；</p> <p>(3)不可抗力，例如：自然灾害、交通戒严、突发战争等。</p> </div> <div class="condiTitle"> 五、服务条款的修改 </div> <div class="condiContent"> <p>本站将可能不定期的修改本用户协议的有关条款，一旦条款及服务内容产生变动，本站将会在重要页面上提示修改内容。</p> </div> <div class="condiTitle"> 六、用户隐私制度 </div> <div class="condiContent"> <p>尊重用户个人隐私是本站的一项基本政策。所以，作为对以上第二条注册资料分析的补充，本站一定不会在未经合法用户授权时公开、编辑或透露其注册资料及保存在本站中的非公开内容。</p> </div> <div class="condiTitle"> 七、用户的帐号，密码和安全性 </div> <div class="condiContent"> <p>用户一旦注册成功，成为本站的合法用户，将得到一个密码和用户名。您可随时根据指示改变您的密码。用户需谨慎合理的保存、使用用户名和密码。用户若发现任何非法使用用户帐号或存在安全漏洞的情况，请立即通知本站和向公安机关报案。</p> </div> <div class="condiTitle"> 八、对用户信息的存储和限制 </div> <div class="condiContent"> <p>如果用户违背了国家法律法规规定或本协议约定，本站有视具体情形中止或终止对其提供网络服务的权利。</p> </div> <div class="condiTitle"> 九、用户管理 </div> <div class="condiContent"> <p>本协议依据国家相关法律法规规章制定，用户同意严格遵守以下条款：</p> <p>(1)从中国境内向外传输技术性资料时必须符合中国有关法规。</p> <p>(2)不利用本站从事非法活动。</p> <p>(3)不干扰或混乱网络服务。</p> <p>(4)遵守所有使用网络服务的网络协议、规定、程序和惯例。</p> <p>用户须承诺不传输任何违法犯罪的、骚扰性的、中伤他人的、辱骂性的、恐吓性的、伤害性的、庸俗的，淫秽的、不文明的等信息资料；不传输损害国家社会公共利益和涉及国家安全的信息资料；不传输教唆他人从事本条所述行为的信息资料。</p> <p>未经许可而非法进入其它电脑系统是禁止的。</p> <p>若用户的行为不符合以上提到的服务条款，本站将作出独立判断立即取消用户服务帐号。用户需对自己在网上的行为承担法律责任。用户若在本站上散布和传播反动、色情或其它违反国家法律的信息，本站的系统记录有可能作为用户违反法律的证据。</p> </div> <div class="condiTitle"> 十、通告 </div> <div class="condiContent"> <p>所有发给用户的通告都可通过重要页面的公告或手机短信或常规的信件传送。用户协议条款的修改、服务变更、或其它重要事件的通告都会以此形式进行。</p> </div> <div class="condiTitle"> 十一、网络服务内容的所有权 </div> <div class="condiContent"> <p>本站定义的网络服务内容包括：文字、软件、声音、图片、录象、图表、广告中的全部内容；电子邮件的全部内容；本站为用户提供的其它信息。所有这些内容受版权、商标、标签和其它财产所有权法律的保护。所以，用户只能在本站和广告商授权下才能使用这些内容，而不能擅自复制、再造这些内容、或创造与内容有关的派生产品。本站所有的文章版权归原文作者和本站共同所有，任何人需要转载本站的文章，必须征得原文作者和本站授权。</p> </div> <div class="condiTitle"> 十二、责任限制 </div> <div class="condiContent"> <p>如因不可抗力或其它本站无法控制的原因使本站销售系统崩溃或无法正常使用导致网上交易无法完成或丢失有关的信息、记录等本站会尽可能合理地协助处理善后事宜，并尽最大努力使客户免受损失。</p> </div> <div class="condiTitle"> 十三、法律管辖和适用 </div> <div class="condiContent"> <p>本协议的订立、执行和解释及争议的解决均应适用中国法律。</p> <p>如发生本站服务条款与中国法律相抵触时，则这些条款将完全按法律规定重新解释，而其它有效条款继续有效。</p> <p>如双方就本协议内容或其执行发生任何争议，双方应尽力友好协商解决；协商不成时，任何一方均可向人民法院提起诉讼。</p> </div> </div>';
	import {
		NavBar,
		Icon
	} from 'vant';
	import {
		// conditionText
	} from './util.js';
	export default {
		name: "condition",
		layout: 'default',
		data() {
			return {
				text: "",
				btnFlag: false,
				scrollTop: 0,
				menuFlag:false,
			}
		},
		created() {
			this.text = conditionText;
		},
		mounted() {
			window.addEventListener('scroll', this.scrollToTop)
		},
		destroyed() {
			window.removeEventListener('scroll', this.scrollToTop)
		},
		methods: {
			showMenu(){
				this.menuFlag = !this.menuFlag;
			},
			goTo(type){
				this.$router.push({
					name: type
				})
			},
			onClickLeft() {
				this.$router.push({
					name: 'login'
				})
			},
			backTop() {
				let timer = setInterval(() => {
					let ispeed = Math.floor(-this.scrollTop / 9)
					document.documentElement.scrollTop = document.body.scrollTop = this.scrollTop + ispeed
					let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
					this.scrollTop = scrollTop;
					if (this.scrollTop === 0) {
						clearInterval(timer)
					}
				}, 16)
			},
			scrollToTop() {
				let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
				this.scrollTop = scrollTop;
				if (this.scrollTop > 60) {
					this.btnFlag = true
				} else {
					this.btnFlag = false
				}
			}
		}
	}
</script>

<style scoped>
	.page-condition {
		background-color: #fff;
		overflow-y: scroll;
	}

	.condition-main {
		padding: 10px;
	}

	.condiTitle {
		color: #000;
		line-height: 26px;
		font-weight: 500;
	}

	.condition {
		color: #666;
		line-height: .5rem;
		padding: .2rem;
		background: #fff;
	}

	.back-top {
		position: fixed;
		font-size: 34px;
		background: #666;
		color: #fff;
		padding: 3px 6px;
		right: 0;
		bottom: 0;
		z-index: 999999;
	}
	.fixedMenuBox .fixedMenu{
		width: .8rem;
	    height: .8rem;
	    bottom: 4.2rem;
	    right: 0;
	    position: fixed;
	    z-index: 5;
	    background: url("../../assets/img/mall/fixed.png") no-repeat;
	    background-size: 100% 100%;
	}
	.fixedMenuBox .fixedMenuActive{
		background: url("../../assets/img/mall/active.png") no-repeat;
		background-size: 100% 100%;
	}
	.fixedMenuBox .mainMenu{
		position: fixed;
	    z-index: 5;
	    right: 0;
	    bottom: 5rem;
	    background: #fff;
	    border: 1px solid #d8d8d8;
	    padding: 0 .2rem;
	}
	.fixedMenuBox .menuHome{
		width: 1.6rem;
	    height: 1rem;
	    line-height: 1rem;
	    border-bottom: 1px solid #d8d8d8;
	    background: url("../../assets/img/mall/home.png") no-repeat;
	    background-size: .45rem;
	    background-position: 0 .28rem;
	    padding-left: 0.6rem;
	    color: #999;
	}
	.fixedMenuBox .menuSearch{
		width: 1.6rem;
	    height: 1rem;
	    line-height: 1rem;
	    background: url("../../assets/img/mall/s_03.png") no-repeat;
	    background-size: .45rem;
	    background-position: 0 .28rem;
	    padding-left: 0.6rem;
	    color: #999;
	}
	.fixedMenuBox .menuJiao{
		position: fixed;
	    right: .2rem;
	    bottom: 4.8rem;
	    z-index: 5;
	    width: .3rem;
	    height: .21rem;
	    background: url("../../assets/img/mall/sanjiao.png") no-repeat;
	    background-size: .3rem;
	}
</style>
