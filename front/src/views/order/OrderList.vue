<template>
	<div class="container">
		<div class="head">
			<span class="iconfont"></span>
			<span class="title">我的订单</span>
			<span class="button"></span>
		</div>
		<div class="order-list">
			<div v-for="(order, index) of orderList" :key="order.id" class="order-item">
				<div class="top">
					<span class="shop-name">{{ order.title }}</span>
					<span class="order-status">{{ order.isCanceled ? "已取消" : "已完成" }}</span>
				</div>
				<div class="bottom">
					<div class="products">
						<img
							v-for="(product, index) of order.products.slice(0, 5)"
							:key="product.id"
							:src="product.img"
							alt=""
							class="product-img"
						/>
					</div>
					<div class="data">
						<div class="price">¥{{ computedTotalPrice(order.products) }}</div>
						<div class="count">共{{ computedTotalNumber(order.products) }}件</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<Tabbar tag="order" />
</template>
<script>
import Tabbar from "@/components/Tabbar.vue";
import { ref, onMounted, computed } from "vue";
import { get } from "@/utils/request.js";
export default {
	name: "OrderList",
	components: {
		Tabbar,
	},
	setup() {
		const orderList = ref([]);
		const getOrderList = async () => {
			// 获取订单列表, 通过接口
			// 通过ajax, 商铺相关的信息
			const result = await get(`/order`);
			// 更新到响应式数据中
			orderList.value = result.data;
			console.log(result);
		};
		onMounted(() => {
			// 获取订单列表
			getOrderList();
		});
		const computedTotalPrice = (products) => {
			// 计算总价, 保留两位小数
			return products
				.reduce((total, product) => {
					return total + product.currentPrice * product.cartCount;
				}, 0)
				.toFixed(2);
		};
		const computedTotalNumber = (products) => {
			// 计算总数量
			return products.reduce((total, product) => {
				return total + product.cartCount;
			}, 0);
		};
		return {
			orderList,
			computedTotalPrice, // 计算总价
			computedTotalNumber, // 计算总数量
		};
	},
};
</script>
<style lang="scss" scoped>
.container {
	width: 100vw;
	height: 100vh;
	background-color: #f8f8f8;
	overflow: hidden;
	@import "../../style/head-common.scss";
	.order-list {
		position: fixed;
		top: 11.7333vw;
		right: 0;
		bottom: 13.0667vw;
		left: 0;
		overflow-y: auto;
		padding-top: 4.2667vw;
		.order-item {
			width: 90.4vw;
			height: 29.3333vw;
			background: #ffffff;
			border-radius: 1.0667vw;
			margin: 0 auto 4.2667vw;
			padding: 4.2667vw;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.shop-name {
					font-family: PingFangSC-Medium;
					font-weight: 500;
					font-size: 4.2667vw;
					color: #333333;
				}
				.order-status {
					font-family: PingFangSC-Medium;
					font-weight: 500;
					font-size: 3.7333vw;
					color: #999999;
				}
			}
			.bottom {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.products {
					.product-img {
						width: 10.6667vw;
						height: 10.6667vw;
						margin-right: 3.2vw;
						object-fit: cover;
						transform: translateY(0.5333vw);
					}
				}
				.data {
					.price {
						font-family: PingFangSC-Regular;
						font-size: 3.7333vw;
						color: #e93b3b;
						text-align: right;
						margin-bottom: 1.0667vw;
					}
					.count {
						font-family: PingFangSC-Regular;
						font-size: 3.2vw;
						color: #333333;
						text-align: right;
						line-height: 3.7333vw;
					}
				}
			}
		}
	}
}
</style>
