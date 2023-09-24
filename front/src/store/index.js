import { createStore } from "vuex";

// 把购物车放入缓存
const setLocalCartData = (state) => {
	// 把购物相关数据解构出来/获取购物车数据
	const { cartData } = state;
	// 对象转json字符串
	const cartDataString = JSON.stringify(cartData);
	// 保存到localStorage
	localStorage.cartData = cartDataString;
};

// 从缓存中获取购物车数据
const getLocalCartData = () => {
	let result = [];
	// 判断localStorage里面是否有数据
	if (localStorage.cartData) {
		result = JSON.parse(localStorage.cartData);
	}
	// 返回数据
	return result;
};

export default createStore({
	state: {
		// 购物车数据, 默认从缓存中获取
		cartData: getLocalCartData(),
		// cartData: [
		// 	{
		// 		id: 1, // 商铺id
		// 		logo: "https://markdown-1253389072.cos.ap-nanjing.myqcloud.com/202202211407079.png", // 商铺logo
		// 		title: "沃尔玛-2", // 商铺名称
		// 		tags: ["月售2万+", "起送¥2", "基础运费¥2"], // 商铺标签
		// 		promotion: "VIP尊享满89元减4元运费券（每月2张）", // 商铺优惠
		// 		products: [
		// 			{
		// 				id: 1, // 商品id
		// 				title: "全部-番茄150g/份(全部)", // 商品名称
		// 				img: "https://markdown-1253389072.cos.ap-nanjing.myqcloud.com/202202261527635.png", // 商品图片
		// 				sale: 1, // 商品销量
		// 				currentPrice: 1.6, // 商品现价
		// 				previousePrice: 1.6, // 商品原价
		// 				cartCount: 88, // 商品数量, 购物车数量
		// 				tags: ["all"], // 商品标签
		//				checked:true, // 商品是否选中
		// 			}, // 商品
		// 			{
		// 				id: 2, // 商品id
		// 				title: "全部-番茄250g/份(全部,秒杀)", // 商品名称
		// 				img: "https://markdown-1253389072.cos.ap-nanjing.myqcloud.com/202202261527635.png", // 商品图片
		// 				sale: 2, // 商品销量
		// 				currentPrice: 2.6, // 商品现价
		// 				previousePrice: 2.6, // 商品原价
		// 				cartCount: 89, // 商品数量, 购物车数量
		// 				tags: ["all", "seckill"], // 商品标签
		//				checked:true, // 商品是否选中
		// 			}, // 商品
		// 			{
		// 				id: 3,
		// 				title: "全部-番茄250g/份(全部,秒杀,新鲜水果)",
		// 				img: "https://markdown-1253389072.cos.ap-nanjing.myqcloud.com/202202261527635.png",
		// 				sale: 3,
		// 				currentPrice: 3.6,
		// 				previousePrice: 3.6,
		// 				cartCount: 90,
		// 				tags: ["all", "seckill", "fruit"],
		//				checked:true, // 商品是否选中
		// 			},
		// 		], // 商品数组
		// 	}, // 商铺
		// ],
	},
	getters: {},
	mutations: {
		// 修改购物车数量
		changeCartCount(state, payload) {
			// 从payload中获取传过来的参数
			const { shopInfo, productInfo, cartNumber } = payload;
			// 先判断state中是否有shopInfo这个商铺
			const shop = state.cartData.find((item) => {
				if (item.id === shopInfo.id) {
					return true;
				}
			});
			// 如果没有这个商铺, 则添加这个商铺, 已经商品的购物车信息
			if (!shop) {
				// 修改商品的购物车数量
				productInfo.cartCount += cartNumber;
				// 修改购物车数量之后, 把商品选中
				productInfo.checked = true;
				// 把商品加入到shopInfo中
				shopInfo.products = [];
				shopInfo.products.push(productInfo);
				// 把shopInfo加入到state.cartData中
				state.cartData.push(shopInfo);
			} else {
				// 如果有这个商铺, 则判断这个商铺中是否有这个商品
				const product = shop.products.find((item) => {
					if (item.id === productInfo.id) {
						return true;
					}
				});
				// 如果没有这个商品, 则添加这个商品
				if (!product) {
					// 修改商品的购物车数量
					productInfo.cartCount += cartNumber;
					// 修改购物车数量之后, 把商品选中
					productInfo.checked = true;
					// 把商品加入到shopInfo中
					shop.products.push(productInfo);
				} else {
					// 如果有这个商品, 则修改这个商品的购物车数量
					product.cartCount += cartNumber;
					// 修改购物车数量之后, 把商品选中
					product.checked = true;
					// 如果购物车数量为0, 则删除这个商品
					if (product.cartCount === 0) {
						// 获取这个商品的索引
						const index = shop.products.findIndex((item) => {
							if (item.id === product.id) {
								return true;
							}
						});
						// 删除这个商品
						shop.products.splice(index, 1);
						// 如果这个商铺中没有商品了, 则删除这个商铺
						if (shop.products.length === 0) {
							// 获取这个商铺的索引
							const index = state.cartData.findIndex((item) => {
								if (item.id === shop.id) {
									return true;
								}
							});
							// 删除这个商铺
							state.cartData.splice(index, 1);
						}
					}
				}
			}
			// 把购物车数据存储到本地
			setLocalCartData(state);
		},
		// 修改商品的选中状态
		changeItemChecked(state, payload) {
			// 获取shopId和productId
			const { shopId, productId } = payload;
			// 通过shopId和productId找到对应的商品
			// 通过shopId找到对应的商铺
			const shop = state.cartData.find((item) => {
				if (item.id === shopId) {
					return true;
				}
			});
			// 通过productId找到对应的商品
			const product = shop.products.find((item) => {
				if (item.id === productId) {
					return true;
				}
			});
			// 修改商品的选中状态
			product.checked = !product.checked;
			// 把购物车数据存储到本地
			setLocalCartData(state);
		},
		// 设置全选
		changeAllChecked(state, payload) {
			// 获取shopId和checked
			const { shopId, checked } = payload;
			// 通过shopId找到对应的商铺
			const shop = state.cartData.find((item) => {
				if (item.id === shopId) {
					return true;
				}
			});
			// 修改商铺的所有购物车商品的选中状态
			shop.products.forEach((item) => {
				item.checked = checked;
			});
			// 把购物车数据存储到本地
			setLocalCartData(state);
		},
		// 清空购物车
		clearCart(state, payload) {
			// 获取shopId
			const { shopId } = payload;
			// 把对应的商铺删除
			state.cartData = state.cartData.filter((item) => {
				if (item.id === shopId) {
					return false;
				} else {
					return true;
				}
			});
			// 把购物车数据存储到本地
			setLocalCartData(state);
		},
	},
	actions: {},
	modules: {},
});
