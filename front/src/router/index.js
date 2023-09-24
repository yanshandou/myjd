import { createRouter, createWebHashHistory } from "vue-router";
// 引入Home组件
// import Home from "../views/home/Home.vue";
// 引入Login组件
// import Login from "../views/login/Login.vue";
// 引入Register组件
// import Register from "../views/register/Register.vue";
// 引入Shop组件
// import Shop from "../views/shop/Shop.vue";

// 配置路由
const routes = [
	// 配置home路由
	{
		path: "/", // 路径
		name: "Home", // 路由名称
		// 这段代码是Vue.js中异步加载组件的语法，它会动态地从 "../views/home/Home.vue" 文件中导入并渲染出 Home 组件。当路由到该组件时才会进行加载，以提高应用程序的性能和效率
		component: () => import("../views/home/Home.vue"), // 对应的组件
	},
	// 配置shop路由
	{
		path: "/shop/:id", // 路径, :id表示商铺id
		name: "Shop", // 路由名称
		component: () => import("../views/shop/Shop.vue"), // 对应的组件
	},
	// 配置确认order的路由
	{
		path: "/order-confirmation/:id", // 路径, :id表示商铺id
		name: "OrderConfirmation", // 路由名称
		component: () => import("../views/order/OrderConfirmation.vue"), // 对应的组件
	},
	// 配置orderList路由
	{
		path: "/order-list", // 路径
		name: "OrderList", // 路由名称
		component: () => import("../views/order/OrderList.vue"), // 对应的组件
	},
	// 配置地址列表路由
	{
		path: "/address-list", // 路径
		name: "AddressList", // 路由名称
		component: () => import("../views/address/AddressList.vue"), // 对应的组件
	},
	// 配置地址创建路由
	{
		path: "/address-create", // 路径
		name: "AddressCreate", // 路由名称
		component: () => import("../views/address/AddressCreate.vue"), // 对应的组件
	},
	// 配置地址编辑路由
	{
		path: "/address-edit/:id", // 路径
		name: "AddressEdit", // 路由名称
		component: () => import("../views/address/AddressEdit.vue"), // 对应的组件
	},
	// 配置购物车路由
	{
		path: "/cart", // 路径
		name: "Cart", // 路由名称
		component: () => import("../views/cart/Cart.vue"), // 对应的组件
	},
	// 配置用户中心路由
	{
		path: "/user", // 路径
		name: "User", // 路由名称
		component: () => import("../views/user/User.vue"), // 对应的组件
	},
	// 配置register路由
	{
		path: "/register", // 路径
		name: "Register", // 路由名称
		component: () => import("../views/register/Register.vue"), // 对应的组件
		// 访问register页面之前执行
		beforeEnter: (to, from, next) => {
			// 判断是否登录, 如果登录了, 则跳转到首页, 否则继续执行
			if (localStorage.isLogin === "true") {
				next({ name: "Home" });
			} else {
				next();
			}
		},
	},
	// 配置login路由
	{
		path: "/login", // 路径
		name: "Login", // 路由名称
		component: () => import("../views/login/Login.vue"), // 对应的组件
		// 访问login页面之前执行
		beforeEnter: (to, from, next) => {
			// 判断是否登录, 如果登录了, 则跳转到首页, 否则继续执行
			if (localStorage.isLogin === "true") {
				next({ name: "Home" });
			} else {
				next();
			}
		},
	},
];

// 创建路由对象
const router = createRouter({
	history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
	routes, // 路由配置
});

// to 跳到哪里去
// from 从哪里跳过来
// next 继续执行
router.beforeEach((to, from, next) => {
	// 判断是否登录, 如果登录了, 则继续执行, 否则跳转到登录页面
	if (localStorage.isLogin === "true" || to.name === "Login" || to.name === "Register") {
		// 或者没有登录, 但是要跳转到登录页面, 或者注册页面, 则继续执行
		next();
	} else {
		// 跳转到登录页面
		next({ name: "Login" });
	}
});

// 导出路由对象
export default router;
