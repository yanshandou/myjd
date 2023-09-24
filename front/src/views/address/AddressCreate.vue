<template>
	<div class="container">
		<div class="head">
			<span class="iconfont icon-left" @click="backToAddressList"></span>
			<span class="title">新建收货地址</span>
			<span class="button" @click="submitForm">保存</span>
		</div>
		<div class="info">
			<div class="item">
				<span class="text">所在城市：</span>
				<input v-model="address.city" type="text" class="input-item" placeholder="如北京市" />
			</div>
			<div class="gap"></div>
			<div class="item">
				<span class="text">小区/大厦/学校：</span>
				<input v-model="address.community" type="text" class="input-item" placeholder="如理工大学国防科技园" />
			</div>
			<div class="gap"></div>
			<div class="item">
				<span class="text">楼号-门牌号：</span>
				<input v-model="address.building" type="text" class="input-item" placeholder="A号楼B层" />
			</div>
			<div class="gap"></div>
			<div class="item">
				<span class="text">收货人：</span>
				<input v-model="address.receiveName" type="text" class="input-item" placeholder="请填写收货人的姓名" />
			</div>
			<div class="gap"></div>
			<div class="item">
				<span class="text">联系电话：</span>
				<input v-model="address.phone" type="text" class="input-item" placeholder="请填写收货手机号" />
			</div>
		</div>
	</div>
	<Toast v-if="toastData.isShowToast" :message="toastData.toastMessage" />
</template>
<script>
import router from "@/router";
import { reactive } from "vue";
// 引入弹框组件
import Toast, { showToastEffect } from "@/components/Toast.vue";
import Schema from "async-validator";
import { post } from "@/utils/request.js";
export default {
	name: "AddressCreate",
	components: {
		Toast,
	},
	setup() {
		// 调用封装好的弹框相关的代码
		const { showToast, toastData } = showToastEffect();
		// 跳转到地址列表页面
		const backToAddressList = () => {
			router.push("/address-list");
		};
		// 定义地址对象, 用于收集表单数据
		const address = reactive({
			// 城市
			city: "",
			// 小区
			community: "",
			// 楼号
			building: "",
			// 收货人
			receiveName: "",
			// 联系电话
			phone: "",
		});

		const rule = {
			city: [
				{
					required: true, // 必填
					message: "城市不能为空", // 提示信息
				},
			],
			community: [
				{
					required: true, // 必填
					message: "小区不能为空", // 提示信息
				},
			],
			building: [
				{
					required: true,
					message: "楼号不能为空",
				},
			],
			receiveName: [
				{
					required: true,
					message: "收货人不能为空",
				},
				{
					pattern: /^[\u4e00-\u9fa5]{2,4}$/, // 中文名字
					message: "请输入有效的中文名字", // 提示信息
				},
			],
			phone: [
				{
					required: true,
					message: "联系电话不能为空",
				},
				{
					pattern: /^1[0-9]{10}$/, // 手机号码
					message: "请输入有效的手机号码", // 提示信息
				},
			],
		};
		// 校验表单
		const validateForm = async () => {
			// 创建校验器
			const validator = new Schema(rule);
			try {
				// 校验, 参数是要校验的对象, 就是收集到的表单数据
				await validator.validate(address);
				// 校验成功
				console.log("校验成功");
				// 调用接口, 保存地址
				console.log(address);
				// address 转成普通对象
				const data = JSON.parse(JSON.stringify(address));
				// 发送请求, 获取响应数据
				const res = await post("/user/address", data);
				// 判断错误码
				if (res.errno === 0) {
					// 创建地址成功
					showToast("创建地址成功");
					// 1秒之后跳转到地址列表页
					setTimeout(() => {
						// 跳转到地址列表页
						router.push("/address-list");
					}, 1000);
				} else {
					// 登录失败, 提示用户, res.msg是错误信息
					showToast(res.msg);
				}
			} catch (errors) {
				// 校验失败
				showToast(errors.errors[0].message);
			}
		};
		// 提交表单
		const submitForm = () => {
			// 校验表单
			validateForm();
		};
		return {
			backToAddressList,
			address,
			submitForm,
			toastData,
		};
	},
};
</script>
<style lang="scss" scoped>
@import "../../style/address-common.scss";
</style>
