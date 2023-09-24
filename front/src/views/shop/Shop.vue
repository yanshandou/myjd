<template>
	<div class="container">
		<div class="head">
			<span @click="handleBackClick" class="iconfont icon-left"></span>
			<span class="iconfont icon-search"></span>
			<input type="text" class="search-input" placeholder="请输入商品名称搜索" />
		</div>
		<div class="shop-container">
			<ShopInfo :item="item" :showBorder="false" />
		</div>
		<div class="shop-body">
			<div class="category">
				<div
					@click="handleItemClick(item.name)"
					v-for="item of leftItems"
					:tab-name="item.name"
					:key="item.id"
					:class="{ 'category-item': true, active: item.name === currentItemName }"
				>
					{{ item.text }}
				</div>
			</div>
			<div class="detail">
				<div v-for="item of rightItems" :key="item.id" class="detail-item">
					<div class="left">
						<img :src="item.img" alt="" class="product-img" />
					</div>
					<div class="right">
						<div class="product-title">{{ item.title }}</div>
						<div class="product-sale">月售{{ item.sale }}件</div>
						<div class="product-data">
							<div class="data-left">
								<span class="current-price">{{ item.currentPrice }}</span>
								<span class="previous-price">¥{{ item.previousePrice }}</span>
							</div>
							<div class="data-right">
								<span
									@click="changeCartCount(item.id, -1)"
									v-show="item.cartCount"
									class="iconfont icon-minus-circle"
								></span>
								<span v-show="item.cartCount" class="product-count">{{ item.cartCount }}</span>
								<span @click="changeCartCount(item.id, 1)" class="iconfont icon-plus-circle-fill"></span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="foot">
			<div class="left">
				<span class="dot" v-show="total">{{ total }}</span>
				<img @click="cartIconClick" src="../../assets/img/cart.png" alt="" class="cart-img" />
				<span v-show="JSON.stringify(cartItems) === '[]'" class="left-title">购物车是空的</span>
				<span v-show="JSON.stringify(cartItems) !== '[]'" class="left-title">总计：</span>
				<span v-show="JSON.stringify(cartItems) !== '[]'" class="left-price">¥{{ sumPrice }}</span>
			</div>
			<router-link class="router-link-a" :to="total ? { path: `/order-confirmation/${shopId}` } : ''">
				<div class="right">去结算</div>
			</router-link>

			<!-- <div class="right">提交订单</div> -->
		</div>
	</div>
	<div v-show="isShowCartList" @click="cartMaskClick" class="cart-mask">
		<div class="cart-info">
			<div class="cart-top">
				<div class="left">
					<span @click="changeAllChecked" v-show="!allChecked" class="iconfont icon-Checkbox_unselected2"></span>
					<span @click="changeAllChecked" v-show="allChecked" class="iconfont icon-selected"></span>
					<span class="text">全选</span>
				</div>
				<div @click="clearCart" class="button">清空购物车</div>
			</div>
			<div class="cart-content">
				<div v-for="item of cartItems" class="cart-item">
					<div class="left">
						<span
							@click="changeItemChecked(item.id)"
							v-show="!item.checked"
							class="iconfont icon-Checkbox_unselected2"
						></span>
						<span @click="changeItemChecked(item.id)" v-show="item.checked" class="iconfont icon-selected"></span>
						<img :src="item.img" alt="" class="cart-img" />
						<div class="product-info">
							<div class="product-title">{{ item.title }}</div>
							<div class="product-data">
								<span class="current-price">{{ item.currentPrice }}</span>
								<span class="previous-price">¥{{ item.previousePrice }}</span>
							</div>
						</div>
					</div>
					<div class="right">
						<span @click="changeCartCount(item.id, -1)" class="iconfont icon-minus-circle"></span>
						<span class="product-count">{{ item.cartCount }}</span>
						<span @click="changeCartCount(item.id, 1)" class="iconfont icon-plus-circle-fill"></span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
