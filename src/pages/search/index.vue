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
        <view class="hotSearch">热搜</view>
        <view class="wrap">
          <view class="hotSearchRank" 
                v-for="item in hotsearch" 
                :key="item.id" @click="Hots(item.id)">{{item.title}}</view>
          <view class="manyHot" @click="toIndex()">更多热门话题>></view>
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
      <view class="topic topic_Tboder" v-for="(article, idx) in articleList" :key="article.id">
        <view class="topic_top" @tap="Hots(article.article_id)">
          <view class="topic_title">{{article.title}}</view>
          <view class="cover-box">
            <image class="topic_img" :src="article.composer_cover" />
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
          <button class="three_button" hover-class="three_button_focus"  
              @click="openSharePopup(article.title, article.article_id, idx)">
              <image src="../image/share.png" class="topic_button" />
              <view>{{article.sharetimes}}</view>
            </button>
          <button class="three_button" hover-class="none" @tap="Hots(article.id)">
              <image src="../image/comment.png" class="topic_button_w" />
              <view>{{article.commenttimes}}</view>
            </button>
          <button class="three_button" 
              hover-class="none" 
              @click="addLike(article.likestatus, article.id, idx)">
              <image v-if="article.likestatus===0?true:false" src="../image/like.png" class="topic_button_o" />
              <image v-if="article.likestatus===1?true:false" src="../image/like-active.png" class="topic_button_o" />
              <view>{{article.liketimes}}</view>
            </button>
        </view>
      </view>
    </view>

     <!--分享卡片-->
    <sharpop @openSharePopup="openSharePopup" 
             @closeSharPop="closeSharPop" 
             :popup="popup" 
             @downloadPoster="downloadPoster"
             :ArticleId="ArticleId"></sharpop>

      <!-- 合成海报的canvas -->
  <canvas canvas-id="mycanvas" 
          style="width:750px; height:1334px; border:1px solid red;position:absolute;left:-1000px;top:-1500px"></canvas>

  </div>
</template>

<script>
  import wxRequest from "../../utils/http.js";
  import api from "../../utils/api.js";
  import utils from '../../utils/utils';
  import sharPop from '../../components/shareItem';
  export default {
    data() {
      return {
        searchEnd: true,
        hotsearch: [],
        articleList: [],
        searchWord: '',
        keywordsList: [],
        historySearch: [],
        page: 1,
        ArticleTtictle: '',
        popup: false,
        ArticleId:'',
        nickName:''
      }
    },
    
    components: {
      sharpop:sharPop
    },

    watch: {
      searchWord(val, old) {
        console.log(val, old)
        // this.searchHot(val)
      }
    },
    async onShow() {
      console.log('onshow')
      this.searchHostery()


      let hotsearch = await wxRequest(api.HotSearch, {}, 'POST');
      this.hotsearch = hotsearch.data.data;
      console.log('hotsearch', HistorySearch)

      let userInfo = await wxRequest(api.getUserInfo,{},'POST')
      console.log('user',userInfo)
      if(userInfo.data.code === api.STATUS){
        this.nickName = userInfo.data.data.nickName;
      }
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

      // 添加喜欢
      async addLike(type, id, idx){
        console.log(type, id, idx)
         let _type = (type=='0'?'inc':'dec')
         console.log('_type', _type)
         let like = await wxRequest(api.likeArticle, { id: id, status: _type });
         if(like.data.code === api.STATUS){
           let _articleList = this.articleList;
          let str = _articleList[idx].liketimes;
          console.log('_type', _type)
           if(_type == 'inc'){
             _articleList[idx].liketimes++;
             _articleList[idx].likestatus = 1;
           }else if(_type == 'dec'){
             _articleList[idx].liketimes--;
             _articleList[idx].likestatus = 0;
           }
           this.articleList = _articleList;
            // tips.success('点赞')
         }
      },

      searchArticle(word) {
        console.log('执行搜索')
        this.searchHot()
      },
      
      Hots(id){
        wx.navigateTo({
          url: '../details/main?id='+ id 
        })
      },
      // 分享
      openSharePopup(title, id){
         this.popup = true;
         this.ArticleTtictle = title;
         this.ArticleId = id;
         wx.hideTabBar()
      },
      // 关闭分享
      closeSharPop(){
          this.popup = false;
          wx.showTabBar()
      },

      // 下载海报
      downloadPoster(){
         console.log('下载海报')
         const ctx = wx.createCanvasContext('mycanvas');
         utils.userDownloadPoster(ctx, this.ArticleTtictle,this)
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
        wx.switchTab({
          url: '../index/main'
        })
      }
    },
    // 分享
    onShareAppMessage(res){
        let that = this;
        wx.showTabBar()
        that.popup = false;
        let nickName = this.nickName || '我';
        console.log('res',res)
        let article_id = this.ArticleId;
        return {
            title: `${nickName}邀请你一起讨论这个话题`,
            path: '/page/details/main?articleid=' + article_id,
            success: function(res) {
              // 转发成功
              utils.shareTime(article_id)
              // console.log(res)
            },
            fail: function(res) {
              // 转发失败
            }
          }
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
