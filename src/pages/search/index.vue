<template>
  <div class="search">
    <view class="searchPage">
      <!-- 搜索输入框 -->
      <view class="readBg space_b">
        <view class="searchBgIn readBg">
          <image src="../image/searchInput.png" class="searchImg" />
          <input class="searchInputContent" @input="searchArticle" v-model="searchWord" placeholder="搜索相关内容" placeholder-class="inputPlaceholder" />
        </view>
        <view class="reduce" :class="searchWord?'hasword':''" @click="clearWords">取消</view>
      </view>
      <!-- <view class="search-list">
            <view class="search-item" 
                  v-for="(item,idx) in keywordsList" 
                  @click="tapArticle(item.id)">{{item.title}}</view>
         </view> -->
      <view v-if="!searchWord">
        <!-- 女主热搜 -->
        <view class="hotSearch">女主热搜</view>
        <view class="wrap">
          <view class="hotSearchRank" v-for="item in hotsearch" :key="item.id">{{item.title}}</view>
          <view class="manyHot" @tap="toIndex()">更多热门话题>></view>
        </view>
        <!-- 搜索历史 -->
        <view class="historySearch" v-if="historySearch.length">搜索历史</view>
        <view v-for="(item,idex) in historySearch" :key="item.id" class="readBg space_b historyList">
          <view class="readBg">
            <image src="../image/clock.png" class="clock" />
            <view class="historyTitle">{{item}}</view>
          </view>
          <image src="../image/delete.png" class="delete" />
        </view>
        <view class="readBg historyList" v-if="historySearch.length">
          <image src="../image/clear.png" class="clear" />
          <view class="manyHot" @click="clearSearchHistory">清空搜索历史</view>
        </view>
      </view>
    </view>
    <view v-if="searchWord">
      <view class="about">
        相关话题
      </view>
      <view class="topic topic_Tboder" v-for="article in articleList">
        <view class="topic_top" @tap="toDetails()">
          <view class="topic_title">{{article.title}}</view>
          <view class="cover-box">
            <image class="topic_img" :src="article.cover" />
          </view>
          <view class="topic_bottom">
            <view class="readBg">
              <view class="read">阅读</view>
              <view class="read_time">{{article.readtimes}}</view>
            </view>
            <view class="read">{{article.create_time}}</view>
          </view>
        </view>
        <view class="button_flex">
          <button class="three_button" hover-class="three_button_focus">
              <image src="../image/share.png" class="topic_button" />
              <view>{{article.sharetimes}}</view>
            </button>
          <button class="three_button" hover-class="three_button_focus" @tap="toDetails()">
              <image src="../image/comment.png" class="topic_button_w" />
              <view>{{article.commenttimes}}</view>
            </button>
          <button class="three_button" hover-class="three_button_focus">
              <image src="../image/like.png" class="topic_button_o" />
              <view>{{article.liketimes}}</view>
            </button>
        </view>
      </view>
    </view>
  </div>
</template>

