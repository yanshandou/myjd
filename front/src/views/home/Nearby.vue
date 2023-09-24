<template>
	<div class="nearby">
		<div class="title">附近店铺</div>
		<router-link :to="`/shop/${item.id}`" v-for="(item, index) in nearbyItems" :key="item.id">
			<ShopInfo :item="item" :showBorder="true" v-if="item.logo" />
		</router-link>
	</div>
</template>
<Toast v-if="toastData.isShowToast" :message="toastData.toastMessage" />
<script>
// 导入onMounted, ref, onMounted的作用是在组件挂载时, 执行某些代码, ref的作用是创建响应式数据
import { onMounted, ref } from "vue";
// 导入封装好的get方法
import { get } from "@/utils/request.js";
// 导入弹框组件
import Toast, { showToastEffect } from "@/components/Toast.vue";
// 导入商铺信息组件
import ShopInfo from "@/components/ShopInfo.vue";

export default {
	// 组件的名称
	name: "Nearby",
	// 注册组件
	components: {
		Toast,
		ShopInfo,
	},
	setup() {
		// 定义一个响应式的数据, 用来存储附近店铺的数据
		const nearbyItems = ref([]);
		// 通过ajax请求, 获取附近店铺的数据
		const getNearbyItems = async function () {
			// 发送ajax请求, 获取附近店铺的数据
			const res = await get("/shop/hot-list");
			// 判断错误码
			if (res.errno !== 0) {
				// 提示用户
				showToast(res.message);
				// 终止代码执行
				return;
			}
			// 返回附近店铺的数据
			nearbyItems.value = res.data;
		};
		// 这段代码是在Vue.js框架中的生命周期钩子函数 onMounted 中，定义了一个箭头函数。当组件挂载时，也就是在页面渲染之后，会调用 getNearbyItems() 函数。该函数可能用于获取附近物品的信息或数据
		onMounted(() => {
			// 获取附近店铺的数据, 走ajax请求
			getNearbyItems();
		});
		return {
			nearbyItems, // 附近店铺的数据
		};
	},
};
</script>
<style lang="scss" scoped>
.nearby {
	padding: 4.2667vw 4.8vw 17.3333vw;
	.title {
		font-family: PingFangSC-Medium;
		font-size: 4.8vw;
		color: #333333;
		font-weight: 500;
		margin-bottom: 3.7333vw;
	}
}
</style>
