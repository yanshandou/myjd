<template>
	<div class="container">
		<div class="head">
			<img src="../../assets/img/head-img.png" alt="" class="head-img" />
		</div>
		<div class="info">
			<input type="text" v-model="data.username" class="input-item phone" placeholder="请输入手机号" />
			<input type="password" v-model="data.password" class="input-item pwd" placeholder="请输入密码" />
			<input type="password" v-model="data.confirmPassword" class="input-item confirm-pwd" placeholder="确认密码" />
		</div>
		<div class="button" @click="handleRegister">注册</div>
		<div class="button-group">
			<a href="javascript:;" @click="handleLogin" class="button-group-item login-now">已有账号去登录</a>
		</div>
	</div>
	<Toast v-if="toastData.isShowToast" :message="toastData.toastMessage" />
</template>
<script>
// 引入reactive, 用于创建响应式数据
import { reactive } from "vue";
// 引入useRouter, 用于路由跳转
import { useRouter } from "vue-router";
// 从封装好的文件中, 导入post方法
import { post } from "@/utils/request.js";
// 引入弹框组件
import Toast, { showToastEffect } from "@/components/Toast.vue";

export default {
	name: "Register",
	// 注册组件
	components: {
		Toast,
	},
	setup() {
		// 获取路由实例
		const router = useRouter();
		// 调用封装好的弹框相关的代码
		const { showToast, toastData } = showToastEffect();
		// 创建响应式数据, 用来存储用户输入的手机号和密码
		const data = reactive({
			username: "", // 手机号
			password: "", // 密码
			confirmPassword: "", // 确认密码
		});

		// 点击立即登录按钮
		const handleLogin = () => {
			// 跳转到登录页面
			router.push({ name: "Login" });
		};
		// 点击注册按钮
		const handleRegister = async () => {
			// 判断手机号和密码是否为空
			if (data.username.trim() === "" || data.password.trim() === "") {
				// 提示用户
				showToast("手机号或密码不能为空");
				// 终止代码执行
				return;
			}
			// 使用正则判断手机号是否合法
			const reg = /^1[3-9]\d{9}$/;
			// 使用正则.test(字符串), 判断字符串是否符合正则规则
			if (!reg.test(data.username)) {
				// 提示用户
				showToast("手机号不合法");
				// 终止代码执行
				return;
			}
			// 判断密码和确认密码是否一致
			if (data.password !== data.confirmPassword) {
				// 提示用户
				showToast("密码和确认密码不一致");
				// 终止代码执行
				return;
			}

			// 发送ajax请求, 通过手机号和密码注册新用户
			try {
				// 发送请求, 获取响应数据
				const res = await post("/user/register", {
					username: data.username,
					password: data.password,
				});
				// 判断错误码
				if (res.errno === 0) {
					// 注册成功
					// 设置登录状态, 把登录状态存储到localStorage中
					localStorage.setItem("isLogin", "true");
					// 跳转到首页, 通过路由跳转, push的参数是一个对象, 通过name指定跳转的路由
					router.push({ name: "Home" });
				} else {
					// 登录失败, 提示用户, res.msg是错误信息
					showToast(res.msg);
				}
			} catch (error) {
				showToast(error);
			}
		};
		return { handleLogin, handleRegister, data, toastData };
	},
};
</script>
<style lang="scss" scoped>
// 引入登录注册的公共样式
@import "../../style/login-register-common.scss";
</style>
