<template>
<div class="detail">
  <!-- 话题主题 -->
  <view class="topic">
    <view class="topic_top">
      <view class="topic_title">{{ArticleTtictle}}</view>
      <!-- <image class="topic_img" mode="widthFix" :src="detail.composer_cover"/> -->
      <view class="content" @click="inputBlur">
        <!-- <rich-text class="richtext" :nodes="ArticleContent" @click="tap"></rich-text> -->
        <wxParse :content="ArticleContent"/>
      </view>
      <view class="topic_bottom">
        <view class="readBg">
          <view class="read">阅读</view>
          <view class="read_time">{{Article_readtimes}}</view>
        </view>
        <view class="read">{{Article_createtime}}</view>
      </view>
    </view>

    <view class="button_flex">
        <button class="three_button" 
                @click="openSharePopup(ArticleTtictle, ArticleId)"
                hover-class="none">
        <image mode="widthFix" 
               src="../image/share.png" 
               class="topic_button" />
        <view>{{Article_sharetimes}}</view>
      </button>

        <button class="three_button" 
                @click="openArticleComm" 
                hover-class="none">
        <image mode="widthFix" 
               src="../image/comment.png" 
               class="topic_button_w" />
        <view>{{Article_comments}}</view>
      </button>
      <button class="three_button" 
              :class="Article_likestatus=='1'?'active_text':''" 
              @click="likeArticle" 
              hover-class="none">
        <image mode="widthFix" 
               :src="Article_likestatus=='0'?'../image/like.png':'../image/like-active.png'" 
               class="topic_button_o"/>
        <view>{{Article_liketimes}}</view>
      </button>
    </view>
  </view>



  <view class="writeBg_zhanwei"></view>

  <block>

  <!-- 评论输入 -->
  <view v-if="is_accredit=='1'?true:false" class="writeBg">
      <!-- {{is_accredit}} -->
      <!-- v-model="commContent" -->
      <!-- @focus="inputGetFocus" -->
      <!-- :value="inputValue" -->
      <!--    :focus="inputFcus" -->
      <!-- @input="inputComment" -->
      <!-- cursor-spacing="30" -->
      <block v-if="inputShow">
        <textarea  :placeholder="inputPlaceholder"
                    auto-height="true"
                    @focus="inputGetFocus"
                    fixed="true"
                    :value="'我是一段文字'"
                    cursor-spacing="14"
                    @input="inputComment"
                    v-model.lazy="commContent"
                    :cursor="inputCursor"
                    @confirm="addComment"
                    confirm-type="send" 
                    placeholder-style="color:#999"
                    :focus="inputFcus"
                    class="inputRedict"/>
     </block>
                 
  </view>

  
  </block>
   <!--分享卡片-->
    <sharpop @openSharePopup="openSharePopup" 
             @closeSharPop="closeSharPop" 
             :popup="popup" 
             @downloadPoster="downloadPoster"
             :ArticleId="ArticleId"></sharpop>

  <!-- 合成海报的canvas -->
  <canvas canvas-id="mycanvas" style="width:750px; height:1334px; border:1px solid red;position:absolute;left:-1000px;top:-1500px"></canvas>
  
  <view class="go-home" @click="goHomego">
      <img src="https://gcdn.playonwechat.com/nvzhu/go-home.png"/>
  </view>
  <button style="position:fixed;left:0;top:500rpx" @click="addComment">发送</button>

</div>

</template>

