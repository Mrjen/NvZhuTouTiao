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

    <scroll-view scroll-y="true" 
                 style="height: 90%;" 
                 @scrolltolower="scrolltolower" 
                 upper-threshold="50"
                 @scrolltoupper="scrolltoupper"
                 lower-threshold="250" 
                 class="content">
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
          <button class="three_button" @click="openSharePopup(item.title)" :data-id="item.id" hover-class="three_button_focus">
            <img src="/pages/image/share.png" class="topic_button" />
            <view>{{item.sharetimes}}</view>
          </button>
          <button class="three_button" hover-class="none" @tap="toDetails(item.id)">
            <img src="/pages/image/comment.png" class="topic_button_w" />
            <view>{{item.commenttimes}}</view>
          </button>
          <button class="three_button" hover-class="none"  @click="addLike(item.likestatus,item.article_id,idx)">
            <img v-if="item.likestatus===0" src="/pages/image/like.png" class="topic_button_o" />
            <img v-if="item.likestatus===1" src="/pages/image/like-active.png" class="topic_button_o" />
            <view>{{item.liketimes}}</view>
          </button>
        </view>
      </view>
    </scroll-view>

   <!--分享卡片-->
    <sharpop @openSharePopup="openSharePopup" 
             @closeSharPop="closeSharPop" 
             :popup="popup" 
             @downloadPoster="downloadPoster"
             :ArticleId="ArticleId"></sharpop>
  
  <!-- 合成海报的canvas -->
  <canvas canvas-id="mycanvas" 
          style="width:750px; height:1334px; border:1px solid red;position:fixed;left:-1000px;top:-1500px"></canvas>
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
        page: 1,
        desc: 'new',
        loadMore: true,
        articleList: [],
        ArticleId:'',
        popup: false,
        ArticleTtictle:''
      };
    },

    components: {
      sharpop:sharPop
    },

    async onLoad(options){
       if( wx.getStorageSync('desc') ){
          this.desc = wx.getStorageSync('desc');
          console.log('this.desc ',this.desc )
       }
       let that = this;
      const code = await utils.getToken();
      this.getArticle({
        page: 1,
        desc: this.desc,
        token: code.data.data.token
      }).then((res) => {
        console.log(res)
        if (res.data.code == api.STATUS) {
          that.articleList = res.data.data;
          that.page++;
        }
      })
    },

    onHide(){
       this.popup = false;
    }, 

    async onShow(){
      console.log('onShow')
    },

    // 分享
    onShareAppMessage(res){
        let that = this;
        wx.showTabBar()
        that.popup = false;
        return {
            title: '自定义转发标题',
            path: '/page/details/main?articleid=' + res.target.dataset.id,
            success: function(res) {
              // 转发成功
              console.log(res)
            },
            fail: function(res) {
              // 转发失败
            }
          }
    },

    onReachBottom() {
      console.log('onReachBottom')
    },

    methods: {
      // 获取文章列表
      async getArticle(data = {page: '1', desc: 'new'}) {
        const getArticleList = await wxRequest(
          api.getArticleList, data)
        return getArticleList;
      },
      // 切换导航
      changeNav(value) {
        console.log(value)
        const that = this;
        this.desc = value;
        this.page = 1;
        this.getArticle({
          page: this.page,
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
        console.log('点赞',type, id)
         let _type = (type=='0'?'inc':'dec')
         console.log('_type', _type)
         let like = await wxRequest(api.likeArticle, { id: id, status: _type });
         if(like.data.code === api.STATUS){
           let articleList = this.articleList;
           articleList[idx].likestatus = (_type=='inc'?1:0)
           if(articleList[idx].liketimes.indexOf('万')) return false;
           if(_type=='inc'){
             articleList[idx].liketimes++;
           }else if(_type=='dec'){
             articleList[idx].liketimes--;
           }
           this.articleList = articleList;
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
      openSharePopup(title){
         this.popup = true;
         this.ArticleTtictle = title;
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
         userDownloadPoster(ctx, this.ArticleTtictle,this)
      },
      // 触顶事件
      async scrolltoupper(){
        console.log('触顶事件')
        let article = await this.getArticle({ page: 1,
         desc: this.desc
        })
        if (article.data.code === api.STATUS){
          this.articleList = article.data.data;
          this.page = 2;
          tips.success('页面刷新了')
        }
      },

      // 触底事件
      scrolltolower() {
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
      }
    }
  };

  // 合成海报
  async function userDownloadPoster(ctx,title,that){
      let bg = 'https://gcdn.playonwechat.com/nvzhu/poster-bg.png'
      const canvas_bg = await utils.getImage(bg);
      let userInfo = await utils.getUserInfo();

      let avatarUrl = userInfo.userInfo.avatarUrl;
      ctx.drawImage(canvas_bg, 0, 0, 750, 1334)
      
      // 画头像
      ctx.save()
      ctx.beginPath()
      ctx.arc(80, 456, 50, 0, 2*Math.PI)
      // ctx.setFillStyle('#ff2cff')
      // ctx.fill();
      ctx.clip()
      let _avatarUrl = await utils.getImage(avatarUrl)
      ctx.drawImage(_avatarUrl, 30, 406, 100, 100)
      ctx.restore()
      
      // 写入昵称
      ctx.beginPath()
      ctx.setFillStyle('#333333')
      ctx.setFontSize(34)
      ctx.fillText(userInfo.userInfo.nickName, 150, 446)
      ctx.save()
      
      ctx.beginPath()
      ctx.setFillStyle('#999999')
      ctx.setFontSize(30)
      ctx.fillText('正在围观讨论这个话题', 150, 486)

      // 写入标题
      ctx.beginPath()
      ctx.setFillStyle('#000000')
      ctx.setTextAlign('left')
      ctx.setFontSize(60)
      let textArr = utils.canvasWorkBreak(550, 60, title)
      for(let i=0;i<textArr.length;i++){
        ctx.fillText(textArr[i], 66, 708+(i*70))
      }
      
      // 画二维码
      ctx.beginPath();
      let qr_code = 'https://gcdn.playonwechat.com/qr-code.png';
      let applet_qrcode = await utils.getImage(qr_code)
      ctx.drawImage(applet_qrcode, 52, 1104, 200, 200)
      ctx.draw();
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success(res){
           console.log('导出图片',res)
           let image = res.tempFilePath;
           utils.saveImageToPhotosAlbum(image,utils.getUserSetting(image))
           that.popup = false;
        },
        fail(res){
          console.log('失败', res)
          utils.success('保存失败')
          that.popup = false;
        },
        complete(){
          wx.showTabBar()
        }
      })
}

</script>

<style lang="less">
  page {
    background-color: #7C48C6;
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
