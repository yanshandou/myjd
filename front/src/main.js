import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 引入normalize.css, 重置浏览器默认样式
// import "normalize.css";
// 引入字体图标
import "./assets/font/iconfont.css";
// 引入reset.css, 重置浏览器默认样式
import "./style/reset.css";

createApp(App).use(store).use(router).mount("#app");