<script>
import wxRequest from "../../utils/http.js";
import api from "../../utils/api.js";
import tips from '../../utils/tips';
import wxParse from 'mpvue-wxparse';
import sharPop from '../../components/shareItem';
import utils from '../../utils/utils';
export default {
  data(){
      return {
        ArticleContent: '',         // 文章内容
        topComment: '',             // 热门评论
        detail: {},                 // 详情数据
        comment: [],                // 最新评论内容
        inputFcus: false,           // 输入框焦点
        commContent:'',             // 评论内容
        inputCursor:-1,             // 输入框光标位置
        inputValue: '',             // 输入框的值
        id:'',                      // 评论id
        commentDom:'article',       // 评论对象 article follow
        page: 2,                    // 最新评论页数
        commentIdx: '',             // 一级评论index
        follow_page: 1,             // 跟评列表page
        follow_index: null,         // 跟评的index
        follow_id: null,
        user_id: null,              // user_id
        comment_id:null,            // 评论id
        comment_type:null,          // 评论类型  -> 最新评论 \ 精彩评论 
        inputPlaceholder: '发表你的观点',
        Article_likestatus: '',     // 文章点赞状态
        Article_liketimes: '',      // 文章喜欢次数
        Article_readtimes: 0,       // 文章阅读次数
        Article_createtime: '',     // 文章发布时间
        Article_sharetimes: 0,      // 文章分享次数
        Article_cover: null,        // 文章封面
        Article_comments: 0,        // 文章被评论次数
        popup: false,               // 分享海报弹窗
        ArticleTtictle: '',         // 文章标题
        ArticleId: '',              // 文章id
        nickName: '',               // 用户名字
        is_accredit: null,          // 是否授权
        userInfo:{},                // 用户信息
        inputShow: true,            // 输入框是否显示
        shareQrcode: null,          // 分享二维码
        requestOver: true,           // 防止重复提交
        inputArr: [],
        currentInputShow: 0          // 当前显示的input的index
      }
  },
  components: {
    wxParse:wxParse,
    sharpop:sharPop
  },
  async onLoad(options){
      let that = this;
      console.log('页面加载了',options, this.id)
      wx.showLoading({
        title: '加载中'
      })
      let _article_id = null;
      if(options.id){
        _article_id = options.id;
        wx.setStorage({ key:"article_id", data: options.id})
      }else if(options.scene){
          _article_id = options.scene;
          console.log('scene', options.scene)
      }
      console.log('_article_id', _article_id)
      // 保证获取到token
      const token = await utils.getToken();
      console.log('token', token)
      const detail = await wxRequest(api.getArticleDetail,{ id: _article_id, page: 1 })
      // 这里数据字节过大，把数据拆分分次传递
      this.id = _article_id;
      this.ArticleId = _article_id;
      this.ArticleContent = detail.data.data.view_content;
      this.topComment = detail.data.data.topcomment;
      this.comment = detail.data.data.comment;
      this.Article_liketimes = detail.data.data.liketimes;
      this.ArticleTtictle = detail.data.data.title;
      this.Article_readtimes = detail.data.data.readtimes;
      this.Article_createtime = detail.data.data.create_time;
      this.Article_sharetimes = detail.data.data.sharetimes;
      this.Article_comments = detail.data.data.commenttimes;
      this.Article_likestatus = detail.data.data.likestatus;
      wx.downloadFile({
          url: detail.data.data.sharcover,
          success(res){
              console.log('封面', res)
              that.Article_cover = res.tempFilePath
          }
      })

    //   获取用户信息
    const userInfo = await wxRequest(api.getUserInfo,{},'POST')
    console.log('请求is_accredit', userInfo)
    this.is_accredit = userInfo.data.data.is_accredit;
    wx.hideLoading()
  },
  async onShow(){
      if(this.id===wx.getStorageSync('article_id')){
         console.log('相等')
      }
       this.commentDom = 'article';
       
      let userInfo = await wxRequest(api.getUserInfo,{},'POST')
      this.inputShow = true;
      console.log('user',userInfo)
      if(userInfo.data.code === api.STATUS){
        this.nickName = userInfo.data.data.nickName;
      }
  },
  onUnload(){
      console.log('隐藏了')
      this.inputFcus = false;
      this.ArticleContent = '';
      this.inputPlaceholder = '发表你的观点';
  },
  methods:{
    //   输入评论
    inputComment(e){
       console.log(e)
       var _input = true;
       if(_input){
        _input = false;
         setTimeout(()=>{
            this.commContent = e.mp.detail.value;
            console.log('光标的位置1', e.mp.detail.cursor)
            this.inputCursor = e.mp.detail.cursor+1;
            console.log('光标的位置2', this.inputCursor)
            _input = true;
         },100)
       }

    //    this.inputValue = e.mp.detail.value;
    //    setTimeout(()=>{
    //        this.inputCursor = e.mp.detail.cursor;
    //        console.log('光标的位置', this.inputCursor)
    //    },20)
       
    },

    inputValueChange(e){
       console.log(e)
    },
      // 返回首页
    goHomego(){
        wx.switchTab({
            url: '../index/main'
        })
    },
    // 文章评论
    openArticleComm() {
       console.log('评论文章')
       this.inputPlaceholder = '发表你的观点';
       this.inputGetFocus();
       this.commentDom = 'article';
       this.page = 2;
    },

    // input获取焦点
    inputGetFocus(){
        // 这里先设置false再设置true防止本来是true无法获取焦点
        this.inputFcus = false;
        this.inputFcus = true;
        console.log('输入框获取焦点了', this.inputFcus)
    },
    // input失去焦点
    inputBlur(){
       console.log('失去焦点');
       this.inputFcus = false;
    },
    // 点击跟评图标
    followComment(id){
       this.id = id;
       this.inputGetFocus();
       this.commentDom = 'follow';
    },
    // 喜欢文章
    async likeArticle(){
      const status = this.Article_likestatus == '0'?'inc':'dec'
      const like = await wxRequest(api.likeArticle, { id: this.ArticleId, status: status })
      if(like.data.code === api.STATUS){
          this.Article_likestatus = (status=='inc'?'1':'0')
          if(status =='inc'){
              this.Article_liketimes++
          }else if(status =='dec'){
              this.Article_liketimes--
          }
      }
    },
    // 收起评论
    collapseComment(idx,text){
       let _comment = [];
       if(text==='收起精彩评论'){
           _comment = this.topComment;
           _comment[idx].follow_comment = _comment[idx].follow_comment.slice(0,2);
           _comment[idx].is_page = true;
           this.follow_page = 1;
           this.topComment = _comment;
       }else if(text==='收起最新评论'){
           _comment = this.comment;
           _comment[idx].follow_comment = _comment[idx].follow_comment.slice(0,2);
           _comment[idx].is_page = true;
           this.follow_page = 1;
           this.comment = _comment;
       }
    },
    // 点击追评图标
    followCommentComment(id, idx, user_id, type, nickName){
        console.log('点击一级追评图标', id, idx, user_id, type, nickName)
       this.commentDom = 'follow';
       this.inputGetFocus();
       this.id = id;
       this.commentIdx = idx;
       this.comment_id = id;
       this.user_id = user_id;
       this.comment_type = type;
       this.inputPlaceholder = `回复${nickName}`
    },
    // 追评添加追评
    async followFollowComment(user_id, comment_id, fidx, cidx, type, nickName){
        console.log('点击二级评论', user_id, comment_id, fidx, cidx, type, nickName)
        this.inputGetFocus();
        this.user_id = user_id;
        this.commentDom = 'follow';
        this.comment_id = comment_id;
        this.follow_index = fidx;
        this.commentIdx = cidx;
        this.comment_type = type;
        this.inputPlaceholder = `回复${nickName}`
    },
    // 提交评论
    async addComment(){
        console.log('评论发送了', this.commContent)
       if(!this.commContent) return;
       if(this.commentDom === 'article'){
            console.log('评论文章')
            this.commentArticle()
       }else if(this.commentDom === 'follow'){
           console.log('追评')
           this.commentFollow(this.user_id, this.comment_id, this.follow_index, this.commentIdx, this.comment_type)
           this.inputFcus = false;
       }
       this.inputFcus = false;
    },
    // 创建追评
    async commentFollow(user_id, comment_id, fidx, cidx, comment_type){
        console.log('提交评论', user_id, comment_id, fidx, cidx, comment_type)
         if(this.requestOver) {
            this.requestOver = false;
           let follow = await wxRequest(api.followComment, { 
                follow_comment: this.commContent, 
                re_user_id: user_id, 
                comment_id: this.comment_id
             })
            this.requestOver = true;
            this.commContent = '';
            console.log('follow',follow)
            let comment = null;
            if(comment_type==='精彩评论一级'){
                console.log('精彩评论一级')
                comment = this.topComment;
            }else if(comment_type==='最新评论一级'){
                console.log('最新评论一级')
                comment = this.comment;
            }else if(comment_type==='最新评论二级'){
                console.log('最新评论二级')
                comment = this.comment;
            }else if(comment_type==='精彩评论二级'){
                console.log('精彩评论二级')
                comment = this.topComment;
            }
        //  console.log('comment', comment)

         if(follow.data.code === api.STATUS){
             tips.success('评论成功')
             this.inputFcus = false;
             console.log('评论成功', follow.data.data)
             if(comment_type=='精彩评论一级'){
                 console.log('精彩评论一级')
                 comment[this.commentIdx].follow_comment = follow.data.data;
                 this.topComment = comment;
             }else if(comment_type=='精彩评论二级'){
                 console.log('精彩评论二级')
                 comment[this.commentIdx].follow_comment = follow.data.data;
                 this.topComment = comment;
             }else if(comment_type=='最新评论一级'){
                 console.log('最新评论一级')
                  comment[this.commentIdx].follow_comment = follow.data.data;
                  this.comment = comment;
             }else if(comment_type=='最新评论二级'){
                 console.log('最新评论二级')
                  comment[this.commentIdx].follow_comment = follow.data.data;
                  this.comment = comment;
             }
         }
         this.inputFcus = false;
         this.inputValue = '';
         console.log('follow', follow)

        //  解决input
         this.currentInputShow++;
         let inputArr = this.inputArr;
         inputArr.map(el=>{
             el.input = 'none';
         })
         console.log('this.currentInputShow++',this.currentInputShow++)
         inputArr[this.currentInputShow].input = 'block';
         this.inputArr = inputArr;
        }
    },
    //   评论文章
    async commentArticle(){
        this.inputPlaceholder = '发表你的观点';
        console.log('评论文章')
       if(this.requestOver){
           this.requestOver = false;
           let comm = await wxRequest(api.addComment,{ article_id: this.id, comment: this.commContent });
           this.requestOver = true;
         if(comm.data.code === api.STATUS){
           this.commContent = '';
           tips.success('评论成功')
           this.inputFcus = false;
           this.inputValue = '';
           this.comment = comm.data.data.list;
        }
      }
       
       console.log('comm', comm)
    },
    // 点赞
    async likeCommentZan(cidx, id, likestatus, type){
        console.log('点赞')
      console.log(cidx, id, likestatus, type)
      this.inputFcus = false;
      let _status = (likestatus=='0'?'inc':'dec')
      let like = await wxRequest(api.likeComment, { comment_id: id, status: _status })
      if(like.data.code === api.STATUS){
          let comment = null;
          if(type==='最新评论点赞'){
             comment = this.comment;
          }else if(type==='精彩评论点赞'){
             comment = this.topComment;
          }
          if(likestatus){
              comment[cidx].liketimes--;
              comment[cidx].likestatus = 0;
          }else if(likestatus=='0'){
              comment[cidx].liketimes++;
              comment[cidx].likestatus = 1;
          }
          if(type==='最新评论点赞'){
             this.comment = comment ;
          }else if(type==='精彩评论点赞'){
             this.topComment = comment ;
          }
      }
    },
    // 增加文章分享次数
    async ArticleShare(){
        let share = await wxRequest(api.addArticleShareTime,{ id:  this.ArticleId })
        console.log('增加分享次数', share)
    },
    // 查看更多评论
    async readMoreFollowComm(id,idx, text){
        console.log('点击更多评论', id, idx, text)
      this.follow_index = idx;
      this.inputFcus = false;
      let page = this.follow_page;
      if(this.follow_id!==id){
          this.follow_page = 1;
      }
      this.follow_id = id;
      console.log('点击更多评论')
      let more = await wxRequest(api.followWommentList, { comment_id: id, page_size: 10, page: this.follow_page, sort:'desc' })
      if(more.data.code === api.STATUS){
            let _comment = [];
            if(page===1) more.data.data.list.splice(0,2);  // 删除评论前两条
            if(text==='点击精彩评论查看更多'){
                _comment = this.topComment;
                _comment[idx].follow_comment = [..._comment[idx].follow_comment,...more.data.data.list];
                if(!more.data.data.length){ _comment[idx].is_page = false }   // 隐藏查看更多评论
                this.topComment = _comment;
            }else if(text==='点击最新评论查看更多'){
                _comment = this.comment;
                _comment[idx].follow_comment = [..._comment[idx].follow_comment,...more.data.data.list];
                if(!more.data.data.length){ _comment[idx].is_page = false }  // 隐藏查看更多评论
                this.comment = _comment;
            }
             if(more.data.data.length){
                 this.follow_page++;
             }
             
      }
    },
    // 追加评论点赞
    async addFollowZan(status, id, fidx, cidx, type){
        let that = this;
        this.inputFcus = false;
       console.log(status, id, fidx)
       let _status = (status=='0'?'inc':'dec');
      let zan = await wxRequest(api.likefollowcomment, { follow_comment_id: id, status: _status })
      if(zan.data.code === api.STATUS){
           let _comment = (type==='精彩评论')?that.topComment:that.comment
             if(status=='0'){
                _comment[cidx].follow_comment[fidx].liketimes++;
                _comment[cidx].follow_comment[fidx].likestatus = 1;
            }else if(status=='1'){
                _comment[cidx].follow_comment[fidx].liketimes--;
                _comment[cidx].follow_comment[fidx].likestatus = 0;
            }
           if(type==='精彩评论'){
               that.topComment = _comment;
           }else if(type==='最新评论'){
               that.comment = _comment;
           }
           
      }
    },
    // 分享
    async openSharePopup(title, id){
        wx.hideTabBar()
        this.popup = true;
        this.ArticleTtictle = title;
        this.ArticleId = id;
        this.inputShow = false;
        let shareQrcode = await wxRequest(api.getQrcode, { id: id });
         console.log('shareQrcode', shareQrcode)
         if(shareQrcode.data.code === api.STATUS){
           this.shareQrcode = shareQrcode.data.data;
         }
    },
    // 关闭分享
    closeSharPop(){
        this.popup = false;
        this.inputShow = true;
        wx.showTabBar()
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
    },
    // 获取用户信息
    async getUserInfo(e){
        let userInfo = e.mp.detail.userInfo;
        userInfo.is_accredit = 1;
        this.userInfo = userInfo;
        let _userInfo = await wxRequest(api.saveUserInfo,userInfo);
        if(_userInfo.data.code === api.STATUS){
            this.is_accredit = 1;
            this.inputGetFocus = true;
            console.log('this.inputGetFocus', this.inputGetFocus)
        }
    },
    // 去用户中心
    toUserCenter(id){
        console.log('用户id', id)
    //    wx.navigateTo({
    //      url: `../otherUserCenter/main?id=${id}`
    //    })
    }
  },

  async onReachBottom(){
      console.log('触底了')
      let more = await wxRequest(api.commentList, { page: this.page, id:  this.ArticleId })
      console.log('more', more)
      if(more.data.code === api.STATUS){
          if(more.data.data.length>0){
              let oldList = this.comment;
              
              this.comment = [...oldList,...more.data.data];

              this.page++;
          }
      }
  },

  async onPullDownRefresh(){
     console.log('刷新页面')
    this.inputFcus = false;
    console.log('this.inputFcus',this.inputFcus)
    const detail = await wxRequest(api.getArticleDetail,{ id:  this.ArticleId, page: 1 })
    this.ArticleContent = detail.data.data.view_content;
    this.topComment = detail.data.data.topcomment;
    this.comment = detail.data.data.comment;
    this.Article_liketimes = detail.data.data.liketimes;
    this.ArticleTtictle = detail.data.data.title;
    this.Article_readtimes = detail.data.data.readtimes;
    this.Article_createtime = detail.data.data.create_time;
    this.Article_sharetimes = detail.data.data.sharetimes;
    this.Article_comments = detail.data.data.commenttimes;
    this.Article_likestatus = detail.data.data.likestatus;
     wx.stopPullDownRefresh();
    //  tips.success('刷新成功')
  },


  onShareAppMessage(){
      let that = this;
      that.popup = false;
      let nickName = this.nickName || '我';
      let article_id = this.ArticleId;
      console.log('分享文章id', article_id)
    return {
        title: `${nickName}邀请你一起讨论这个话题`,
        path: '/pages/details/main?id=' + article_id,
        imageUrl: that.Article_cover,
        success: function(res) {
            // 转发成功
            console.log('转发成功')
            that.ArticleShare()
        },
        fail: function(res) {
            // 转发失败
        }
    }
  }
}
</script>

