<template>
	<div class="head">
		<div class="head-info">
			<div class="left">
				<span class="iconfont icon-location"></span>
				<span class="address">北京理工大学国防科技园2号楼10层</span>
			</div>
			<span class="iconfont icon-notice"></span>
		</div>
		<Search />
	</div>
</template>
<script>
// 引入组件
import Search from "./Search.vue";
export default {
	// 组件名
	name: "Header",
	// 注册组件
	components: {
		Search,
	},
};
</script>
<style lang="scss" scoped>
.head {
	background-color: #fff;
	position: fixed;
	height: 26.1333vw;
	padding: 4.2667vw 4.8vw 3.2vw;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.head-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		.left {
			display: flex;
			align-items: center;
			.iconfont {
				margin-right: 2.4vw;
				font-size: 5.8667vw;
				&.icon-location {
					color: #333333;
				}
			}
			.address {
				font-family: PingFangSC-Regular;
				font-size: 4.2667vw;
				color: #333333;
			}
		}
		.iconfont {
			font-size: 5.8667vw;

			&.icon-notice {
				color: #000;
			}
		}
	}
	
}
</style>