// 引入ref, 创建ref对象, 计算属性
import { ref, onMounted, computed } from "vue";
// 引入useRouter, 获取路由对象, 引入useRoute, 获取路由参数
import { useRouter, useRoute } from "vue-router";
// 导入useStore, 获取vuex中的数据
import { useStore } from "vuex";
// 引入get
import { get } from "@/utils/request";
// 导入shopInfo组件
import ShopInfo from "@/components/ShopInfo.vue";
export default {
	name: "Shop",
	components: {
		ShopInfo,
	},
	setup() {
		// 定义一个变量, 控制购物车的显示和隐藏
		const isShowCartList = ref(false);
		// 获取路由对象
		const router = useRouter();
		// 获取路由参数
		const route = useRoute();
		// 从路由参数中获取id
		const shopId = route.params.id;
		// 定义一个数组, 用来存储所有的商品数据
		let allItems = [];
		// 这段代码使用 Vue.js 中的 useStore() 函数来创建一个名为 store 的常量。在 Vue.js 中， useStore() 通常与 Vuex 库一起使用，用于获取应用程序的全局状态管理对象。这样，你可以访问、修改和跟踪组件之间共享的状态数据。
		const store = useStore();
		// 创建响应式数据
		const item = ref({});
		// 通过ajax, 获取item的数据
		const getItemData = async () => {
			// 通过ajax, 商铺相关的信息
			const result = await get(`/shop/${shopId}`);
			// 更新到响应式数据中
			item.value = result.data;
		};
		// 定义左侧分类的数据
		const leftItems = ref([]);
		// 通过ajax, 获取左侧分类的数据
		const getLeftItems = async () => {
			// 获取左侧分类的数据
			const result = await get(`/shop/${shopId}/tags`);
			// 更新到响应式数据中
			leftItems.value = result.data;
		};
		// 定义右侧商品的数据
		const rightItems = ref([]);
		// 通过ajax, 获取右侧商品的数据
		const getRightItems = async () => {
			// 获取右侧的商品数据
			const result = await get(`/shop/${shopId}/products`);
			// 更新到响应式数据中
			rightItems.value = result.data;
			// 存到allItems中, 方便后面的筛选操作
			allItems = result.data;
			// 通过shopId, productId, 获取购物车数量
			allItems.forEach((element) => {
				element.cartCount = getProductFromVuex(shopId, element.id).cartCount;
				element.checked = getProductFromVuex(shopId, element.id).checked;
			});
			// 更新rightItems中的数据
			rightItems.value = allItems;
		};
		// 获取购物车数据,做成计算属性, 从rightItems中获取有购物车数量的商品数据
		const cartItems = computed(() => {
			// 定义一个数组, 用来存储购物车数据
			const tmpArr = [];
			// 获取商铺id
			const shopId = route.params.id;
			// 从vuex中获取购物车数据
			rightItems.value.forEach((element) => {
				// 通过shopId, productId, 获取购物车数量
				element.cartCount = getProductFromVuex(shopId, element.id).cartCount;
				// 通过shopId, productId, 获取checked属性
				element.checked = getProductFromVuex(shopId, element.id).checked;
			});
			// 遍历rightItems, 获取有购物车数量的商品数据
			rightItems.value.forEach((element) => {
				// 如果商品的购物车数量大于0, 就添加到tmpArr中
				if (element.cartCount > 0) {
					tmpArr.push(element);
				}
			});
			// 如果tmpArr的长度为0, 就隐藏购物车列表
			if (tmpArr.length === 0) {
				isShowCartList.value = false;
			}
			// 返回tmpArr
			return tmpArr;
		});
		// 完善商品数据, 通过商铺id, 商品id, 从vuex中查询cartCount属性, 添加到商品中, 记录的购物车数量
		// 参数1: 商铺id, 参数2: 商品id
		const getProductFromVuex = (shopId, productId) => {

			// 定义一个购物车数量
			let cartCount;
			let checked;
			// 通过商铺id, 商品id, 从vuex中查询cartCount属性, 添加到商品中, 记录的购物车数量, 如果vuex中没有数据, 默认为空数组
			const cartData = store.state.cartData || [];
			// 先通过商铺id, 获取商铺的数据
			let shop = {
				products: [],
			};
			cartData.forEach((element) => {
				if (element.id === shopId) {
					// 如果vuex中有这个商铺的数据, 就把这个商铺的数据赋值给shop
					shop = element;
				}
			});
			// 通过商品id, 获取商品的数据
			let product = {};
			shop.products.forEach((element) => {
				// 如果商品id相同, 就把商品的数据赋值给product, 说明vuex中有这个商品的数据
				if (element.id === productId) {
					product = element;
				}
			});
			// 获取商品的购物车数量, 如果没有, 默认为0
			cartCount = product.cartCount || 0;
			checked = product.checked || false;
			// 返回购物车数量
			return {
				cartCount,
				checked,
			};
		};
		// 请求数据, 通过onMounted, 在组件挂载完成后, 执行函数, 走ajax请求
		onMounted(() => {
			getItemData(); // 获取商铺相关的信息
			getLeftItems(); // 获取左侧分类的数据
			getRightItems(); // 获取右侧商品的数据
		});
		// 定义当前选中的分类, 默认是all, 代表全部商品, 通过ref创建响应式数据
		const currentItemName = ref("all");
		// 定义点击分类的事件处理函数, name代表当前点击的分类的名称
		const handleItemClick = (name) => {
			// 将当前选中的分类, 赋值给currentItemName
			currentItemName.value = name;
			// 过滤右侧商品的数据, 在所有商品中, 通过分类进行过滤
			rightItems.value = allItems.filter((item) => {
				return item.tags.includes(name);
			});
		};
		const handleBackClick = () => {
			// 返回上一页
			router.back();
		};
		// 修改购物车数据, 参数1: 商品id, 参数2: 购物车数量
		const changeCartCount = (productId, cartNumber) => {
			// 准备shop的所有信息
			const shopInfo = item.value;
			// 通过productId, 获取商品的信息
			const products = rightItems.value;
			// 这段代码用于在 products 数组中查找具有特定 productId 的对象。它使用了 find 方法，通过一个箭头函数来检查每个数组内的元素（这里是 item ）。如果元素的 id 属性与给定的 productId 相匹配，则返回该元素。如果找到匹配项， productInfo 将存储该匹配对象；否则， productInfo 将存储 undefined 。
			const productInfo = products.find((item) => {
				return item.id === productId;
			});
			// 通过mutation, 修改vuex中的数据
			store.commit("changeCartCount", {
				shopInfo,
				productInfo,
				cartNumber,
			});
		};
		// 切换商品的选中状态, 参数1: 商品id
		const changeItemChecked = (productId) => {
			// 获取shop的id
			const shopInfo = item.value;
			const shopId = shopInfo.id;
			// 通过mutation, 修改vuex中的数据, 商品的checked状态取反
			store.commit("changeItemChecked", {
				shopId,
				productId,
			});
		};
		// 计算购物车的总数量, 计算属性
		const total = computed(() => {
			// 定义一个总数量
			let totalNumber = 0;
			// 通过shopId, productId, 获取当前商品在购物车中的数量
			rightItems.value.forEach((element) => {
				// 只有选中的商品, 才计算数量
				if (element.checked) {
					totalNumber += getProductFromVuex(shopId, element.id).cartCount;
				}
			});
			// 返回总数量
			return totalNumber;
		});
		// 计算购物车的总价格, 计算属性
		const sumPrice = computed(() => {
			// 定义一个总价格
			let sumPrice = 0;
			// 通过shopId, productId, 获取当前商品在购物车中的数量
			rightItems.value.forEach((element) => {
				// 只有选中的商品, 才计算价格
				if (element.checked) {
					sumPrice += getProductFromVuex(shopId, element.id).cartCount * element.currentPrice;
				}
			});
			// 返回总价格, 保留两位小数
			return sumPrice.toFixed(2);
		});
		// 定义一个计算属性, 用于判断是否全选
		const allChecked = computed(() => {
			// 默认返回true
			let allChecked = true;
			// 遍历购物车中的所有商品, 如果有一个商品没有选中, 就返回false
			cartItems.value.forEach((element) => {
				if (!element.checked) {
					allChecked = false;
				}
			});
			// 返回是否全选
			return allChecked;
		});
		// 购物车图标的点击事件处理函数
		const cartIconClick = () => {
			// 判断, 如果购物车数量为0, 点击无效
			if (cartItems.value.length === 0) {
				return;
			}
			// 点击购物车图标, 显示购物车列表
			isShowCartList.value = !isShowCartList.value;
		};
		// 购物车遮罩层的点击事件处理函数
		const cartMaskClick = (event) => {
			// 查看触发事件的元素, 如果类名是cart-mask, 才触发
			if (event.target.className !== "cart-mask") {
				return;
			}
			// 相当于点击了购物车图标
			cartIconClick();
		};
		// 切换全选
		const changeAllChecked = () => {
			// 获取shopId
			const shopId = item.value.id;
			// 根据allChecked的值, 确定修改的状态
			const checked = !allChecked.value;
			// 通过mutation, 修改vuex中的数据
			store.commit("changeAllChecked", {
				shopId,
				checked,
			});
		};
		// 清空购物车
		const clearCart = () => {
			// 获取shopId
			const shopId = item.value.id;
			// 通过mutation, 修改vuex中的数据
			store.commit("clearCart", {
				shopId,
			});
			// 清空购物车之后, 隐藏购物车列表
			isShowCartList.value = false;
		};
		return {
			item,
			handleBackClick,
			leftItems,
			currentItemName,
			handleItemClick,
			rightItems,
			changeCartCount,
			total,
			sumPrice,
			isShowCartList, // 是否显示购物车列表
			cartIconClick, // 点击购物车图标的事件处理函数
			cartMaskClick, // 点击购物车遮罩层的事件处理函数
			cartItems, // 购物车列表的数据
			changeItemChecked, // 切换商品的选中状态
			allChecked, // 是否全选
			changeAllChecked, // 切换全选
			clearCart, // 清空购物车
			shopId, // 当前店铺的id
		};
	},
};
</script>
<!-- scoped 的作用, 是为了防止各个组件之间的样式, 互相干扰 -->
<style lang="scss" scoped>
.container {
	overflow: hidden;
	width: 100vw;
	height: 100vh;
	background-color: #fff;
	.head {
		position: relative;
		margin-top: 4.2667vw;
		width: 100vw;
		height: 8.5333vw;
		display: flex;
		align-items: center;
		padding: 0 4.8vw;
		.icon-search {
			position: absolute;
			top: 1.8667vw;
			left: 18.9333vw;
			color: #b7b7b7;
			font-size: 4.8vw;
		}
		.icon-left {
			font-size: 5.8667vw;
			color: #b6b6b6;
			margin-right: 4.2667vw;
		}
		.search-input {
			padding-left: 11.7333vw;
			width: 82.6667vw;
			background: #f5f5f5;
			border-radius: 4.2667vw;
			height: 8.5333vw;
		}
	}
	.shop-container {
		padding: 0 4.8vw;
		height: 28.2667vw;
		width: 100vw;
		display: flex;
		align-items: center;
	}
	.shop-body {
		position: fixed;
		top: 41.0667vw;
		left: 0;
		right: 0;
		bottom: 13.0667vw;
		display: flex;
		.category {
			overflow-y: auto;
			width: 20.2667vw;
			background-color: #f5f5f5;
			.category-item {
				background: #f5f5f5;
				height: 10.6667vw;
				border-radius: 0.5333vw;
				font-family: PingFangSC-Regular;
				font-size: 3.7333vw;
				color: #333333;
				text-align: center;
				line-height: 10.6667vw;
				&.active {
					background: #ffffff;
					font-weight: 700;
				}
			}
		}
		.detail {
			flex-grow: 1;
			overflow-y: auto;
			.detail-item {
				width: 70.6667vw;
				height: 24.5333vw;
				padding: 3.2vw 0;
				border-bottom: 0.2667vw solid #f1f1f1;
				margin: 0 auto;
				display: flex;
				.left {
					.product-img {
						width: 18.1333vw;
						height: 18.1333vw;
						object-fit: cover;
						margin-right: 4.2667vw;
					}
				}
				.right {
					flex-grow: 1;
					display: flex;
					flex-direction: column;
					.product-title {
						padding-bottom: 4.5vw;
						width: 48.26vw;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						font-family: PingFangSC-Medium;
						font-weight: 500;
						font-size: 3.7333vw;
						color: #333333;
						margin-bottom: 1.6vw;
					}
					.product-sale {
						font-family: PingFangSC-Regular;
						font-size: 3.2vw;
						color: #333333;
						line-height: 4.2667vw;
						margin-bottom: 1.6vw;
					}
					.product-data {
						display: flex;
						justify-content: space-between;
						align-items: center;
						.data-left {
							.current-price {
								font-family: PingFangSC-Semibold;
								font-weight: 900;
								font-size: 3.7333vw;
								color: #e93b3b;
								line-height: 5.3333vw;
								margin-right: 1.6vw;
								&::before {
									content: "¥";
									font-size: 2.6667vw;
								}
							}
							.previous-price {
								font-family: PingFangSC-Regular;
								font-size: 2.6667vw;
								color: #999999;
								line-height: 5.3333vw;
								text-decoration: line-through;
							}
						}
						.data-right {
							display: flex;
							align-items: center;
							.iconfont {
								font-size: 5.8667vw;
								&.icon-minus-circle {
									color: #666;
									font-size: 6.1333vw;
								}
								&.icon-plus-circle-fill {
									display: inline-block;
									transform: translateY(-0.2667vw);
									color: #0091ff;
								}
							}
							.product-count {
								margin: 0 2.6667vw;
								font-family: PingFangSC-Regular;
								font-size: 3.7333vw;
								color: #333333;
								line-height: 4.2667vw;
							}
						}
					}
				}
			}
		}
	}
	@import "../../style/foot-common.scss";
	.foot {
		.router-link-a {
			flex-grow: 1;
		}
		.left {
			padding-left: 6.4vw;
			.dot {
				position: absolute;
				left: 12.5333vw;
				top: 1.8667vw;
				min-width: 2.6667vw;
				height: 2.6667vw;
				padding: 0.5333vw;
				background: #e93b3b;
				border-radius: 2.6667vw;
				text-align: center;
				line-height: 1.6vw;
				color: #fff;
				font-size: 2.1333vw;
			}
			.cart-img {
				width: 7.4667vw;
			}
			.left-title {
				font-family: PingFangSC-Regular;
				font-size: 3.2vw;
				color: #333333;
				transform: translateY(0.2667vw);
			}
			.left-price {
				font-family: PingFangSC-Medium;
				font-weight: 500;
				font-size: 4.8vw;
				color: #e93b3b;
			}
		}
	}
}
.cart-mask {
	// 默认关闭
	// display: none;
	position: fixed;
	top: 0;
	right: 0;
	bottom: 49px;
	left: 0;
	background: rgba(0, 0, 0, 0.5);
	.cart-info {
		background-color: #fff;
		position: absolute;
		bottom: 0;
		.cart-top {
			width: 100vw;
			padding: 18px;
			height: 52px;
			background-color: #fff;
			border-bottom: 1px solid #f1f1f1;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.left {
				display: flex;
				align-items: center;
				.iconfont {
					margin-right: 8px;
					font-size: 22px;
					&.icon-Checkbox_unselected2 {
						color: #666;
					}
					&.icon-selected {
						color: #0091ff;
					}
				}
				.text {
					font-family: PingFangSC-Regular;
					font-size: 14px;
					color: #333333;
					line-height: 16px;
				}
			}
			.button {
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #333333;
				text-align: right;
				line-height: 16px;
			}
		}
		.cart-content {
			max-height: 380px;
			overflow-y: auto;
			.cart-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100vw;
				height: 46px;
				margin: 16px 0;
				padding: 0 18px;
				.left {
					display: flex;
					align-items: center;
					.iconfont {
						margin-right: 16px;
						font-size: 22px;
						&.icon-Checkbox_unselected2 {
							color: #666;
						}
						&.icon-selected {
							color: #0091ff;
						}
					}
					.cart-img {
						width: 46px;
						height: 46px;
						object-fit: cover;
						margin-right: 16px;
					}
					.product-info {
						.product-title {
							font-family: PingFangSC-Medium;
							font-weight: 500;
							font-size: 14px;
							color: #333333;
							margin-bottom: 6px;
							width: 42.66vw;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
						.product-data {
							.current-price {
								font-family: PingFangSC-Semibold;
								font-weight: 900;
								font-size: 3.7333vw;
								color: #e93b3b;
								line-height: 5.3333vw;
								margin-right: 1.6vw;
								&::before {
									content: "¥";
									font-size: 2.6667vw;
								}
							}
							.previous-price {
								font-family: PingFangSC-Regular;
								font-size: 2.6667vw;
								color: #999999;
								line-height: 5.3333vw;
								text-decoration: line-through;
							}
						}
					}
				}
				.right {
					display: flex;
					align-items: center;
					.iconfont {
						font-size: 5.8667vw;
						&.icon-minus-circle {
							color: #666;
							font-size: 6.1333vw;
						}
						&.icon-plus-circle-fill {
							display: inline-block;
							transform: translateY(-0.2667vw);
							color: #0091ff;
						}
					}
					.product-count {
						margin: 0 2.6667vw;
						font-family: PingFangSC-Regular;
						font-size: 3.7333vw;
						color: #333333;
						line-height: 4.2667vw;
					}
				}
			}
		}
	}
}
</style>