<style lang="less">
page{
    background-color: #EEEEEE;
}

.topic_title{
    padding-bottom: 30rpx;
    box-sizing: border-box;
    margin-bottom: 50rpx;
    position: relative;
    text-align: center;
}

// .detail .topic{
//     margin: 0;
// }


.topic_title:after{
    content: '';
    display: block;
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
    position: absolute;
    left: 0;
    bottom: 0;
    transform: scaleY(.5)
}

.zan{
    align-items: center;
    margin-right: 40rpx;
    display: flex;
    align-items: center;
}

.comments{
    background-color:#FFFFFF;
    margin-bottom: 20rpx;
}

.topic_img{
    display: block;
    width: 100%;
}

.wonderfulComments{
    font-size: 30rpx;
    font-weight: bold;
    color: #333333;
    padding:30rpx 35rpx;
    display: flex;
    justify-content: space-between;
    text{
        display: inline-block;
    }
    .wrtie-comment{
        font-size: 30rpx;
        font-weight: normal;
        color: #226abc;
        display: inline-block;
    }
}
.commentsConter{
    padding: 30rpx;
    border-top: 1rpx solid #E5E5E5;
}
.head_img{
    width: 80rpx;
    height: 80rpx;
    margin-right: 20rpx;
    border-radius: 50%;
}

