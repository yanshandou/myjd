<template>
	<div class="container">
		<div class="head">
			<span class="iconfont icon-left" @click="backToUser"></span>
			<span class="title">管理收货地址</span>
			<span class="button" @click="createAddress">新建</span>
		</div>
		<div class="title">我的收货地址</div>
		<div class="address-list">
			<div @click="toEditAddress(address.id)" v-for="address of addressList" :key="address.id" class="address-item">
				<div class="left">
					<div class="top">
						<span class="username">{{ address.receiveName }}</span>
						<span class="phone">{{ address.phone }}</span>
					</div>
					<div class="bottom">
						<p class="address-info">{{ address.city }} {{ address.community }} {{ address.building }}</p>
					</div>
				</div>
				<div class="right">
					<span class="iconfont icon-right"></span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { onMounted } from "vue";
import { ref } from "vue";
import router from "@/router";
// 引入get
import { get } from "@/utils/request";
export default {
	name: "AddressList",
	setup() {
		// 从接口中获取地址列表
		const addressList = ref([]);
		const getAddressList = async () => {
			// 通过ajax, 商铺相关的信息
			const res = await get(`/user/address`);
			addressList.value = res.data;
		};
		// 调用接口
		onMounted(() => {
			getAddressList();
		});
		// 跳转到新建地址页面
		const createAddress = () => {
			// 路由跳转
			router.push("/address-create");
		};
		// 跳转到用户页面
		const backToUser = () => {
			router.push("/user");
		};
		// 跳转到编辑地址页面
		const toEditAddress = (id) => {
			router.push(`/address-edit/${id}`);
		};
		return {
			addressList,
			createAddress,
			backToUser,
			toEditAddress,
		};
	},
};
</script>
<style lang="scss" scoped>
.container {
	width: 100vw;
	height: 100vh;
	background-color: #f8f8f8;
	@import "../../style/head-common.scss";
	.title {
		margin: 3.2vw 0;
		padding-left: 4.8vw;
		font-family: PingFangSC-Regular;
		font-size: 3.7333vw;
		color: #333333;
	}
	.address-list {
		.address-item {
			width: 90.4vw;
			height: 27.7333vw;
			background: #ffffff;
			border-radius: 1.0667vw;
			margin: 0 auto 4.2667vw;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 4.2667vw;
			.left {
				.top {
					margin-bottom: 2.1333vw;
					font-family: PingFangSC-Regular;
					font-size: 3.7333vw;
					color: #999999;
					.username {
						margin-right: 17.6vw;
					}
				}
				.bottom {
					.address-info {
						width: 69.3333vw;
						font-family: PingFangSC-Regular;
						font-size: 3.7333vw;
						color: #333333;
						line-height: 5.8667vw;
					}
				}
			}
			.right {
				.iconfont {
					font-size: 4.2667vw;
					color: #999999;
				}
			}
		}
	}
}
</style>
