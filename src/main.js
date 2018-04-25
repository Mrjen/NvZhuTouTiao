import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [
      "^pages/index/main",
      "pages/editUserInfo/main",
      "pages/chatRoom/main",
      "pages/details/main",
      "pages/feedback/main",
      "pages/message/main",
      "pages/mycenter/main",
      "pages/search/main",
      "pages/commList/main",
      "pages/likesList/main",
      "pages/messageDetail/main"
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#7c48c6",
      navigationBarTitleText: "女主说",
      navigationBarTextStyle: "white",
      enablePullDownRefresh: true,
      backgroundColor: "#e9e9e9",
      onReachBottomDistance: 250
    },
    tabBar: {
      color: "#333333",
      selectedColor: "#793292",
      backgroundColor: "#F5F4F1",
      borderStyle: "black",
      list: [
        {
          pagePath: "pages/index/main",
          text: "话题",
          iconPath: "pages/image/index.png",
          selectedIconPath: "pages/image/h_index.png"
        },
        {
          pagePath: "pages/mycenter/main",
          text: "我的",
          iconPath: "pages/image/mycenter.png",
          selectedIconPath: "pages/image/h_myCenter.png"
        }
      ]
    }
  }
};