.display_flex{
    display: flex;
    align-items: center;
}

.verticalBar{
    width: 4rpx;
    background-color: #999999;
    margin-left: 20rpx;
    margin-right: 20rpx;
    height: 20rpx;
}
.floor{
    color: #999999;
    font-size: 20rpx;
    margin-top: 10rpx;
}
.nice{
    font-size: 28rpx;
    color: #999999;
    margin-right: 40rpx;
    display: flex;
    align-items: center;
}
.niceImg{
    width:32rpx;
    height: 30rpx;
    padding: 8rpx;
}
.commentTalk{
    width: 32rpx;
    height: 30rpx;
}
.comment_name{
    color: #333333;
    font-size: 28rpx;
}
.flex_end{
    align-self:flex-end;

}
.commentsTxt{
    color: #333333;
    font-size: 28rpx;
    margin: 30rpx 13rpx 30rpx 97rpx;
    padding: 0;
    background: transparent;
    text-align: left;
    line-height: 40rpx;
}

.font_24{
    color: #666666;
    font-size: 24rpx;
    margin-bottom: 24rpx;
}

.content{
    image{
        width: 100% !important;
        // display: inline-block;
    }
}
  .richtext {
    .common-css {
      padding: 0;
      margin: 0;
      font-family: 'Microsoft YaHei';
      box-sizing: border-box;
    }
    .p{
      color: #444;
      font-size: 32rpx;
      line-height: 1.6 !important;
      margin:15rpx 0;
      font-weight: 300;
      text-align: justify;
    }
    .common-css::after,
    .common-css::before {
      content: '';
      visibility: hidden;
    }
    .page {
      position: relative;
      float: left;
      width: 750rpx;
      min-height: 100%;
      padding: 25rpx;
      font-family: 'SimHei';
      background-color: #fff;
    }
    .page-rich-text {
      float: left;
      width: 100%;
    }
    .div {
      float: left;
      margin-bottom: 20rpx;
      width: 100%;
      font-size: 30rpx;
      color: #454545;
      line-height: 66rpx;
      text-indent: 2rem;
      letter-spacing: 4rpx;
      word-spacing: 4rpx;
    }
    .img {
      float: left;
      margin: 20rpx 0;
      width: 100%;
    }
    .em {
      font-size: 26rpx;
      color: #868686;
    }
    .a,
    .span {
      font-size: 30rpx;
      color: #333;
    }
    .page-share {
      display: none;
      position: fixed;
      top: 10rpx;
      left: 10rpx;
      z-index: 99;
      width: 200rpx;
      height: 60rpx;
      background-color: #226abc;
    }
  }

