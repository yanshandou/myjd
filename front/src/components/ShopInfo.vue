<template>
	<div class="nearby-item">
		<div class="left">
			<img :src="item.logo" alt="" class="shop-logo" />
		</div>
		<div :class="{ right: true, line: showBorder }">
			<div class="shop-title">{{ item.title }}</div>
			<div class="tags">
				<span v-for="(tag, tagIndex) of item.tags" :key="tagIndex" class="tag-item">{{ tag }}</span>
			</div>
			<div class="promotion">{{ item.promotion }}</div>
		</div>
	</div>
</template>
<script>
export default {
	// 组件名
	name: "ShopInfo",
	// 接收父组件传递过来的数据
	props: {
		// 店铺的信息
		item: {
			type: Object, // 数据类型
		},
		// 是否显示下边框, 默认显示
		showBorder: {
			type: Boolean,
			default: true,
		},
	},
};
</script>
<style lang="scss" scoped>
.nearby-item {
	height: 22.9333vw;
	margin-bottom: 3.2vw;
	&:last-child {
		margin-bottom: 0;
	}
	display: flex;
	.left {
		.shop-logo {
			width: 14.9333vw;
			margin-right: 4.2667vw;
			margin-top: 1.3333vw;
		}
	}
	.right {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		&.line {
			border-bottom: 0.2667vw solid #f1f1f1;
		}
		.shop-title {
			font-family: PingFangSC-Regular;
			font-size: 4.2667vw;
			color: #333333;
		}
		.tags {
			display: flex;
			.tag-item {
				font-family: PingFangSC-Regular;
				font-size: 3.4667vw;
				color: #333333;
				margin-right: 4.2667vw;
			}
		}
		.promotion {
			font-family: PingFangSC-Regular;
			font-size: 3.4667vw;
			color: #e93b3b;
		}
	}
}
</style>
