<template>
	<div class="container">
		<div class="head">
			<img src="../../assets/img/head-img.png" alt="" class="head-img" />
		</div>
		<div class="info">
			<input type="text" v-model="data.username" class="input-item phone" placeholder="请输入手机号" />
			<input type="password" v-model="data.password" class="input-item pwd" placeholder="请输入密码" />
		</div>
		<div @click="handleLogin" class="button">登录</div>
		<div class="button-group">
			<a href="javascript:;" @click="handleRegister" class="button-group-item register-now">立即注册</a>
			<span class="gap button-group-item">|</span>
			<a href="javascript:;" class="forget-password button-group-item">忘记密码</a>
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
	name: "Login",
	components: {
		Toast,
	},
	setup() {
		// 调用封装好的弹框相关的代码
		const { showToast, toastData } = showToastEffect();

		// 创建响应式数据, 用来存储用户输入的手机号和密码
		const data = reactive({
			username: "", // 手机号
			password: "", // 密码
		});

		// 获取路由实例
		const router = useRouter();
		// 点击登录按钮
		const handleLogin = async () => {
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
			// 发送ajax请求, 判断手机号和密码是否正确
			try {
				// 发送请求, 获取响应数据
				const res = await post("/user/login", {
					username: data.username,
					password: data.password,
				});

				// 判断错误码
				if (res.errno === 0) {
					// 登录成功
					// 设置登录状态, 把登录状态存储到localStorage中
					localStorage.setItem("isLogin", "true");
					// 跳转到首页, 通过路由跳转, push的参数是一个对象, 通过name指定跳转的路由
					router.push({ name: "Home" });
				} else {
					// 登录失败, 提示用户, res.message是错误信息
					showToast(res.message);
				}
			} catch (error) {
				showToast(error);
			}
		};
		// 点击立即注册按钮
		const handleRegister = () => {
			// 跳转到注册页面
			router.push({ name: "Register" });
		};
		return { handleLogin, handleRegister, data, toastData };
	},
};
</script>
<style lang="scss" scoped>
// 引入登录注册的公共样式
@import "../../style/login-register-common.scss";
</style>
