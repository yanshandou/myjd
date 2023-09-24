<template>
	<div class="toast">{{ message }}</div>
</template>
<script>
// 导入 reactive
import { reactive } from "vue";
export default {
	name: "Toast",
	// 接收父组件传递过来的数据
	props: {
		message: {
			type: String, // 指定数据类型
			default: "", // 默认值
		},
	},
};
export const showToastEffect = () => {
	// 定义响应式数据, 用来存储弹框相关的数据
	const toastData = reactive({
		isShowToast: false, // 是否显示弹框
		toastMessage: "", // 弹框的内容
	});

	// 封装弹框的方法
	const showToast = (message) => {
		toastData.isShowToast = true; // 显示弹框
		toastData.toastMessage = message; // 设置弹框的内容
		setTimeout(() => {
			toastData.isShowToast = false; // 隐藏弹框
			toastData.toastMessage = ""; // 清空弹框的内容
		}, 1000);
	};
	// 返回数据
	return { showToast, toastData };
};
</script>
<style lang="scss" scoped>
.toast {
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	background-color: rgba(0, 0, 0, 0.5);
	padding: 3vw;
	border-radius: 1vw;
	color: #fff;
}
</style>
