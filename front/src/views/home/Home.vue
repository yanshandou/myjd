<template>
	<div class="container">
		<Header />
		<Banner />
		<Category />
		<Gap />
		<Nearby />
	</div>
	<Tabbar tag="home" />
</template>
<script>
// 引入组件
import Header from "./Header.vue";
import Banner from "./Banner.vue";
import Category from "./Category.vue";
import Gap from "./Gap.vue";
import Nearby from "./Nearby.vue";
import Tabbar from "@/components/Tabbar.vue";
export default {
	// 注册组件
	components: {
		Header,
		Banner,
		Category,
		Gap,
		Nearby,
		Tabbar,
	},
};
</script>
<!-- scoped 的作用, 是为了防止各个组件之间的样式, 互相干扰 -->
<style lang="scss" scoped>
.container {
	width: 100vw;
	height: 100vh;
	background-color: #fff;
	overflow: auto;
}
</style>
