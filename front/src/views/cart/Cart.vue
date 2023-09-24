<template>
	<div class="container">
		<div class="head">
			<span class="iconfont"></span>
			<span class="title">我的全部购物车（{{ total }}）</span>
			<span class="button"></span>
		</div>
		<div class="cart-list">
			<!-- 使用for循环渲染购物车列表 -->
			<CartItem v-for="shop of cartData" :key="shop.id" :shop="shop" />
		</div>
	</div>
	<Tabbar tag="cart" />
	<Toast v-if="toastData.isShowToast" :message="toastData.toastMessage" />
</template>
<script>
import Tabbar from "@/components/Tabbar.vue";
// 导入组件
import CartItem from "@/components/CartItem.vue";
// 导入vuex
import { computed } from "vue";
import { useStore } from "vuex";

// 引入弹框组件
import Toast, { showToastEffect } from "@/components/Toast.vue";
export default {
	name: "Cart",
	components: {
		Tabbar,
		CartItem,
		Toast,
	},
	setup() {
		// 调用封装好的弹框相关的代码
		const { showToast, toastData } = showToastEffect();
		// 从vuex中获取购物车数据
		const store = useStore();
		const cartData = computed(() => store.state.cartData);
		console.log(cartData.value);
		// 如果没有数据, 则显示空购物车
		if (cartData.value.length === 0) {
			showToast("购物车没有数据");
		}
		// 计算购物车总量
		const total = computed(() => {
			let total = 0;
			console.log(cartData.value);
			cartData.value.forEach((shop) => {
				shop.products.forEach((product) => {
					total += product.cartCount;
				});
			});
			return total;
		});
		return {
			cartData,
			toastData,
			total,
		};
	},
};
</script>
<style lang="scss" scoped>
.container {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	background-color: #f8f8f8;
	@import "../../style/head-common.scss";
	@import "../../style/cart-list-common.scss";
}
</style>