.go-home{
    width: 100rpx;
    height: 100rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, .2);
    border-radius: 50%;
    position: fixed;
    z-index: 100;
    bottom: 250rpx;
    right: 30rpx;
    img{
        display: block;
        width: 60%;
        height: 60%;
    }
}

// 跟评样式
.comm_comment{
    margin-right: 20rpx;
    height: 50rpx;
    display: flex;
    align-items: center;
}

.com_comments{
    background-color: #F7F7F7;
    padding:24rpx 20rpx 20rpx 20rpx;
    margin-left: 78rpx;
    .info-left{
        display: flex;
        padding-bottom: 10rpx;
        position: relative;
    }
    .border_bottom{
        position: relative;
        padding-bottom: 10rpx;
    }
    .border_bottom:after{
        content: '';
        display: block;
        width: 100%;
        border-bottom: 1px solid rgba(0, 0, 0, .1);
        transform: scaleY(.5);
        left: 0;
        bottom: 0;
        position: absolute;
    }
    .last-noborder:nth-last-of-type(1):after{
        display: none;
    }
    .info-avatar{
        width: 50rpx;
        height: 50rpx;
        margin-right: 14rpx;
        border-radius: 50%;
        flex-shrink: 0;
    }
    .info-name{
        font-size: 24rpx;
        color: #793292;
    }
    .info-time{
        font-size: 22rpx;
        color:#8c8c8c;
    }
    .talker{
        text-align: justify;
        line-height: 40rpx;
        font-size: 28rpx;
        text{
          color: #793292;
        }
    }
    .otherAnswer{
        font-size: 24rpx;
        color: #5EB6E7;
        text-align: center;
    }
    .user-info{
        display: flex;
        justify-content: space-between;
    }
    .info-comm-btn{
        display: flex;
        height: 50rpx;
        align-items: center;
        img{
            width: 32rpx;
            height: 26rpx;
            padding: 8rpx;
        }
    }
    .info-comm-cion{
        img{
            width: 32rpx;
            height: 26rpx;
            padding: 8rpx;
        }
    }
}

// 暂无评论
.no-comment{
    width: 750rpx;
    height: 300rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #f9f9f9;
    color: #888;
    margin-top: -30rpx;
    img{
        display: block;
        width: 100rpx;
        height: 100rpx;
        margin-bottom: 20rpx;
    }
}
</style>
