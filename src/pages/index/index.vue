<template>
  <div class="home">
    <div class="topBar">
      <div class="readBg">
        <div class="topNew" 
             :class="desc==='new'?'active':''" 
             @click="changeNav('new')">最新</div>
        <div class="topNew" 
             :class="desc==='hot'?'active':''" 
             @click="changeNav('hot')">最热</div>
      </div>
      <img class="searchButton" 
           src="/pages/image/search.png"
           @click="toSearch()" />
    </div>
<view class="container">
  <view class="topic" 
        v-for="(item,idx) in articleList" 
        :key="item.id">
    <navigator class="topic_top" 
               :url="'../details/main?id='+ item.id">
      <view class="topic_title">{{item.title}}</view>
      <view class="cover-box">
        <img class="topic_img" 
             mode="widthFix" 
             :src="item.composer_cover" />
      </view>
      <view class="topic_bottom">
        <view class="readBg">
          <view class="read">阅读</view>
          <view class="read_time">{{item.readtimes}}</view>
        </view>
        <view class="read">{{item.create_time}}</view>
      </view>
    </navigator>

    <view class="button_flex">
      <button class="three_button" 
              hover-class="none" 
              @click="openSharePopup(item.title,item.article_id)" 
              :data-id="item.id">
        <img src="/pages/image/share.png" 
             class="topic_button" />
        <view>{{item.sharetimes}}</view>
      </button>
      <button class="three_button" 
              hover-class="none" 
              @click="toDetails(item.id)">
        <img src="/pages/image/comment.png" 
             class="topic_button_w" />
        <view>{{item.commenttimes}}</view>
      </button>
      <button class="three_button" 
              hover-class="none" 
              @click="addLike(item.likestatus, item.article_id, idx)">
        <img v-if="item.likestatus===0" src="/pages/image/like.png" class="topic_button_o" />
        <img v-if="item.likestatus===1" src="/pages/image/like-active.png" class="topic_button_o" />
        <view>{{item.liketimes}}</view>
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
  import tips from '../../utils/tips';
  export default {
    data() {
      return {
        currentTab: 1,
        page: 2,
        desc: 'new',
        loadMore: true,
        articleList: [],
        ArticleId:'',
        popup: false,
        ArticleTtictle:'',
        nickName: null,
        shareQrcode: null  // 分享海报二维码图
      };
    },

    components: {
      sharpop:sharPop
    },

    async onLoad(options){
      let ctx = wx.createCanvasContext('mycanvas')
       if( wx.getStorageSync('desc') ){
          this.desc = wx.getStorageSync('desc');
          console.log('this.desc ',this.desc )
       }
       let that = this;
      const code = await utils.getToken();
      console.log('code', code)
      wx.setStorage({ key: 'token', data: code.data.data.token})
      this.getArticle({
        page: 1,
        desc: this.desc,
        token: code.data.data.token
      }).then((res) => {
        console.log(res)
        if (res.data.code == api.STATUS) {
          that.articleList = res.data.data;
        }
      })
    },

    onHide(){
       this.popup = false;
    }, 

    async onShow(){
      console.log('onShow')
      let userInfo = await wxRequest(api.getUserInfo,{},'POST')
      console.log('user',userInfo)
      if(userInfo.data.code === api.STATUS){
        this.nickName = userInfo.data.data.nickName;
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
            path: 'pages/index/main',
            success: function(res) {
              // 转发成功
              utils.shareTime(article_id)
              // console.log(res)
            },
            fail: function(res) {
              // 转发失败
            }
          }
    },

    async onPullDownRefresh(){
       console.log('触顶')
       let article = await this.getArticle({ page: 1,
         desc: this.desc
        })
        if (article.data.code === api.STATUS){
          this.articleList = article.data.data;
          this.page = 2;
          wx.stopPullDownRefresh()
          // tips.success('页面刷新了')
        }
    },

    onReachBottom() {
      console.log('触底了')
        let that = this;
        if (this.loadMore) {
          that.loadMore = false;
          this.getArticle({
              page: this.page,
              desc: this.desc
            })
            .then((res) => {
              console.log(res)
              if (res.data.data.length > 0) {
                let oldList = that.articleList;
                that.articleList = [...oldList, ...res.data.data];
                that.page++;
              } else {
                console.log('没有更多数据')
              }
              that.loadMore = true;
            })
        }
    },

    methods: {
      // 获取文章列表
      async getArticle(data = {page: '1', desc: 'new', token: wx.getStorageSync('token')}) {
        const getArticleList = await wxRequest(api.getArticleList, data)
        return getArticleList;
      },
      // 切换导航
      changeNav(value) {
        console.log(value)
        const that = this;
        this.desc = value;
        this.page = 2;
        this.getArticle({
          page: 1,
          desc: value
        }).then(res => {
          if (res.data.code === api.STATUS) {
            that.articleList = res.data.data;
          } else {
            console.log('切换导航数据', res)
          }
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
      // 去详情
      toDetails(id){ 
         wx.navigateTo({
           url: '../details/main?id='+id,
         })
      },
      // 分享
      async openSharePopup(title, id){
         this.popup = true;
         this.ArticleTtictle = title;
         this.ArticleId = id;
         console.log('打开分享', api.getQrcode)
         let shareQrcode = await wxRequest(api.getQrcode, { id: id });
         console.log('shareQrcode', shareQrcode)
         if(shareQrcode.data.code === api.STATUS){
           this.shareQrcode = shareQrcode.data.data;
         }
         wx.hideTabBar()
      },
      // 关闭分享
      closeSharPop(){
          this.popup = false;
          wx.showTabBar()
      },
      // 搜索
      toSearch(){
         wx.removeStorage({key: 'desc'})
         wx.navigateTo({
            url: `../search/main`
          })
      },
      // 下载海报
      downloadPoster(){
         console.log('下载海报')
         const ctx = wx.createCanvasContext('mycanvas');
         utils.userDownloadPoster({
            ctx:ctx,
            title:this.ArticleTtictle,
            that:this,
            qrcodePath: this.shareQrcode
        })
      }
    }
  };
</script>

<style lang="less">
  page {
    background-color: #e9e9e9;
  }

  .topBar{
    position: fixed;
    top: 0;
    left: 0;
    width: 750rpx;
    height: 100rpx;
    background: #7C48C6;
    display:flex;
    color:#C4A7EC;
    font-size:30rpx;
    justify-content:space-between;
    align-items:center;
    padding: 40rpx;
    box-sizing: border-box;
    z-index: 1000;
  }

  .container{
    box-sizing: border-box;
    margin-top: 100rpx;
    background: #f0f0f0;
  }

  .content {
    background-color: #F0F0F0;
    border-top-left-radius: 18rpx;
    border-top-right-radius: 18rpx;
    position: fixed;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    /*垂直居中*/
    justify-content: center;
    /*水平居中*/
    overflow: scroll;
  }


  .cover-box {
    width: 100%;
    display: flex;
    height: 380rpx;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 4px;
    img {
      display: block;
      width: 100%;
    }
  }

  // 合成海报
  #mycanvas{
    width: 750px;
    height: 500px;
    border:1px solid red;
    z-index: 100;
  }

</style>