<script>
  import wxRequest from "../../utils/http.js";
  import api from "../../utils/api.js";
  import utils from '../../utils/utils'
  export default {
    data() {
      return {
        searchEnd: true,
        hotsearch: [],
        articleList: [],
        searchWord: '',
        keywordsList: [],
        historySearch: [],
        page: 1
      }
    },
    async created() {
      let hotsearch = await wxRequest(api.HotSearch, {}, 'POST');
      this.hotsearch = hotsearch.data.data;
      console.log('hotsearch', HistorySearch)
    },
    watch: {
      searchWord(val, old) {
        console.log(val, old)
        // this.searchHot(val)
      }
    },
    onShow() {
      console.log('onshow')
      this.searchHostery()
    },
    onReachBottom() {
      this.searchHot({
        page: this.page
      })
    },
    methods: {
      //  点击更多热门
      toIndex() {
        console.log(111)
        wx.setStorage({
          key: 'desc',
          data: 'hot'
        })
        wx.switchTab({
          url: '../index/main?desc=hot',
        })
      },
      searchArticle(word) {
        console.log('执行搜索')
        this.searchHot()
      },
      //  关键词搜索
      async searchHot(data = {
        page: 1
      }) {
        let keywords = await wxRequest(api.getArticleList, {
          search: this.searchWord,
          page: data.page,
          page_size: 10
        })
        console.log('搜索结果', keywords)
        if (keywords.data.code === api.STATUS) {
          if (keywords.data.data.length > 0) {
            let oldList = this.articleList;
            this.articleList = [...oldList, ...keywords.data.data]
            this.page++;
          }
        } else {
          console.log('请求出错', keywords)
        }
      },
      //  获取搜索历史
      async searchHostery() {
        let historyKey = await wxRequest(api.HistorySearch, {}, 'POST')
        this.historyKey = historyKey.data.data;
        console.log('搜索历史', historyKey)
      },
      //  获取搜索相关关键词
      // async getKeyWordsList(e){
      //   console.log(e)
      //   let keyList = await wxRequest(api.searchWorld,{ search:  this.searchWord })
      //   this.keywordsList = keyList.data.data;
      //   console.log('相关关键词', keyList)
      // },
      async clearSearchHistory() {
        let clear = await wxRequest(api.clearSearchHistory, {}, 'POST')
        if (clear.data.code === api.STATUS) {
          this.historySearch = [];
        }
        console.log(clear)
      },
      // 清空搜索框
      clearWords() {
        this.searchWord = '';
      }
    },
    onShareAppMessage(){

  }
  }
</script>

<style lang="less">
  .searchPage {
    padding: 25rpx 30rpx;
    border-bottom: 20rpx solid #F3F6F8;
  }
  .inputPlaceholder {
    font-size: 26rpx;
    color: #CCCCCC;
  }
  .hasword {
    color: #138ADD !important;
  }
  .searchInputContent {
    font-size: 26rpx;
    margin-left: 30rpx;
    width: 100%;
  }
  .cover-box {
    width: 100%;
    display: flex;
    height: 380rpx;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 8rpx;
  }
  .searchBgIn {
    background-color: #F6F6F6;
    padding: 15rpx 40rpx;
    border-radius: 33rpx;
    width: 75%;
  }
  .searchImg {
    width: 25rpx;
    height: 25rpx;
  }
  .reduce,
  .search-item {
    color: #999999;
    font-size: 30rpx;
  }
  .search-item {
    padding: 10rpx 0;
    box-sizing: border-box;
  }
  .search-list {
    position: absolute;
    width: 100%;
    min-height: 60rpx;
    background: #fff;
  }
  .search-list {
    padding: 20px;
  }
  .hotSearch {
    color: #333333;
    font-weight: bold;
    font-size: 36rpx;
    margin-top: 45rpx;
    margin-bottom: 50rpx;
  }
  .hotSearchRank {
    width: 45%;
    font-size: 30rpx;
    color: #333333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 30rpx;
    margin-bottom: 30rpx;
  }
  .wrap {
    flex-wrap: wrap;
    display: flex;
  }
  .manyHot {
    color: #138ADD;
    font-size: 30rpx;
  }
  .historySearch {
    color: #333333;
    font-weight: bold;
    font-size: 36rpx;
    margin-top: 15rpx;
    margin-bottom: 20rpx;
  }
  .clock {
    width: 30rpx;
    height: 30rpx;
    margin-right: 20rpx;
  }
  .delete {
    width: 34rpx;
    height: 34rpx;
  }
  .historyList {
    padding: 30rpx 0;
    border-bottom: 1rpx solid #EEEEEE;
  }
  .historyTitle {
    color: #333333;
    font-size: 30rpx;
  }
  .clear {
    width: 31rpx;
    height: 32rpx;
    margin-right: 20rpx;
  }
  .about {
    background: linear-gradient(to right, #fef0dc, #FFFFFF);
    height: 70rpx;
    color: #F39800;
    font-size: 28rpx;
    padding: 22rpx 44rpx;
    line-height: 70rpx;
  }
  .topic_Tboder {
    border-top: 1rpx solid #EEEEEE;
    border-bottom: 20rpx solid #F3F6F8;
  }

</style>
